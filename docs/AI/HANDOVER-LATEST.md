# EstateOS — Phase 3a Agency Admin shell and Agency Profile: implemented and verified by Claude (2026-10-21)

## Current task
- Contract: `docs/PHASE-3A-AGENCY-PROFILE-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 8 confirmations.
- The amendment to Phase 2a owner answer 4 is recorded in `docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md`.
- Git: branch `master`, Phase 3a committed as `1a1697b` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-044, D-045 (part), D-046, D-047, D-055, D-085 (Profile side), D-089, D-099, D-100, D-102, D-109, D-110, D-115.

## Work completed
- **Backend**
  - `models.ts`: Agency adds `publicContact` ({showMobile, showWhatsapp}, both false by default), `profile` (description, officeAddress, city, serviceAreas, publicEmail), `profileVersion` and `profileUpdatedAt`.
  - `review.ts`: `ownerCanEdit` now covers Pending, Changes Requested and **Approved** while unrestricted.
  - `profile-routes.ts` (new):
    - `GET /owner/profile` and `PUT /owner/profile`;
    - the PUT saves the whole form in one transaction: Agency plus the owner's `User.name`, a version check, and `PROFILE_CONFLICT` / `PROFILE_READ_ONLY` / `AGENCY_DEACTIVATED`;
    - the agency comes from the session only.
  - `validation.ts`: `profileSchema` (strict; empty optional text is stored as absent; email is lower-cased).
  - The Super Admin detail adds `profile` and `publicContact`. The owner session adds `agency.name`.
  - The migration also backfills `profileVersion` and `publicContact`.
- **BFF (owner)**: `GET` and `PUT /owner/profile`; `PUT` method exported.
- **Agency Admin UI**
  - `components/AppShell.tsx`:
    - sidebar from `lg` (1024 px) up and a Menu button below it;
    - navigation lists only Overview and Agency profile;
    - an unsaved-changes guard context with a Save / Discard / Stay dialog on navigation and Sign out.
  - `components/Overview.tsx`: review status and website status shown separately, a Deactivated notice, one primary action to the Profile, and the review card.
  - `components/ProfileForm.tsx`:
    - one page with Essentials, "Shown on your website" checkboxes, a read-only login email and a collapsible More details section;
    - one Save profile button, field-level 422 errors, a 409 conflict message, a `beforeunload` prompt, and read-only mode.
  - New `lib/api.ts` and `lib/session.ts`. `/` shows the Overview when signed in; new `/profile` route.
- **Super Admin UI**: the agency page shows "Shown on website", city, address, areas served, public email and the description.

## Verification (Node v24.22.1)
- typecheck, lint and build (all 4 workspaces) → exit 0.
- `npm test -w backend` → **52/52** (new `test/profile.test.ts`, 11 tests; `bff.test.ts` +1).
  - The 2a unit test was updated for the amended `ownerCanEdit`.
  - The 2b migration test now expects 4 updates, because its legacy document also lacks the 3a fields.
- `migrate:review-axes` on Atlas dev: 4 updates, then 0.
- HTTPS end-to-end check with the synthetic test owner:
  - GET defaults; PUT saves (version 1, city and WhatsApp public);
  - stale PUT → `PROFILE_CONFLICT`; injected agencyId → 422;
  - the Super Admin detail shows the profile; owner → Super Admin route → 404;
  - the original values were restored; `/` and `/profile` → 200.
- Not verified: a visual click-through in Chrome or Edge, in particular the mobile menu and the Save / Discard / Stay dialog.

## Handoff
- Next: the Phase 3b contract (My Website hub, theme preset, Hero editor, image storage D-105/D-108, D-033 readiness, D-101 private preview, D-085 Profile → site-draft mapping, full D-045 checklist). It needs approval before any code.
- Preserve:
  - the profile is saved only as a whole form, with `expectedProfileVersion`;
  - public contact is private unless chosen;
  - the navigation lists only screens that are built.

---

# EstateOS — Phase 2b All Agencies directory and Block / Deactivate: implemented and verified by Claude (2026-10-21)

## Current task
- Contract: `docs/PHASE-2B-DIRECTORY-RESTRICTIONS-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 9 confirmations.
- Git: branch `master`, Phase 2b committed as `002b095` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-070, D-071, D-072, D-073, D-074, D-081, D-083, D-089, D-092, D-102, D-115.

