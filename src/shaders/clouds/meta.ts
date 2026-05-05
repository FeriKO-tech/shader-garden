import type { UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_scale', type: 'float', label: 'Scale', default: 4.0, min: 1, max: 10, step: 0.1 },
  { name: 'u_speed', type: 'float', label: 'Speed', default: 1.0, min: 0, max: 3, step: 0.05 },
  { name: 'u_tint', type: 'color', label: 'Cloud tint', default: [0.95, 0.95, 1.0] },
];

export const cloudsMeta = {
  slug: 'clouds',
  title: 'Animated clouds',
  description: 'fBm noise drifting across a twilight sky.',
  vertex,
  fragment,
  uniforms,
};
