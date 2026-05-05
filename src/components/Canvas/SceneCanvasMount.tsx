'use client';

import dynamic from 'next/dynamic';

import type { UniformDef, UniformValues } from '@/shaders/types';

const SceneCanvas = dynamic(
  () => import('./SceneCanvas').then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-ink-faint">
        booting webgl…
      </div>
    ),
  },
);

type SceneCanvasMountProps = {
  className?: string;
  vertexShader?: string;
  fragmentShader?: string;
  uniformDefs?: UniformDef[];
  uniformValues?: UniformValues;
};

export function SceneCanvasMount(props: SceneCanvasMountProps) {
  return <SceneCanvas {...props} />;
}
