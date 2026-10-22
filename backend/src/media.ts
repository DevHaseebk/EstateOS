import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { Media } from './models.js';
import { mediaStorage } from './storage.js';

// Phase 3d image pipeline (docs/PHASE-3D-PHOTO-UPLOADS-CONTRACT-APPROVED.md): D-060 limits, D-086 privacy-clean derivatives.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const VARIANT_WIDTHS = [480, 960, 1600] as const;
export const MEDIA_PURPOSES = ['HERO', 'LOGO', 'PROPERTY', 'ABOUT', 'TEAM'] as const;
export type MediaPurpose = typeof MEDIA_PURPOSES[number];
const MIN_SIZE: Record<MediaPurpose, { width: number; height: number; landscape?: boolean; message: string }> = {
  HERO: { width: 1200, height: 1, landscape: true, message: 'The main photo must be at least 1200 pixels wide and wider than it is tall.' },
  LOGO: { width: 64, height: 64, message: 'The logo must be at least 64 × 64 pixels.' },
  PROPERTY: { width: 400, height: 300, message: 'Property photos must be at least 400 × 300 pixels.' },
  // Phase 3e (docs/PHASE-3E-ABOUT-TEAM-PHOTOS-CONTRACT-APPROVED.md §1).
  ABOUT: { width: 800, height: 500, message: 'The About photo must be at least 800 × 500 pixels.' },
  TEAM: { width: 300, height: 300, message: 'Team photos must be at least 300 × 300 pixels.' },
};

export class MediaError extends Error {
  constructor(public code: 'UNSUPPORTED_TYPE' | 'TOO_LARGE' | 'TOO_SMALL' | 'CORRUPT_IMAGE', message: string) { super(message); }
}

/** Trust the bytes, not the file name or the claimed type (D-060 §3). */
export function sniffImageType(buffer: Buffer): 'jpeg' | 'png' | 'webp' | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

export type ProcessedImage = { type: 'jpeg' | 'png' | 'webp'; width: number; height: number; variants: { width: number; body: Buffer }[] };

/**
 * Validates and re-encodes one upload. Re-encoding with sharp drops EXIF/GPS and all other metadata (D-086).
 * Variants are WebP at 480/960/1600 px wide, never upscaled; a smaller original gets one variant at its own width.
 */
export async function processImage(buffer: Buffer, purpose: MediaPurpose): Promise<ProcessedImage> {
  if (buffer.length > MAX_UPLOAD_BYTES) throw new MediaError('TOO_LARGE', 'This image is larger than 5 MB.');
  const type = sniffImageType(buffer);
  if (!type) throw new MediaError('UNSUPPORTED_TYPE', 'Only JPEG, PNG or WebP images are supported.');
  let width: number;
  let height: number;
  try {
    // Fully decode once (corrupt files fail here); rotate() applies the camera orientation before measuring.
    const decoded = await sharp(buffer, { failOn: 'error', limitInputPixels: 40_000_000 }).rotate().toBuffer({ resolveWithObject: true });
    ({ width, height } = decoded.info);
  } catch {
    throw new MediaError('CORRUPT_IMAGE', 'This image could not be read. Please try another file.');
  }
  const rule = MIN_SIZE[purpose];
  if (width < rule.width || height < rule.height || (rule.landscape && width <= height)) throw new MediaError('TOO_SMALL', rule.message);
  const widths = VARIANT_WIDTHS.filter((target) => target <= width);
  const targets = widths.length ? widths : [width];
  const variants = await Promise.all(targets.map(async (target) => ({
    width: target,
    body: await sharp(buffer, { limitInputPixels: 40_000_000 }).rotate().resize({ width: target, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
  })));
  return { type, width, height, variants };
}

/** Stores the private original and the public-safe variants, and records the media as STAGED (D-106). */
export async function stageUpload(agencyId: string, purpose: MediaPurpose, buffer: Buffer) {
  const processed = await processImage(buffer, purpose);
  const id = randomBytes(16).toString('hex');
  const storage = mediaStorage();
  const originalKey = `originals/${agencyId}/${id}`;
  await storage.put(originalKey, buffer, `image/${processed.type}`);
  const variants = [];
  for (const variant of processed.variants) {
    const key = `variants/${id}/${variant.width}.webp`;
    await storage.put(key, variant.body, 'image/webp');
    variants.push({ width: variant.width, key, bytes: variant.body.length });
  }
  return Media.create({
    mediaId: id, agencyId, purpose, status: 'STAGED', width: processed.width, height: processed.height,
    bytes: buffer.length, contentType: `image/${processed.type}`, originalKey, variants,
  });
}

/** The stored variant to serve for a requested width: the largest not above it, else the smallest. Never the original. */
export function pickVariant(variants: { width: number; key: string }[], requested: number) {
  const sorted = [...variants].sort((a, b) => a.width - b.width);
  return [...sorted].reverse().find((variant) => variant.width <= requested) ?? sorted[0];
}

/**
 * Marks media as ATTACHED once a save references it (§1 Q5). Every id must belong to this agency and purpose,
 * otherwise nothing is attached and the caller gets the list of bad ids.
 */
export async function attachMedia(agencyId: string, purpose: MediaPurpose, mediaIds: string[]): Promise<string[]> {
  const unique = [...new Set(mediaIds)];
  if (!unique.length) return [];
  const found = await Media.find({ agencyId, purpose, mediaId: { $in: unique } }).select('mediaId').lean();
  const known = new Set(found.map((media) => media.mediaId));
  const bad = unique.filter((id) => !known.has(id));
  if (bad.length) return bad;
  await Media.updateMany({ agencyId, mediaId: { $in: unique }, status: 'STAGED' }, { $set: { status: 'ATTACHED', attachedAt: new Date() } });
  return [];
}

/** §1 Q5: staged uploads never attached within 24 hours are deleted with their files. Attached media is never touched. */
export async function cleanupStagedMedia(olderThanMs = 24 * 60 * 60_000): Promise<number> {
  const stale = await Media.find({ status: 'STAGED', createdAt: { $lt: new Date(Date.now() - olderThanMs) } }).limit(500).lean();
  const storage = mediaStorage();
  let removed = 0;
  for (const media of stale) {
    const result = await Media.deleteOne({ _id: media._id, status: 'STAGED' });
    if (result.deletedCount !== 1) continue;
    await Promise.all([storage.delete(media.originalKey), ...media.variants.map((variant) => storage.delete(variant.key))]).catch(() => undefined);
    removed += 1;
  }
  return removed;
}
