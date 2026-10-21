## v5.6 ADDENDUM — Later approved review-state scope

The original D-066 text below was written before D-067…D-073; its wording calling **correction state, resubmission, rejected recovery, agency directory, Block/Deactivate and pilot roles/audit entirely undecided is now HISTORICAL**. User has approved their Option A at a BUSINESS/UX level: separate Changes Requested + explicit correction-cycle Resubmit → Pending manual review; Super Admin Reopen Rejected; searchable agency list; reasoned reversible separate Block/Deactivate; pilot Super Admin + Agency Owner only; basic audit/in-app state. Exact backend enums/transitions, validators, auth, failure handling, roles matrix, notification specifics and public effects remain undecided. D-066 dialog/sheet design unchanged.

---

# D-066 — CONFIRMED: Action-Specific Agency Review Confirmation (Option A)

**Owner confirmation: 2026-10-21. Status: CONFIRMED for review action confirmation presentation and mandatory-reason placement, NOT the approval of exact backend transitions or permission rules.** This document is UX planning. Beyond previously authorized Phase 0 scaffolding, do not implement product code until separately authorized.

## Approved UX

- Keep the **D-065 one-page Super Admin Agency Review Detail** with visually separate existing **Approve / Request Changes / Reject** actions.
- Selecting an otherwise authorized action opens a **compact action-specific confirmation dialog on suitable desktop widths**, using a **responsive mobile sheet** for small screens. The exact breakpoint, sizing, component library, close/focus behavior and routes remain OPEN; accessibility must be considered before coding.
- **Approve:** concise explicit confirmation tied to the actual agency identity and action. Distinguish **manual agency approval** from **D-033 website readiness**: approval of an unready site does not immediately make it Live. Do not invent a required site readiness/Preview/KYC gate to approve an agency.
- **Request Changes:** dedicated confirmation with an **obligatory reason** (pre-existing **D-022**). A separate confirm action is required; clicking the primary Review-page action alone must not submit.
- **Reject:** separate confirmation with **obligatory reason** (pre-existing **D-022**), differentiated from Request Changes. Exact warning severity and literal wording are OPEN.
- Cancel/dismiss without confirming leaves agency unchanged. Never optimistically display a successful approval/rejection without acknowledged success. Actual loading, retries, transient errors, duplicate clicks, race control, stale review handling and server status contracts are OPEN.
- No extra multi-step wizard or separate decision route for the standard actions. An in-page expanding decision panel is not the selected default.

## Safeguards and boundaries

1. **D-022** requires non-empty reasons for Request Changes and Reject; reason length, allowed content, visibility to owner, retention and audit details remain OPEN.
2. **D-028** lean self-register and platform-admin agency creation, immediate Pending, manual agency review; do not restore old mandatory document, KYC, verified email or office-proof gates.
3. **D-029 + D-033** FIRST public website Live is AUTOMATIC as soon as manual agency approval AND website readiness are both genuinely satisfied; no initial owner Publish/Submit, zero-property agencies valid. The later trigger/recheck mechanism remains OPEN.
4. **D-053 + D-063** already-Live public website content/theme/eligible saved property changes become public only through owner's explicit Publish Updates; no new per-update Super Admin moderation gate.
5. **D-064 + D-065** pending review queue first, single-page Review Detail and authorized PRIVATE Preview unchanged.
6. **Phase 0:** root npm workspaces, four application roots (`frontend` 4000, `admin` 4001, `super-admin` 4002, `backend` 4003). User authorized Codex scaffolding only; execution not verified in this planning bundle.

## Explicitly still UNDECIDED

Backend status enum, legal transitions, Request Changes correction/resubmission, rejected recovery, agency directory UX, suspension/block/deactivation effects and public website effects, role rights, reason constraints, audit/notifications, review concurrency/errors, exact labels/routes and responsive pixel breakpoints, CRM inclusion, tenant authentication, live publishing edge cases. Next **D-067 through D-073 are PROPOSALS ONLY** in `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md`; selecting D-066 A does not authorize any of these options.
