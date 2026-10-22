import express, { Router, type Response } from 'express';
import { asyncRoute, countAttempt, currentSession, HttpError, rejectAgencyInput, requireCsrf, requireOwnerWritable, requirePortal } from './auth.js';
import { MAX_UPLOAD_BYTES, MEDIA_PURPOSES, MediaError, pickVariant, stageUpload, type MediaPurpose } from './media.js';
import { Agency, Media } from './models.js';
import { ownerCanEdit, ReviewError } from './review.js';
import { mediaStorage } from './storage.js';
import { ownerScope, superAdminScope, tenantAgencyFilter } from './tenant.js';

// Phase 3d uploads and image reads (docs/PHASE-3D-PHOTO-UPLOADS-CONTRACT-APPROVED.md). Originals are never served.
const router = Router();
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MEDIA_ID = /^[a-f0-9]{32}$/;
const notFound = () => new HttpError(404, 'NOT_FOUND', 'Image not found');

/**
 * Streams one stored WebP variant; `scope` decides who may cache. Public images are cached for 5 minutes only (Phase 6b §1 Q1),
 * so a Block, Deactivate or removed photo stops being served soon after; longer caching waits for a CDN with purge.
 */
export const PUBLIC_IMAGE_CACHE = 'public, max-age=300';
export async function sendVariant(response: Response, variants: { width: number; key: string }[], width: string, scope: 'private' | 'public') {
  const requested = Number(width);
  if (!Number.isInteger(requested) || requested < 1 || requested > 4000) throw notFound();
  const variant = pickVariant(variants, requested);
  const body = variant ? await mediaStorage().get(variant.key) : null;
  if (!body) throw notFound();
  response.setHeader('Content-Type', 'image/webp');
  response.setHeader('Cache-Control', scope === 'public' ? PUBLIC_IMAGE_CACHE : 'private, max-age=3600');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(body);
}

// The raw image body is parsed only on this route, and only for image types (§4: no multipart parser).
router.post('/owner/media', express.raw({ type: IMAGE_TYPES, limit: MAX_UPLOAD_BYTES + 1024 }), asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true, IMAGE_TYPES);
  requireOwnerWritable(request);
  if (Object.hasOwn(request.query, 'agencyId') || request.header('x-agency-id')) throw new HttpError(422, 'VALIDATION_ERROR', 'agencyId is not accepted');
  const purpose = String(request.query.purpose ?? '') as MediaPurpose;
  if (!MEDIA_PURPOSES.includes(purpose)) throw new ReviewError(422, 'VALIDATION_ERROR', 'Choose what the image is for: Hero, logo, property, About or team photo.');
  const scope = ownerScope(request.sessionContext!.user);
  const agency = await Agency.findOne(tenantAgencyFilter(scope)).select('reviewStatus restrictionStatus').lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  if (!ownerCanEdit(agency)) throw new ReviewError(403, 'WEBSITE_READ_ONLY', 'Your website can no longer be changed. Contact EstateOS support.');
  // §4 abuse guard: 60 uploads per agency per hour.
  if (await countAttempt('media-upload', scope.agencyId, 60 * 60_000) > 60) throw new HttpError(429, 'RATE_LIMITED', 'Too many uploads. Please try again later.');
  const body = Buffer.isBuffer(request.body) ? request.body : Buffer.alloc(0);
  if (!body.length) throw new ReviewError(422, 'UNSUPPORTED_TYPE', 'Only JPEG, PNG or WebP images are supported.');
  try {
    const media = await stageUpload(scope.agencyId, purpose, body);
    response.status(201).json({ data: { media: { id: media.mediaId, purpose: media.purpose, width: media.width, height: media.height, status: media.status } } });
  } catch (error) {
    if (error instanceof MediaError) throw new ReviewError(422, error.code, error.message);
    throw error;
  }
}));

router.get('/owner/media/:mediaId/:width', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  rejectAgencyInput(request);
  const context = await currentSession(request);
  const scope = ownerScope(context!.user);
  const mediaId = String(request.params.mediaId);
  if (!MEDIA_ID.test(mediaId)) throw notFound();
  const media = await Media.findOne({ mediaId, agencyId: scope.agencyId }).select('variants').lean();
  if (!media) throw notFound();
  await sendVariant(response, media.variants, String(request.params.width), 'private');
}));

router.get('/super-admin/media/:mediaId/:width', asyncRoute(async (request, response) => {
  requirePortal(request, 'SUPER_ADMIN');
  const context = await currentSession(request);
  superAdminScope(context!.user);
  const mediaId = String(request.params.mediaId);
  if (!MEDIA_ID.test(mediaId)) throw notFound();
  const media = await Media.findOne({ mediaId, status: 'ATTACHED' }).select('variants').lean();
  if (!media) throw notFound();
  await sendVariant(response, media.variants, String(request.params.width), 'private');
}));

export { router as mediaRouter, MEDIA_ID };
