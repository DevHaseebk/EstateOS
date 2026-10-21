// Browser helpers for the same-origin Agency Admin BFF (/api/v1). Session cookies are HttpOnly; CSRF token per mutation.

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details: Record<string, string> = {}) { super(message); }
}

type ErrorPayload = { error?: { code?: string; message?: string; details?: Record<string, string> } } | null;

function toError(status: number, payload: ErrorPayload): ApiError {
  return new ApiError(status, payload?.error?.code ?? 'REQUEST_FAILED', payload?.error?.message ?? 'Request failed', payload?.error?.details ?? {});
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw toError(response.status, payload);
  return payload.data as T;
}

export async function apiMutation<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T | null> {
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

export type OwnerSession = {
  user: { id: string; name: string; role: string };
  agency: { id: string; name: string; reviewStatus: string; restrictionStatus: string };
};

export const REVIEW_LABELS: Record<string, string> = {
  PENDING: 'Waiting for review',
  CHANGES_REQUESTED: 'Changes requested',
  APPROVED: 'Approved',
  REJECTED: 'Not approved',
};
