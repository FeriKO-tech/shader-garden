// Wrapper that runs Next.js scripts from a temp workspace when the source
// path contains characters Next.js cannot handle (notably `#`, which is
// interpreted as a URL fragment by webpack/@vercel/nft).
//
// Usage: node scripts/run-safe.mjs <dev|build|start|lint>

import { cp, mkdir, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_MODES = new Set(['dev', 'build', 'start', 'lint']);
const mode = process.argv[2];

if (!VALID_MODES.has(mode)) {
  console.error(`run-safe: unknown mode "${mode}". Expected one of: ${[...VALID_MODES].join(', ')}.`);
  process.exit(1);
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const needsSafePath = projectRoot.includes('#');
const workspaceRoot = needsSafePath ? await createTemporaryWorkspace(projectRoot, mode) : projectRoot;

try {
  if (workspaceRoot !== projectRoot) {
    await runPnpm(['install', '--prefer-frozen-lockfile'], workspaceRoot);
  }

  await runPnpm([`${mode}:direct`], workspaceRoot);

  if (workspaceRoot !== projectRoot && mode === 'build') {
    await copyBuildOutput(workspaceRoot, projectRoot);
  }
} finally {
  if (workspaceRoot !== projectRoot && mode !== 'dev') {
    await rm(workspaceRoot, { recursive: true, force: true });
  }
}

async function createTemporaryWorkspace(sourceRoot, currentMode) {
  const digest = createHash('sha1').update(sourceRoot).digest('hex').slice(0, 10);
  const targetRoot = join(tmpdir(), `shader-garden-${currentMode}-${digest}`);

  await rm(targetRoot, { recursive: true, force: true });
  await mkdir(targetRoot, { recursive: true });

  const excluded = new Set([
    '.git',
    '.next',
    '.turbo',
    '.vercel',
    'coverage',
    'dist',
    'node_modules',
    'out',
  ]);

  await cp(sourceRoot, targetRoot, {
    recursive: true,
    filter(source) {
      const parts = relative(sourceRoot, source).split(/[\\/]/).filter(Boolean);
      if (parts.some((part) => excluded.has(part))) return false;
      if (source.endsWith('.tsbuildinfo')) return false;
      return true;
    },
  });

  return targetRoot;
}

async function copyBuildOutput(sourceRoot, targetRoot) {
  const source = resolve(sourceRoot, '.next');
  const target = resolve(targetRoot, '.next');

  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true });
}

function runPnpm(args, cwd) {
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'cmd.exe' : 'pnpm';
  const commandArgs = isWindows ? ['/d', '/s', '/c', `pnpm ${args.join(' ')}`] : args;

  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, commandArgs, {
      cwd,
      stdio: 'inherit',
      env: process.env,
    });

    child.on('error', rejectRun);
    child.on('exit', (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }

      if (code === 0) {
        resolveRun();
        return;
      }

      rejectRun(new Error(`pnpm ${args.join(' ')} exited with code ${code ?? 1}`));
    });
  });
}
