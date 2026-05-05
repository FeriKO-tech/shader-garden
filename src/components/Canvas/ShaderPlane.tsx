'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { ShaderMaterial, Vector2 } from 'three';

type ShaderPlaneProps = {
  vertexShader: string;
  fragmentShader: string;
};

export function ShaderPlane({ vertexShader, fragmentShader }: ShaderPlaneProps) {
  const matRef = useRef<ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new Vector2(size.width, size.height) },
      u_mouse: { value: new Vector2(0.5, 0.5) },
    }),
    // refs persist across renders; we only need the initial size snapshot
    // to seed the resolution uniform
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.u_time.value = state.clock.elapsedTime;
    mat.uniforms.u_resolution.value.set(state.size.width, state.size.height);
    mat.uniforms.u_mouse.value.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
