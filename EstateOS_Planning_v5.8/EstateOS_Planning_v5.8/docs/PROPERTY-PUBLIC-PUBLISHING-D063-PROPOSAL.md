> **HISTORICAL — RESOLVED by D-063 Option A (2026-10-21, v5.2).** This A/B/C proposal is retained only for decision history. Canonical approved rule: `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`. B and C NOT approved. Property public eligibility/status/archive behavior remains pending; D-029 initial auto-go-live unchanged. NO CODE.

# D-063 — PROPOSED ONLY: Individual Property Public Publishing UX

**Status: OPEN — NO OPTION APPROVED**  
**Bundle: EstateOS Planning v5.1 | Planning only; no application code.**

## Decision question

When an agency already has a **Live public website**, it may save a new property, edit an existing property's details or media, change availability (D-062), Archive or Restore. The property record can exist in the agency dashboard without yet being publicly visible. **When and how should each property's public representation change?**

This decision is separate from D-062 (internal status/archive) and D-061 (whole-property save). D-053 currently confirms an explicit **Publish Updates** step for subsequent already-live website *theme/section* edits, but it does **not** automatically define public-property behavior.

## Option A — Shared Saved-Draft + Publish Updates workflow (RECOMMENDED)

- After a successful Save Property, edits/additions to the property are in the agency's **saved private draft** and can be previewed in an authenticated context; the already-live public version remains stable.
- Reuse the website's **existing explicit Publish Updates** action to publish eligible pending property changes *together with* theme/section edits, rather than adding a new per-property Publish button.
- Status or Archive/Restore changes do NOT bypass this public publication boundary. Exact handling of unavailable/archived entries, publish transaction, validation and failure/rollback still need subsequent approvals.
- This would **extend** the D-053 publishing scope to property records *if chosen*; until then it is only a proposal.

## Option B — Per-property public visibility controls

- Saved property records remain private until an agency owner explicitly **Publish Property** (and later **Unpublish Property**) for individual records. Public changes are managed one record at a time, alongside D-053's separate website-content/theme Publish Updates workflow.
- More granular but more controls, state combinations and chances of owner confusion.

## Option C — Automatically sync saved property changes to Live

- On a Live agency site, successful Save Property and relevant status/archive actions automatically update public listings, while D-053 explicit Publish Updates continues to govern only website theme/section changes.
- Fewer clicks but increases the risk of accidental public changes and introduces two different publishing mental models.

## Rules all options must preserve

1. **Initial website go-live (D-029) unchanged**: Super Admin manually approves agency + D-033 site readiness → first public site becomes Live automatically with no extra owner Submit/Publish action. **Zero-property sites remain valid.** Whether/how eligible prelaunch properties appear in initial public snapshot will be specified later; do not invent property eligibility or a first-time publish gate.
2. **D-062 confirmed**: Available/Sold/Rented *availability concepts* + reversible Archive/Restore, no permanent MVP Delete. Exact enums/defaults/transitions, archive/public visibility and preview behavior still need definition.
3. **D-061 confirmed**: whole-property manual Save and Save/Discard/Stay on dirty navigation. A successful property Save does NOT itself imply any particular public effect until D-063 approved.
4. **D-058/059/060 confirmed**: six required Basics, optional Details and optional photo gallery, max 10 JPEG/PNG/WebP at 5 MB each, clear per-file validation.
5. Authentication, public/preview URLs, permission checks, publish eligibility, cache invalidation, atomicity, failure/retry/rollback, property visibility when sold/rented/archived, audit logs and blocked-agency effects remain open.
6. Keep MVP lean for 2–3 agencies, with clear desktop/mobile behavior. Pilot CRM/Inquiries remains undecided. **No application code.**

## Owner choice requested

Choose **A, B, or C**. Record the chosen high-level publication behavior as D-063 CONFIRMED in the next planning bundle; keep exact implementation and edge cases pending unless separately approved.
