# EstateOS — Phase 2a Super Admin Review Lifecycle Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-21, as written, including the three confirmations in section 8 (D-115). Drafted by Claude Code the same day.
**Builds on:** `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md` (sessions, BFF, CSRF/Origin, tenant scope, error format).
**Decisions implemented:** D-022, D-028, D-029, D-064, D-065, D-066, D-067, D-068, D-069, D-072, D-073, D-089, D-092, D-093, D-102, D-110, D-111, D-115.

## 0. Owner answers this contract is based on (2026-10-21)

The owner accepted Claude's recommended answers to four open questions:

1. **Block / Deactivate and owner login** (applies in Phase 2b, recorded here): **Blocked** → owner cannot sign in and existing owner sessions are revoked. **Deactivated** → owner can sign in, everything is read-only, with a clear notice. Both keep the public website non-public (D-083).
2. **After Approve:** no further review decisions. An Approved agency can only be restricted (Block/Deactivate, Phase 2b).
3. **Reasons:** required for Request Changes, Reject and Reopen; 10–1000 characters after trimming; shown in full to the agency owner.
4. **Owner editing rights:** owner may edit agency data while **Pending** or **Changes Requested**; **Rejected** is view-only. (Phase 2a adds no editable owner screens; this rule is implemented as a shared check that Phase 3 will use.)
   *Amended 2026-10-21 by the approved Phase 3a contract: Approved agencies may also edit their profile; Rejected stays view-only.*

## 1. Scope

**In scope (2a):**
- Super Admin dashboard led by the Pending review queue (D-064).
- One-page Agency Review Detail (D-065).
- Approve, Request Changes and Reject with separate confirmation dialogs (desktop) / sheets (mobile); a reason is required for the last two (D-022, D-066).
- Changes Requested state; owner sees the reason and uses **Resubmit for Review** to return to Pending (D-067, D-068).
- Super Admin **Reopen for Review** of a Rejected agency (D-069).
- Append-only audit record for every decision (D-073, D-092).
- Separate state axes on the agency (D-102).
- Owner dashboard shows the true review status and latest reason (D-073).

**Out of scope (later):**
- Phase 2b: All Agencies directory with search/filter (D-070); Block/Deactivate/Restore (D-071).
- Super Admin-created agencies and owner invitations (D-118).
- Email/SMS/WhatsApp notifications (not required, D-073).
- Agency Profile editing, website editor, readiness computation, private preview (Phase 3, D-052, D-101).
- Public website activation (Phase 4). **Approving never makes any website Live in 2a** (D-029: approved but not ready stays non-public).

## 2. State model (D-102)

Each agency gets four independent axes. Only the review axis changes in 2a.

| Axis | Field | Values in 2a | Later |
|---|---|---|---|
| Review disposition | `reviewStatus` | `PENDING`, `CHANGES_REQUESTED`, `APPROVED`, `REJECTED` | — |
| Operational restriction | `restrictionStatus` | `NONE` | `BLOCKED`, `DEACTIVATED` (2b) |
| Website readiness | *(computed, not stored)* | always "not ready" (no website data exists yet) | Phase 3 |
| Public publication | `publicationStatus` | `NEVER_PUBLISHED` | `LIVE` (Phase 4) |

### Allowed review transitions (all others are rejected)

| From | Action | Actor | Reason | To |
|---|---|---|---|---|
| `PENDING` | Approve | Super Admin | not accepted | `APPROVED` |
| `PENDING` | Request Changes | Super Admin | required | `CHANGES_REQUESTED` |
| `PENDING` | Reject | Super Admin | required | `REJECTED` |
| `CHANGES_REQUESTED` | Resubmit for Review | Agency Owner (own agency) | — | `PENDING` |
| `REJECTED` | Reopen for Review | Super Admin | required | `PENDING` |

- `APPROVED` is final for the review axis (owner answer 2).
- A Super Admin cannot decide while the agency is `CHANGES_REQUESTED`; it waits for the owner's Resubmit. (If an owner never responds, the Super Admin can act on it in Phase 2b with Deactivate.)
- New agencies from signup start as `PENDING` (unchanged from Phase 1).
- Resubmitting does not require the owner to have changed anything in 2a, because no editing screens exist yet. Corrections can be arranged with support until Phase 3.

### Concurrency and double clicks
- Every agency has an integer `reviewVersion`, starting at 0 and incremented on each review transition.
- Every review mutation must send `expectedReviewVersion`. The update is a single conditional write (`_id`, `reviewStatus`, `reviewVersion` must all match).
- Version mismatch → `409 REVIEW_CONFLICT`; the UI reloads and shows the current status. A double click therefore changes the state once, and the second request gets 409.
- Action not allowed from the current status → `409 INVALID_TRANSITION`.

