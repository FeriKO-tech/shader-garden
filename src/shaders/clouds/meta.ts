import type { TutorialStep, UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_scale', type: 'float', label: 'Scale', default: 4.0, min: 1, max: 10, step: 0.1 },
  { name: 'u_speed', type: 'float', label: 'Speed', default: 1.0, min: 0, max: 3, step: 0.05 },
  { name: 'u_tint', type: 'color', label: 'Cloud tint', default: [0.95, 0.95, 1.0] },
];

const tutorial: TutorialStep[] = [
  {
    title: 'Pseudo-random hash',
    body:
      '`hash(p)` turns a 2D point into a deterministic 0..1 scalar. The magic numbers are just empirically good constants that smash bits around enough to look random. Same input always gives the same output, which is what we need for a reproducible noise field.',
    lineRange: [12, 16],
  },
  {
    title: 'Value noise: bilinear-interpolated hash',
    body:
      'Split the plane into unit cells (`floor` = cell id, `fract` = position inside cell). Sample the hash at 4 corners, then smoothstep-interpolate between them. Result: a smooth, continuous noise field instead of raw random static.',
    lineRange: [18, 27],
  },
  {
    title: 'fBm: stack octaves of noise',
    body:
      'Fractional Brownian Motion adds 5 copies of the same noise at doubling frequencies and halving amplitudes. The low frequency gives large cloud shapes, the high frequencies add fluffy detail. Standard trick for every procedural texture.',
    lineRange: [29, 38],
  },
  {
    title: 'Drift + aspect correction',
    body:
      'Fix the square-stretching by multiplying by aspect. Scroll the domain over time for parallax motion. Move the mouse to pan - `(u_mouse - 0.5) * 1.6` shifts the entire sky.',
    lineRange: [41, 46],
  },
  {
    title: 'Domain warp: fBm(uv + fBm(uv))',
    body:
      'The key trick: feed one fBm as an offset into another. This warps the texture so clouds get wispy, swirly shapes instead of looking like a flat heightmap. Then `smoothstep(0.35, 0.95, n)` decides which noise values count as "cloud".',
    lineRange: [48, 49],
  },
  {
    title: 'Sky gradient + highlight',
    body:
      'Paint a vertical gradient from deep blue to purple horizon, then lerp toward `u_tint` wherever the cloud mask is bright. Finally add a `pow(cloud, 4.0) * 0.25` highlight so the densest spots glow.',
    lineRange: [51, 55],
  },
];

export const cloudsMeta = {
  slug: 'clouds',
  title: 'Animated clouds',
  description: 'fBm noise drifting across a twilight sky.',
  vertex,
  fragment,
  uniforms,
  tutorial,
};
