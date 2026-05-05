import type { TutorialStep, UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_speed', type: 'float', label: 'Speed', default: 0.45, min: 0, max: 2, step: 0.01 },
  { name: 'u_tint', type: 'color', label: 'Tint', default: [1.0, 1.0, 1.0] },
];

const tutorial: TutorialStep[] = [
  {
    title: 'Inputs from the host',
    body:
      'The shader runs once per pixel. `vUv` arrives from the vertex stage with each pixel\'s 0..1 position on the quad. `u_time`, `u_resolution`, and `u_mouse` are pushed every frame by the playground. `u_speed` and `u_tint` are user-driven sliders declared in `meta.ts`.',
    lineRange: [3, 9],
  },
  {
    title: 'UV remap to centered coordinates',
    body:
      'We turn 0..1 UV into -1..1 centered coordinates so the origin is in the middle of the canvas. Multiplying the X axis by the aspect ratio keeps the pattern from squashing on widescreen displays.',
    lineRange: [12, 13],
  },
  {
    title: 'Time and mouse warp',
    body:
      'Multiplying `u_time` by `u_speed` lets the slider control how fast the field evolves. `warp` reads the horizontal mouse position and turns it into an offset that bends one of the sine layers.',
    lineRange: [15, 16],
  },
  {
    title: 'Sum of sines = plasma',
    body:
      'A plasma is just layered sine waves. Two are aligned with the X and Y axes, one runs along the X+Y diagonal, and one is radial around a warp point. Averaging them with `*= 0.25` keeps the result in roughly -1..1.',
    lineRange: [18, 22],
  },
  {
    title: 'Phase-shifted RGB',
    body:
      'The same wave value is fed into three sines offset by 0, 2π/3, and 4π/3. That shifts each color channel\'s peak so the same field reads as a moving rainbow without any explicit palette.',
    lineRange: [24, 28],
  },
  {
    title: 'Final tint',
    body:
      'The slider color tints the result on the way out. Set `u_tint` to a warm hue to get a sunset-like plasma, or to a deep blue for a glacial vibe. The 1.0 alpha just makes the canvas fully opaque.',
    lineRange: [30, 30],
  },
];

export const plasmaMeta = {
  slug: 'plasma',
  title: 'Plasma',
  description: 'Classic sin-based plasma. Drag horizontally to warp.',
  vertex,
  fragment,
  uniforms,
  tutorial,
};

export type ShaderMeta = typeof plasmaMeta;