## Work completed
- **Backend**
  - `models.ts`: `restrictionStatus` is now NONE/BLOCKED/DEACTIVATED; adds `restrictionVersion`, `latestRestriction` and the directory indexes. The audit gets an `axis` field (REVIEW/RESTRICTION) and the `RESTRICT_*` actions.
  - `restriction.ts` (new): transition table, views, and `applyRestrictionTransition`, which in one transaction does the version/state check, the conditional update, owner session revocation on Block, and the audit entry.
  - `review.ts`: any review transition on a restricted agency → 409 `AGENCY_RESTRICTED`; the conditional update also requires `restrictionStatus: NONE`.
  - `auth.ts`:
    - owner login on a Blocked agency → 403 `AGENCY_BLOCKED`, only after a correct password;
    - `currentSession` treats a Blocked agency as signed out (401, defence in depth);
    - `requireOwnerWritable` → 403 `AGENCY_DEACTIVATED`;
    - the owner session and agency responses include the restriction.
  - `review-routes.ts`: `GET /super-admin/agencies` (regex-escaped search over agency name and owner email; filters; newest-first cursor), detail `restriction` plus history `axis`, `POST …/restrictions`, and the Resubmit write guard.
  - `validation.ts`: `restrictionSchema` and `directoryQuerySchema`.
  - The migration CLI also sets `restrictionVersion` and the audit `axis`.
- **BFF**: the Super Admin allow-list adds the list and restrictions routes.
- **Super Admin UI**
  - Header navigation: Review queue first, then All agencies.
  - New `/agencies` directory: filters kept in the URL, desktop rows and mobile cards, View / Manage.
  - The agency page has an **Account status** panel with Deactivate, Block and Restore dialogs. While restricted, the decision area shows "Restore first". The history labels both axes.
- **Agency Admin UI**: Deactivated card with the reason, Resubmit hidden. When a session ends (Block), the page returns to sign-in with a notice. The Blocked sign-in message comes from the API.

## Verification (Node v24.22.1)
- typecheck, lint and build (all 4 workspaces) → exit 0.
- `npm test -w backend` → **40/40** (new `test/restriction.test.ts`, 13 tests; `bff.test.ts` +1).
- Test fix: both migration tests now spawn the CLI asynchronously. `spawnSync` blocked the test process, so the in-memory mongod's piped log filled up and it stalled (30 s timeout).
- `migrate:review-axes` on Atlas dev: 5 updates, then 0.
- HTTPS end-to-end check with the synthetic test owner:
  - directory search;
  - Deactivate: the owner sees the reason; Resubmit → `AGENCY_DEACTIVATED`; a decision → `AGENCY_RESTRICTED`;
  - Restore, then Block: the old cookie → 401; login → `AGENCY_BLOCKED`;
  - Restore again: login → 200;
  - owner → directory → 404.
  - The test agency ends **PENDING / NONE**. The owner's own registered agency was not touched.
- Not verified: a visual click-through of the new screens in Chrome or Edge.

## Handoff
- Contract clarification: section 8 test 6 says a Block racing an Approve leads to "exactly one succeeds". Block is valid on an approved agency, so both can succeed when the Approve lands first. The test asserts the real invariant instead: an approval is never recorded after a Block.
- Not in 2b: public-site suppression pages and cache (Phase 4, D-083); notifications; bulk actions.
- Preserve: restriction mutations need `expectedRestrictionVersion`; Block plus session revocation plus audit stay in one transaction; search input is always regex-escaped.

---

# EstateOS — Phase 2a Super Admin review lifecycle: implemented and verified by Claude (2026-10-21)

