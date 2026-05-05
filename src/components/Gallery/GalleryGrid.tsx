'use client';

import { useEffect, useMemo, useState } from 'react';

import { SceneCard } from '@/components/SceneCard/SceneCard';
import { DEFAULT_FEATURED_SLUGS, fetchFeaturedSlugs } from '@/lib/featured';
import type { SceneMeta } from '@/shaders/registry';

type GalleryGridProps = {
  scenes: SceneMeta[];
};

export function GalleryGrid({ scenes }: GalleryGridProps) {
  const [featured, setFeatured] = useState<Set<string>>(() => new Set(DEFAULT_FEATURED_SLUGS));

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const slugs = await fetchFeaturedSlugs();
      if (!cancelled) setFeatured(new Set(slugs));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const ordered = useMemo(() => {
    const featuredList: SceneMeta[] = [];
    const rest: SceneMeta[] = [];
    for (const scene of scenes) {
      if (featured.has(scene.slug)) featuredList.push(scene);
      else rest.push(scene);
    }
    return [...featuredList, ...rest];
  }, [scenes, featured]);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((scene) => (
        <SceneCard key={scene.slug} scene={scene} featured={featured.has(scene.slug)} />
      ))}
    </div>
  );
}
