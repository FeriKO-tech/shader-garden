import type { TutorialStep, UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_intensity', type: 'float', label: 'Intensity', default: 1.5, min: 0, max: 3, step: 0.05 },
  { name: 'u_height', type: 'float', label: 'Height', default: 1.5, min: 0.5, max: 3, step: 0.05 },
];

const tutorial: TutorialStep[] = [
  {
    title: 'Noise + fBm scaffold',
    body:
      'Same hash → value-noise → fBm pipeline as the clouds scene. This gives us a smooth, octave-stacked scalar field that we will shape into flames.',
    lineRange: [10, 36],
  },
  {
    title: 'Hand-crafted fire palette',
    body:
      'Five colour stops go from black → dark red → orange → yellow → near-white. Split `t` into four segments and `mix()` between the neighbours. Much more controllable than a single `vec3(t, t*t, t*t*t)` hack and gives the authentic hot-to-cold fire gradient.',
    lineRange: [38, 49],
  },
  {
    title: 'Upward motion + horizontal sway',
    body:
      'Subtract time from `p.y` so the noise domain scrolls downward, which reads as flames climbing up. A small `sin()` on `p.x` wobbles the column, and `u_mouse.x` lets you push the whole fire left/right.',
    lineRange: [55, 57],
  },
  {
    title: 'Anisotropic sampling',
    body:
      '`p * vec2(2.0, 4.5)` stretches the noise vertically - the domain is sampled tighter on X and more spread on Y, so we get tall licking tongues of flame instead of blobs.',
    lineRange: [59, 59],
  },
  {
    title: 'Fade-from-bottom mask',
    body:
      '`fromBottom = 1.0 - uv.y` is 1 at the bottom, 0 at the top. `smoothstep` with `u_height` turns it into a soft vertical falloff. Multiplying noise by this mask is what makes the flames die out as they rise instead of filling the whole screen.',
    lineRange: [61, 62],
  },
  {
    title: 'Colour through the palette',
    body:
      'Take the final intensity (0..1) and feed it into `firePalette`. High-noise pixels at the base get white-yellow, mid values get orange, low values fade to dark red and black. That single lookup turns a scalar field into convincing fire.',
    lineRange: [64, 65],
  },
];

export const fireMeta = {
  slug: 'fire',
  title: 'Procedural fire',
  description: 'fBm flames climbing through a fire palette.',
  vertex,
  fragment,
  uniforms,
  tutorial,
};
