import type { UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_density', type: 'float', label: 'Density', default: 1.5, min: 0, max: 3, step: 0.05 },
  { name: 'u_swirl', type: 'float', label: 'Swirl', default: 0.8, min: -2, max: 2, step: 0.05 },
  { name: 'u_coreColor', type: 'color', label: 'Core', default: [1.0, 0.85, 0.55] },
  { name: 'u_haloColor', type: 'color', label: 'Halo', default: [0.40, 0.30, 0.90] },
];

export const galaxyMeta = {
  slug: 'galaxy',
  title: 'Galaxy / nebula',
  description: 'Spiral fBm with a hot core, a halo, and sparse stars.',
  vertex,
  fragment,
  uniforms,
};
