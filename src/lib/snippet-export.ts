import type { UniformDef, UniformValue, UniformValues } from '@/shaders/types';

type SnippetInput = {
  slug: string;
  title: string;
  vertex: string;
  fragment: string;
  uniformDefs?: UniformDef[];
  uniformValues?: UniformValues;
};

type SnippetUniformPayload =
  | { name: string; type: 'float'; value: number }
  | { name: string; type: 'vec2'; value: [number, number] }
  | { name: string; type: 'color'; value: [number, number, number] };

function escapeForTemplateString(input: string): string {
  return input.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pickUniformValue(def: UniformDef, values: UniformValues | undefined): UniformValue {
  const v = values?.[def.name];
  if (def.type === 'float') return typeof v === 'number' ? v : def.default;
  if (def.type === 'vec2') return Array.isArray(v) && v.length === 2 ? v : def.default;
  return Array.isArray(v) && v.length === 3 ? v : def.default;
}

function buildPayload(defs: UniformDef[] | undefined, values: UniformValues | undefined): SnippetUniformPayload[] {
  if (!defs) return [];
  return defs.map((def) => {
    const value = pickUniformValue(def, values);
    if (def.type === 'float') return { name: def.name, type: 'float', value: value as number };
    if (def.type === 'vec2') return { name: def.name, type: 'vec2', value: value as [number, number] };
    return { name: def.name, type: 'color', value: value as [number, number, number] };
  });
}

const RUNTIME = `
const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: false });
if (!gl) {
  document.body.innerHTML = '<p style="color:#fff;font-family:system-ui;padding:2rem">WebGL is not available in this browser.</p>';
  throw new Error('WebGL unsupported');
}

function compile(type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    throw new Error('Shader compile failed:\\n' + log + '\\n\\nSource:\\n' + src);
  }
  return sh;
}

const vs = compile(gl.VERTEX_SHADER, VERTEX);
const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error('Program link failed: ' + gl.getProgramInfoLog(program));
}
gl.useProgram(program);

const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1,-1,0,  1,-1,0,  -1,1,0,
  -1,1,0,   1,-1,0,   1,1,0,
]), gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(program, 'position');
if (posLoc !== -1) {
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
}

const uvBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  0,0, 1,0, 0,1,
  0,1, 1,0, 1,1,
]), gl.STATIC_DRAW);
const uvLoc = gl.getAttribLocation(program, 'uv');
if (uvLoc !== -1) {
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);
}

const uTime = gl.getUniformLocation(program, 'u_time');
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uMouse = gl.getUniformLocation(program, 'u_mouse');

for (const u of UNIFORMS) {
  const loc = gl.getUniformLocation(program, u.name);
  if (!loc) continue;
  if (u.type === 'float') gl.uniform1f(loc, u.value);
  else if (u.type === 'vec2') gl.uniform2f(loc, u.value[0], u.value[1]);
  else if (u.type === 'color') gl.uniform3f(loc, u.value[0], u.value[1], u.value[2]);
}

let mouseX = 0.5;
let mouseY = 0.5;
window.addEventListener('pointermove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left) / rect.width;
  mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
});

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.clientWidth * dpr);
  canvas.height = Math.floor(canvas.clientHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

const start = performance.now();
function frame() {
  const t = (performance.now() - start) / 1000;
  if (uTime) gl.uniform1f(uTime, t);
  if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
  if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`;

const VERTEX_PROLOGUE = `attribute vec3 position;
attribute vec2 uv;
mat4 projectionMatrix = mat4(1.0);
mat4 modelViewMatrix = mat4(1.0);

`;

function wrapVertexShader(source: string): string {
  return VERTEX_PROLOGUE + source;
}

function wrapFragmentShader(source: string): string {
  return source;
}

export function buildSnippetHtml(input: SnippetInput): string {
  const wrappedVertex = wrapVertexShader(input.vertex);
  const wrappedFragment = wrapFragmentShader(input.fragment);
  const uniforms = buildPayload(input.uniformDefs, input.uniformValues);

  const safeTitle = escapeHtml(`${input.title} · Shader Garden export`);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
  html, body { margin: 0; height: 100%; background: #07060c; overflow: hidden; }
  canvas { display: block; width: 100vw; height: 100vh; }
  .label {
    position: fixed; left: 16px; bottom: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.55);
    pointer-events: none;
  }
  .label a { color: rgba(168,85,247,0.85); text-decoration: none; pointer-events: auto; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<div class="label">${escapeHtml(input.slug)} · made with <a href="https://github.com/FeriKO-tech/shader-garden">shader-garden</a></div>
<script>
const VERTEX = \`${escapeForTemplateString(wrappedVertex)}\`;
const FRAGMENT = \`${escapeForTemplateString(wrappedFragment)}\`;
const UNIFORMS = ${JSON.stringify(uniforms)};
${RUNTIME}
</script>
</body>
</html>
`;
}
