'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/lib/auth';
import { SHARE_FRAGMENT_PARAM, SHARE_VERTEX_PARAM, encodeFragment } from '@/lib/encode-share';
import { deleteFork, listForksByUser, type ForkDoc } from '@/lib/forks';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export function MyForksClient() {
  const { available, ready, user, signInWithGoogle } = useAuth();
  const [forks, setForks] = useState<ForkDoc[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const load = useCallback(async (uid: string) => {
    setState('loading');
    setError(null);
    try {
      const docs = await listForksByUser(uid);
      setForks(docs);
      setState('ready');
    } catch (err) {
      setError((err as Error).message);
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (!ready || !available || !user) return;
    void load(user.uid);
  }, [ready, available, user, load]);

  if (!available) {
    return (
      <div className="rounded-2xl border border-white/10 bg-bg-panel p-6 text-sm text-ink-dim">
        Firebase is not configured for this deployment. Set the{' '}
        <code className="rounded bg-white/5 px-1 font-mono text-xs">NEXT_PUBLIC_FIREBASE_*</code>{' '}
        environment variables to enable accounts and saved forks.
      </div>
    );
  }

  if (!ready) {
    return <p className="text-sm text-ink-dim">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-bg-panel p-6">
        <p className="text-sm text-ink-dim">Sign in to see the forks you&apos;ve saved.</p>
        <button
          type="button"
          onClick={() => {
            void signInWithGoogle();
          }}
          className="self-start rounded-full border border-accent/50 bg-accent/15 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink transition hover:bg-accent/25"
        >
          sign in with google
        </button>
      </div>
    );
  }

  async function handleDelete(id: string) {
    setPendingDelete(id);
    try {
      await deleteFork(id);
      setForks((prev) => prev.filter((fork) => fork.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPendingDelete(null);
    }
  }

  if (state === 'loading' || state === 'idle') {
    return <p className="text-sm text-ink-dim">Loading your forks…</p>;
  }

  if (state === 'error') {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
        Failed to load forks: {error}
      </div>
    );
  }

  if (forks.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-bg-panel p-6 text-sm text-ink-dim">
        No forks yet. Open any scene, tweak the shader, and hit <strong>save fork</strong> in the
        playground header.
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {forks.map((fork) => {
        const href = buildForkHref(fork);
        const dateLabel = formatDate(fork.createdAt);
        return (
          <li
            key={fork.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-bg-panel p-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold text-ink">{fork.title}</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                {fork.slug}
              </span>
            </div>
            {dateLabel ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                saved {dateLabel}
              </span>
            ) : null}
            <div className="mt-auto flex items-center justify-between gap-2">
              <Link
                href={href}
                className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ink transition hover:bg-accent/20"
              >
                open
              </Link>
              <button
                type="button"
                onClick={() => void handleDelete(fork.id)}
                disabled={pendingDelete === fork.id}
                className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-rose-400/50 hover:text-rose-200 disabled:opacity-50"
              >
                {pendingDelete === fork.id ? 'deleting…' : 'delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function buildForkHref(fork: ForkDoc): string {
  const params = new URLSearchParams();
  if (fork.fragment) params.set(SHARE_FRAGMENT_PARAM, encodeFragment(fork.fragment));
  if (fork.vertex) params.set(SHARE_VERTEX_PARAM, encodeFragment(fork.vertex));
  const qs = params.toString();
  return `/scene/${fork.slug}${qs ? `?${qs}` : ''}`;
}

function formatDate(value: ForkDoc['createdAt']): string | null {
  if (!value) return null;
  try {
    const d = value.toDate();
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return null;
  }
}
