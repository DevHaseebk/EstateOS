> **HISTORICAL / RESOLVED in v5.0 (2026-10-21):** Owner selected **Option A**. Canonical authoritative rule: `docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md` (one explicit whole-property Save and Save/Discard/Stay guard). B/C below are rejected alternatives; do not implement them. Next D-062 is **PROPOSED ONLY**.

# D-061 — HISTORICAL PROPOSAL: Add/Edit Property Save and Unsaved Changes UX

**Status:** OWNER DECISION PENDING — NOT CONFIRMED | **Date:** 2026-10-20 | **Bundle:** EstateOS v4.9 | **NO APP CODE**

## Existing confirmed constraints

- **D-057**: one responsive Add/Edit Property page; six D-058 mandatory Basics visible first; optional Details and Photos expandable.
- **D-058**: only the six required Basics needed for a property record to be saved; photos and cover always optional.
- **D-059 / D-060**: optional gallery, cover chosen explicitly, reorder/remove; max **10 images**, **5 MB/file**, allowed **JPEG/PNG/WebP**, and clear per-file invalid-image feedback.
- D-050 section-level explicit Save and D-051 dirty navigation protection cover the **website editor**, NOT automatically the Property form; we must make a distinct D-061 policy.
- A persisted Property record is NOT automatically a public Property listing; that separate publishing policy has not been approved.

## Choice A — One explicit Save Property + Save / Discard / Stay navigation guard (RECOMMENDED)

- Add/Edit form has one clear **Save Property** action for the whole record (not separate Save for Basics, Details, Photos).
- Only successful persistence counts as saved. Visible success or inline validation/error feedback; exact wording and failed-media processing/retry mechanics remain open.
- When leaving the form with unsaved changes, show a protective **Save / Discard / Stay** choice. **Save** attempts to save the property and navigates only after success; **Discard** drops unsaved form changes without editing the previously persisted version; **Stay** keeps edits and remains.
- Confirmed optional photos are not secretly made mandatory; exact pending-upload interaction is still open. This resembles D-051 but would be independently approved for Property UI.
- Simple for property agents and aligns with the manual save mental model, while keeping website-editor section-save semantics separate.

## Choice B — Explicit Save Property with simpler leave warning

- One primary Save Property button for the entire record.
- If navigating with unsaved edits, show **Leave Without Saving / Keep Editing**, rather than offering Save inside the warning. The user may return to the form and tap Save.
- Fewer dialog actions, but adds navigation friction and makes accidental omissions more likely.

## Choice C — Property-form autosave

- Save draft changes automatically during property editing, show visible **Saving / Saved / Error** states; manually saving the complete record would not be the main interaction.
- Requires decisions on temporarily incomplete six-Basics records, upload queues, failures and lifecycle, making it more complex for the lean 2–3 agency pilot.
- Autosaving a private Property record still does NOT authorize public publication.

## Not decided by any D-061 choice

- Exact Save/cancel button English labels, screen routes, save-as-draft versus complete record semantics, whether incomplete six-Basics entries can exist as *temporary local drafts*, attachment upload transaction boundaries, background/browsers' unload protection, offline behaviour and failure/retry copy.
- Public property listing visibility, edit-to-public synchronization, property status/availability/delete/archive, file storage/security, dimensions/compression/EXIF, responsive numerical breakpoints, CRM pilot scope.
- D-029 initial agency-site auto activation after manual approval+readiness; D-053 already-live website content/theme Publish Updates must stay unchanged.

**No option is approved until the owner selects it.** Do not start implementation. Once chosen, make `docs/PROPERTY-SAVE-UNSAVED-D061-CONFIRMED.md` and update cross-AI handover in v5.0.
