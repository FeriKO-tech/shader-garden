'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { SceneCanvasMount } from '@/components/Canvas/SceneCanvasMount';
import { ShaderEditorMount } from '@/components/ShaderEditor/ShaderEditorMount';
import {
  SHARE_FRAGMENT_PARAM,
  SHARE_VERTEX_PARAM,
  encodeFragment,
} from '@/lib/encode-share';
import { useAuth } from '@/lib/auth';
import { saveFork } from '@/lib/forks';
import { recordCanvasToGif, triggerGifDownload } from '@/lib/record-gif';
import { buildSnippetHtml } from '@/lib/snippet-export';
import { defaultUniformValues } from '@/shaders/types';
import type { TutorialStep, UniformDef, UniformValues } from '@/shaders/types';

import { TutorialPanel } from './TutorialPanel';
import { UniformControls } from './UniformControls';

type ShaderStage = 'fragment' | 'vertex';

type LivePlaygroundProps = {
  slug: string;
  title: string;
  defaultVertex: string;
  defaultFragment: string;
  initialVertex?: string;
  initialFragment?: string;
  uniformDefs?: UniformDef[];
  tutorial?: TutorialStep[];
};

type ShareState = 'idle' | 'copied' | 'error';

export function LivePlayground({
  slug,
  title,
  defaultVertex,
  defaultFragment,
  initialVertex,
  initialFragment,
  uniformDefs,
  tutorial,
}: LivePlaygroundProps) {
  const [vertex, setVertex] = useState(initialVertex ?? defaultVertex);
  const [fragment, setFragment] = useState(initialFragment ?? defaultFragment);
  const [activeStage, setActiveStage] = useState<ShaderStage>('fragment');

  const initialUniformValues = useMemo(() => defaultUniformValues(uniformDefs), [uniformDefs]);
  const [uniformValues, setUniformValues] = useState<UniformValues>(initialUniformValues);

  const [isPending, startTransition] = useTransition();
  const [shareState, setShareState] = useState<ShareState>('idle');
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const recordAbortRef = useRef<AbortController | null>(null);
  const [recordState, setRecordState] = useState<{ phase: 'idle' | 'recording' | 'encoding' | 'error'; captured?: number; total?: number; message?: string }>({ phase: 'idle' });

  const { user, available: authAvailable } = useAuth();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasTutorial = !!tutorial && tutorial.length > 0;
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const activeTutorialStep = hasTutorial && tutorialOpen ? tutorial![tutorialIndex] : undefined;

  useEffect(() => {
    if (!activeTutorialStep) return;
    const targetStage: ShaderStage = activeTutorialStep.stage ?? 'fragment';
    setActiveStage(targetStage);
  }, [activeTutorialStep]);

  const highlightRange =
    activeTutorialStep &&
    (activeTutorialStep.stage ?? 'fragment') === activeStage
      ? activeTutorialStep.lineRange
      : undefined;

  const compiledVertex = useDeferredValue(vertex);
  const compiledFragment = useDeferredValue(fragment);
  const isCompiling =
    isPending || compiledFragment !== fragment || compiledVertex !== vertex;

  const fragmentDirty = fragment !== defaultFragment;
  const vertexDirty = vertex !== defaultVertex;
  const uniformsDirty = JSON.stringify(uniformValues) !== JSON.stringify(initialUniformValues);
  const isDirty = fragmentDirty || vertexDirty || uniformsDirty;

  useEffect(() => {
    return () => {
      if (shareTimer.current) clearTimeout(shareTimer.current);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function flashSaveState(state: 'saved' | 'error') {
    setSaveState(state);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveState('idle'), 1800);
  }

  function flashShareState(state: ShareState) {
    setShareState(state);
    if (shareTimer.current) clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareState('idle'), 1800);
  }

  function handleEditorChange(next: string) {
    startTransition(() => {
      if (activeStage === 'fragment') setFragment(next);
      else setVertex(next);
    });
  }

  function handleReset() {
    startTransition(() => {
      setVertex(defaultVertex);
      setFragment(defaultFragment);
      setUniformValues(initialUniformValues);
    });
  }

  async function handleShare() {
    if (typeof window === 'undefined') return;

    const url = new URL(`/scene/${slug}`, window.location.origin);
    if (fragmentDirty) url.searchParams.set(SHARE_FRAGMENT_PARAM, encodeFragment(fragment));
    if (vertexDirty) url.searchParams.set(SHARE_VERTEX_PARAM, encodeFragment(vertex));
    const href = url.toString();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(href);
      } else {
        window.prompt('Copy share link:', href);
      }
      flashShareState('copied');
    } catch {
      flashShareState('error');
    }
  }

  async function handleRecord() {
    if (typeof window === 'undefined') return;
    if (recordState.phase === 'recording' || recordState.phase === 'encoding') {
      recordAbortRef.current?.abort();
      return;
    }

    const canvas = canvasWrapperRef.current?.querySelector('canvas') ?? null;
    if (!canvas) {
      setRecordState({ phase: 'error', message: 'canvas not ready' });
      return;
    }

    const DURATION_MS = 3000;
    const FPS = 24;
    const TARGET = 480;
    const ratio = canvas.width && canvas.height ? canvas.height / canvas.width : 1;
    const width = TARGET;
    const height = Math.max(1, Math.round(TARGET * ratio));

    const controller = new AbortController();
    recordAbortRef.current = controller;
    setRecordState({ phase: 'recording', captured: 0, total: Math.round((DURATION_MS / 1000) * FPS) });

    try {
      const bytes = await recordCanvasToGif({
        source: canvas,
        width,
        height,
        fps: FPS,
        durationMs: DURATION_MS,
        signal: controller.signal,
        onProgress: (captured, total) => {
          setRecordState({ phase: captured === total ? 'encoding' : 'recording', captured, total });
        },
      });
      triggerGifDownload(bytes, slug);
      setRecordState({ phase: 'idle' });
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setRecordState({ phase: 'idle' });
      } else {
        setRecordState({ phase: 'error', message: (err as Error).message });
      }
    } finally {
      recordAbortRef.current = null;
    }
  }

  async function handleSaveFork() {
    if (!user) return;
    setSaveState('saving');
    try {
      await saveFork({
        uid: user.uid,
        slug,
        title,
        vertex,
        fragment,
        uniformValues,
      });
      flashSaveState('saved');
    } catch (err) {
      console.error('saveFork failed', err);
      flashSaveState('error');
    }
  }

  function handleTutorialToggle() {
    setTutorialOpen((open) => {
      const next = !open;
      if (next) setTutorialIndex(0);
      return next;
    });
  }

  function handleTutorialPrev() {
    setTutorialIndex((idx) => Math.max(0, idx - 1));
  }

  function handleTutorialNext() {
    if (!tutorial) return;
    setTutorialIndex((idx) => Math.min(tutorial.length - 1, idx + 1));
  }

  function handleExport() {
    if (typeof window === 'undefined') return;

    const html = buildSnippetHtml({
      slug,
      title,
      vertex,
      fragment,
      uniformDefs,
      uniformValues,
    });

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${slug}.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
  }

  const shareLabel: Record<ShareState, string> = {
    idle: isDirty ? 'share fork' : 'share',
    copied: 'copied!',
    error: 'copy failed',
  };

  const editorValue = activeStage === 'fragment' ? fragment : vertex;

  return (
    <section className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div
          ref={canvasWrapperRef}
          className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-bg-panel shadow-glow lg:aspect-auto"
        >
          <SceneCanvasMount
            className="h-full w-full"
            vertexShader={compiledVertex}
            fragmentShader={compiledFragment}
            uniformDefs={uniformDefs}
            uniformValues={uniformValues}
          />
        </div>

        <div className="flex h-[480px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-panel">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em]">
            <div role="tablist" aria-label="Shader stage" className="flex items-center gap-1">
              {(['fragment', 'vertex'] as const).map((stage) => {
                const isActive = stage === activeStage;
                const isStageDirty = stage === 'fragment' ? fragmentDirty : vertexDirty;
                return (
                  <button
                    key={stage}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveStage(stage)}
                    className={
                      'rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition ' +
                      (isActive
                        ? 'bg-accent/15 text-ink ring-1 ring-accent/40'
                        : 'text-ink-faint hover:text-ink')
                    }
                  >
                    {slug}/{stage}.glsl
                    {isStageDirty ? <span className="ml-1.5 text-accent">•</span> : null}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 text-ink-faint">
              <span
                aria-live="polite"
                className={isCompiling ? 'text-accent/80' : 'text-emerald-300/80'}
              >
                {isCompiling ? 'compiling…' : 'live'}
              </span>
              {hasTutorial ? (
                <button
                  type="button"
                  onClick={handleTutorialToggle}
                  className={
                    'rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em] transition ' +
                    (tutorialOpen
                      ? 'border-accent/60 bg-accent/15 text-ink'
                      : 'border-white/10 text-ink-dim hover:border-accent/50 hover:text-ink')
                  }
                >
                  {tutorialOpen ? 'tutorial: on' : 'tutorial'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleShare}
                className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink"
              >
                {shareLabel[shareState]}
              </button>
              {authAvailable && user ? (
                <button
                  type="button"
                  onClick={handleSaveFork}
                  disabled={saveState === 'saving'}
                  title="Save this shader to your account"
                  className={
                    'rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em] transition ' +
                    (saveState === 'error'
                      ? 'border-rose-500/40 text-rose-200 hover:border-rose-400/70'
                      : saveState === 'saved'
                        ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-100'
                        : 'border-white/10 text-ink-dim hover:border-accent/50 hover:text-ink') +
                    ' disabled:cursor-progress disabled:opacity-60'
                  }
                >
                  {saveState === 'saving'
                    ? 'saving…'
                    : saveState === 'saved'
                      ? 'saved!'
                      : saveState === 'error'
                        ? 'save failed'
                        : 'save fork'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleExport}
                className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink"
                title="Download a self-contained .html embed of this shader"
              >
                export html
              </button>
              <button
                type="button"
                onClick={handleRecord}
                className={
                  'rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.25em] transition ' +
                  (recordState.phase === 'recording' || recordState.phase === 'encoding'
                    ? 'border-rose-400/70 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25'
                    : recordState.phase === 'error'
                      ? 'border-rose-500/40 text-rose-200 hover:border-rose-400/70'
                      : 'border-white/10 text-ink-dim hover:border-accent/50 hover:text-ink')
                }
                title="Record a 3 second GIF of the live canvas"
              >
                {recordState.phase === 'recording'
                  ? `rec ${recordState.captured ?? 0}/${recordState.total ?? 0} · cancel`
                  : recordState.phase === 'encoding'
                    ? 'encoding gif…'
                    : recordState.phase === 'error'
                      ? 'rec failed · retry'
                      : 'record gif'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty}
                className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-ink-dim"
              >
                reset
              </button>
            </div>
          </header>
          <div className="flex-1">
            <ShaderEditorMount
              key={activeStage}
              value={editorValue}
              onChange={handleEditorChange}
              className="h-full"
              highlightRange={highlightRange}
            />
          </div>
        </div>
      </div>

      {tutorialOpen && tutorial ? (
        <TutorialPanel
          steps={tutorial}
          activeIndex={tutorialIndex}
          onPrev={handleTutorialPrev}
          onNext={handleTutorialNext}
          onClose={() => setTutorialOpen(false)}
        />
      ) : null}

      {uniformDefs && uniformDefs.length > 0 ? (
        <UniformControls defs={uniformDefs} values={uniformValues} onChange={setUniformValues} />
      ) : null}
    </section>
  );
}
