'use client';

import { doc, getDoc } from 'firebase/firestore';

import { getFirebaseDb } from './firebase';

/**
 * Fallback featured slugs used when Firebase is off or the config doc is absent.
 */
export const DEFAULT_FEATURED_SLUGS: string[] = ['plasma', 'raymarch', 'galaxy'];

/**
 * Fetches featured slugs from Firestore at `featured/scenes` (field `slugs: string[]`).
 * Falls back to `DEFAULT_FEATURED_SLUGS` on any error or missing config.
 */
export async function fetchFeaturedSlugs(): Promise<string[]> {
  const db = getFirebaseDb();
  if (!db) return DEFAULT_FEATURED_SLUGS;
  try {
    const snap = await getDoc(doc(db, 'featured', 'scenes'));
    if (!snap.exists()) return DEFAULT_FEATURED_SLUGS;
    const data = snap.data() as { slugs?: unknown };
    if (Array.isArray(data.slugs) && data.slugs.every((s) => typeof s === 'string')) {
      return data.slugs as string[];
    }
    return DEFAULT_FEATURED_SLUGS;
  } catch {
    return DEFAULT_FEATURED_SLUGS;
  }
}