## 3. Data model changes

**`Agency` (existing) — added fields:**

| Field | Type | Notes |
|---|---|---|
| `reviewStatus` | enum (4 values above) | existing field, enum widened |
| `reviewVersion` | integer, default 0 | optimistic concurrency |
| `submittedForReviewAt` | date | set at signup and on Resubmit/Reopen; queue order |
| `latestReview` | `{ action, reason?, decidedAt, actorUserId }` or absent | what the owner and the detail page show |
| `restrictionStatus` | enum, default `NONE` | D-102 axis; only `NONE` in 2a |
| `publicationStatus` | enum, default `NEVER_PUBLISHED` | D-102 axis; only this value in 2a |

New index: `{ reviewStatus: 1, submittedForReviewAt: 1 }`.

**`AgencyAudit` (new, append-only, D-092):**

| Field | Notes |
|---|---|
| `at` | server time |
| `agencyId` | target agency |
| `actorUserId`, `actorRole` | `SUPER_ADMIN` or `AGENCY_OWNER` |
| `action` | `REVIEW_APPROVE`, `REVIEW_REQUEST_CHANGES`, `REVIEW_REJECT`, `REVIEW_REOPEN`, `OWNER_RESUBMIT` |
| `fromStatus`, `toStatus` | review axis values |
| `reason` | when required |
| `requestId` | correlates with the API error/log id |

- Each audit entry is written **in the same MongoDB transaction** as the status change. If either fails, neither is saved and the API returns an error, so nothing ever reports a false success.
- No API, CLI or code path updates or deletes audit entries. Only Super Admin can read them (agency history on the detail page). Logs never print reasons in full (D-111).

**Migration:** a one-time idempotent CLI, `npm run migrate:review-axes -w backend`, sets missing fields on existing agencies (`reviewVersion: 0`, `submittedForReviewAt: createdAt`, `restrictionStatus: NONE`, `publicationStatus: NEVER_PUBLISHED`). Running it twice changes nothing.

## 4. Authorization

- Super Admin routes need a valid Super Admin session on the `SUPER_ADMIN` portal (Phase 1 rules). Cross-agency reads exist **only** on these routes, through an explicit `superAdminScope()` helper (D-072, D-089).
- Owner routes derive `agencyId` only from the session (`ownerScope`). Any `agencyId` in the query, body or `x-agency-id` header → `422` (Phase 1 rule). The owner mutation has no agency id in its path.
- An owner session on Super Admin routes → `401`/`404` (portal mismatch, BFF allow-list), as in Phase 1.
- All mutations need CSRF token + exact Origin (Phase 1).
- Shared check `ownerCanEdit(agency)` = `reviewStatus ∈ {PENDING, CHANGES_REQUESTED}` and `restrictionStatus = NONE` (owner answer 4), unit-tested now and used by Phase 3.

## 5. Versioned REST API — additions to `/api/v1`

Response and error envelopes are the same as Phase 1.

| Method & path | Portal | Request | Success |
|---|---|---|---|
| `GET /super-admin/review-queue?limit=20&cursor=` | SUPER_ADMIN | `limit` 1–50, opaque `cursor` | `200 { items: [{ id, agencyName, ownerName, submittedForReviewAt, reviewStatus }], nextCursor, counts: { PENDING, CHANGES_REQUESTED, APPROVED, REJECTED } }` — `PENDING` only, oldest first |
| `GET /super-admin/agencies/:agencyId` | SUPER_ADMIN | 24-hex id | `200 { id, agencyName, owner: { name, email, mobile, whatsapp }, createdAt, review: { status, version, latestReview, submittedForReviewAt }, restrictionStatus, websiteReadiness: "NOT_READY", publicationStatus, history: [last 50 audit entries, newest first] }` |
| `POST /super-admin/agencies/:agencyId/review-decisions` | SUPER_ADMIN | `{ decision: "APPROVE" \| "REQUEST_CHANGES" \| "REJECT", reason?, expectedReviewVersion }` | `200 { review: { status, version, latestReview } }` |
| `POST /super-admin/agencies/:agencyId/reopen` | SUPER_ADMIN | `{ reason, expectedReviewVersion }` | `200 { review: … }` |
| `GET /owner/agencies/:agencyId` *(extended)* | OWNER | own id only | adds `review: { status, version, latestReview: { action, reason?, decidedAt } }, canResubmit, canEdit` |
| `POST /owner/review-resubmissions` | OWNER | `{ expectedReviewVersion }` | `200 { review: … }` |