## Current task
- Contract: `docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md`. The owner approved it in chat on 2026-10-21, including the section 8 confirmations.
- Git: branch `master`, Phase 2a committed as `430e8d8` and pushed to `origin/master` on the owner's instruction.
- Decisions: D-022, D-064–D-069, D-072, D-073, D-092, D-102, D-115.

## Work completed
- **Backend**
  - `models.ts`: Agency adds `reviewVersion`, `submittedForReviewAt`, `latestReview`, `restrictionStatus` (NONE only) and `publicationStatus` (NEVER_PUBLISHED only), plus the queue index. New append-only `AgencyAudit` model; update/delete hooks throw `AUDIT_APPEND_ONLY`.
  - `review.ts`: transition table, `ownerCanEdit`, owner/review views, and `applyReviewTransition`, which checks the version and transition, does a conditional update and writes the audit in one transaction. Returns 409 `REVIEW_CONFLICT` or `INVALID_TRANSITION`.
  - `review-routes.ts`: `GET /super-admin/review-queue` (cursor pagination, counts), `GET /super-admin/agencies/:id`, `POST …/review-decisions`, `POST …/reopen`, `POST /owner/review-resubmissions`.
  - `auth.ts`: exports helpers and `apiGuard`, and the owner agency read includes the review view.
  - `validation.ts`: reasons are trimmed, 10–1000 characters, and APPROVE takes no reason.
  - `tenant.ts`: adds `superAdminScope`.
  - Migration CLI `npm run migrate:review-axes -w backend` (idempotent).
- **BFF**: allow-lists in both `app/api/v1/[...path]/route.ts`; cross-portal routes return 404.
- **Super Admin UI**: queue-first home (`components/ReviewQueue.tsx`); one-page `agencies/[agencyId]` review with review status and website readiness shown separately, a disabled private-preview placeholder, a decision area and history; `DecisionDialog.tsx` (desktop dialog, mobile bottom sheet, reason counter). A 409 shows a notice and reloads.
- **Agency Admin UI**: `components/ReviewStatusCard.tsx` shows a truthful status and the latest reason. Resubmit with confirmation appears only for Changes Requested.

## Verification (Node v24.22.1)
- `npm run typecheck`, `npm run lint` and `npm run build` (all 4 workspaces) → exit 0.
- `npm test -w backend` → **26/26** (new: `test/review.test.ts`, 13 tests; `bff.test.ts` +1). Covers:
  - the transition table, reason edges (9/10/1000/1001/whitespace), and one audit entry per decision;
  - 422 with no audit for bad reasons; 409 for an invalid transition and a stale version; parallel decisions where exactly one succeeds;
  - owner resubmit rules, and injected agencyId in the body or header → 422;
  - reopen requires a reason; owner sessions are rejected on Super Admin routes; CSRF and foreign Origin → 403;
  - queue order and pagination; unknown agency → 404;
  - a failed audit write rolls back the status change; audit update/delete are rejected;
  - the migration backfill is idempotent.
- `migrate:review-axes` on the Atlas dev DB: 4 field updates, then 0 on a re-run.
- HTTPS end-to-end check through Caddy with real cookies, using the synthetic test owner:
  - Super Admin login; the test agency appears in the queue; detail shows PENDING and NOT_READY;
  - a short reason → 422; Request Changes → 200; a stale repeat → `REVIEW_CONFLICT`;
  - the owner sees the reason and `canResubmit`; owner → Super Admin route → 404;
  - Resubmit → PENDING.
  - The dev agency is back in **PENDING**, with 2 audit entries.
- Not verified: a visual click-through in Chrome or Edge (the in-app browser refuses `*.localhost`).

## Handoff
- Not in Phase 2a: Block/Deactivate and the effects of Blocked/Deactivated sessions (Phase 2b), real website readiness, private preview, publishing, the All Agencies directory, notifications.
- Open: the audit `requestId` is a per-call UUID, not yet a request-wide correlation ID. Queue counts use a full aggregate (fine at pilot scale).
- Preserve: `reviewVersion` must be supplied on every mutation; audit and status change always happen in one transaction; agencyId never comes from a request.

