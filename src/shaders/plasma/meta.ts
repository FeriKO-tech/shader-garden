import type { UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_speed', type: 'float', label: 'Speed', default: 0.45, min: 0, max: 2, step: 0.01 },
  { name: 'u_tint', type: 'color', label: 'Tint', default: [1.0, 1.0, 1.0] },
];

export const plasmaMeta = {
  slug: 'plasma',
  title: 'Plasma',
  description: 'Classic sin-based plasma. Drag horizontally to warp.',
  vertex,
  fragment,
  uniforms,
};

export type ShaderMeta = typeof plasmaMeta;
