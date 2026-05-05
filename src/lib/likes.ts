'use client';

import {
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { getFirebaseDb } from './firebase';

const LIKES = 'likes';

/**
 * Doc id is `${slug}_${uid}` so a user can like a scene at most once.
 */
function likeDocId(slug: string, uid: string) {
  return `${slug}_${uid}`;
}

export async function getSceneLikeCount(slug: string): Promise<number> {
  const db = getFirebaseDb();
  if (!db) return 0;
  // getCountFromServer requires a Query, not a CollectionReference with filters implicit;
  // we use where() via the collection + query modules below.
  const { collection, query, where } = await import('firebase/firestore');
  const q = query(collection(db, LIKES), where('slug', '==', slug));
  try {
    const snap = await getCountFromServer(q);
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function hasUserLiked(slug: string, uid: string): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) return false;
  const ref = doc(db, LIKES, likeDocId(slug, uid));
  try {
    const snap = await getDoc(ref);
    return snap.exists();
  } catch {
    return false;
  }
}

export async function toggleLike(slug: string, uid: string): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore is not configured');
  const ref = doc(db, LIKES, likeDocId(slug, uid));
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await deleteDoc(ref);
    return false;
  }
  await setDoc(ref, { slug, uid, createdAt: serverTimestamp() });
  return true;
}
