'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { ProfileForm } from '../components/ProfileForm';
import { useOwnerSession } from '../lib/session';

// Phase 3a §6: /profile is the one-page Agency Profile; signed-out owners go back to sign-in.
export default function ProfilePage() {
  const router = useRouter();
  const { session, setSession, loading, refresh } = useOwnerSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (!session) return <main className="app-loading"><p role="status">Loading…</p></main>;
  return <AppShell session={session} onSignedOut={() => setSession(null)}>
    <div className="page">
      <h1>Agency profile</h1>
      <p className="page-intro">These details are used for your agency account and, later, for your website.</p>
      <ProfileForm onSaved={() => void refresh()} />
    </div>
  </AppShell>;
}