**Validation:**
- `reason`: string, trimmed, 10–1000 characters, plain text. Required for `REQUEST_CHANGES`, `REJECT` and reopen. Sending `reason` with `APPROVE` → `422`.
- `decision` outside the three values → `422`. Unknown fields → `422` (strict schemas, as in Phase 1).

**New error codes:** `REVIEW_CONFLICT` 409 (stale version) · `INVALID_TRANSITION` 409 (action not allowed from current status). Existing: `VALIDATION_ERROR` 422, `NOT_FOUND` 404, `AUTH_REQUIRED` 401, `FORBIDDEN`/`ORIGIN_REJECTED`/`CSRF_REJECTED` 403, `AUTH_UNAVAILABLE` 503.

**BFF allow-lists:** the Super Admin facade adds the four Super Admin routes; the owner facade adds `POST /owner/review-resubmissions`. Everything else stays 404.

## 6. Screens

**Super Admin (`super-admin/`)**
- **Dashboard (`/`, after sign-in):** Pending queue first; a count, then rows on desktop / cards on mobile, each with one **Review** button. Small secondary counts for other statuses. Empty state: "No agencies are waiting for review." No analytics (D-064).
- **Agency Review (`/agencies/[agencyId]`):** one page (D-065):
  - agency and owner summary;
  - separate badges for **Review status** and **Website** ("Not ready — website builder comes later");
  - disabled **Private preview** with "Available after the website builder";
  - a separate decision area with Approve / Request Changes / Reject; Reopen when Rejected;
  - the history list.
- **Dialogs/sheets (D-066):**
  - each action has its own confirmation;
  - Request Changes, Reject and Reopen have a reason box with a live character count (10–1000);
  - Approve's text says approval does **not** publish the website;
  - Cancel changes nothing;
  - the status only updates after the server confirms;
  - on 409 the page reloads the latest state with a short message.

**Agency Admin (`admin/`)** — after sign-in, a status card:
- **Pending:** "Your agency is waiting for review."
- **Changes Requested:** the reason, plus a **Resubmit for Review** button with a confirmation.
- **Approved:** "Approved. Your website is not live yet — the website builder is coming next."
- **Rejected:** the reason, read-only, plus "Contact EstateOS support."

All screens: plain English, responsive with Tailwind standard breakpoints (D-109), keyboard and screen-reader accessible dialogs, visible focus, aiming at WCAG 2.2 AA (D-110).

## 7. Acceptance tests (D-093)

**Unit:**
- the full transition table (every allowed and every rejected from/action pair);
- `ownerCanEdit` for all statuses;
- reason validation edges: 9, 10, 1000, 1001 characters, whitespace-only.

**API integration (in-memory MongoDB replica set, synthetic data D-116):**
1. Super Admin Approve, Request Changes and Reject from `PENDING` succeed and each writes exactly one audit entry with actor, from/to status and reason.
2. Missing, short or long reason → 422 with no state change and no audit entry; a reason on Approve → 422.
3. A second Approve on an `APPROVED` agency → 409 `INVALID_TRANSITION`; a stale `expectedReviewVersion` → 409 `REVIEW_CONFLICT`.
4. Two parallel decisions on the same agency: exactly one succeeds.
5. Owner Resubmit works only from `CHANGES_REQUESTED`, then moves the agency to `PENDING`; it cannot affect another agency; an injected `agencyId` → 422.
6. Reopen works only from `REJECTED` and requires a reason.
7. An owner session on any Super Admin route is rejected; Super Admin routes reject missing CSRF and foreign Origin.
8. The queue returns only `PENDING`, oldest first, paginated; detail of an unknown id → 404.
9. When the audit write fails inside the transaction, the status stays unchanged.
10. The migration CLI is idempotent.
11. The owner agency response shows the correct `review`, `canResubmit` and `canEdit`.

**BFF:** new routes allowed only on their own portal; cross-portal → 404.

**Gates:** root typecheck, lint, build for all 4 apps, and `npm test -w backend` all pass with recorded results. Manual check through `https://control.estateos.localhost` and `https://admin.estateos.localhost`.

## 8. Owner confirmations (approved 2026-10-21)

- The contract is approved as written.
- A Super Admin cannot act while an agency is `CHANGES_REQUESTED`; it waits for the owner.
- A Reopen needs a reason (10–1000 characters).
- Resubmit is allowed even though owners cannot edit anything until Phase 3.
