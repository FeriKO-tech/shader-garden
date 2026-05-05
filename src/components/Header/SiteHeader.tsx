import Link from 'next/link';

import { UserMenu } from './UserMenu';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-accent/15 font-mono text-[11px] text-accent">
            §
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-dim">
            shader · garden
          </span>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
