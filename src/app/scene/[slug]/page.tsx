import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LivePlayground } from '@/components/Playground/LivePlayground';
import { getSceneBySlug, scenes } from '@/shaders/registry';

type ScenePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return scenes.map((scene) => ({ slug: scene.slug }));
}

export function generateMetadata({ params }: ScenePageProps) {
  const scene = getSceneBySlug(params.slug);
  if (!scene) return { title: 'Scene not found · Shader Garden' };

  return {
    title: `${scene.title} · Shader Garden`,
    description: scene.description,
  };
}

export default function ScenePage({ params }: ScenePageProps) {
  const scene = getSceneBySlug(params.slug);
  if (!scene) notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 lg:py-16">
      <nav className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
        <Link href="/" className="transition hover:text-ink">
          ← gallery
        </Link>
        <span>/</span>
        <span>{scene.slug}</span>
      </nav>

      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-ink lg:text-5xl">{scene.title}</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-dim">{scene.description}</p>
      </header>

      <LivePlayground slug={scene.slug} vertex={scene.vertex} initialFragment={scene.fragment} />
    </main>
  );
}
