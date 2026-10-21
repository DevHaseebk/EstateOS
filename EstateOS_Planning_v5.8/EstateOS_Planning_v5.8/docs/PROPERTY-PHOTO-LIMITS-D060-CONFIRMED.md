> **v5.0 ACTIVE CROSS-REFERENCE:** D-061 Option A **CONFIRMED**, whole-property explicit Save + Save/Discard/Stay (`docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`). Historical claims below that Property Save/dirty handling is unapproved are SUPERSEDED. D-062 Property Status & Archive/Delete **PROPOSED ONLY** (`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`). Exact validation/failures, pending upload transaction, per-property public publishing, final labels/routes/breakpoints and CRM still OPEN. D-029/D-033 first automatic website Live, D-053 post-live website content/theme explicit Publish Updates and zero-property requirement are unchanged. **NO APP CODE.**

# D-060 — CONFIRMED: Balanced Property Photo Limits and Per-File Validation (Option A)

**Decision:** D-060 Option A | **Status: CONFIRMED** | **Approved:** 2026-10-20 | **Bundle:** EstateOS Planning v4.9 | **Scope:** optional property photo files/count/formats + UX validation direction | **NO APPLICATION CODE**

## Owner-approved upload contract

1. In D-057's one-page Add/Edit Property form and D-059's expandable, optional multi-photo gallery, each property may have **up to 10 photos total**. No photos, **including no cover**, are required to save a property under D-058.
2. Maximum **5 MB per individual uploaded image**. This is a per-file maximum, **not** a total gallery size or storage quota. Exact 5-MB byte interpretation, server limit details and request overhead are implementation issues not yet approved; do not improvise a different displayed policy.
3. Accepted user photo formats are **JPEG/JPG, PNG and WebP**. Other formats are unsupported. Treat the file's extension and client claims as untrusted; exact MIME/content inspection, security and image decoding pipeline still need design.
4. **Clearly communicate** supported types, maximum count and per-image size near the upload affordance. When a file is invalid, display a **clear per-file, plain-language reason** (e.g. unsupported format, oversized image or quantity limit) instead of silently omitting it. Where possible preserve valid selections while identifying invalid individual files.
5. If an optional upload fails validation, **do not make photos mandatory** or unnecessarily block saving an otherwise valid six-Basics property record solely because a rejected optional image exists. Exact handling of pending uploads, partial failures, image state and Property Save transaction boundaries remains D-061+ discussion, not approved by this sentence.
6. D-059 remains canonical for thumbnails, explicit cover selection, simple order/remove controls and touch-friendly layout. An owner can choose a cover only from photos present, but the cover and entire gallery are optional. Exact cover-removal fallback or default cover algorithm remains open.

## Scope boundaries and unresolved specifics

**This approves ONLY:** maximum image count (**10**), per-file size ceiling (**5 MB**), image formats (**JPEG, PNG, WebP**), visible rule communication, and clear **per-file validation feedback**. This decision does NOT approve image compression, resizing, resolution/dimensions/aspect limits, processing pipelines, stripping EXIF/geolocation, malicious-content scanning techniques, thumbnails' stored dimensions, storage/vendor/URL visibility, quota/pricing, upload concurrency/progress/cancel/retries, failure recovery, offline behavior, deletion/retention, or cross-browser decoding. Those require further planning/security verification.

**Other still OPEN:** property record Save/Cancel and unsaved-navigation behavior; failed or pending uploads during Save; listing status/sold/rented/archive/delete; whether/when individual property records or photos reach the public site; exact property type/price validators and enumerations; final English copy and route paths, responsive numerical breakpoints and pilot CRM scope.

## Approved dependencies that must not change

- **D-058:** six Basics required for an individual Property Save: Property Title, Sale/Rent, Property Type, Price PKR, City, Area/Neighborhood. All other property details and photos optional.
- **D-057:** Basics first; Details/Photos expandable in one form. **D-056:** responsive Agency Admin property cards, including sensible placeholder when no image exists. A property gallery can have zero photos.
- **D-029 / D-033:** agency website FIRST goes Live automatically after manual Super Admin approval AND required website readiness. **ZERO PROPERTY RECORDS allowed; no initial owner Publish or Submit gate.**
- **D-053:** an already-Live website's CONTENT/THEME updates need deliberate Publish Updates. **Individual-property publication remains independently UNDECIDED**; saving or uploading photos does not by itself approve public publication.
- This is a product planning package: **NO application code should be written without separate authorization**.

## Canonical history / next decision

This file supersedes `docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`, which is **HISTORICAL/RESOLVED** (A chosen; B and C rejected). **NEXT D-061 PROPOSED ONLY:** `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`, about property-form Save and unsaved-navigation UX. Neither its choices nor its labels or save details are confirmed.
