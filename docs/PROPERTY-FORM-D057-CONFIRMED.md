> **v5.0 ACTIVE CROSS-REFERENCE:** D-061 Option A **CONFIRMED**, whole-property explicit Save + Save/Discard/Stay (`docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`). Historical claims below that Property Save/dirty handling is unapproved are SUPERSEDED. D-062 Property Status & Archive/Delete **PROPOSED ONLY** (`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`). Exact validation/failures, pending upload transaction, per-property public publishing, final labels/routes/breakpoints and CRM still OPEN. D-029/D-033 first automatic website Live, D-053 post-live website content/theme explicit Publish Updates and zero-property requirement are unchanged. **NO APP CODE.**

> **v4.9 CURRENT CROSS-REFERENCE:** D-060 Option A **CONFIRMED** media guardrails (max 10 optional property images, max 5 MB/image, JPEG/PNG/WebP and clear per-file validation) via `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`. The older “D-060 unapproved”/“limits open” language **below is historical as of v4.8**. Image security/processing, uploading errors/retry, Property Save, status/delete and individual property-publication still OPEN. D-061 Save/unsaved UX is **PROPOSED ONLY**; see `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`. Photos and cover remain optional; no app coding.

> **v4.8 CURRENT CROSS-REFERENCE:** D-059 Option A **CONFIRMED** optional multi-photo thumbnails, explicit cover selection and simple reorder/remove (`docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`). NO photo required. Old `NEXT D-059` wording below is a **historical snapshot**. Next D-060 image upload limits & validation is PROPOSED/UNAPPROVED (`docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`). Property-public-site sync/Save/lifecycle remain OPEN.

# D-057 — CONFIRMED: Single-page Add/Edit Property Form with Expandable Details & Photos

**Decision:** D-057 Option A | **Status:** CONFIRMED | **Approved:** 2026-10-19 | **Planning bundle:** EstateOS v4.6 | **Scope:** Agency Admin form layout/grouping ONLY | **No application coding authorized**

## Approved form hierarchy

1. An **Add Property** or **Edit Property** opens **ONE responsive page**, not a multi-step wizard and not independent tabs. Both Add and Edit use the same layout and group positions.
2. **Basic Information** is visible **first**, without expansion, and is straightforward for agents with limited technical experience. The field names illustrated in prototypes (e.g., title, sale/rent, price, location, category) are examples only; their inclusion and requiredness are now decided by **D-058 Option A**; see `docs/PROPERTY-MINIMUM-FIELDS-D058-CONFIRMED.md`.
3. Below Basics, **Property Details** and **Photos** are separate, clearly discoverable **expandable/collapsible groups** on the same page. Neither group becomes a mandatory multi-screen step just because it has a place in the layout.
4. Layout is comfortable on desktop and mobile. On narrow viewports, fields and controls can stack vertically with touch-friendly expand/collapse behavior; actual columns, spacing and numerical breakpoints remain OPEN.
5. Keep a plainly discoverable path to return to Properties and space for future save/cancel/error UI. **The exact action labels and save/dirty-navigation behavior are NOT approved by this layout decision.**
6. Preserves D-056 **responsive card list** with Add Property entry point and the ability to have **zero listings**. The property form must never become a prerequisite to agency approval or website activation.

## What D-057 did not decide (D-058 later confirmed minimum fields)

- **Field requirements:** D-058 confirms six required Basics fields and optional Details/Photos. Exact enum options, validators, size units, category-dependent fields and defaults remain OPEN.
- **Persistence:** Save versus draft/submit, validation thresholds, unsaved navigation, warnings, error/retry, edit conflicts, optimistic UI. D-050 section-level website Editor saving and D-051 warning **DO NOT automatically apply** to property records.
- **Photos:** requiredness, cover vs gallery, MIME/type/count/size restrictions, ordering, image processing, storage and privacy.
- **Record life cycle:** availability status, sold/rented, hide/archival/delete/recovery and permissions.
- **Public-site publication:** whether adding/editing/removing an individual property is immediate, batched into D-053 website Publish Updates, or managed by a separate listing action remains OPEN. **Never infer instant public publication from a property form layout or Save.**
- **Search/filter/listing metadata**, SEO/per-property URLs, CRM/Inquiries pilot scope, final labels/routes, numerical responsiveness and accessibility specifics.

## Invariants carried forward

- **D-028:** lean first pilot (2–3 agencies) and no new KYC/document gates.
- **D-029 + D-033:** the FIRST public agency website is automatically activated only after manual Super Admin agency approval **and** minimum site readiness; NO first-time owner Publish or Submit gate. Listings remain optional, including zero properties.
- **D-049–D-054:** public website theme/sections use saved-draft preview and, for an **already-live** site, explicit **Publish Updates**. This decision does not automatically extend or replace those semantics for individual property records.
- **D-055:** one-page Agency Profile is independent of this one-page Property form and has its own still-open persistence and requiredness.

## Canonical sources and next decision

- `docs/PROPERTIES-LIST-D056-CONFIRMED.md` — approved Agency Admin list (not public listing cards).
- `docs/PROPERTY-FORM-D057-PROPOSAL.md` — **historical A/B/C proposal** resolved by approval of Option A.
- `docs/PROPERTY-FORM-FIELDS-v4.5-DISCUSSION.md` — historical discussion-only candidate fields, still **not** an approved schema.
- `docs/PROPERTY-MINIMUM-FIELDS-D058-CONFIRMED.md` — **D-058 NOW APPROVED**: six required Basics; other details/photos optional. The old `docs/PROPERTY-MINIMUM-FIELDS-D058-PROPOSAL.md` is historical. **NEXT D-059 proposed only**: `docs/PROPERTY-PHOTOS-D059-PROPOSAL.md`.

**Implementation boundary:** Planning is not an instruction to develop source code. Await owner authorization.
