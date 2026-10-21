'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { apiMutation } from '../lib/api';

export function AdminHeader({ name, onSignedOut }: { name: string; onSignedOut: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pathname = usePathname();
  async function signOut() {
    setBusy(true); setError('');
    try { await apiMutation('/api/v1/super-admin/session', 'DELETE'); onSignedOut(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not sign out'); }
    finally { setBusy(false); }
  }
  return <header className="admin-header">
    <Link href="/" className="brand">EstateOS <span>Super Admin</span></Link>
    {/* D-064: the review queue stays first; All agencies (D-070) is secondary. */}
    <nav className="admin-nav" aria-label="Super Admin">
      <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>Review queue</Link>
      <Link href="/agencies" aria-current={pathname === '/agencies' ? 'page' : undefined}>All agencies</Link>
    </nav>
    <div className="header-user">
      <span>{name}</span>
      <button type="button" className="secondary small" disabled={busy} onClick={signOut}>Sign out</button>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
  </header>;
}
