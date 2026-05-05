'use client';

import type { TutorialStep } from '@/shaders/types';

type TutorialPanelProps = {
  steps: TutorialStep[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

export function TutorialPanel({ steps, activeIndex, onPrev, onNext, onClose }: TutorialPanelProps) {
  if (steps.length === 0) return null;
  const safeIndex = Math.max(0, Math.min(activeIndex, steps.length - 1));
  const step = steps[safeIndex];
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === steps.length - 1;

  return (
    <aside className="grid gap-4 rounded-2xl border border-accent/30 bg-bg-panel p-5 shadow-glow lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/80">
          tutorial · step {safeIndex + 1} / {steps.length}
        </span>
        <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
        {step.lineRange ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            {step.stage ?? 'fragment'}.glsl · lines {step.lineRange[0]}–{step.lineRange[1]}
          </span>
        ) : null}
      </header>

      <div className="flex flex-col gap-4">
        <p className="whitespace-pre-line text-sm leading-relaxed text-ink-dim">{step.body}</p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink-faint transition hover:border-white/30 hover:text-ink"
          >
            close tutorial
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-ink-dim"
            >
              ← prev
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={isLast}
              className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-[10px] uppercase tracking-[0.25em] text-ink transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-accent/10"
            >
              next →
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
