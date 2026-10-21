> **HISTORICAL — D-062 resolved in v5.1:** Owner selected **Option A**. Read `docs/PROPERTY-STATUS-ARCHIVE-D062-CONFIRMED.md` for implementation authority. This A/B/C document is retained as the original proposal; no other option is approved. Next D-063 is UNAPPROVED.

# D-062 — PROPOSED ONLY: Property Availability Status and Archive/Delete UX

**Historical status:** proposal snapshot from v5.0; **Option A CONFIRMED in v5.1**. Do not treat the old OPEN status below as current. **NO APP CODE**

## Why we need this decision

Agency owner can now conceptually Add/Edit and manually Save an optional property (D-056–D-061). They also need a low-friction way to represent an unavailable property and stop managing obsolete listings. **No property statuses, archive/delete semantics or individual-property public visibility rules are currently approved.** This decision addresses Agency Admin property lifecycle UX only, NOT public publication mechanics.

## Option A — Simple availability states + reversible Archive/Restore (RECOMMENDED)

- Candidate owner-facing availability concepts: **Available**, **Sold**, **Rented** (applicability and exact enum copy still require separate validation). Property cards can show an appropriate simple status indicator.
- Add a separate **Archive** action (with clear confirmation) to remove an obsolete record from the main active management view without destroying its information. Archived records accessible through a simple Archived filter/view, with **Restore**.
- **No permanent delete action during MVP.** Avoid accidental irreversible loss. Exact status transitions, whether sold/rented values are available for all listing intents, and public listing effects remain open.
- Suitable for a lean 2–3 agency pilot: minimum controls, recoverability, simple mobile actions.

## Option B — Basic visibility-focused state + Archive/Restore

- Keep only two proposed owner-facing management states, such as **Available** and **Off Market**, plus a reversible **Archive/Restore** action.
- Less detail on the reason a listing is unavailable. Exact status labels and public effects still undecided.

## Option C — Availability states + recoverable Soft Delete

- Candidate **Available/Sold/Rented** availability states, plus an explicit **Delete** action with a confirmation and recoverable soft-deleted/trash state.
- Better if agents insist on a familiar Delete action, but adds trash/recovery and audit/retention complexity. This is **not** authorization to hard-delete or publish/unpublish a property automatically.

## Guardrails applying to ANY choice

1. **D-061 whole-property manual Save and Save/Discard/Stay remains approved.** Whether changing availability status is saved by the same Save, a separate action or a confirmation is a follow-up, not assumed.
2. **D-058** six required Basics and optional photos; **D-059/D-060** gallery + 10/5 MB JPEG/PNG/WebP. Zero properties allowed and no property is mandatory for website readiness.
3. **Individual-property public publication/unpublication and how it coordinates with D-053** post-live site-level Publish Updates are **OPEN**. Even an internal Archive or Sold action is not yet an approved public-site change.
4. Exact enums, permissions, filters, audit/retention, recovery windows, Delete/Archive wording, iconography, responsive breakpoints and accessibility handling stay open unless explicitly chosen later.
5. Do not add CRM/Inquiries, inventory analytics, public listing moderation or new Super Admin gate by inference.
6. **D-029** initial agency website go-live stays automatic after admin approval + readiness, without first-time Publish/Submit.

## Next decision needed

Owner picks A/B/C to confirm a **high-level availability and removal approach**. Exact labels/enum constraints and public effects may be separately planned afterward. Keep this proposal UNAPPROVED until explicit selection. **No application code.**
