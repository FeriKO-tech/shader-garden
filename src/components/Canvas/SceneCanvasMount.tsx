'use client';

import dynamic from 'next/dynamic';

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

export function SceneCanvasMount({ className }: { className?: string }) {
  return <SceneCanvas className={className} />;
}
