import type { UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_smooth', type: 'float', label: 'Smooth blend', default: 0.30, min: 0, max: 1, step: 0.01 },
];

export const raymarchMeta = {
  slug: 'raymarch',
  title: 'Ray marching',
  description: 'SDF sphere, box, and torus blended via smooth-union. Drag to orbit.',
  vertex,
  fragment,
  uniforms,
};
