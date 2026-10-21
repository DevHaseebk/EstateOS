'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import type { OwnerSession } from '../lib/api';
import { useOwnerSession } from '../lib/session';
import { AppShell } from './AppShell';

/** Signed-in Agency Admin page: loads the session, sends signed-out owners to sign-in, and wraps the shell. */
export function OwnerPage({ children }: { children: (session: OwnerSession, refresh: () => void) => ReactNode }) {
  const router = useRouter();
  const { session, setSession, loading, refresh } = useOwnerSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (!session) return <main className="app-loading"><p role="status">Loading…</p></main>;
  return <AppShell session={session} onSignedOut={() => setSession(null)}>{children(session, () => void refresh())}</AppShell>;
}
