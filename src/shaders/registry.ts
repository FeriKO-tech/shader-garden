import { glitchMeta } from './glitch/meta';
import { plasmaMeta } from './plasma/meta';
import { voronoiMeta } from './voronoi/meta';

export type SceneMeta = {
  slug: string;
  title: string;
  description: string;
  vertex: string;
  fragment: string;
};

export const scenes: SceneMeta[] = [plasmaMeta, voronoiMeta, glitchMeta];

export function getSceneBySlug(slug: string): SceneMeta | undefined {
  return scenes.find((scene) => scene.slug === slug);
}
