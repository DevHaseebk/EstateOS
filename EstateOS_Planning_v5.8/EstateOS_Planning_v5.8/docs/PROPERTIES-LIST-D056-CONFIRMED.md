> **v5.0 ACTIVE CROSS-REFERENCE:** D-061 Option A **CONFIRMED**, whole-property explicit Save + Save/Discard/Stay (`docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`). Historical claims below that Property Save/dirty handling is unapproved are SUPERSEDED. D-062 Property Status & Archive/Delete **PROPOSED ONLY** (`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`). Exact validation/failures, pending upload transaction, per-property public publishing, final labels/routes/breakpoints and CRM still OPEN. D-029/D-033 first automatic website Live, D-053 post-live website content/theme explicit Publish Updates and zero-property requirement are unchanged. **NO APP CODE.**

> **v4.9 CURRENT CROSS-REFERENCE:** D-060 Option A **CONFIRMED** media guardrails (max 10 optional property images, max 5 MB/image, JPEG/PNG/WebP and clear per-file validation) via `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`. The older “D-060 unapproved”/“limits open” language **below is historical as of v4.8**. Image security/processing, uploading errors/retry, Property Save, status/delete and individual property-publication still OPEN. D-061 Save/unsaved UX is **PROPOSED ONLY**; see `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`. Photos and cover remain optional; no app coding.

> **v4.8 CURRENT CROSS-REFERENCE:** D-059 Option A **CONFIRMED** optional multi-photo thumbnails, explicit cover selection and simple reorder/remove (`docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`). NO photo required. Old `NEXT D-059` wording below is a **historical snapshot**. Next D-060 image upload limits & validation is PROPOSED/UNAPPROVED (`docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`). Property-public-site sync/Save/lifecycle remain OPEN.

# D-056 — CONFIRMED: Responsive Property Cards (Desktop and Mobile)

**Decision:** D-056 Option A | **Status:** CONFIRMED | **Owner approval:** 2026-10-19 | **Bundle:** EstateOS v4.5 | **Phase:** M00 PLANNING ONLY, NO APPLICATION CODE

## Exactly what is approved

- Agency Admin **Properties listing** is a calm, consistent **responsive property-card interface** instead of a desktop-row/mobile-card hybrid or dense management table.
- Desktop: a responsive card **grid** with sufficient room for readable content and obvious actions. Mobile: cards stack in a comfortable, vertically scrollable **single-column** layout. Exact column count, widths, gaps, and breakpoint pixel values are **OPEN**.
- Use **one reusable card presentation pattern** across viewport sizes; no forced horizontal-scroll tables or desktop-only actions. Cards should be readable and touch-friendly for low-training agency owners. Exact UI copy, affordances, image/crop ratios and accessibility tuning remain OPEN.
- Support a **clear zero-properties state** with the optional path to Add Property. A small agency may retain **zero listings and still go Live** when D-029/D-033 conditions are met. A property is **never** a website-readiness gate.
- For an agency with listings, the visual arrangement permits scanning a property and finding an Edit/manage entry point. Candidate visual slots (photo/placeholder, title, area, price, sale/rent, status) are examples ONLY; this decision **does not** approve card data fields, requiredness, status taxonomy or action semantics.
- Fits D-046 grouped Agency Admin navigation; D-047 Overview optional Add Property shortcut; and D-031/D-032 optional public-site Properties section. **Admin property cards and public listing cards are different surfaces**; D-056 approves the Agency Admin list only.

## Typical screen states — structural, not field or data rules

1. **Empty:** optional Add Property is discoverable, no blocking warning and no mandatory listing count.
2. **Has records:** responsive card grid/stack; each record can be inspected or opened for editing using plain controls, without promising unapproved deletion/status options.
3. **Small-screen usage:** one-column cards, text wraps rather than clipping, actions reachable by touch and keyboard; no numerical breakpoints implied.
4. **Error/loading:** accessible non-deceptive states are necessary eventual implementation concerns, but text/retry strategies are not approved here.

## D-056 explicitly does NOT confirm

- Property schema, actual visible card metadata, required fields, sale/rent enums, units, PKR precision, photo uploads/limits/mandatory-ness, carousel/gallery, crop, status, draft/visibility, search, sort, filter, pagination, bulk actions, Delete/Archive, undo/recovery, permission rules, editing/save/unsaved behavior, import/export, AI features or CRM.
- Add/Edit form grouping: proposed separately as **D-057**, NOT CONFIRMED. See `docs/PROPERTY-FORM-D057-PROPOSAL.md`.
- How individual property additions/edits/deletions appear on the public website. **Do not assume property Save instantly changes an already-Live site**, or that D-053 definitively governs separate property records: public property synchronization/publishing requires its own future decision.
- Does NOT override D-053 saved-draft section/theme post-live Publish Updates or D-029 initial **automatic** go-live (Super Admin approval + D-033 readiness, no initial owner Submit/Publish).
- Exact final English labels/routes, responsive breakpoint values and pilot Inquiries/CRM remain OPEN.

## Related references

- `docs/PROPERTIES-LIST-D056-PROPOSAL.md` — **historical** A/B/C comparison, resolved by this approval.
- `docs/PROPERTIES-SCREENS-D056-DISCUSSION.md` — historical candidate fields and flow, still discussion only.
- `docs/PROPERTY-FORM-D057-PROPOSAL.md` — **NEXT OPEN decision**, Add/Edit form presentation.
- `docs/PROPERTY-FORM-FIELDS-v4.5-DISCUSSION.md` — unapproved candidate field inventory, validation/publication risks.
- `docs/AGENCY-PROFILE-UX-D055-CONFIRMED.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`.
