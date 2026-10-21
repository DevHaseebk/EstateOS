> **v4.8 HISTORICAL/RESOLVED:** Owner APPROVED **D-059 Option A** on 2026-10-20. This A/B/C document is retained for decision traceability, **NOT a current choice**. Canonical approved UX: `docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`. The next **D-060 is UNAPPROVED**, concerning photo upload limits and validation UX; see `docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`.

# D-059 — PROPOSED ONLY: Optional Property Photos UX

**Historical original status:** OWNER CHOICE PENDING / NOT APPROVED (now RESOLVED BY D-059 Option A) | **Date:** 2026-10-20 | **Bundle:** EstateOS v4.7 | **M00 planning only — NO APP CODE**

## Starting constraints already confirmed

- **D-058**: Property photos and cover image are **OPTIONAL**. A valid property can be saved with the six required Basics fields without any photos.
- **D-057**: Property Photos is a separate expandable section on the **same** Add/Edit Property page; Basics visible first and Details separately expandable.
- **D-056**: Agency Admin list uses responsive property cards; no photo must mean an appropriate fallback, not a broken card.
- **Public property listing/publishing still UNDECIDED.** Choosing photo management UI does not make photo updates instantly public or invoke site Publish Updates automatically.

## Decision D-059: Which user interaction for optional photos?

### Option A — Optional Multi-Photo Gallery with Explicit Cover (RECOMMENDED)

- Property Photos expansion has an easily understandable **Add Photos** action, preview thumbnails, and controls to **choose a cover** and **remove/reorder** selected images (simple controls rather than complex drag/drop as a requirement).
- If owner adds **zero photos**, saving a property is still allowed and the Admin card uses a neutral appropriate placeholder (specific design TBD).
- Clear helper text explains photos are optional and which image will represent the property, if the user adds more than one.
- **No numeric limit or file/MIME size, crop/storage rules are approved** by choosing this interaction. Multiple photo handling may need upload state/error design later.

### Option B — Single Optional Cover Photo Only (Leanest MVP)

- One **Add/Replace/Remove Photo** interaction; no multi-photo gallery or ordering in pilot.
- Very simple implementation; less capable for an actual property listing. Future galleries can be added separately.
- Still **no required photo**. File restrictions/upload handling remain pending.

### Option C — Optional Gallery, First Image Becomes Cover

- Owner may add multiple photos and see thumbnails; **first uploaded/current first photo is automatically the cover** with no separate manual cover selection UI in MVP.
- Slightly simpler than Option A but can be unintuitive when first photo is not best. Order/replacement interactions still need separate rules.
- Photos are optional; limits/error/media requirements remain pending.

## What the selection would NOT authorize

Exact image count, per-file size, formats, resolution, storage, security/virus scanning, cropping/aspect ratio, EXIF/privacy, progress/retry/replacement, default image choice, public image URLs, cover processing, deletion/retention, property Save/dirty navigation, and publishing/SEO remain separate decisions. The photo UI must be usable on mobile and desktop; exact breakpoints/wording remain open.

## Next decisions after D-059

- Minimum media limits and photo upload handling (propose D-060).
- Property form Save and unsaved-changes safeguards.
- Property lifecycle (available/sold/rented, archival/delete).
- Individual property public visibility/publishing, Agency Profile outstanding rules, Super Admin UX and pilot CRM scope.

**RECOMMENDATION:** A for a useful but understandable agency photo experience, provided we keep the implementation lean and do not force photos. **No choice has been approved yet.**
