'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { ShaderMaterial, Vector2, Vector3 } from 'three';

import type { UniformDef, UniformValues } from '@/shaders/types';

type ShaderPlaneProps = {
  vertexShader: string;
  fragmentShader: string;
  uniformDefs?: UniformDef[];
  uniformValues?: UniformValues;
};

export function ShaderPlane({
  vertexShader,
  fragmentShader,
  uniformDefs,
  uniformValues,
}: ShaderPlaneProps) {
  const matRef = useRef<ShaderMaterial>(null);
  const valuesRef = useRef<UniformValues | undefined>(uniformValues);
  valuesRef.current = uniformValues;
  const { viewport, size } = useThree();

  const uniforms = useMemo(() => {
    const base: Record<string, { value: unknown }> = {
      u_time: { value: 0 },
      u_resolution: { value: new Vector2(size.width, size.height) },
      u_mouse: { value: new Vector2(0.5, 0.5) },
    };

    if (uniformDefs) {
      for (const def of uniformDefs) {
        const initial = uniformValues?.[def.name] ?? def.default;
        if (def.type === 'float') {
          base[def.name] = { value: typeof initial === 'number' ? initial : def.default };
        } else if (def.type === 'vec2') {
          const v = Array.isArray(initial) && initial.length === 2 ? initial : def.default;
          base[def.name] = { value: new Vector2(v[0], v[1]) };
        } else {
          const v = Array.isArray(initial) && initial.length === 3 ? initial : def.default;
          base[def.name] = { value: new Vector3(v[0], v[1], v[2]) };
        }
      }
    }

    return base;
    // The shaderMaterial is keyed on shader+uniform-shape, so this memo only
    // needs to run when the material is remounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertexShader, fragmentShader, uniformDefs]);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;

    (mat.uniforms.u_time.value as number) = state.clock.elapsedTime;
    (mat.uniforms.u_resolution.value as Vector2).set(state.size.width, state.size.height);
    (mat.uniforms.u_mouse.value as Vector2).set(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5,
    );

    const values = valuesRef.current;
    if (!values || !uniformDefs) return;

    for (const def of uniformDefs) {
      const slot = mat.uniforms[def.name];
      if (!slot) continue;
      const value = values[def.name];
      if (value === undefined) continue;

      if (def.type === 'float' && typeof value === 'number') {
        slot.value = value;
      } else if (def.type === 'vec2' && Array.isArray(value) && value.length === 2) {
        (slot.value as Vector2).set(value[0], value[1]);
      } else if (def.type === 'color' && Array.isArray(value) && value.length === 3) {
        (slot.value as Vector3).set(value[0], value[1], value[2]);
      }
    }
  });

  const uniformShape = uniformDefs?.map((d) => `${d.name}:${d.type}`).join(',') ?? '';

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        key={`${vertexShader.length}:${fragmentShader.length}:${uniformShape}:${vertexShader}:${fragmentShader}`}
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
