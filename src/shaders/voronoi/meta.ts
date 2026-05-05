import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

export const voronoiMeta = {
  slug: 'voronoi',
  title: 'Voronoi',
  description: 'Animated cell-noise. Move horizontally to zoom in.',
  vertex,
  fragment,
};
