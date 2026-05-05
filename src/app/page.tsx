import { LivePlayground } from '@/components/Playground/LivePlayground';
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
        <p className="mt-2 max-w-2xl text-sm text-ink-faint">
          Edit the fragment shader on the right — the canvas recompiles as you type.
        </p>
      </section>

      <LivePlayground
        slug={plasmaMeta.slug}
        vertex={plasmaMeta.vertex}
        initialFragment={plasmaMeta.fragment}
      />
    </main>
  );
}
