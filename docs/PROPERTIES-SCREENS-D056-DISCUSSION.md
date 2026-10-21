> **v5.0 ACTIVE CROSS-REFERENCE:** D-061 Option A **CONFIRMED**, whole-property explicit Save + Save/Discard/Stay (`docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`). Historical claims below that Property Save/dirty handling is unapproved are SUPERSEDED. D-062 Property Status & Archive/Delete **PROPOSED ONLY** (`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`). Exact validation/failures, pending upload transaction, per-property public publishing, final labels/routes/breakpoints and CRM still OPEN. D-029/D-033 first automatic website Live, D-053 post-live website content/theme explicit Publish Updates and zero-property requirement are unchanged. **NO APP CODE.**

# Optional Properties — Listing and Add/Edit UX discussion, v4.4

**Status:** DISCUSSION ONLY / candidate fields and Add/Edit workflows NOT APPROVED | **Date:** 2026-10-19 | **Mode:** PLANNING ONLY

This v4.4 document is retained as a **historical discussion**. Since v4.5, D-056 Option A responsive Agency Admin Property CARD listing is CONFIRMED in `docs/PROPERTIES-LIST-D056-CONFIRMED.md`. **D-057 Add/Edit Property layout remains OPEN**, and this file is NOT an approved schema or publish workflow. See `docs/PROPERTY-FORM-D057-PROPOSAL.md`.

## Proposed Properties listing screen

- Page header: manageable, simple heading and optional Add Property primary action. Exact English labels/routes TBD.
- No items: inviting empty state with optional Add Property; agency remains eligible to launch with zero records (D-028/D-033).
- Has items: each candidate card/row may display cover photo or safe placeholder, title, neighborhood, sale/rent, price and a clearly discoverable Edit. Actual requiredness and status semantics **OPEN**.
- Future tools such as search, filter by sale/rent, ordering, pagination and deletion/archive dialogs are **OPEN**; do not add as requirements now.
- Mobile touch targets and column behavior need explicit design QA, breakpoint value OPEN.

## Proposed Add/Edit Property screen

| Candidate group | Possible inputs — none required/approved yet |
|---|---|
| Basics | Property title, property category, sale vs rent, asking price, area/neighborhood |
| Details | Size + units (sq ft / sq yd etc), beds, baths, floor, short description, highlights |
| Photos | Cover image + optional gallery, upload/reorder/remove, placeholders and alt text |
| Availability | Potential status such as available/sold/rented/draft — **not confirmed** |
| Form actions | A single comprehensible Save and Back/Cancel; persistence/unsaved handling OPEN |

### Key UX considerations to decide later

- Short first form with optional advanced details versus structured accordion or steps.
- Which fields really matter for Karachi/Pakistan agencies and what values/units to support; money notation PKR, area unit, location metadata and validations require user approval.
- Photo upload: whether optional or required, count/format/size limits, image cropping and security, failure/retry and ordering.
- Property ID/slug/public URL, SEO/caching and listing discoverability remain technical/product questions.
- **Critical live-site boundary:** if Properties section is enabled, is adding/saving/deleting a property immediately public, part of D-053 Publish Updates, or governed by separate per-property publish? **No behavior approved**. Preserve public draft/live separation and avoid unreviewed silent changes.
- Permission, delete recovery, duplication, multi-agent collaboration, analytics and CRM/Inquiries scope all OPEN.

## Related canonical decisions

- D-055 Agency Profile one page essentials first / optional expandable additional info (layout only).
- D-046 grouped navigation, D-047 status-first Overview and optional Add Property shortcut, D-048 My Website hub, D-031/D-032 Properties website section optional.
- D-029 initial automatic go-live when approved + ready, D-053 manual publication for already-live website content/theme changes. Do not invent per-property behavior from these.

## Recommended next steps

D-056 card-based listing is confirmed; NEXT D-057 form-group choice is unapproved, then decide mandatory field schema, photos, deletion/status and how property records connect to website publication. Super Admin agency review UX follows. Still planning only.
