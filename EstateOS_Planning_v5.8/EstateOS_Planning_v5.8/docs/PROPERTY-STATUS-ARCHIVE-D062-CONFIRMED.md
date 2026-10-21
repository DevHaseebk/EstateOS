> **D-063 v5.2 interpretation:** D-063 now confirms **existing explicit Publish Updates** covers eligible saved property changes on already-Live websites; this **does not resolve** public behavior of Sold, Rented, Archived or Restored entries, exact status/Archive transitions, or which entries are eligible. Internal D-062 statuses/Archive remain unchanged. Canonical `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`.

# D-062 — CONFIRMED: Property Availability + Reversible Archive/Restore

**Status: CONFIRMED — Option A (owner approval, 2026-10-21)**  
**Bundle: EstateOS Planning v5.1 | Planning only. No app code is authorized.**

## Approved scope

- Agency Admin property records have a **simple availability-status concept** distinguishing **Available**, **Sold**, and **Rented**. These words identify the agreed owner-facing concepts; exact persisted enum keys, compatibility with For Sale/For Rent intent, defaults, transitions, and final English copy are **not** yet approved.
- An agency owner can **Archive** a property from the normal active-management view without permanently deleting its saved record. A dedicated archived listing/filter is available in concept so the owner can **Restore** that property. Exact filter and navigation design is open.
- **No permanent Delete action in the MVP.** Archiving is reversible; do not introduce Trash/Soft Delete (rejected Option C) or silent hard deletion.
- The UX must be understandable on both desktop and mobile. Exact confirmation dialogs, action wording, placement, progress/retry and accessibility details remain open.

## Critical distinctions — do not infer more than was approved

1. **Availability and archival are separate dimensions.** Marking Sold or Rented is not the same as Archive, and Archive is not destructive deletion. Do not infer that changing availability will archive the record or vice versa.
2. **Individual-property public publishing and unpublishing remain OPEN.** No decision here says Sold, Rented, Archive, Restore or Save instantly changes the public site. The behavior of public records, already-live site updates, and the relationship to the existing website-level Publish Updates action is deferred to **D-063**.
3. **D-061** still requires one explicit whole-property Save and provides Save/Discard/Stay for dirty in-app navigation. Whether status edits follow that same save or use an explicit separate action has NOT been decided. Archive/Restore confirmations and failure recovery remain open.
4. **D-058** exactly six required fields to Save a Property (Title, Sale/Rent, Type, Price PKR, City, Area); other details and **all photos including cover remain optional**. **D-059/D-060** optional gallery: thumbnails, selected cover, reorder/remove, max 10 images, max 5 MB per image, JPEG/PNG/WebP, per-file validation. These rules remain unchanged.
5. **Zero-property agencies remain valid.** **D-029** first public agency website automatically activates only after manual Super Admin approval AND D-033 minimum website readiness; NO new owner first-time Publish/Submit gate. **D-053** already-live *site theme/content* updates require explicit owner Publish Updates; property publication has not yet been folded into or excluded from that mechanism.
6. Exact status enums/defaults/intent constraints, archive filters, restore position, retention, confirmations, permissions, audit trail, blocked states, mobile breakpoints, property images processing and upload failures, and CRM/Inquiries MVP scope remain OPEN.

## Rejected alternatives and history

- **D-062 Option B** (only Available/Off Market + Archive) is not selected.
- **D-062 Option C** (availability statuses + recoverable Soft Delete/Trash) is not selected.
- The original `docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md` is retained for historical rationale and **is not active implementation authority**.

## Next decision — D-063 PROPOSED ONLY

Read `docs/PROPERTY-PUBLIC-PUBLISHING-D063-PROPOSAL.md` to choose how saved individual property additions, edits, status changes, and archiving affect the *public* agency website. **No D-063 alternative is approved.** Keep all implementation work on hold until explicit separate authorization.
