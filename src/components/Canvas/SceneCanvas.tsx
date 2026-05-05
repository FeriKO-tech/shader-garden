'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

type SceneCanvasProps = {
  className?: string;
};

function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.4;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[1.4, 1.4, 1.4]} />
      <meshStandardMaterial color="#9d7bff" metalness={0.2} roughness={0.35} />
    </mesh>
  );
}

export function SceneCanvas({ className }: SceneCanvasProps) {
  return (
    <Canvas
      className={className}
      shadows
      camera={{ position: [2.4, 1.8, 3.2], fov: 45 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0d0e15']} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <RotatingCube />

      <gridHelper args={[10, 10, '#1f2233', '#15182a']} position={[0, -1, 0]} />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}