---

# EstateOS — Local dev environment working (Claude, 2026-10-21)

- MongoDB Atlas free cluster `estateos-dev` (project `EstateOS`, Mumbai), app user `estateos_app`. Secrets only in gitignored `backend/.env`, `admin/.env.local`, `super-admin/.env.local`.
- First Super Admin bootstrapped via the CLI; dev password in gitignored `backend/.env.superadmin-dev.local`. A synthetic test owner and Pending agency exist (`backend/.env.testowner-dev.local`, gitignored).
- Local HTTPS through Caddy (`npm run proxy`, `dev/https/Caddyfile`; Caddy root CA trusted in the Windows CurrentUser store). Dev hosts were switched from `*.estateos.test` to `https://admin.estateos.localhost` and `https://control.estateos.localhost`, because hosts-file edits failed and browsers resolve `*.localhost` themselves. Code defaults, tests, env files and docs were updated. Guide: `docs/LOCAL-DEV-SETUP.md`.
- Verified through the proxy with real cookies: owner signup 201 Pending; login 200 setting `__Host-estateos_owner` (Secure, HttpOnly, SameSite=Lax, no Domain; token not in JSON); session shows the owner and a PENDING agency; foreign-Origin logout 403; cookies not accepted on the other portal (401); BFF blocks cross-portal routes (404); logout 204, then 401. The same checks pass for the Super Admin portal.
- Not verified: a visual click-through in a desktop browser. The Claude Code in-app browser refuses `*.estateos.localhost`; the owner should open both URLs in Chrome or Edge.
- Setup changes (Caddyfile, `proxy` script, `allowedDevOrigins`, loopback-only admin dev servers, `.localhost` hosts, docs) are uncommitted.

---

# EstateOS — Phase 1 auth & tenant foundation: implemented by Codex, verified by Claude (2026-10-21)

## Current task
- Agent: Codex implemented Prompt #02 (Phase 1 auth + tenant foundation); Claude Code reviewed, re-ran checks and applied small fixes at the owner's request.
- Git: branch `master`, base commit `d34b57a`. **All Phase 1 work is UNCOMMITTED.** Nothing pushed (`origin/master` is still `3fe80da`).
- Decisions followed: D-028, D-072, D-074, D-076, D-081, D-088, D-089, D-093, D-095–D-098, D-111, D-115.
- **Contract:** the owner approved the Phase 1 contract in chat on 2026-10-21. The original Prompt #01 text was never saved, so Claude wrote the as-built version from the verified code: `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md` (D-115).

## Work completed
- Backend (`backend/src/`): `models.ts` (Agency PENDING, User, AuthSession, AuthRateLimit, AuthAudit); `auth.ts` (signup, owner/Super Admin login, session, logout, owner agency read, support-reset completion); `security.ts` (argon2id, zxcvbn, CSRF HMAC); `tenant.ts` (server-derived agency scope); `validation.ts` (zod, six signup fields); CLIs `cli/bootstrap-super-admin.ts` and `cli/issue-reset.ts`. The backend binds to 127.0.0.1 and accepts only callers holding `INTERNAL_API_KEY`; `cors` was removed.
- BFF: `admin/app/api/v1/[...path]/route.ts` and `super-admin/.../route.ts` (route allow-list, exact Origin check, `__Host-` HttpOnly Secure host-only cookies, session token never sent to the browser).
- UI: simple sign-in / register / reset-code screens in `admin/app/page.tsx` and `super-admin/app/page.tsx`. No dashboards or review actions.
- Tests: `backend/test/auth.test.ts`, `backend/test/bff.test.ts`. Runtime notes: `docs/AI/PHASE-1-RUNTIME.md`.
- Claude fixes: login now verifies a throwaway hash for unknown emails, so timing does not reveal which emails are registered (`auth.ts`); a listen failure now exits with an error instead of logging success (`server.ts`); auth screens show the backend's field-level validation message instead of only "Invalid request" (both `page.tsx`); removed the legacy root `apps/.gitkeep` and `packages/.gitkeep` that the v5.9 doc merge had recreated.

