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

Phase 1 auth & tenant foundation was implemented by Codex and verified by Claude. Typecheck, lint and build pass for all 4 workspaces, and `npm test -w backend` passes 12/12, including the cross-tenant negative tests. The owner-approved D-115 contract is in `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md`. Committed locally, not pushed. See the top of `docs/AI/HANDOVER-LATEST.md`. Super Admin review and approval features are not started.

## Next gate (written before Phase 1; kept for history)

Review actual repo/active Git diff; reconcile AI setup; document Phase 1 exact server session/CSRF/dev host, agency/user/session bootstrap/recovery, tenant-scoping and versioned auth API contracts with tests. Obtain explicit owner approval **before auth/tenant business code**. Suggested prompt: `docs/AI/PHASE-1-AUTH-TENANT-CODEX-PROMPT.md`.

## Historical handover

Full previous v5.8 state preserved verbatim: `docs/AI/HISTORY-v5.8-docs-AI-CURRENT-STATE.md`.
