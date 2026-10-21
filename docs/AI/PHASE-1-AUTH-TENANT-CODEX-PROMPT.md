# Codex — EstateOS Phase 1 Auth + Tenant Foundation: CONTRACT-FIRST IMPLEMENTATION BRIEF

You are in the owner's existing EstateOS monorepo. **This prompt is a proposal and can be sent to Codex to request a narrowly scoped Phase 1 milestone. It must not be interpreted as blanket implementation authorization simply because it exists in the planning ZIP.**

## Source-of-truth preflight

1. Inspect `git status`, branch, recent commits, root npm workspaces, current Node version and the active Phase 0.5/AI rules work; do not overwrite concurrent Codex/Claude changes. Git repo and remote already exist. Never run `git init` or push.
2. Read `AGENTS.md`, `CLAUDE.md` where relevant, `docs/PLANNING-INDEX-LOCKED-v5.9.md`, `docs/DECISIONS.md`, `docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md`, `docs/AI/CURRENT-STATE.md`, `docs/AI/HANDOVER-LATEST.md` and `docs/OPEN-QUESTIONS.md`. In particular read canonical D-028/D-029/D-072/D-074/D-076/D-081/D-088/D-089/D-093/D-095/D-096/D-097/D-098/D-115/D-118.
3. Preserve root folders and ports: frontend/4000, admin/4001, super-admin/4002, backend/4003; npm workspaces.

## REQUIRED GATE 1 — contract/design, NO business-feature edits

First inspect actual code and prepare a concrete **Phase 1 implementation contract for owner signoff**. Deliver the contract in the conversation (or proposed file diff only after owner permits writing) with:

- Local and production management hosts/origins, BFF/server API transport, backend trust boundary, separate host-only cookies (no false per-port isolation), HTTPS dev strategy, Secure/SameSite cookie behavior, CSRF token + Origin/Fetch-Metadata requirements, CORS/redirect handling and threat assumptions.
- Minimal one-time CLI first-Super-Admin bootstrap and secure support-assisted password reset; how to deliver invitation/activation tokens WITHOUT assuming mandatory automated email; secrets never committed.
- Explicit `User`, `Agency`, `Session` and minimal audit record model candidates and indexes; normalized owner email uniqueness and agencyId trust derivation.
- **D-115 versioned REST API** table: signup/login/logout/session identity; Super Admin bootstrap CLI (not public API); read-only Pending agency list; secure invite claim and reset only if in approved Phase 1 scope. For each route document request/response/errors, portal role, session/CSRF requirements, tenant authorization and rate limits.
- Signup six fields and no email/KYC gate; approved roles only Super Admin and Agency Owner. Separate restriction/review state from auth identity.
- Negative tests: owner A cannot read/write B; query/body/path injected agencyId rejected; owner blocked from Super Admin; CSRF/foreign-Origin mutation denied; login throttling; logout/revoke/reset invalidates sessions; health response works without MongoDB.
- Dependencies proposed (minimal, well maintained), data migration/seed approach, environment variables example names, and acceptance criteria. Flag all unresolved choices rather than inventing 'confirmed' values.

**STOP after contract and request owner's explicit approval to implement.** Do not code authentication, API routes, schemas, sessions, migrations or tests before the contract gate is approved.

## AFTER OWNER EXPLICITLY APPROVES GATE 1 — restricted Phase 1 build scope

Only after receiving a distinct user instruction approving the contract:

- Implement minimal backend-validated owner/Super Admin sign-in, logout and session identity; six-field owner signup immediately Pending (no mandatory verification).
- Implement narrowly scoped owner/admin authentication UI only, without business dashboards or website builders.
- Apply server-derived agencyId data-access protection at every approved Phase 1 tenant-owned route; use data-access helpers that fail closed and cross-tenant negative tests.
- Add approved one-time audited CLI bootstrap for first Super Admin; owner invites / password reset only to extent explicitly included in the approved Phase 1 contract.
- Implement controlled session revocation/expiry, CSRF + Origin defense, login throttling and appropriate session/cookie settings for approved host topology.
- Optional **read-only Pending agency list** ONLY if approved in the signed-off contract. Do not implement Approve/Reject/Block/Deactivate, public tenant routing, theme editor, publishing, properties/media, CRM or billing.
- Provide synthetic test fixtures only (D-116), no real client data.

## Verification and stopping criteria

Record *actual* TypeScript, lint, production build, auth/tenant integration & negative test, and `/api/health` results; explain environment/DB dependencies and any remaining failures. Never claim builds passed because artifacts exist. Inspect `git diff`, avoid unrelated code changes, secrets or production config. Update concise CURRENT-STATE and HANDOVER-LATEST **after** implementation and include exact changed files, commands and outcomes. Do not push Git remote; commit locally only if owner instructs.

## Response

At the first gate return: proposed specific host/cookie/CSRF/DB/API/test contract, unresolved risks, and exact statement: **'Ready for owner contract approval; no Phase 1 business code implemented.'**
