'use client';

import Link from 'next/link';
import { useState } from 'react';
import { apiMutation } from '../lib/api';

export function AdminHeader({ name, onSignedOut }: { name: string; onSignedOut: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function signOut() {
    setBusy(true); setError('');
    try { await apiMutation('/api/v1/super-admin/session', 'DELETE'); onSignedOut(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not sign out'); }
    finally { setBusy(false); }
  }
  return <header className="admin-header">
    <Link href="/" className="brand">EstateOS <span>Super Admin</span></Link>
    <div className="header-user">
      <span>{name}</span>
      <button type="button" className="secondary small" disabled={busy} onClick={signOut}>Sign out</button>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
  </header>;
}
