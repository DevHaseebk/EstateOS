# EstateOS — Phase 2b All Agencies Directory and Block / Deactivate Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-21, as written, including the confirmations in section 9 (D-115). Drafted by Claude Code the same day.
**Builds on:** `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md` (sessions, BFF, CSRF/Origin, tenant scope, errors) and `docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md` (state axes, audit, versioning).
**Decisions implemented:** D-070, D-071, D-072, D-073, D-074, D-081, D-083, D-089, D-092, D-093, D-102, D-109, D-110, D-111, D-115.

## 0. Already decided (Phase 2a owner answer 1)

- **Blocked:** the owner cannot sign in, and all existing owner sessions are revoked at once.
- **Deactivated:** the owner can sign in, but everything is read-only, with a clear notice.
- Both keep the public website non-public (D-083). No public website exists yet (Phase 4), so in 2b this is a rule to record and test later, not a page to build.

## 1. Owner answers this contract is based on (approved 2026-10-21)

D-070, D-071 and D-083 left these open. The recommended answer is written into the contract below.

| # | Question | Recommended answer |
|---|---|---|
| 1 | Which agencies can be Blocked or Deactivated? | Any agency, whatever its review status (Pending, Changes Requested, Approved, Rejected). |
| 2 | Can an agency be Blocked **and** Deactivated, or switch directly? | No. One restriction at a time. To switch, Restore first, then apply the other one. |
| 3 | Can review decisions happen while restricted? | No. Approve / Request Changes / Reject / Reopen and owner Resubmit are refused until Restore. |
| 4 | Is a reason required? | Yes, for Block, Deactivate **and** Restore: 10–1000 characters, same rule as Phase 2a. |
| 5 | Does the owner see the reason? | Deactivated: yes, on their status card. Blocked: no. The sign-in screen shows only "This agency account is blocked. Contact EstateOS support." |
| 6 | What does Restore do? | Sets the restriction back to None. Review status is unchanged. Blocked owners must sign in again, because their sessions were revoked. |
| 7 | What can the directory search? | Agency name (contains) and owner email (contains), case-insensitive. At least 2 characters. |
| 8 | What can the directory filter and sort by? | Filters: review status and account restriction. Sort: newest registered first. "Show more" pagination. |

## 2. Scope

**In scope (2b):**
- **All Agencies directory** (D-070): searchable, filterable list; desktop rows, mobile cards; one **View / Manage** link per agency. The review queue stays the primary dashboard (D-064); All Agencies is a secondary link in the header.
- **Block, Deactivate, Restore** (D-071) on the existing agency page, each with its own confirmation dialog and a required reason.
- Owner effects:
  - **Blocked:** login refused and sessions revoked.
  - **Deactivated:** read-only access and a notice.
- Every restriction action written to the append-only audit history (D-073, D-092).

**Out of scope (later):**
- Public website suppression pages and cache/SEO handling (Phase 4, D-083). Restore will re-check eligibility in Phase 4; it never makes a site public by itself.
- Super Admin-created agencies and invitations (D-118).
- Notifications by email, SMS or WhatsApp.
- Agency profile editing, readiness and preview (Phase 3).
- Bulk actions, export, analytics.

## 3. State model (extends Phase 2a, D-102)

`restrictionStatus` gains two values: `NONE` (default), `BLOCKED`, `DEACTIVATED`.

| From | Action | Actor | Reason | To |
|---|---|---|---|---|
| `NONE` | Block | Super Admin | required | `BLOCKED` |
| `NONE` | Deactivate | Super Admin | required | `DEACTIVATED` |
| `BLOCKED` | Restore | Super Admin | required | `NONE` |
| `DEACTIVATED` | Restore | Super Admin | required | `NONE` |

- All other moves → `409 INVALID_TRANSITION` (e.g. Block while Deactivated, Restore while None).
- A new integer `restrictionVersion` (default 0) works exactly like `reviewVersion`. Every restriction mutation sends `expectedRestrictionVersion`; a mismatch → `409 RESTRICTION_CONFLICT`.
- **Review actions while restricted:** every review transition (Phase 2a) additionally requires `restrictionStatus = NONE` in the same conditional write. Otherwise → `409 AGENCY_RESTRICTED`. This also covers a Block that lands while a review decision is in flight: exactly one wins.
- `ownerCanEdit` already returns false when restricted (Phase 2a); no change.
- `publicationStatus` is not touched in 2b.

