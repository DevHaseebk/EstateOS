'use client';

import Image from 'next/image';
import { useId, useState, type ChangeEvent } from 'react';
import { IMAGE_ACCEPT, precheckImage, uploadImage } from '../lib/media';
import { ownerMediaUrl } from '../lib/website';

export const MAX_PHOTOS = 10;
const move = (list: string[], index: number, offset: -1 | 1) => {
  const target = index + offset;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target]!, copy[index]!];
  return copy;
};

/**
 * D-059/D-060 property gallery: up to 10 photos, explicit cover, Move up/down and Remove (no drag).
 * Uploads are staged; only Save property attaches them (D-106). Each rejected file gets its own reason;
 * valid files from the same selection are kept.
 */
export function PhotoGallery({ photos, cover, disabled, onChange, onUploadingChange }: {
  photos: string[]; cover: string; disabled: boolean;
  onChange: (next: { photos: string[]; cover: string }) => void; onUploadingChange: (count: number) => void;
}) {
  const id = useId();
  const [uploading, setUploading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const effectiveCover = cover && photos.includes(cover) ? cover : photos[0] ?? '';

  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    if (!files.length) return;
    const problems: string[] = [];
    const room = MAX_PHOTOS - photos.length;
    const accepted = files.filter((file) => {
      const problem = precheckImage(file);
      if (problem) { problems.push(problem); return false; }
      return true;
    });
    for (const file of accepted.slice(room)) problems.push(`${file.name}: a property can have at most ${MAX_PHOTOS} photos.`);
    const toUpload = accepted.slice(0, Math.max(room, 0));
    setErrors(problems);
    if (!toUpload.length) return;
    setUploading(toUpload.length); onUploadingChange(toUpload.length);
    let next = [...photos];
    for (const file of toUpload) {
      try {
        const media = await uploadImage(file, 'PROPERTY');
        next = [...next, media.id];
        onChange({ photos: next, cover: cover || next[0]! });
      } catch (failure) {
        problems.push(`${file.name}: ${failure instanceof Error ? failure.message : 'the upload failed.'}`);
        setErrors([...problems]);
      } finally {
        setUploading((count) => { onUploadingChange(count - 1); return count - 1; });
      }
    }
  }

  return <div className="photo-gallery">
    <p className="field-hint" id={`${id}-rule`}>Up to {MAX_PHOTOS} photos · JPEG, PNG or WebP · 5 MB each · at least 400 × 300 pixels. Location data is removed automatically.</p>
    {photos.length === 0 && <p className="field-hint">No photos yet. Photos are optional; your listing works without them.</p>}
    {photos.length > 0 && <ol className="gallery-rows">
      {photos.map((mediaId, index) => <li key={mediaId} className="gallery-row">
        <Image src={ownerMediaUrl(mediaId, 480)} alt={`Photo ${index + 1}`} width={160} height={100} unoptimized />
        <div className="gallery-actions">
          {mediaId === effectiveCover
            ? <span className="cover-badge">Cover</span>
            : <button type="button" className="secondary small" disabled={disabled} onClick={() => onChange({ photos, cover: mediaId })}>Set as cover</button>}
          <button type="button" className="secondary small" disabled={disabled || index === 0} onClick={() => onChange({ photos: move(photos, index, -1), cover })} aria-label={`Move photo ${index + 1} up`}>Move up</button>
          <button type="button" className="secondary small" disabled={disabled || index === photos.length - 1} onClick={() => onChange({ photos: move(photos, index, 1), cover })} aria-label={`Move photo ${index + 1} down`}>Move down</button>
          <button type="button" className="danger-text small" disabled={disabled} onClick={() => {
            const rest = photos.filter((photo) => photo !== mediaId);
            onChange({ photos: rest, cover: cover === mediaId ? '' : cover });
          }} aria-label={`Remove photo ${index + 1}`}>Remove</button>
        </div>
      </li>)}
    </ol>}
    {photos.length < MAX_PHOTOS && <div className="upload-control">
      <label htmlFor={id} className={`secondary upload-button${disabled || uploading ? ' disabled' : ''}`}>{uploading ? `Uploading ${uploading}…` : 'Add photos'}</label>
      <input id={id} type="file" accept={IMAGE_ACCEPT} multiple className="visually-hidden" disabled={disabled || uploading > 0} onChange={(event) => void choose(event)} aria-describedby={`${id}-rule`} />
    </div>}
    {errors.length > 0 && <ul className="upload-errors" role="alert">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
  </div>;
}
