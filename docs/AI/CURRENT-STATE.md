# EstateOS — AI CURRENT STATE (v5.9 · 2026-10-21)

## Product and policy

EstateOS is a lean Pakistan/Karachi real-estate agency SaaS, initial 2–3 agency pilot. One shared public template/3 themes; guided Agency Admin; manual Super Admin approval; optional property management. Internal CRM/billing deferred. **D-088–D-119 Option A all CONFIRMED as policy** with D-001–D-087 preserved. Consult `docs/DECISIONS.md` and `docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md`.

## Existing invariants

- Lean self-service/admin agency creation immediately Pending, no KYC/email verification gates; manual review with reasons (D-022/D-028).
- First website Live automatic after Super Admin approval + D-033 true readiness, public contact explicitly chosen D-099; no initial owner Publish button and zero properties allowed (D-029/D-084).
- Already-Live: saved section/theme/eligible property/Profile mapped changes are PRIVATE until Publish Updates atomically succeeds, old Live preserved on failure.
- Browser management uses separate host-scoped secure server sessions + same-origin facade, explicit CSRF/Origin; data isolated by server-derived agencyId. Actual contract pending.

## Development status

Owner reports Git initialized at monorepo root and pushed to remote. Previously Codex produced Phase 0 shell according to Claude read-only review; review reported four app folders, Node version mismatch, lack of runtime verification. User assigned Phase 0.5 & AI skills/rules prompts, completion not independently verified here. **Do not overwrite the user's actual code or handover.** No Phase 1 feature implementation has been authorized by this planning approval.

## Phase 0 architecture

Root npm workspaces only: `frontend/` 4000 (public), `admin/` 4001, `super-admin/` 4002, `backend/` 4003.

## Phase 1 status (2026-10-21, latest)

Phase 1 auth & tenant foundation was implemented by Codex and verified by Claude. Typecheck, lint and build pass for all 4 workspaces, and `npm test -w backend` passes 12/12, including the cross-tenant negative tests. The owner-approved D-115 contract is in `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md`. Committed and pushed (`cdec11c`; local HTTPS setup `a9bc10a`). See `docs/AI/HANDOVER-LATEST.md`. Super Admin review is now Phase 2a (below).

## Phase 2a status (2026-10-21)

The Phase 2a Super Admin review lifecycle contract is **APPROVED** (2026-10-21) and **implemented and verified by Claude**, committed `430e8d8` and pushed: `docs/PHASE-2A-REVIEW-CONTRACT-APPROVED.md`.

- Built: review state machine with optimistic `reviewVersion` and an append-only `AgencyAudit` written in the same transaction; Super Admin review queue, detail, decisions and reopen; owner status card with Resubmit; the BFF allow-list; and the migration CLI `npm run migrate:review-axes -w backend`, already run on the Atlas dev DB.
- Checks: typecheck, lint and build pass for all 4 workspaces; `npm test -w backend` passes 26/26; an HTTPS end-to-end round trip passed.
- Not built yet (Phase 2b and later): Block/Deactivate, website readiness, private preview, publishing, the agency directory. Local dev environment: see `docs/LOCAL-DEV-SETUP.md`.

## Phase 2b status (2026-10-21)

Phase 2b contract is **APPROVED** (2026-10-21) and **implemented and verified by Claude**, committed `002b095` and pushed: `docs/PHASE-2B-DIRECTORY-RESTRICTIONS-CONTRACT-APPROVED.md`.

- Built: All Agencies directory (search, filters, pagination); Block / Deactivate / Restore with reasons, an audit entry with `axis: RESTRICTION`, and versioning; Block revokes owner sessions in the same transaction; Deactivated owners are read-only; review decisions are frozen while restricted.
- Checks: typecheck, lint and build pass for all 4 workspaces; `npm test -w backend` passes 40/40; the migration ran on Atlas dev; the HTTPS end-to-end check passed.
- Font fix (Inter for both portals) committed `18e9c6f`.

## Phase 3a status (2026-10-21)

Phase 3 is split: 3a Agency Admin shell and Agency Profile; 3b My Website, theme, editor, images, readiness and preview; 4 first Live and public site; 5 Properties. The Phase 3a contract is **APPROVED** (2026-10-21) and **implemented and verified by Claude**, committed `1a1697b` and pushed: `docs/PHASE-3A-AGENCY-PROFILE-CONTRACT-APPROVED.md`. Phase 2a owner answer 4 was amended: Approved agencies can edit their profile.

- Checks: typecheck, lint and build pass for all 4 workspaces; `npm test -w backend` passes 52/52; the migration ran on Atlas dev; the HTTPS end-to-end check passed.

## Phase 3b status (2026-10-21)

