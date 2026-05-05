import type { UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_intensity', type: 'float', label: 'Intensity', default: 1.5, min: 0, max: 3, step: 0.05 },
  { name: 'u_height', type: 'float', label: 'Height', default: 1.5, min: 0.5, max: 3, step: 0.05 },
];

export const fireMeta = {
  slug: 'fire',
  title: 'Procedural fire',
  description: 'fBm flames climbing through a fire palette.',
  vertex,
  fragment,
  uniforms,
};
