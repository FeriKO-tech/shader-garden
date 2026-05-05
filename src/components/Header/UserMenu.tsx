'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/lib/auth';

export function UserMenu() {
  const { available, ready, user, signInWithGoogle, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!available) {
    return (
      <span
        className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint sm:inline"
        title="Set NEXT_PUBLIC_FIREBASE_* env vars to enable sign-in"
      >
        auth: off
      </span>
    );
  }

  if (!ready) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        …
      </span>
    );
  }

  async function handleSignIn() {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy}
          className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink disabled:opacity-50"
        >
          {busy ? 'signing in…' : 'sign in with google'}
        </button>
        {error ? (
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-rose-300 md:inline">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/my"
        className="hidden rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink sm:inline-flex"
      >
        my scenes
      </Link>
      <div className="flex items-center gap-2">
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="h-7 w-7 rounded-full border border-white/10"
          />
        ) : (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] text-ink-dim">
            {(user.displayName || user.email || '?').slice(0, 1).toUpperCase()}
          </span>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={busy}
          className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim transition hover:border-accent/50 hover:text-ink disabled:opacity-50"
        >
          sign out
        </button>
      </div>
    </div>
  );
}