The Phase 3b contract is **APPROVED** (2026-10-21) and **implemented and verified by Claude**, committed `b7cbbcc` and pushed: `docs/PHASE-3B-WEBSITE-FOUNDATION-CONTRACT-APPROVED.md`.

- Built: the `WebsiteDraft`; My Website hub, Theme Apply, and the Guided Editor for Header, Hero and Contact (Footer is read-only); D-033 readiness; owner and Super Admin private preview; the D-045 checklist; Profile values mapped into the draft.
- New library workspace `site-template/`, holding the shared template and the licensed Hero photo list.
- Checks: typecheck, lint and build pass for all 5 workspaces; `npm test -w backend` passes 66/66; the HTTPS end-to-end check passed.
- **Owner action:** supply the licensed default Hero photos (`site-template/assets/LICENSES.md`). Until then no site can be READY.

## Phase 3c status (2026-10-21)

The Phase 3c contract is **APPROVED** (2026-10-21) and **implemented and verified by Claude**, committed `c006a66` and pushed: `docs/PHASE-3C-OPTIONAL-SECTIONS-CONTRACT-APPROVED.md`.

- Built: About, Services, Why Choose Us and Team (all hidden until they have content); a separate Layout save for show/hide and order; card editors; 12 icons; consent required for team numbers.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 76/76; server-render checks pass; the HTTPS end-to-end check passed.

## Phase 4a status (2026-10-22)

Phase 4 is split: 4a automatic first Live and public site; 4b Publish Updates. The Phase 4a contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `190b325` and pushed: `docs/PHASE-4A-FIRST-LIVE-CONTRACT-APPROVED.md`.

- Built: idempotent first activation (triggers plus a 5-minute reconciler and CLI); slug fixed at first Live; append-only `PublishedRevision`; the PUBLIC portal and key; `frontend/` serves `<slug>.sites.estateos.localhost`; one identical 404 for unknown, Not Live, Blocked and Deactivated sites; truthful status and links in both portals.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 89/89; the HTTPS end-to-end check passed.
- One synthetic agency (`e2e-synthetic-homes-1792610312`) is Live in the dev DB, as approved.

## Phase 4b status (2026-10-22)

The Phase 4b contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `b12d832` and pushed: `docs/PHASE-4B-PUBLISH-UPDATES-CONTRACT-APPROVED.md`.

- Built: owner Publish updates (whole saved draft becomes revision n+1, compare-and-swap pointer, idempotent request id, truthful 503); an `unpublishedChanges` content fingerprint; hub badge, confirmation dialog and Try again; post-Live notes; Super Admin revision info.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 99/99; the HTTPS end-to-end check passed on the synthetic Live agency (now revision 2).

## Phase 5a status (2026-10-22)

The Phase 5a contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `200bf0b` and pushed: `docs/PHASE-5A-PROPERTIES-CONTRACT-APPROVED.md`.

- Built: Property records (CRUD, availability rule, Archive/Restore, 200 active limit); the eligible list goes into revisions; a public Properties section with Enquire; Agency Admin list/form; Super Admin read-only list.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 111/111; server-render checks pass.
- The HTTPS end-to-end check passed after the owner added the new IP in Atlas Network Access (properties published; Sold removed after publish).

## Phase 3d status (2026-10-22)

The Phase 3d contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `ca6cc42` and pushed: `docs/PHASE-3D-PHOTO-UPLOADS-CONTRACT-APPROVED.md`.

- Built: the storage interface with a local-disk driver (`backend/.media-dev/`, gitignored); `sharp` processing to WebP 480/960/1600 with metadata stripped and private originals; staged uploads attached on save and expired after 24 hours; Hero upload (satisfies readiness), logo, and the property gallery; public images only from the current Live revision.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 123/123; the HTTPS end-to-end check passed with a real uploaded Hero, **with no fixture**.
- Owner-supplied licensed defaults are now optional: agencies can go Live with their own photo.

## Phase 3e status (2026-10-22)

The Phase 3e contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `a7e5cac` and pushed: `docs/PHASE-3E-ABOUT-TEAM-PHOTOS-CONTRACT-APPROVED.md`.

- Built: media purposes ABOUT (at least 800×500) and TEAM (at least 300×300) on the 3d pipeline; an optional About photo; an optional photo per team member that needs the "agreed to show their photo" tick; photos are public only after Publish and only while their section is shown.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 129/129; the HTTPS end-to-end check on the 3d synthetic agency passed.
- Readiness is unchanged (D-033); without photos the sections render as in 3c.

## Phase 6a status (2026-10-22)

The Phase 6a contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `f5bcb01` and pushed: `docs/PHASE-6A-ADMIN-CREATED-AGENCY-INVITATION-CONTRACT-APPROVED.md`.

