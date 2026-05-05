import type { TutorialStep, UniformDef } from '../types';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

const uniforms: UniformDef[] = [
  { name: 'u_smooth', type: 'float', label: 'Smooth blend', default: 0.30, min: 0, max: 1, step: 0.01 },
];

const tutorial: TutorialStep[] = [
  {
    title: 'Signed distance functions',
    body:
      'Each shape returns the signed distance from a point in 3D to its surface — negative inside, positive outside, zero on the surface. Sphere is just radius minus length; box and torus do a bit more vector work but the idea is the same.',
    lineRange: [14, 26],
  },
  {
    title: 'Smooth union',
    body:
      '`opSmoothUnion` blends two SDFs with a soft k-radius blob instead of taking the hard min. The slider on the right (`u_smooth`) controls how mushy the merge is — drop it to 0 to see the original three solids.',
    lineRange: [28, 31],
  },
  {
    title: 'The animated scene',
    body:
      'The whole scene is one function: position the sphere, box, and torus over time, smooth-union them, and return the result. Changing this function changes what gets ray-marched — try multiplying `t` by larger numbers to speed up the dance.',
    lineRange: [39, 56],
  },
  {
    title: 'Surface normals via gradient',
    body:
      'A surface normal is just the gradient of the SDF, approximated with a tiny finite-difference. Three samples on each axis, normalize, and you get the direction the surface is facing — needed for any kind of shading.',
    lineRange: [58, 65],
  },
  {
    title: 'Camera + ray direction',
    body:
      'The camera sits at `(0, 0, -3)` and the mouse rotates it around the origin and tilts it vertically. Each pixel\'s UV becomes a ray direction by projecting onto the camera basis (`forward`, `right`, `up`).',
    lineRange: [67, 78],
  },
  {
    title: 'The ray march loop',
    body:
      'Start at the camera, ask the scene how far the nearest surface is, step that far along the ray, and repeat. Stop when you hit something (`ds < SURF_DIST`) or run out of room (`d > MAX_DIST`). 64 steps is plenty for these shapes.',
    lineRange: [80, 86],
  },
  {
    title: 'Shading the hit point',
    body:
      'Once we hit, we sample the normal, dot it with a light direction for diffuse, do a quick Phong specular and fresnel rim for that wet purple look, then mix two base colors driven by diffuse intensity.',
    lineRange: [88, 99],
  },
];

export const raymarchMeta = {
  slug: 'raymarch',
  title: 'Ray marching',
  description: 'SDF sphere, box, and torus blended via smooth-union. Drag to orbit.',
  vertex,
  fragment,
  uniforms,
  tutorial,
};
