import type { Metadata } from 'next';

import { MyForksClient } from './MyForksClient';

export const metadata: Metadata = {
  title: 'My scenes',
  description: 'Your saved shader forks.',
};

export default function MyScenesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/80">
          your account
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">My scenes</h1>
        <p className="max-w-xl text-sm text-ink-dim">
          Forks you save from the playground live here. Open one to keep editing, or delete it to
          free the slot. Your account holds up to 100 forks.
        </p>
      </header>

      <MyForksClient />
    </main>
  );
}
