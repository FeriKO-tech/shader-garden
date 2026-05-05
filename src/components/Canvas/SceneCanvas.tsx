'use client';

import { Canvas } from '@react-three/fiber';

import { plasmaMeta } from '@/shaders/plasma/meta';

import { ShaderPlane } from './ShaderPlane';

type SceneCanvasProps = {
  className?: string;
  vertexShader?: string;
  fragmentShader?: string;
};

export function SceneCanvas({
  className,
  vertexShader = plasmaMeta.vertex,
  fragmentShader = plasmaMeta.fragment,
}: SceneCanvasProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 1], fov: 50 }}
      gl={{ antialias: true, preserveDrawingBuffer: false }}
    >
      <ShaderPlane vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </Canvas>
  );
}
