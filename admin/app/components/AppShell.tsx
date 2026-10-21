'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { apiMutation, type OwnerSession } from '../lib/api';

// D-100 / Phase 3a §6: a page with unsaved changes registers a guard; leaving through the shell asks Save / Discard / Stay.
type Guard = { isDirty: () => boolean; save: () => Promise<boolean> };
type GuardApi = { register: (guard: Guard | null) => void; guarded: (action: () => void) => void };
const GuardContext = createContext<GuardApi>({ register: () => undefined, guarded: (action) => action() });
/** Pages with unsaved edits register here; the shell asks Save / Discard / Stay before leaving. */
export const useUnsavedGuard = () => useContext(GuardContext).register;
/** Runs an in-page action (switch section, open Preview) only after the same Save / Discard / Stay check (D-051). */
export const useGuardedAction = () => useContext(GuardContext).guarded;

// D-046: only screens that work are listed (Phase 3a owner answer 5).
const NAV = [
  { href: '/', label: 'Overview' },
  { href: '/website', label: 'My Website' },
  { href: '/profile', label: 'Agency profile' },
];
const isCurrent = (pathname: string, href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export function AppShell({ session, onSignedOut, children }: { session: OwnerSession; onSignedOut: () => void; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const guard = useRef<Guard | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState<(() => void) | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const register = useCallback((next: Guard | null) => { guard.current = next; }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (pending && !element.open) element.showModal();
    if (!pending && element.open) element.close();
  }, [pending]);

  const guarded = useCallback((action: () => void) => {
    if (guard.current?.isDirty()) setPending(() => action);
    else action();
  }, []);
  const api = useMemo(() => ({ register, guarded }), [register, guarded]);
  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setMenuOpen(false);
    if (!guard.current?.isDirty()) return;
    event.preventDefault();
    setPending(() => () => router.push(href));
  }
  async function signOut() {
    setBusy(true); setError('');
    try { await apiMutation('/api/v1/owner/session', 'DELETE'); guard.current = null; onSignedOut(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not sign out'); }
    finally { setBusy(false); }
  }
  async function saveAndLeave() {
    const action = pending;
    setBusy(true);
    const saved = await guard.current?.save().catch(() => false);
    setBusy(false);
    if (saved) { setPending(null); action?.(); }
    else setPending(null);
  }
  function discardAndLeave() {
    const action = pending;
    guard.current = null;
    setPending(null);
    action?.();
  }

  return <GuardContext.Provider value={api}>
    <div className="app-shell">
      <header className="app-topbar">
        <span className="app-brand">EstateOS</span>
        <button type="button" className="menu-button" aria-expanded={menuOpen} aria-controls="app-nav" onClick={() => setMenuOpen((open) => !open)}>Menu</button>
      </header>
      <aside className={`app-sidebar${menuOpen ? ' open' : ''}`} id="app-nav">
        <p className="app-brand desktop-only">EstateOS</p>
        <p className="sidebar-agency">{session.agency.name}</p>
        <nav aria-label="Agency admin">
          {NAV.map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
            onClick={(event) => navigate(event, item.href)}>{item.label}</Link>)}
        </nav>
        <div className="sidebar-footer">
          <p>{session.user.name}</p>
          <button type="button" className="text-button" disabled={busy} onClick={() => guarded(() => void signOut())}>Sign out</button>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
    <dialog ref={dialog} className="confirm-dialog" aria-labelledby="unsaved-title" onCancel={(event) => { event.preventDefault(); if (!busy) setPending(null); }}>
      <h2 id="unsaved-title">You have unsaved changes</h2>
      <p>Save your changes before leaving this page?</p>
      <div className="dialog-actions">
        <button type="button" className="secondary" disabled={busy} onClick={() => setPending(null)}>Stay</button>
        <button type="button" className="secondary" disabled={busy} onClick={discardAndLeave}>Discard changes</button>
        <button type="button" className="primary-inline" disabled={busy} onClick={() => void saveAndLeave()}>{busy ? 'Saving…' : 'Save and leave'}</button>
      </div>
    </dialog>
  </GuardContext.Provider>;
}