- Built: Super Admin **Create agency** (Pending, `origin` ADMIN_CREATED, owner `INVITED` with no password); a single-use 72-hour invitation link (code in the `#fragment`, only its digest stored), shown once; **Issue a new link** cancels the old one; the owner `/invite` page (preview, choose a password, then normal sign-in); everything audited on a new `ACCOUNT` audit axis.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 137/137; the HTTPS end-to-end check (create → claim → sign in → approve) passed.
- An invited account can neither sign in nor use a support reset code (the reset CLI and redeem route now require an ACTIVE account).

## Phase 6b status (2026-10-22)

A Codex review of Phases 0–6a was checked against the code. The resulting Phase 6b pilot-fixes contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `153aeb8` and pushed: `docs/PHASE-6B-PILOT-FIXES-CONTRACT-APPROVED.md`.

- Fixed: public images `public, max-age=300` (was one year immutable); revisions hold only the shown properties (newest `displayCount`, none while hidden) and only their photos are public; 30 failed sign-ins per account per 15 minutes across IPs; the upload error names all five purposes; truthful Overview action, review cards, editor intro, Approve/Restore dialogs and invited-owner status; editor sections grouped into Essentials and Optional sections.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 142/142; the HTTPS check on the 3d synthetic agency passed (cache header; a hidden Properties section makes its photo 404 after Publish).
- **Browser gate completed (Codex, 2026-10-22):** Chrome opened the trusted local HTTPS hosts with signed-in synthetic accounts. Desktop and 390×844 mobile checks covered the Super Admin review queue, All agencies directory, Create agency form, agency detail, and Approve confirmation, plus the owner Live Overview, mobile Menu, My Website hub, and grouped editor. No blocking layout or wording defect was observed. The confirmation was cancelled; no agency, review, restriction, or website data was changed. The existing dev invitation had already been claimed, so the INVITED panel and Restore dialog were not visually exercised; their API/component behavior remains covered by the existing tests. The in-app browser still rejects the local certificate, so Chrome was used for this gate.
- The browser-gate record was committed as `4a9ba4d` and pushed to `origin/master` on the owner's instruction.

## Phase 7 status (2026-10-22)

`docs/PHASE-7-STAGING-DEPLOYMENT-CONTRACT-PROPOSED.md` is a **PROPOSED, uncommitted** staging/deployment contract for owner review. It reconciles the confirmed deployment, storage, cache, backup, synthetic-data and privacy policies with the current local-disk/media and localhost runtime. No Phase 7 application code, infrastructure or production deployment has been authorized or changed. Hosting/domain, storage, CDN, backup, operational ownership and D-117 privacy/legal details remain OPEN; the proposal lists exact decisions and staging acceptance evidence needed before implementation and pilot launch.

## Phase 7a status (2026-10-22)

Claude reviewed the Codex Phase 7 draft (kept as the staging/production umbrella) and the Phase 7a deploy-readiness contract is **APPROVED** (2026-10-22) and **implemented and verified by Claude**, committed `6465bc5` and pushed: `docs/PHASE-7A-DEPLOY-READINESS-CONTRACT-APPROVED.md`.

- Built: an S3-compatible `MediaStorage` driver (`MEDIA_STORAGE=s3`, private bucket, `@aws-sdk/client-s3`); `assertProductionConfig` (production refuses development defaults, short or equal keys, local storage); `GET /api/ready` (503 unless the database and storage answer); `RUN_BACKGROUND_JOBS`; `BACKEND_INTERNAL_URL` for the public site too (`API_URL` fallback); encrypted backup/restore CLIs (`npm run backup|restore -w backend`, AES-256-GCM, restore only into an empty non-source database); `.github/workflows/ci.yml`; refreshed `.env.example` files; `docs/DEPLOYMENT-RUNBOOK.md`.
- Checks: typecheck, lint and build pass for 5 workspaces; `npm test -w backend` passes 164/164 (the whole media suite also runs against an in-process fake S3); local HTTPS still works with local storage; a manual backup of the synthetic dev database restored into a scratch database with identical counts (10 collections).
- Not done: the CI workflow has not run on GitHub yet (first push); provisioning and the first deployment are Phase 7b.

## History

### Pre-Phase-1 "Next gate" (superseded: Phases 1–6b are done)

Review actual repo/active Git diff; reconcile AI setup; document Phase 1 exact server session/CSRF/dev host, agency/user/session bootstrap/recovery, tenant-scoping and versioned auth API contracts with tests. Obtain explicit owner approval **before auth/tenant business code**. Suggested prompt: `docs/AI/PHASE-1-AUTH-TENANT-CODEX-PROMPT.md`.

### Historical handover

Full previous v5.8 state preserved verbatim: `docs/AI/HISTORY-v5.8-docs-AI-CURRENT-STATE.md`.
