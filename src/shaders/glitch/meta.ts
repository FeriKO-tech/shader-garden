import type { TutorialStep } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const tutorial: TutorialStep[] = [
  {
    title: 'Cheap pseudo-random',
    body:
      'Same `sin(dot(co, ...)) * big` trick as the other shaders. Seed it with `(band, t)` to get a fresh offset per scanline per time-step; seed with raw `uv + t` to get per-pixel sparkle noise.',
    lineRange: [8, 10],
  },
  {
    title: 'Quantise time, dial chaos with the mouse',
    body:
      '`floor(u_time * 10) / 10` snaps the clock to 10 fps, so new random seeds only arrive 10×/sec - perfect for that choppy VHS feel. `u_mouse.y` adds a base chaos amount so dragging up makes the glitch wilder.',
    lineRange: [14, 15],
  },
  {
    title: 'Per-band tearing + rare bursts',
    body:
      'Divide the screen into 80 horizontal bands. Give each `(band, t)` pair a random offset. `step(0.92, rand(t))` is 1 only ~8% of the time - these occasional bursts multiply the tearing amount for sudden glitch flashes.',
    lineRange: [17, 19],
  },
  {
    title: 'RGB split with opposite offsets',
    body:
      'R uses `+ offset`, B uses `- offset`, G uses none. When `offset` is non-zero the three channels separate horizontally, producing that classic chromatic-aberration "shaky TV" feel. Sine patterns shift over time so there\'s always motion.',
    lineRange: [21, 23],
  },
  {
    title: 'Hot-pixel sparkle + scanlines',
    body:
      'Raise white-noise to the 18th power to get occasional very bright pixels (most noise values die, only the biggest survive). Then subtract a `sin(uv.y * 600)` scanline pattern so the image gets those CRT bars.',
    lineRange: [25, 29],
  },
];

export const glitchMeta = {
  slug: 'glitch',
  title: 'Glitch / VHS',
  description: 'Chromatic-aberrated scanlines with random tearing.',
  vertex,
  fragment,
  tutorial,
};
