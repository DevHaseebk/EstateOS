> **v5.0 ACTIVE CROSS-REFERENCE:** D-061 Option A **CONFIRMED**, whole-property explicit Save + Save/Discard/Stay (`docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`). Historical claims below that Property Save/dirty handling is unapproved are SUPERSEDED. D-062 Property Status & Archive/Delete **PROPOSED ONLY** (`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`). Exact validation/failures, pending upload transaction, per-property public publishing, final labels/routes/breakpoints and CRM still OPEN. D-029/D-033 first automatic website Live, D-053 post-live website content/theme explicit Publish Updates and zero-property requirement are unchanged. **NO APP CODE.**

> **v4.9 CURRENT CROSS-REFERENCE:** D-060 Option A **CONFIRMED** media guardrails (max 10 optional property images, max 5 MB/image, JPEG/PNG/WebP and clear per-file validation) via `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`. The older “D-060 unapproved”/“limits open” language **below is historical as of v4.8**. Image security/processing, uploading errors/retry, Property Save, status/delete and individual property-publication still OPEN. D-061 Save/unsaved UX is **PROPOSED ONLY**; see `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`. Photos and cover remain optional; no app coding.

# D-059 — CONFIRMED: Optional Multi-Photo Gallery with Explicit Cover Selection (Option A)

**Decision:** D-059 Option A | **Status:** CONFIRMED | **Approved:** 2026-10-20 | **Planning bundle:** EstateOS v4.8 | **Scope:** Agency Admin Property Photos UX **only** | **NO APPLICATION CODE**

## Owner-approved UX contract

1. **All property photographs are optional**, including the cover image. A property can be saved with ZERO images if it meets the six D-058 required Basics fields. A property record is never mandatory for agency website readiness (D-029/D-033).
2. In D-057's **single Add/Edit Property page**, the separately **expandable Property Photos** group supports selecting/uploading **multiple** photographs. The owner can access this group without wizard steps or tabs.
3. Display understandable **thumbnail previews** for selected/available photos, including an unambiguous indication of which photo is currently designated as **cover**. When images exist, owner can **explicitly select any existing photo as cover**; do not force the first image to remain cover.
4. Offer a simple, understandable control for **reordering** the gallery and **removing** individual photos. Prefer touch-friendly ordinary controls (e.g. Move Up / Move Down), **no drag-and-drop requirement**. Exact interaction labels, removal confirmations and visual positions are OPEN.
5. With zero images, show a friendly no-photo/placeholder state rather than a broken Agency Admin property card. Exact placeholder visuals and any fallback for a public listing are pending.
6. Keep the photo editor comprehensible on mobile and desktop with clear affordances for upload, thumbnail, cover, reorder and remove; exact breakpoints, numerical geometry and upload states are undecided.

## Essential boundaries — NOT approved by D-059

- **D-060 is unapproved:** maximum photos per property, maximum file size, accepted image types, image resolution/quality, dimensions/aspect ratio, compression/resizing, media storage, uploads/errors/retries, malicious file checks, EXIF/geolocation/privacy handling and retention/deletion timing. Do not invent defaults as approved rules.
- The lifecycle of cover selection if the currently designated cover is removed, first-add defaults, photo upload order versus persistent display order, keyboard controls and cancellation are still implementation decisions.
- Property **Save**, unsaved-changes prompts, upload-pending navigation, partial save/validation, status/delete and property-specific public publication are OPEN. An upload, photo removal or Set as Cover action is **NOT** an instruction to change a live public website.
- Website Editor D-050 Save/Discard/Stay D-051 and D-053 owner Publish Updates for already-Live **website sections/theme** must not automatically be assumed to control individual property record public visibility.
- Final labels/routes, CRM pilot scope, photo moderation and public SEO remain open.

## Canonical precedence & next owner decision

This file is canonical D-059. `docs/PROPERTY-PHOTOS-D059-PROPOSAL.md` is **RESOLVED/HISTORICAL**: owner selected A and did not select B (single cover) or C (automatic first cover). Other approved D-057 one-page form, D-058 six Basics, D-056 responsive property cards, D-029 first automatic go-live and D-053 deliberate subsequent site content/theme updates remain unchanged.

**NEXT D-060 PROPOSED ONLY:** `docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`. No chosen counts/MB/formats/validation constraints are approved yet.

**Planning-only boundary:** Do not start source code or alter product behavior without separate user authorization.
