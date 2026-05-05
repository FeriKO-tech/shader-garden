import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

export const plasmaMeta = {
  slug: 'plasma',
  title: 'Plasma',
  description: 'Classic sin-based plasma. Drag horizontally to warp.',
  vertex,
  fragment,
};

export type ShaderMeta = typeof plasmaMeta;
