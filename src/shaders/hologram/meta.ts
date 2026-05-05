import type { TutorialStep, UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_scanlines', type: 'float', label: 'Scanlines', default: 220.0, min: 50, max: 600, step: 5 },
  { name: 'u_flicker', type: 'float', label: 'Flicker', default: 0.18, min: 0, max: 1, step: 0.02 },
  { name: 'u_color', type: 'color', label: 'Glow', default: [0.55, 0.95, 1.0] },
];

const tutorial: TutorialStep[] = [
  {
    title: 'Helpers: hash + ring SDF',
    body:
      '`hash()` gives us random scalars for noise/flicker. `ring(p, r, w)` is a signed-distance-ish helper that returns 1 on a thin circle of radius `r` with falloff `w`, zero elsewhere. We\'ll stamp many rings using it.',
    lineRange: [12, 18],
  },
  {
    title: 'Centered, aspect-correct UVs',
    body:
      'Shift `vUv` so 0 is the centre and multiply by aspect so our circles stay round on any viewport shape.',
    lineRange: [20, 22],
  },
  {
    title: 'Stack of breathing rings',
    body:
      'Five concentric rings at increasing radii. Each ring has its own phase (`+ float(i)`) and wobbles its radius via `sin(u_time * 0.8 + i) * 0.02`, so they breathe slightly out of sync.',
    lineRange: [24, 28],
  },
  {
    title: 'Square grid overlay',
    body:
      '`abs(fract(uv * 12) - 0.5)` creates a 12-per-unit grid where values are 0 at the centre of each cell and 0.5 on the edges. `smoothstep(0.46, 0.50, ...)` isolates thin grid lines.',
    lineRange: [30, 32],
  },
  {
    title: 'Core glow + mouse-following ring',
    body:
      'An exponential falloff `exp(-length(uv) * 4)` adds a bright spot in the middle. Then we draw a pulsing ring centred on the mouse, so dragging sweeps a scanning halo through the scene.',
    lineRange: [34, 39],
  },
  {
    title: 'Chromatic aberration',
    body:
      'Red is boosted slightly, blue is dampened, based on distance from the centre. This splits highlights into tiny rainbow fringes - the cheapest way to say "lens" or "CRT".',
    lineRange: [41, 47],
  },
  {
    title: 'Flicker + scanlines + noise',
    body:
      'Three post-effects stacked: step-quantised flicker using `hash(floor(u_time * 35))`, a scanline pattern via `sin(vUv.y * u_scanlines)`, and per-pixel noise. Turn any of them off with `* 0.0` to see the contribution of the others.',
    lineRange: [49, 53],
  },
];

export const hologramMeta = {
  slug: 'hologram',
  title: 'Hologram material',
  description: 'Concentric rings, grid, chromatic aberration, scanlines and flicker.',
  vertex,
  fragment,
  uniforms,
  tutorial,
};
