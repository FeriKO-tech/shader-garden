'use client';

import { useDeferredValue, useState, useTransition } from 'react';

import { SceneCanvasMount } from '@/components/Canvas/SceneCanvasMount';
import { ShaderEditorMount } from '@/components/ShaderEditor/ShaderEditorMount';

type LivePlaygroundProps = {
  slug: string;
  vertex: string;
  initialFragment: string;
};

export function LivePlayground({ slug, vertex, initialFragment }: LivePlaygroundProps) {
  const [fragment, setFragment] = useState(initialFragment);
  const [isPending, startTransition] = useTransition();
  const compiledFragment = useDeferredValue(fragment);
  const isCompiling = isPending || compiledFragment !== fragment;
  const isDirty = fragment !== initialFragment;

  function handleChange(next: string) {
    startTransition(() => setFragment(next));
  }

  function handleReset() {
    startTransition(() => setFragment(initialFragment));
  }

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
        <header className="flex items-center justify-between border-b border-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
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