## 4. Owner session and access effects

| | Sign in | Existing sessions | Owner GET routes | Owner mutations (except sign out) |
|---|---|---|---|---|
| `NONE` | allowed | kept | allowed | allowed per review rules |
| `DEACTIVATED` | allowed | kept | allowed | `403 AGENCY_DEACTIVATED` |
| `BLOCKED` | `403 AGENCY_BLOCKED` (only after a correct password) | revoked in the Block transaction | `401` | `401` |

- **Block:** the restriction change, the audit entry and the revocation of every session of that agency's owner happen in **one transaction**. If any part fails, nothing changes.
- **Defence in depth:** every owner request already loads the session; it also loads the agency and treats `BLOCKED` as no session (`401`). A missed revocation can therefore never keep access.
- **Wrong password on a blocked account:** still `401 INVALID_CREDENTIALS` with the same timing as today. The blocked message appears only to someone who knows the password, so it reveals nothing about which emails exist.
- **Support password reset** (Phase 1 CLI) still works for a blocked owner, but sign-in stays refused until Restore.
- **Super Admin sessions** are never affected.

## 5. Data model changes

**`Agency`:**
- `restrictionStatus` enum widened to `NONE`, `BLOCKED`, `DEACTIVATED`.
- New `restrictionVersion` (integer, default 0).
- New `latestRestriction`: `{ action, reason, decidedAt, actorUserId }` or absent.
- New indexes:
  - `{ createdAt: -1, _id: -1 }` for the directory;
  - `{ reviewStatus: 1, createdAt: -1 }` and `{ restrictionStatus: 1, createdAt: -1 }` for filters.

**`AgencyAudit`:**
- New actions: `RESTRICT_BLOCK`, `RESTRICT_DEACTIVATE`, `RESTRICT_RESTORE`.
- New field `axis`: `REVIEW` or `RESTRICTION`, defaulting to `REVIEW`. For restriction entries, `fromStatus` and `toStatus` hold restriction values.
- Still append-only; still written in the same transaction as the change.

**Migration:** extend the idempotent CLI as `npm run migrate:review-axes -w backend` (same command). It sets `restrictionVersion: 0` where missing and `axis: 'REVIEW'` on old audit entries. The audit update runs through the native driver only inside this migration. Application code still has no update path. Running it twice changes nothing.

## 6. Versioned REST API — additions to `/api/v1`

Envelopes and errors as in Phase 1 and 2a.

| Method & path | Portal | Request | Success |
|---|---|---|---|
| `GET /super-admin/agencies?q=&review=&restriction=&limit=20&cursor=` | SUPER_ADMIN | `q` 2–100 chars (optional); `review` one of the 4 review values (optional); `restriction` one of the 3 values (optional); `limit` 1–50; opaque `cursor` | `200 { items: [{ id, agencyName, ownerName, ownerEmail, createdAt, reviewStatus, restrictionStatus, websiteReadiness: "NOT_READY", publicationStatus }], nextCursor }` newest first |
| `GET /super-admin/agencies/:agencyId` *(extended)* | SUPER_ADMIN | — | adds `restriction: { status, version, latestRestriction }`; history includes restriction entries with `axis` |
| `POST /super-admin/agencies/:agencyId/restrictions` | SUPER_ADMIN | `{ action: "BLOCK" \| "DEACTIVATE" \| "RESTORE", reason, expectedRestrictionVersion }` | `200 { restriction: { status, version, latestRestriction } }` |
| `GET /owner/agencies/:agencyId` *(extended)* | OWNER | own id | adds `restriction: { status, reason? }`; the reason is present only for `DEACTIVATED` |
| `POST /owner/sessions` *(changed)* | OWNER | unchanged | blocked agency → `403 AGENCY_BLOCKED` after password check |

**Search rules:**
- `q` is trimmed and regex-escaped (never raw regex). It matches agency name or owner email, case-insensitive, contains.
- Owner email matches are resolved by looking up matching owner users, then their agency ids. This is fine at pilot scale.

**New error codes:**

| Code | Status | Meaning |
|---|---|---|
| `RESTRICTION_CONFLICT` | 409 | stale version |
| `AGENCY_RESTRICTED` | 409 | review action while restricted |
| `AGENCY_BLOCKED` | 403 | owner sign-in |
| `AGENCY_DEACTIVATED` | 403 | owner mutation |

