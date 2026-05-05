import Link from 'next/link';

import { SceneCanvasMount } from '@/components/Canvas/SceneCanvasMount';
import { LikeButton } from '@/components/Likes/LikeButton';
import type { SceneMeta } from '@/shaders/registry';

type SceneCardProps = {
  scene: SceneMeta;
  featured?: boolean;
};

export function SceneCard({ scene, featured }: SceneCardProps) {
  return (
    <Link
      href={`/scene/${scene.slug}`}
      className={
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-bg-panel transition ' +
        (featured
          ? 'border-accent/40 shadow-glow hover:border-accent/60'
          : 'border-white/10 hover:border-accent/40 hover:shadow-glow')
      }
    >
      {featured ? (
        <span className="absolute left-3 top-3 z-10 rounded-full border border-accent/40 bg-bg/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-accent backdrop-blur">
          featured
        </span>
      ) : null}

      <div className="aspect-square w-full overflow-hidden bg-bg-soft">
        <SceneCanvasMount
          className="h-full w-full"
          vertexShader={scene.vertex}
          fragmentShader={scene.fragment}
          uniformDefs={scene.uniforms}
        />
      </div>

      <div className="flex flex-col gap-1 border-t border-white/5 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink">{scene.title}</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            /{scene.slug}
          </span>
        </div>
        <p className="text-sm leading-snug text-ink-dim">{scene.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80 transition group-hover:text-accent">
            open editor →
          </span>
          <LikeButton slug={scene.slug} size="sm" stopPropagation />
        </div>
      </div>
    </Link>
  );
}
