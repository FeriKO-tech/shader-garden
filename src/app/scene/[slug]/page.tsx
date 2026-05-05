import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LivePlayground } from '@/components/Playground/LivePlayground';
import {
  SHARE_FRAGMENT_PARAM,
  SHARE_VERTEX_PARAM,
  decodeFragment,
} from '@/lib/encode-share';
import { getSceneBySlug, scenes } from '@/shaders/registry';

type ScenePageProps = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
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

function pickToken(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function ScenePage({ params, searchParams }: ScenePageProps) {
  const scene = getSceneBySlug(params.slug);
  if (!scene) notFound();

  const fragmentToken = pickToken(searchParams[SHARE_FRAGMENT_PARAM]);
  const vertexToken = pickToken(searchParams[SHARE_VERTEX_PARAM]);
  const sharedFragment = fragmentToken ? decodeFragment(fragmentToken) : null;
  const sharedVertex = vertexToken ? decodeFragment(vertexToken) : null;
  const isFork =
    Boolean(sharedFragment && sharedFragment !== scene.fragment) ||
    Boolean(sharedVertex && sharedVertex !== scene.vertex);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 lg:py-16">
      <nav className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
        <Link href="/" className="transition hover:text-ink">
          ← gallery
        </Link>
        <span>/</span>
        <span>{scene.slug}</span>
        {isFork ? <span className="text-accent/80">· fork</span> : null}
      </nav>

      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-ink lg:text-5xl">{scene.title}</h1>
        <p className="mt-3 max-w-2xl text-base text-ink-dim">{scene.description}</p>
      </header>

      <LivePlayground
        slug={scene.slug}
        defaultVertex={scene.vertex}
        defaultFragment={scene.fragment}
        initialVertex={sharedVertex ?? undefined}
        initialFragment={sharedFragment ?? undefined}
        uniformDefs={scene.uniforms}
      />
    </main>
  );
}
