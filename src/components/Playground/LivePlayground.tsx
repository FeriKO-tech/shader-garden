'use client';

import { useDeferredValue, useEffect, useRef, useState, useTransition } from 'react';

import { SceneCanvasMount } from '@/components/Canvas/SceneCanvasMount';
import { ShaderEditorMount } from '@/components/ShaderEditor/ShaderEditorMount';
import { SHARE_PARAM, encodeFragment } from '@/lib/encode-share';

type LivePlaygroundProps = {
  slug: string;
  vertex: string;
  defaultFragment: string;
  initialFragment?: string;
};

type ShareState = 'idle' | 'copied' | 'error';

export function LivePlayground({
  slug,
  vertex,
  defaultFragment,
  initialFragment,
}: LivePlaygroundProps) {
  const [fragment, setFragment] = useState(initialFragment ?? defaultFragment);
  const [isPending, startTransition] = useTransition();
  const [shareState, setShareState] = useState<ShareState>('idle');
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const compiledFragment = useDeferredValue(fragment);
  const isCompiling = isPending || compiledFragment !== fragment;
  const isDirty = fragment !== defaultFragment;

  useEffect(() => {
    return () => {
      if (shareTimer.current) clearTimeout(shareTimer.current);
    };
  }, []);

  function flashShareState(state: ShareState) {
    setShareState(state);
    if (shareTimer.current) clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareState('idle'), 1800);
  }

  function handleChange(next: string) {
    startTransition(() => setFragment(next));
  }

  function handleReset() {
    startTransition(() => setFragment(defaultFragment));
  }

  async function handleShare() {
    if (typeof window === 'undefined') return;

    const url = new URL(`/scene/${slug}`, window.location.origin);
    if (isDirty) url.searchParams.set(SHARE_PARAM, encodeFragment(fragment));
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

  const shareLabel: Record<ShareState, string> = {
    idle: isDirty ? 'share fork' : 'share',
    copied: 'copied!',
    error: 'copy failed',
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-bg-panel shadow-glow lg:aspect-auto">
        <SceneCanvasMount
          className="h-full w-full"
          vertexShader={vertex}
          fragmentShader={compiledFragment}
        />
      </div>

      <div className="flex h-[480px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          <span>{slug}/fragment.glsl</span>
          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className={isCompiling ? 'text-accent/80' : 'text-emerald-300/80'}
            >
              {isCompiling ? 'compiling…' : 'live'}
            </span>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink"
            >
              {shareLabel[shareState]}
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
          <ShaderEditorMount value={fragment} onChange={handleChange} className="h-full" />
        </div>
      </div>
    </section>
  );
}
