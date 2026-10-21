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
- Not run: a browser end-to-end test over the HTTPS `*.estateos.test` proxy, and a real MongoDB replica set (tests use mongodb-memory-server). Diff reviewed: no `.env` files or secrets.

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
