# RESOLVED / HISTORICAL — D-067–D-073 Option A Approved (v5.6)

**Do not treat the unapproved language below as current.** On 2026-10-21 the owner explicitly approved **Option A for each D-067, D-068, D-069, D-070, D-071, D-072 and D-073**. See their individual `docs/SUPER-ADMIN-D###-CONFIRMED.md` files and `docs/SUPER-ADMIN-REVIEW-LIFECYCLE-v5.6.md` for active scope. This original A/B/C comparison is retained verbatim for historical audit only. No feature coding approval.

---

# D-067 to D-073 — BATCH PROPOSAL ONLY: Super Admin Pilot Decisions

**Status: ALL SEVEN DECISIONS UNAPPROVED.** Owner requested faster planning: collect 5–8 independently expressed selections in ONE reply. **D-066 Option A action-specific desktop dialogs/mobile sheets is already CONFIRMED.** This document is NOT feature-coding permission.

Choose **A/B/C for each decision**; recommended choices are marked. All choices apply to **2–3-agency lean pilot**. An A choice for one decision cannot implicitly approve another; if responses conflict, resolve in documentation before implementation. Preserve D-022/D-028/D-029/D-033/D-053/D-063 and Phase 0 setup.

## D-067 — Agency review state representation

**A (recommended):** Persist a separate **Changes Requested** state after a reasoned Request Changes decision. When a subsequently approved re-review trigger occurs, return the agency to **Pending** for another manual review. Approved and Rejected remain distinguishable. Actual state names, transitions, idempotency, notification and re-review trigger are OPEN; D-068 selects the correction trigger.

**B:** Keep review state **Pending** throughout corrections, add a **Needs Corrections** review flag/marker; no separate Changes Requested top-level state. Must avoid treating flagged pending record as ready for approval without context.

**C:** A provisional **On Hold** review state for all nonapproval outcomes, including correction requests; separately identify Rejected disposition. Greater ambiguity and event-model complexity.

**Do not invent a first-launch owner Submit/Publish:** any correction resubmission is for MANUAL AGENCY REVIEW, not for first public website publication.

## D-068 — After Request Changes: owner correction/re-review trigger

**A (recommended):** Show the reason privately in Agency Admin; owner can edit allowed profile/site draft fields and use an explicit **Resubmit for Review** action to return to manual review queue (subject to D-067 selected state model). **This action applies ONLY after Request Changes**; it is not a first-registration Submit/Publish and not a public website gate. What exactly is editable, validation and save coordination remain OPEN.

**B:** After Request Changes, the next successful correction Save automatically returns the agency to review queue. No explicit Resubmit control. Need precise criteria for meaningful edits and race protection.

**C:** Owner edits after Request Changes, then requests Super Admin to manually reopen/reschedule the review through an admin-only control. Less owner autonomy, more support overhead.

## D-069 — Rejected-agency recovery

**A (recommended):** Rejected agency stays nonapproved with the documented reason. **Authorized Super Admin can explicitly reopen it for manual re-review**; no automatic approval and no forced duplicate signup. Exact business criteria, owner visibility and status names remain OPEN.

**B:** Rejected agency owner gets a **Request Reconsideration** action and may supply context for Super Admin's manual decision. More workflow and potential spam/rate limiting.

**C:** Rejected is terminal for the pilot; no reopening. A fresh signup path, if permitted at all, needs duplicate identity handling and remains unspecified.

## D-070 — All Agencies directory interaction

**A (recommended):** Simple searchable, status-filtered management list with prominent agency name, review state, website Live/readiness distinction and one **View/Manage** entry; desktop compact rows, mobile stacked rows/cards. Exact fields, filters, paging and labels OPEN.

**B:** Visual agency cards on both desktop and mobile, basic status filtering. Easy browsing but lower information density.

**C:** Dense desktop data table with horizontal/mobile-scroll handling. Best for large lists, unnecessary pilot complexity.

## D-071 — Block/Deactivate UX boundary

**A (recommended):** Keep separate recognizable **Block / Deactivate** administrative actions; both require a focused reason + confirmation and are **reversible only by authorized Super Admin**. These are operational management actions, **not rejection or archive**. Exact semantics, allowed states, website availability, session invalidation and restore behavior are NOT decided by choosing A; decide them before coding.

**B:** One generic **Suspend / Reactivate** action for pilot, with reason/confirmation. Fewer UI actions but less expressiveness than distinct Block/Deactivate.

**C:** Two distinct reversible actions with confirmation but reason optional. Faster, weaker traceability.

## D-072 — Pilot account/role boundary

**A (recommended):** Start with **Super Admin** acting only within platform-admin scope, and one **Agency Owner** managing that owner's agency only. Additional agency staff/member roles and fine-grained RBAC deferred. Enforcement and tenant isolation mandatory architectural requirements; exact login/session/permission/API contracts and Super Admin staffing model OPEN.

**B:** Add Owner plus at least one **Agency Staff** role during pilot, with some edit capability. Requires owner invite/assignment and permission matrix.

**C:** Include fine-grained permission roles per section/action for pilot. Flexible but overbuilt for 2–3 agencies.

## D-073 — Pilot audit and review notification scope

**A (recommended):** Persist a minimal authoritative **audit/history event** for agency approval, Request Changes, Reject and operational Block/Deactivate/Reactivation. Display truthful in-app status/reasons to permitted actors; **automated emails/SMS/WhatsApp NOT required in pilot by this option**. Exact event schema, retention/security and whether optional manual outreach occurs OPEN.

**B:** Basic audit events **plus automated email** updates for agency decisions and correction requests; delivery and retries need technical decisions.

**C:** In-app current status only, no persistent review history in MVP. Least effort but poor accountability/recovery.

## Cross-decision consistency and remaining work

- A possible fast-track recommended package is `D-067 A, D-068 A, D-069 A, D-070 A, D-071 A, D-072 A, D-073 A`; **none is approved until owner replies**.
- D-067 and D-068 must combine into a logically consistent status + requeue model, and D-069 recovery must not bypass manual review.
- Block/Deactivate public-domain and access effects are **NOT decided in D-071**. Status/readiness and site public visibility must be modeled independently.
- D-029 first website Live remains automatic on genuine agency approval plus D-033 readiness; site can have zero properties. No initial owner Submit/Publish action. Agency correction resubmit must not become initial public-site publish.
- D-053 and D-063 later already-Live owner Publish Updates for saved website sections/themes/eligible property changes unchanged. Exact property eligibility, public Sold/Rented/Archived effects and rollback/cache remain OPEN.
- No new KYC/document/verified email requirement from D-028 lean pilot; existing D-022 rejection/change reasons mandatory.
- Exact reason length/validation, modal semantics beyond D-066, concurrency, filters, audit policies, notifications, tenant data isolation, authentication/API design, UI copy/routes/breakpoints and CRM pilot scope remain separately OPEN unless specifically approved.
- All decisions are planning approvals; **the only preexisting code authorization is Phase 0 four-app npm-workspaces scaffolding on ports 4000–4003**. Feature coding needs separate explicit owner permission.
