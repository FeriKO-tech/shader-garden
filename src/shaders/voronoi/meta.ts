import type { TutorialStep } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const tutorial: TutorialStep[] = [
  {
    title: 'hash2: a 2D pseudo-random point',
    body:
      'For each integer cell we need a random offset inside that cell. `hash2` maps a 2D id to a `vec2` in the 0..1 square, deterministically. The magic `sin(dot(...)) * 43758.5453` trick is the standard GLSL one-liner.',
    lineRange: [9, 13],
  },
  {
    title: 'Aspect-correct UVs + mouse zoom',
    body:
      'Fix the stretch so the cells stay square on any aspect ratio. Then multiply by `5 + u_mouse.x * 4` - the farther right your cursor, the more cells fit on screen (effective zoom-out).',
    lineRange: [15, 18],
  },
  {
    title: 'Cell id vs position-inside-cell',
    body:
      '`floor(uv)` identifies which cell we\'re in; `fract(uv)` is the local 0..1 position inside that cell. We\'ll use the cell id for hashing and the local position for distance computation.',
    lineRange: [20, 21],
  },
  {
    title: 'Sweep the 3×3 neighbourhood',
    body:
      'The closest point to a pixel might live in the current cell, or in any of the 8 neighbours. Loop over all 9, fetch each one\'s random offset via `hash2`, and keep the smallest distance.',
    lineRange: [25, 33],
  },
  {
    title: 'Make the points move',
    body:
      '`0.5 + 0.5 * sin(u_time * 0.6 + 6.2831 * point)` turns each static hash into a wobbling point that circles around the cell centre. The `6.2831 * point` phase means every cell wobbles with a different rhythm.',
    lineRange: [28, 29],
  },
  {
    title: 'Colour by distance + hot core',
    body:
      'Lerp between a cool purple and a warm pink based on `minDist` - near a point = cool, far from points = warm. Then `pow(1 - minDist, 6.0) * 0.4` adds a tight bright spike right at each cell\'s centre.',
    lineRange: [35, 38],
  },
];

export const voronoiMeta = {
  slug: 'voronoi',
  title: 'Voronoi',
  description: 'Animated cell-noise. Move horizontally to zoom in.',
  vertex,
  fragment,
  tutorial,
};
