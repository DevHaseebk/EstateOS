> **v4.9 HISTORICAL / RESOLVED — D-060 Option A CONFIRMED (2026-10-20):** This A/B/C document is retained solely for decision traceability. The owner selected **10 photos max, 5 MB each, JPEG/PNG/WebP and clear per-file validation**. Canonical requirements: `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`. B and C were not selected. **NEXT D-061 UNAPPROVED:** `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`. Statements below that D-060 is pending are historical and superseded. Photos remain optional.

# D-060 — PROPOSED ONLY: Property Photo Upload Limits and Validation UX

**Status:** OWNER CHOICE PENDING — NOT CONFIRMED | **Date:** 2026-10-20 | **Planning bundle:** v4.8 | **NO APPLICATION CODE**

## What is already confirmed

- **D-059 Option A**: optional **multi-photo** gallery on D-057 one-page form; thumbnails, owner-chosen cover, simple reorder/remove. Any photo/cover remains optional (D-058); zero photos does not prevent saving a valid six-Basics property record.
- **D-056** desktop/mobile Agency Admin cards; show appropriate no-image placeholder rather than a broken photo.
- No property is required for launching an approved and website-ready agency (D-029/D-033).
- D-053's Publish Updates for already-Live website **content/theme** must not be silently repurposed into per-property public publishing; that policy is still OPEN.

## D-060 decision packages: suggested count, per-file limit, accepted formats and validation presentation

### Option A — Balanced Media Guardrails (RECOMMENDED)

- Up to **10** optional photos per property; maximum **5 MB per file**.
- Accept **JPEG/JPG, PNG and WebP** images; reject unsupported file types.
- Before selection or upload, clearly show the count, size and format rules. In the gallery, show per-file validation errors with plain-language reason, and keep otherwise valid images selectable; avoid silently dropping files.
- On crossing an approved limit, identify which file(s) or count failed; do not block saving an otherwise valid photo-free property solely because an optional image failed.
- Responsive thumbnails and mobile-friendly image management stay D-059; specific progress, retries, compression and storage remain subsequent decisions.

### Option B — Leanest Pilot Guardrails

- Up to **6** optional photos; maximum **3 MB per file**; accept **JPEG/JPG and PNG**.
- Simple clear form-level validation summary and label beside rejected items. Fewer files and formats simplify the first implementation but can frustrate owners with modern WebP photos.

### Option C — Extended Gallery Guardrails

- Up to **20** optional photos; maximum **10 MB per file**; accept **JPEG/JPG, PNG and WebP**.
- Detailed per-file validation and clear pending/success/error states recommended; potentially higher upload and hosting cost and more mobile wait/failed-upload cases.

## Boundaries even if an option is chosen

- Selected option would confirm only its **numeric count + per-file upload ceiling + allowed formats + stated validation presentation direction**. Formats correspond to a validated file, not trust in filename/extension alone; exact verification/encoding/security pipeline needs implementation review.
- **Still OPEN:** image resolution/dimension minima and maxima, resizing/compression, orientation/EXIF/GPS stripping, virus/security scanning specifics, storage provider, public vs private URL privacy, thumbnail processing, upload progress/cancel/retry, attachment transaction boundaries versus Property Save, offline handling, deduplication, server error detail, permanent deletion/retention, and pricing/quotas.
- D-059 cover selection and reorder/remove remain available within whatever chosen limit, and **zero photos is valid**.
- Error messages and upload states must not imply unsaved optional photos have been published; per-property public publishing is separately undecided.

## Future planning after D-060

D-061 property Save / cancel / unsaved edits including pending uploads; record availability and archive/delete; individual-property-to-public-site synchronization; Agency Profile state and CRM pilot scope; Super Admin review/operations screens.

**This is a proposal, not approval. Do not treat A's 10/5MB/JPEG-PNG-WebP parameters as current implementation requirements before the owner selects an option.**
