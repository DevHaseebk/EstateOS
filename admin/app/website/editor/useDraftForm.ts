'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useUnsavedGuard } from '../../components/AppShell';
import { ApiError } from '../../lib/api';

type Message = { kind: 'error' | 'notice'; text: string } | null;

/**
 * One editor form with its own explicit Save (D-050): truthful saved/unsaved state, field-level 422 errors,
 * conflict messages, and registration with the shell's Save / Discard / Stay guard plus the browser prompt (D-051).
 * `submit` sends the values and returns the values as the server saved them.
 */
export function useDraftForm<V>(initial: V, submit: (values: V) => Promise<V>, savedText = 'Saved. Your changes are in your private draft.') {
  const [saved, setSaved] = useState<V>(initial);
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<Message>(null);
  const [saving, setSaving] = useState(false);
  const register = useUnsavedGuard();
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  const save = useCallback(async (): Promise<boolean> => {
    setSaving(true); setErrors({}); setMessage(null);
    try {
      const next = await submit(values);
      setSaved(next); setValues(next);
      setMessage({ kind: 'notice', text: savedText });
      return true;
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 409) {
        setMessage({ kind: 'error', text: `${failure.message} Your typed changes stay here until you reload.` });
      } else if (failure instanceof ApiError && failure.status === 422) {
        setErrors(failure.details);
        setMessage({ kind: 'error', text: failure.details.section ?? 'Please fix the highlighted fields.' });
      } else {
        setMessage({ kind: 'error', text: failure instanceof Error ? failure.message : 'Could not save. Nothing was changed.' });
      }
      return false;
    } finally { setSaving(false); }
  }, [submit, values, savedText]);

  const latest = useRef({ dirty, save });
  useEffect(() => { latest.current = { dirty, save }; }, [dirty, save]);
  useEffect(() => {
    register({ isDirty: () => latest.current.dirty, save: () => latest.current.save() });
    return () => register(null);
  }, [register]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  return { values, setValues, dirty, saving, errors, message, save };
}
