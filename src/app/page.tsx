import { SceneCard } from '@/components/SceneCard/SceneCard';
import { scenes } from '@/shaders/registry';

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

      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-ink-dim">Gallery</h2>
          <span className="font-mono text-xs text-ink-faint">{scenes.length} scenes</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scenes.map((scene) => (
            <SceneCard key={scene.slug} scene={scene} />
          ))}
        </div>
      </section>
    </main>
  );
}
