import type { TutorialStep, UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_density', type: 'float', label: 'Density', default: 1.5, min: 0, max: 3, step: 0.05 },
  { name: 'u_swirl', type: 'float', label: 'Swirl', default: 0.8, min: -2, max: 2, step: 0.05 },
  { name: 'u_coreColor', type: 'color', label: 'Core', default: [1.0, 0.85, 0.55] },
  { name: 'u_haloColor', type: 'color', label: 'Halo', default: [0.40, 0.30, 0.90] },
];

const tutorial: TutorialStep[] = [
  {
    title: 'Hash → noise → fBm',
    body:
      'Procedural pipeline: `hash` turns a 2D point into a deterministic random number, `noise` smooths the hash with bilinear interpolation, and `fbm` stacks 5 octaves of doubling-frequency noise to get cloud-like detail.',
    lineRange: [13, 39],
  },
  {
    title: 'Centered, aspect-correct UVs',
    body:
      'We re-center the UV around (0,0) and stretch by aspect so circles stay circular on widescreens. The mouse offset shifts the whole nebula a little, like a parallax view.',
    lineRange: [42, 44],
  },
  {
    title: 'Polar swirl',
    body:
      'Convert to polar `(r, ang)`, then bend the angle as a function of radius. The `(1 - r)` factor makes the inner ring twist faster than the outer, which is the signature spiral arm look. Slow time-drift keeps it slowly rotating.',
    lineRange: [46, 50],
  },
  {
    title: 'Two density layers',
    body:
      'A coarse fBm layer paints the broad arms, a fine layer adds bright knots. The radial `falloff` fades the disk near the edge, and `u_density` lets the user dial the whole thing up or down.',
    lineRange: [52, 57],
  },
  {
    title: 'Sparse star field',
    body:
      'Take a high-frequency noise sample and raise it to a high power. Most pixels collapse to ~0, only the brightest spots survive - that\'s a cheap, convincing star field with no extra texture.',
    lineRange: [59, 59],
  },
  {
    title: 'Compositing',
    body:
      'Start with a deep-blue background, mix in the halo color where density is mid-range, then mix in the core color at high density. Add stars on top, plus an extra core glow that\'s independent of density. That\'s the final pixel.',
    lineRange: [61, 68],
  },
];

export const galaxyMeta = {
  slug: 'galaxy',
  title: 'Galaxy / nebula',
  description: 'Spiral fBm with a hot core, a halo, and sparse stars.',
  vertex,
  fragment,
  uniforms,
  tutorial,
};
