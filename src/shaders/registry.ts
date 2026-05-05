import { cloudsMeta } from './clouds/meta';
import { fireMeta } from './fire/meta';
import { galaxyMeta } from './galaxy/meta';
import { glitchMeta } from './glitch/meta';
import { hologramMeta } from './hologram/meta';
import { plasmaMeta } from './plasma/meta';
import { raymarchMeta } from './raymarch/meta';
import { voronoiMeta } from './voronoi/meta';
import type { TutorialStep, UniformDef } from './types';

export type SceneMeta = {
  slug: string;
  title: string;
  description: string;
  vertex: string;
  fragment: string;
  uniforms?: UniformDef[];
  tutorial?: TutorialStep[];
};

export const scenes: SceneMeta[] = [
  plasmaMeta,
  cloudsMeta,
  fireMeta,
  galaxyMeta,
  voronoiMeta,
  raymarchMeta,
  hologramMeta,
  glitchMeta,
];

export function getSceneBySlug(slug: string): SceneMeta | undefined {
  return scenes.find((scene) => scene.slug === slug);
}
