# EstateOS — Phase 6a Super Admin-Created Agency with One-Time Owner Invitation Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 6 (D-115). Drafted by Claude Code the same day.
**Builds on:** Phase 1 (auth, sessions, CSRF, support reset code), Phase 2a/2b (review queue, directory, audit), Phase 3a (agency profile).
**Decisions implemented:** D-028 (Super Admin agency creation, lean Pending, no KYC or email verification gate), D-072, D-088, D-089, D-092, D-097, D-098, D-111, D-113 (curated pilot), D-115, D-116, **D-118** (one-time invitation; the owner chooses their own password).

## 0. Why this phase

D-028 has two ways in: self-registration (built in Phase 1) and **Super Admin creates the agency**. The second path does not exist yet. For a curated pilot (D-113) the operator will often set agencies up personally. D-118 forbids a shared or admin-chosen password, so the owner must claim the account through a **one-time link** and set their own password.

This phase needs no external account: there is no email provider yet, so the Super Admin copies the link and sends it to the owner personally (for example on WhatsApp), the same way the support reset code is delivered today.

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | What does the Super Admin enter? | The five lean signup fields without a password: **agency name, owner name, mobile, WhatsApp, owner email**. The same validation as self-registration (D-097). |
| 2 | Which review state does the agency start in? | **Pending**, like self-registration (D-028). It is reviewed with the normal Approve, Request changes and Reject actions. Nothing is skipped. |
| 3 | How is the invitation delivered? | **Shown once to the Super Admin as a link to copy**; the Super Admin sends it to the owner personally. No email or SMS in this phase. The token is in the link's `#fragment`, so it never reaches server logs or `Referer` headers. |
| 4 | How long is a link valid? | **72 hours**, single use. The Super Admin can **issue a new link**, which cancels the previous one. |
| 5 | What can the owner do before claiming? | **Nothing.** The account is `INVITED`: it cannot sign in, and the support reset code does not apply to it. |
| 6 | What happens on claim? | The owner opens the link, sees the agency name and their email, chooses a password (the Phase 1 password rules) and is then asked to sign in normally. The link stops working. |
| 7 | Duplicate email? | Refused at creation with 409 `EMAIL_EXISTS` (one email = one account, as in Phase 1). |
| 8 | Restricted agencies? | A new link cannot be issued while the agency is **Deactivated**. A **Blocked** agency's owner may claim, but sign-in then shows the Phase 2b blocked message. |
| 9 | Is it audited? | **Yes.** `AgencyAudit` gets `AGENCY_CREATED_BY_ADMIN`, `INVITATION_ISSUED` (each new link) and `INVITATION_CLAIMED`. The token itself is never stored or logged; only its digest is stored. |

## 2. Data model

- `Agency.origin`: `SELF_SIGNUP` (default; also for every existing agency) or `ADMIN_CREATED`.
- `User.accountState`: `ACTIVE` or **`INVITED`**. An `INVITED` user has no `passwordHash` (the field becomes optional only for that state).
- `User.inviteTokenDigest` and `User.inviteExpiresAt` (hidden by default, like the reset fields); removed on claim.
- `AgencyAudit.axis` adds `ACCOUNT`, with the three actions in section 1 Q9 (append-only as today).

## 3. Versioned REST API — additions

| Method and path | Who | Result |
|---|---|---|
| `POST /api/v1/super-admin/agencies` | Super Admin (CSRF) | Body: the five fields in section 1 Q1. Creates the Pending agency, the `INVITED` owner and a link in one transaction. Returns `201` with the agency id and **`invitation.url` and `expiresAt` once**. `409 EMAIL_EXISTS`; `422` field errors. Rate limit: 30 per hour per Super Admin. |
| `POST /api/v1/super-admin/agencies/:agencyId/invitations` | Super Admin (CSRF) | Issues a new link and cancels the old one. Returns the URL once. `409 ALREADY_CLAIMED` if the owner is already active; `409 AGENCY_DEACTIVATED`. |
| `POST /api/v1/auth/invitations/preview` | Owner portal (pre-auth CSRF) | Body `{ invitationCode }`. Returns `{ agencyName, email }` for a valid, unexpired, unused code; otherwise one generic `400 INVALID_INVITATION`. Rate limited per IP and per code (like the reset code). |
| `POST /api/v1/auth/invitations/claim` | Owner portal (pre-auth CSRF) | Body `{ invitationCode, newPassword }`. Sets the password, makes the account `ACTIVE` and uses up the code in one transaction. `204`; `400 INVALID_INVITATION`; `422` weak password. |

- The Super Admin agency detail and directory views add `origin` and `owner.accountState`, plus `invitationExpiresAt` while invited. The URL is never returned again after the response that created it.
- The BFF allow-lists add these four routes (Super Admin facade: the first two; owner facade: the last two).

## 4. Screens

- **Super Admin → Agencies:** a **Create agency** button opens a form with the five fields. After saving, a panel shows the link with **Copy link**, the expiry time and the note "Send this link to the owner yourself. It is shown only once."
- **Super Admin → agency detail:** "Created by EstateOS" and the owner state: "Invitation sent, expires …", "Invitation expired" or "Owner active". **Issue a new link** is shown while the owner is invited.
- **Agency Admin → `/invite`:** reads the code from the `#fragment`, shows the agency name and email, and asks for a new password twice. On success: "Your account is ready. Sign in with <email>." An invalid or expired link shows: "This link is invalid or has expired. Ask EstateOS support for a new one."

## 5. Acceptance tests (D-093)

**Unit:** the invitation code is random and only its digest is stored; expiry is 72 hours.

**API integration:**
1. Super Admin creates an agency → Pending, `origin` ADMIN_CREATED, owner INVITED, link returned once, audit entries written. Duplicate email → 409. Owner portal and anonymous callers → 401/403.
2. The invited owner cannot sign in (generic 401) and cannot use the reset-code path.
3. Preview and claim with a valid code → 204; then normal sign-in works; the code cannot be used again (400); the claim is audited.
4. An expired code and a replaced (old) code → the same generic 400; the rate limit applies.
5. A new link while active → 409; while Deactivated → 409.
6. The created agency follows the normal review path (Approve with readiness still controls First Live).

**BFF:** the four routes are allowed; the fragment is never sent to the server.

**Gates:** typecheck, lint and build, plus `npm test -w backend`; an HTTPS end-to-end check with a synthetic agency (create → copy link → claim → sign in → approve).

## 6. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- The link is shown once and delivered personally by the Super Admin (no email or SMS in this phase).
- Links last 72 hours, are single use, and a new link cancels the old one.
- An admin-created agency still starts Pending and goes through normal review.
