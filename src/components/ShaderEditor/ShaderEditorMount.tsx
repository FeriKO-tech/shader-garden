'use client';

import dynamic from 'next/dynamic';

const ShaderEditor = dynamic(() => import('./ShaderEditor').then((m) => m.ShaderEditor), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-ink-faint">
      loading editor…
    </div>
  ),
});

type ShaderEditorMountProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  height?: number | string;
  highlightRange?: [number, number];
};

export function ShaderEditorMount(props: ShaderEditorMountProps) {
  return <ShaderEditor {...props} />;
}
