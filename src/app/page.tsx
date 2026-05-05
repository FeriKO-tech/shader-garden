import { SceneCanvasMount } from '@/components/Canvas/SceneCanvasMount';

export default function HomePage() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:py-24">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">shader-garden / v0.1</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-ink">
          Interactive WebGL <span className="text-accent">shader garden</span>.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
          A growing collection of GLSL scenes you can fork, tweak, and share. Built on Next.js, React Three Fiber, and Monaco.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 font-mono text-sm">
          <span className="rounded-full border border-white/10 bg-bg-panel/80 px-4 py-2 text-ink-dim">Next.js 14</span>
          <span className="rounded-full border border-white/10 bg-bg-panel/80 px-4 py-2 text-ink-dim">R3F + drei</span>
          <span className="rounded-full border border-white/10 bg-bg-panel/80 px-4 py-2 text-ink-dim">GLSL</span>
          <span className="rounded-full border border-white/10 bg-bg-panel/80 px-4 py-2 text-ink-dim">Tailwind</span>
        </div>
      </section>

      <section className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-bg-panel shadow-glow">
        <SceneCanvasMount className="h-full w-full" />
      </section>
    </main>
  );
}
