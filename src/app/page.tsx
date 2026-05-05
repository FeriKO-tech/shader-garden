import { SceneCanvasMount } from '@/components/Canvas/SceneCanvasMount';
import { ShaderEditorMount } from '@/components/ShaderEditor/ShaderEditorMount';
import { plasmaMeta } from '@/shaders/plasma/meta';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 lg:py-20">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">shader-garden / v0.1</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
          Interactive WebGL <span className="text-accent">shader garden</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-dim">
          A growing collection of GLSL scenes you can fork, tweak, and share. Built on Next.js, React Three Fiber, and Monaco.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="aspect-square overflow-hidden rounded-3xl border border-white/10 bg-bg-panel shadow-glow lg:aspect-auto">
          <SceneCanvasMount className="h-full w-full" />
        </div>

        <div className="flex h-[480px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-panel">
          <header className="flex items-center justify-between border-b border-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            <span>{plasmaMeta.slug}/fragment.glsl</span>
            <span className="text-accent/70">read-only</span>
          </header>
          <div className="flex-1">
            <ShaderEditorMount value={plasmaMeta.fragment} readOnly className="h-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
