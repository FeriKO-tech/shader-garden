'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/lib/auth';
import { getSceneLikeCount, hasUserLiked, toggleLike } from '@/lib/likes';

type LikeButtonProps = {
  slug: string;
  /** Compact variant for cards; default is the larger playground size. */
  size?: 'sm' | 'md';
  /** Prevents parent link navigation when rendered inside a <Link>. */
  stopPropagation?: boolean;
};

export function LikeButton({ slug, size = 'md', stopPropagation = false }: LikeButtonProps) {
  const { available, ready, user, signInWithGoogle } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!available) {
      setCount(0);
      return;
    }
    let cancelled = false;
    void (async () => {
      const c = await getSceneLikeCount(slug);
      if (!cancelled) setCount(c);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, available]);

  useEffect(() => {
    if (!available || !user) {
      setLiked(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      const v = await hasUserLiked(slug, user.uid);
      if (!cancelled) setLiked(v);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, available, user]);

  async function handleClick(e: React.MouseEvent) {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!available) return;
    if (!ready) return;
    if (!user) {
      setPending(true);
      try {
        await signInWithGoogle();
      } catch {
        // ignore; popup close, etc.
      } finally {
        setPending(false);
      }
      return;
    }
    setPending(true);
    try {
      const nowLiked = await toggleLike(slug, user.uid);
      setLiked(nowLiked);
      setCount((prev) => {
        if (prev == null) return nowLiked ? 1 : 0;
        return Math.max(0, prev + (nowLiked ? 1 : -1));
      });
    } catch {
      // noop
    } finally {
      setPending(false);
    }
  }

  if (!available) {
    // Hide the button entirely when Firebase is off.
    return null;
  }

  const padY = size === 'sm' ? 'py-0.5' : 'py-1';
  const padX = size === 'sm' ? 'px-2' : 'px-3';
  const text = size === 'sm' ? 'text-[10px]' : 'text-[11px]';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={liked}
      title={user ? (liked ? 'Unlike this scene' : 'Like this scene') : 'Sign in to like'}
      className={
        `inline-flex items-center gap-1 rounded-full border ${padX} ${padY} font-mono ${text} uppercase tracking-[0.25em] transition ` +
        (liked
          ? 'border-accent/60 bg-accent/15 text-ink'
          : 'border-white/10 text-ink-dim hover:border-accent/50 hover:text-ink') +
        ' disabled:opacity-60'
      }
    >
      <span aria-hidden className={liked ? 'text-accent' : ''}>
        {liked ? '♥' : '♡'}
      </span>
      <span>{count ?? '…'}</span>
    </button>
  );
}
