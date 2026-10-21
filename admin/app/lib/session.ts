'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiGet, type OwnerSession } from './api';

/** Loads the signed-in owner (or null) once per page; refresh() re-reads it after status changes. */
export function useOwnerSession() {
  const [session, setSession] = useState<OwnerSession | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => apiGet<OwnerSession>('/api/v1/owner/session')
    .then(setSession).catch(() => setSession(null)).finally(() => setLoading(false)), []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { session, setSession, loading, refresh };
}
