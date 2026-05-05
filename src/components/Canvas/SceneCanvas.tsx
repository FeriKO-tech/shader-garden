'use client';

import { Canvas } from '@react-three/fiber';

import { plasmaMeta } from '@/shaders/plasma/meta';
import type { UniformDef, UniformValues } from '@/shaders/types';

import { ShaderPlane } from './ShaderPlane';

type SceneCanvasProps = {
  className?: string;
  vertexShader?: string;
  fragmentShader?: string;
  uniformDefs?: UniformDef[];
  uniformValues?: UniformValues;
};

export function SceneCanvas({
  className,
  vertexShader = plasmaMeta.vertex,
  fragmentShader = plasmaMeta.fragment,
  uniformDefs,
  uniformValues,
}: SceneCanvasProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 1], fov: 50 }}
      gl={{ antialias: true, preserveDrawingBuffer: false }}
    >
      <ShaderPlane
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniformDefs={uniformDefs}
        uniformValues={uniformValues}
      />
    </Canvas>
  );
}
