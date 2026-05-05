import { cloudsMeta } from './clouds/meta';
import { fireMeta } from './fire/meta';
import { glitchMeta } from './glitch/meta';
import { plasmaMeta } from './plasma/meta';
import { voronoiMeta } from './voronoi/meta';
import type { UniformDef } from './types';

export type SceneMeta = {
  slug: string;
  title: string;
  description: string;
  vertex: string;
  fragment: string;
  uniforms?: UniformDef[];
};

export const scenes: SceneMeta[] = [plasmaMeta, cloudsMeta, fireMeta, voronoiMeta, glitchMeta];

export function getSceneBySlug(slug: string): SceneMeta | undefined {
  return scenes.find((scene) => scene.slug === slug);
}