Existing codes such as `INVALID_TRANSITION` 409 and `VALIDATION_ERROR` 422 apply as before.

**BFF allow-list:** the Super Admin facade adds `GET /super-admin/agencies` (list) and `POST /super-admin/agencies/:id/restrictions`. The owner facade has no new routes.

## 7. Screens

**Super Admin**
- **Header:** two links, **Review queue** (first) and **All agencies**.
- **All agencies (`/agencies`):**
  - a search box, plus filters for review status and account restriction;
  - results as rows on desktop and cards on mobile, each showing agency name, owner name and email, registered date, and separate badges for **Review**, **Account** (only when restricted) and **Website: not ready**;
  - one **View / Manage** link per agency;
  - **Show more** pagination;
  - empty states for no agencies and no matches;
  - the search and filters are kept in the URL, so Back works.
- **Agency page (`/agencies/[agencyId]`)** gets a new **Account status** panel:
  - **None:** **Deactivate** and **Block** buttons, with short text explaining the difference.
  - **Restricted:** the status, the reason, the date, and a **Restore** button.
  - Each action has its own confirmation dialog (mobile bottom sheet) with a reason box and character count.
  - The Block dialog says the owner will be signed out immediately. Restore says it does not make the website public.
  - While restricted, the review decision area shows "Restore this agency before making review decisions" instead of buttons.
  - A 409 response reloads the page with a short message, as in 2a.

**Agency Admin**
- **Deactivated:** the status card shows "Your agency account is deactivated", the reason, and "Contact EstateOS support". Resubmit is hidden.
- **Blocked:** the sign-in form shows "This agency account is blocked. Contact EstateOS support." If the owner was already signed in, the next request returns 401 and the screen shows the sign-in form.

All screens: plain English, responsive (D-109), keyboard and screen-reader accessible, aiming at WCAG 2.2 AA (D-110).

## 8. Acceptance tests (D-093)

**Unit:**
- the restriction transition table (every allowed and rejected pair);
- reason edges;
- search escaping: `q` with regex characters matches literally.

**API integration (in-memory replica set, synthetic data D-116):**
1. Block, Deactivate and Restore each change the status and write exactly one audit entry with `axis: RESTRICTION`, actor, from/to and reason.
2. Missing or invalid reason → 422 with no change and no audit. Wrong starting state → 409 `INVALID_TRANSITION`. Stale version → 409 `RESTRICTION_CONFLICT`. Two parallel restriction actions → exactly one succeeds.
3. Block revokes every session of that owner in the same transaction. The old cookie → 401. Correct password → 403 `AGENCY_BLOCKED`. Wrong password → 401 `INVALID_CREDENTIALS`.
4. A blocked agency whose session was somehow not revoked still gets 401 (defence in depth).
5. Deactivated: sign-in works, GET works, Resubmit → 403 `AGENCY_DEACTIVATED`, and the owner view shows the reason with `canEdit: false`.
6. Review decisions and Reopen on a restricted agency → 409 `AGENCY_RESTRICTED`. A Block racing an Approve → exactly one succeeds.
7. Restore returns to None, review status is unchanged, and the owner can sign in again.
8. Directory: newest first; filters by review and restriction; search by name and email; pagination; invalid filter value → 422; owner session → rejected.
9. A failed audit or session-revocation write rolls back the whole restriction change.
10. The migration is still idempotent and sets `axis` on old audit entries.

**BFF:** new routes allowed only on the Super Admin portal; cross-portal → 404.

**Gates:**
- root typecheck, lint and build for all 4 apps, plus `npm test -w backend`, all pass;
- migration run on the Atlas dev DB;
- an HTTPS end-to-end check through `https://control.estateos.localhost` and `https://admin.estateos.localhost` using the synthetic test owner, leaving it unrestricted afterwards.

## 9. Owner confirmations (approved 2026-10-21)

The owner confirmed:

- Restore needs a reason (10–1000 characters), just like Block and Deactivate.
- A blocked owner never sees the Block reason in the app. A deactivated owner does.
- Review decisions are frozen while an agency is restricted.
- One restriction at a time: switching between Block and Deactivate needs a Restore first.
