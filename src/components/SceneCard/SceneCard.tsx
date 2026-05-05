import Link from 'next/link';

import { SceneCanvasMount } from '@/components/Canvas/SceneCanvasMount';
import type { SceneMeta } from '@/shaders/registry';

type SceneCardProps = {
  scene: SceneMeta;
};

export function SceneCard({ scene }: SceneCardProps) {
  return (
    <Link
      href={`/scene/${scene.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-bg-panel transition hover:border-accent/40 hover:shadow-glow"
    >
      <div className="aspect-square w-full overflow-hidden bg-bg-soft">
        <SceneCanvasMount
          className="h-full w-full"
          vertexShader={scene.vertex}
          fragmentShader={scene.fragment}
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
        <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent/80 transition group-hover:text-accent">
          open editor →
        </span>
      </div>
    </Link>
  );
}
