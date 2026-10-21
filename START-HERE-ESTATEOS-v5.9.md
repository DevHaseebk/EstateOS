# START HERE — EstateOS Planning v5.9

Status 2026-10-21: existing confirmed decisions through D-087 retained, **32 newly owner-approved D-088–D-119 Option A confirmed**. Planning policy defined for MVP; actual provider/account/credential/API/schema/UI validation and release milestones still need concrete contracts and verification.

### Reading order

1. `README.md` and `AGENTS.md`.
2. `docs/PLANNING-INDEX-LOCKED-v5.9.md` and `docs/DECISIONS.md`.
3. `docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md`.
4. `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md`.
5. Relevant existing `*-CONFIRMED.md` specs and `docs/OPEN-QUESTIONS.md`.

### Preserved core principles

First website activation automatic on approval+real readiness, without initial Publish gate and with zero properties allowed. Already-Live updates staged private and one atomic Publish Updates. Tenant data always server-scoped. Two pilot account roles, no CRM/billing.

### Development root installation

Prefer `EstateOS_v5.9_ROOT_READY.zip` extracted to a TEMP location; compare/merge `README.md`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/project.mdc`, `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md` with any Codex/Claude modifications before copying. Never replace existing app folders/package manifests or Git metadata with planning docs. Follow `docs/AI/ROOT-INSTALL-AND-MERGE-GUIDE-v5.9.md`.

### Next development gate

After verifying Phase 0.5 and skills setup, give Codex the scoped `docs/AI/PHASE-1-AUTH-TENANT-CODEX-PROMPT.md`; obtain an approved D-115 implementation contract and then explicitly authorize bounded Phase 1 coding.
