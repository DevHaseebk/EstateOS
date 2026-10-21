// Browser helpers for the same-origin Super Admin BFF (/api/v1). Session cookies are HttpOnly; CSRF token per mutation.

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

type ErrorPayload = { error?: { code?: string; message?: string; details?: Record<string, string> } } | null;

function toError(status: number, payload: ErrorPayload): ApiError {
  const details = payload?.error?.details ? Object.values(payload.error.details).join(' ') : '';
  return new ApiError(status, payload?.error?.code ?? 'REQUEST_FAILED', details || payload?.error?.message || 'Request failed');
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw toError(response.status, payload);
  return payload.data as T;
}

export async function apiMutation<T>(path: string, method: 'POST' | 'DELETE', body?: unknown): Promise<T | null> {
  const csrfResponse = await fetch('/api/v1/auth/csrf', { cache: 'no-store' });
  const csrf = await csrfResponse.json().catch(() => null);
  if (!csrfResponse.ok) throw toError(csrfResponse.status, csrf);
  const response = await fetch(path, {
    method,
    headers: { 'X-CSRF-Token': csrf.data.csrfToken, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw toError(response.status, payload);
  return payload ? payload.data as T : null;
}

export const REVIEW_LABELS: Record<string, string> = {
  PENDING: 'Pending review',
  CHANGES_REQUESTED: 'Changes requested',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const ACTION_LABELS: Record<string, string> = {
  REVIEW_APPROVE: 'Approved',
  REVIEW_REQUEST_CHANGES: 'Requested changes',
  REVIEW_REJECT: 'Rejected',
  REVIEW_REOPEN: 'Reopened for review',
  OWNER_RESUBMIT: 'Owner resubmitted for review',
};

export function formatDate(value: string | null | undefined): string {
  return value ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
}