## Verification (Claude, Node v24.14.0 from Codex's bundled runtime; system default is v22.0.0, below `engines`)
- `npm run typecheck` (all 4) → exit 0. `npm run lint` (all 4) → exit 0. `npm run build` (all 4) → exit 0; rebuilt admin, super-admin and backend after the fixes → exit 0.
- `npm test -w backend` → **12/12 pass**: health without DB, direct-call rejection, Pending signup, CSRF and foreign-Origin rejection, normalized duplicate email (409), cross-tenant 404, agencyId injected via query/header/body (422), cross-portal tokens (401), logout revocation, idle and absolute expiry, reset revoking sessions plus replay rejection, login throttling (429), one-time audited bootstrap, BFF cookie flags, and cross-portal routes.
- Not run: a browser end-to-end test over the HTTPS `*.estateos.localhost` proxy, and a real MongoDB replica set (tests use mongodb-memory-server). Diff reviewed: no `.env` files or secrets.

## Handoff
- Open items, not blocking local development:
  - Login throttling is per email+IP and per IP, with no per-account cap across many IPs.
  - Both facades share one `INTERNAL_API_KEY`; separate keys per portal would be stronger.
  - The CLIs run through `tsx` (a devDependency), so production operators need dev dependencies installed.
  - Install Node ≥22.13 (or 24 LTS) as the system default.
- Next: the owner reviews the diff and saves the approved contract file, then makes a local commit. After that, the Phase 2 contract (Super Admin review lifecycle, D-064–D-073, D-092, D-102) needs approval under D-115 before any code. Do not start Approve/Reject.
- Preserve: ports 4000–4003, the `__Host-` cookie names, the loopback-only backend, and the rule that agencyId never comes from a request.

---

# EstateOS — AI HANDOVER LATEST (v5.9 · 2026-10-21)

## Latest approved work

The owner approved **32 D-088–D-119 Option A** product/architecture policies in one turn. The v5.9 planning ZIP was generated from the complete v5.8 ZIP. Canonical individual docs, a new confirmed map, decisions, open questions and concise AI rule entry points were updated. **No application code or current developer Git repository was modified here.**

## Read first

1. Root `AGENTS.md` and agent-specific `CLAUDE.md` or Cursor rule.
2. `docs/PLANNING-INDEX-LOCKED-v5.9.md`; `docs/DECISIONS.md`; `docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md`.
3. `docs/AI/CURRENT-STATE.md`; `docs/OPEN-QUESTIONS.md`.
4. Applicable canonical specs, especially D-088/D-089/D-095–D-098/D-115 before any auth milestone.

## Safeguards

- Keep D-028 immediate Pending manual review, D-029 first auto-Live approval + readiness/opt-in public contact and zero properties, D-053/D-063 post-Live explicit Publish Updates.
- No tenant data query may rely on user-supplied agencyId; use authenticated server scope.
- Public subdomains must not receive privileged admin cookies. Localhost PORTS alone are not cookie boundaries.
- Original proposal letters for D-088–D-094 differ: current owner selected final batch Option A supersedes proposals, not prior CONFIRMED decisions.
- D-113 free curated pilot does not disable D-028 self-service registration.

## Next agent operational requirements

- Inspect real project Git status, Node version, lint/build/tests and existing Codex/Claude skill configuration; don't assume planning archive is the code repo.
- Before writing Phase 1 business logic, produce concrete auth/tenant/security/schema/API/negative-test contract for owner approval as required by D-115.
- No reinitializing Git, installing global packages, pushing remotes, deleting existing code or rewriting live secrets without explicit authorization.
- At end of each task update concise CURRENT-STATE and HANDOVER-LATEST with files changed, checks actually run, blockers and next requested scope.

## Historical context

Verbatim older v5.8 handover: `docs/AI/HISTORY-v5.8-docs-AI-HANDOVER-LATEST.md`. User had separately provided Claude's read-only review; that report is evidence of static repo inspection, not fresh verification in this planning bundle.
