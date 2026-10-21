> **v5.0 ACTIVE CROSS-REFERENCE:** D-061 Option A **CONFIRMED**, whole-property explicit Save + Save/Discard/Stay (`docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`). Historical claims below that Property Save/dirty handling is unapproved are SUPERSEDED. D-062 Property Status & Archive/Delete **PROPOSED ONLY** (`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`). Exact validation/failures, pending upload transaction, per-property public publishing, final labels/routes/breakpoints and CRM still OPEN. D-029/D-033 first automatic website Live, D-053 post-live website content/theme explicit Publish Updates and zero-property requirement are unchanged. **NO APP CODE.**

> **v4.9 CURRENT CROSS-REFERENCE:** D-060 Option A **CONFIRMED** media guardrails (max 10 optional property images, max 5 MB/image, JPEG/PNG/WebP and clear per-file validation) via `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`. The older “D-060 unapproved”/“limits open” language **below is historical as of v4.8**. Image security/processing, uploading errors/retry, Property Save, status/delete and individual property-publication still OPEN. D-061 Save/unsaved UX is **PROPOSED ONLY**; see `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`. Photos and cover remain optional; no app coding.

> **v4.8 CURRENT CROSS-REFERENCE:** D-059 Option A **CONFIRMED** optional multi-photo thumbnails, explicit cover selection and simple reorder/remove (`docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`). NO photo required. Old `NEXT D-059` wording below is a **historical snapshot**. Next D-060 image upload limits & validation is PROPOSED/UNAPPROVED (`docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`). Property-public-site sync/Save/lifecycle remain OPEN.

# D-058 — CONFIRMED: Balanced Six Required Property Fields (Option A)

**Decision:** D-058 Option A | **Status:** CONFIRMED | **Approved:** 2026-10-20 | **Bundle:** v4.7 | **Stage:** M00 PLANNING ONLY — NO APP CODE

## Owner-approved minimum for a property record

Under D-057's **single-page Add/Edit Property form**, the **Basic Information** group visibly contains these **SIX REQUIRED** information categories whenever the owner saves a property record:

| Required field | Meaning / scope | Still undecided |
| --- | --- | --- |
| **Property Title** | Human-readable name of this property | Character limit, trimming, duplicate rules |
| **Listing Intent** | Whether the listing is **For Sale** or **For Rent** | Exact stored enum, display copy, rent periods |
| **Property Type** | Category of property, such as house/apartment/plot, **examples only** | Exact enum/category list and special cases |
| **Price (PKR)** | Asking price denominated in Pakistani rupees | Numeric validator, formatting, rent period, price-on-request/zero/negotiable exceptions |
| **City** | City where the property is located | Selection versus free text, validation, allowed cities |
| **Area / Neighborhood** | Broad locality; not a requirement for a precise street address | Place catalog, autocomplete, free text rules |

The following are **OPTIONAL** for the basic property record and must not be silently turned into requirements: **property size and unit; bedrooms; bathrooms; description; property photos including any cover photo/gallery; other secondary details.** Some inputs may be relevant only to certain property types; exact appearance and validations are separate future decisions. **No photo is mandatory** to save a property under this decision. An appropriate no-image fallback for cards can be designed later; it does not make photos required.

## Approved user-experience relationship

- D-057 **one responsive Add/Edit page** with **Basics visible first**, **Property Details** and **Photos** separately expandable/collapsible below. Required six are in Basics. Secondary optional information and photos reside below, without wizard/tabs.
- D-056 **responsive Agency Admin property cards** on desktop/mobile with a friendly zero-properties empty state. Card **display** metadata (which properties to show), filtering and search are not set by D-058.
- **Properties remain optional to add at all.** D-058 applies only if an owner chooses to create/edit a property; it adds no agency signup, approval, verification, or website-readiness gate.
- Do not treat `Property Save` as approved publishing or as automatic appearance on an already-Live public website. **Property save/cancel/unsaved navigation, status, delete/restore, media transfer, per-property publication are OPEN.** D-050 section Save and D-053 site content/theme Publish Updates are separate decisions.
- D-029 **first go-live** remains automatic once **manual Super Admin approval plus D-033 website readiness** hold; no initial owner Publish/Submit action. D-053 **subsequent website content/theme updates** retain explicit Publish Updates.

## Strictly still OPEN after D-058

1. Exact option enums for intent/type, price formatting, numeric constraints, rent period, internationalisation, required string validation, missing/invalid fields, and exception policy.
2. Optional Details field inventory, size units (gaz/sq yd, sq ft, marla, kanal), dependency on listing category and validation.
3. **D-059 PROPOSED ONLY** Property Photos interaction: optional image selection, gallery/cover, thumbnails and reordering. No photo required; exact count, file size/types, storage, EXIF, privacy and upload failure behavior remain unapproved.
4. Property Save/unsaved protection/feedback, ability to maintain partial private drafts, status/availability/sold/rented/archival/delete, permissions and audit.
5. Public publication/synchronisation of individual property records, including new/edit/delete/cover photo and existing Live sites; whether related to D-053 is NOT decided.
6. Exact property-card displayed metadata, public property page design/SEO, routes, final labels, breakpoints and pilot CRM/Inquiries.

## Sources / precedence

This file is the **canonical D-058 decision**. `docs/PROPERTY-MINIMUM-FIELDS-D058-PROPOSAL.md` is now **RESOLVED/HISTORICAL** (A chosen; B/C rejected). D-057 remains canonical for form grouping in `docs/PROPERTY-FORM-D057-CONFIRMED.md`. Next proposal: `docs/PROPERTY-PHOTOS-D059-PROPOSAL.md` is **UNAPPROVED**, not an implementation requirement. All historical decision archives retain their dated snapshots. **No application code authorized.**
