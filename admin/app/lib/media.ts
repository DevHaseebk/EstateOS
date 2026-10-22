import { ApiError } from './api';

// Phase 3d: browser upload of one image as the raw request body (no multipart). The server re-checks everything.
export type MediaPurpose = 'HERO' | 'LOGO' | 'PROPERTY';
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_ACCEPT = TYPES.join(',');

/** D-060 §4: a clear per-file reason before uploading, when the browser already knows the file is unsuitable. */
export function precheckImage(file: File): string | null {
  if (!TYPES.includes(file.type)) return `${file.name}: only JPEG, PNG or WebP images are supported.`;
  if (file.size > MAX_IMAGE_BYTES) return `${file.name}: larger than 5 MB.`;
  return null;
}

export async function uploadImage(file: File, purpose: MediaPurpose): Promise<{ id: string; width: number; height: number }> {
  const csrfResponse = await fetch('/api/v1/auth/csrf', { cache: 'no-store' });
  const csrf = await csrfResponse.json().catch(() => null);
  if (!csrfResponse.ok) throw new ApiError(csrfResponse.status, 'AUTH_UNAVAILABLE', 'Authentication is unavailable');
  const response = await fetch(`/api/v1/owner/media?purpose=${purpose}`, {
    method: 'POST', headers: { 'X-CSRF-Token': csrf.data.csrfToken, 'Content-Type': file.type }, body: file,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, payload?.error?.code ?? 'UPLOAD_FAILED', payload?.error?.message ?? 'The upload failed. Please try again.');
  }
  return payload.data.media;
}
