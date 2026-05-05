'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from 'firebase/firestore';

import { getFirebaseDb } from './firebase';
import type { UniformValues } from '@/shaders/types';

export type ForkDocInput = {
  uid: string;
  slug: string;
  title: string;
  vertex: string;
  fragment: string;
  uniformValues: UniformValues;
  note?: string;
};

export type ForkDoc = ForkDocInput & {
  id: string;
  createdAt: Timestamp | null;
};

const COLLECTION = 'forks';
const MAX_FORKS_PER_USER = 100;

function forksCollection() {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore is not configured');
  return collection(db, COLLECTION);
}

export async function saveFork(input: ForkDocInput): Promise<string> {
  const col = forksCollection();
  const ref = await addDoc(col, {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listForksByUser(uid: string): Promise<ForkDoc[]> {
  const col = forksCollection();
  const q = query(
    col,
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(MAX_FORKS_PER_USER),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Omit<ForkDoc, 'id'>;
    return { id: d.id, ...data };
  });
}

export async function deleteFork(forkId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore is not configured');
  await deleteDoc(doc(db, COLLECTION, forkId));
}
