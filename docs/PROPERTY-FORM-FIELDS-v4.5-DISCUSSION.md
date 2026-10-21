> **v5.0 ACTIVE CROSS-REFERENCE:** D-061 Option A **CONFIRMED**, whole-property explicit Save + Save/Discard/Stay (`docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md`). Historical claims below that Property Save/dirty handling is unapproved are SUPERSEDED. D-062 Property Status & Archive/Delete **PROPOSED ONLY** (`docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`). Exact validation/failures, pending upload transaction, per-property public publishing, final labels/routes/breakpoints and CRM still OPEN. D-029/D-033 first automatic website Live, D-053 post-live website content/theme explicit Publish Updates and zero-property requirement are unchanged. **NO APP CODE.**

> **v4.9 CURRENT CROSS-REFERENCE:** D-060 Option A **CONFIRMED** media guardrails (max 10 optional property images, max 5 MB/image, JPEG/PNG/WebP and clear per-file validation) via `docs/PROPERTY-PHOTO-LIMITS-D060-CONFIRMED.md`. The older “D-060 unapproved”/“limits open” language **below is historical as of v4.8**. Image security/processing, uploading errors/retry, Property Save, status/delete and individual property-publication still OPEN. D-061 Save/unsaved UX is **PROPOSED ONLY**; see `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md`. Photos and cover remain optional; no app coding.

> **v4.8 CURRENT CROSS-REFERENCE:** D-059 Option A **CONFIRMED** optional multi-photo thumbnails, explicit cover selection and simple reorder/remove (`docs/PROPERTY-PHOTOS-D059-CONFIRMED.md`). NO photo required. Old `NEXT D-059` wording below is a **historical snapshot**. Next D-060 image upload limits & validation is PROPOSED/UNAPPROVED (`docs/PROPERTY-PHOTO-LIMITS-D060-PROPOSAL.md`). Property-public-site sync/Save/lifecycle remain OPEN.

# EstateOS Optional Properties — Add/Edit Form Discussion (v4.5)

**Status:** DISCUSSION ONLY / NOT AN APPROVED SCHEMA | **Date:** 2026-10-19 | **No app code**

This supplements `docs/PROPERTIES-SCREENS-D056-DISCUSSION.md` and D-057 proposed layout. **D-056 approved only the responsive Agency Admin card listing.** Do not interpret the example fields below as requirements.

## Screen-by-screen proposed user experience

### Agency Admin / Properties (D-056 CONFIRMED presentation)

- No listings → calm empty card state, optional Add Property action; website can be Live with no properties.
- Some listings → responsive card grid on desktop and one-column cards on mobile; support a clearly discoverable route to Add or Edit. Card metadata and status badges below are not settled.
- Long lists → behavior for search/sort/pagination/filters is open. Avoid assuming tables or bulk workflows.

### Add Property (D-057 OPEN layout choice)

1. Return context: property owner should know they are adding a record, not editing public website Hero/Theme.
2. Candidate group **Basics:** property title, listing intent (sale/rent), category/type, price (PKR), city, neighborhood. *Decide what is required later.*
3. Candidate group **Details:** built area/plot size and local unit, beds, baths, floor, description, amenities/highlights. *No unit enumeration or numeric limits approved.*
4. Candidate group **Photos:** cover and optional gallery, upload/preview/order/remove; *format, count, file-size, crop and security handling all pending.*
5. Candidate action **Save:** visible confirmation/errors, navigation recovery, status of record and public visibility rules all undecided. Website Editor D-050 per-section Save/ D-051 dirty guard cannot silently dictate Property form semantics.

### Edit Property (D-057 OPEN layout choice)

- Reuse same fields and grouping as Add, with current stored values when genuine; do not fabricate statuses.
- Preserve access to an obvious back-to-list action. Handling unsaved navigation, conflicting edits, media replacement, deleting a property and restoration remain unapproved.
- No approved individual property URL, SEO behavior, syndication, sharing, or CRM/lead-capture.

## Separate validation and operational decisions still required

- **Core fields & requiredness:** Title? intent? price? area? city? property category? Which can be left blank and still saved?
- **Units & formatting:** sq ft / sq yd (gaz) / marla / kanal; PKR amount and internationalized display; never hard-code based on a UI example.
- **Media handling:** cover needed or placeholder allowed? number/size/format limit? cropping, EXIF/privacy, reordering, retry and safe URLs.
- **Record statuses:** draft/available/sold/rented/archived? Do not invent.
- **Delete vs archive:** irreversible delete, soft-delete, restore, confirmations, ownership/audit.
- **Public listing publishing:** Does an individually saved property immediately appear publicly, wait for D-053 site-level Publish Updates, or have per-record publication? **OPEN**; maintain no inadvertent public mutation.
- **D-029 initial go-live:** remains automatic when approved+ready; zero-properties stays valid.
- **Permissions and scope:** tenant isolation, who edits a listing among 1–10 agents, image access, blocked/deactivated agency behavior; all pending.
- **Pilot Inquiries/CRM:** inclusion is not confirmed, so avoid buttons/fields implying a built-in lead system.

## Suggested future order

D-057 grouped form layout A/B/C → schema/requiredness → photo interaction and constraints → property lifecycle/delete → public listing synchronization → Super Admin workflow. Keep decisions individually owner-approved and maintain versioned planning-only ZIP handovers.
