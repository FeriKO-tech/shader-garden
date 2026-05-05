import type { UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_scanlines', type: 'float', label: 'Scanlines', default: 220.0, min: 50, max: 600, step: 5 },
  { name: 'u_flicker', type: 'float', label: 'Flicker', default: 0.18, min: 0, max: 1, step: 0.02 },
  { name: 'u_color', type: 'color', label: 'Glow', default: [0.55, 0.95, 1.0] },
];

export const hologramMeta = {
  slug: 'hologram',
  title: 'Hologram material',
  description: 'Concentric rings, grid, chromatic aberration, scanlines and flicker.',
  vertex,
  fragment,
  uniforms,
};
