# EstateOS — Active Locked Planning Index (v5.9)

**Current owner-approved scope:** D-001–D-087 as previously confirmed, plus ALL 32 D-088–D-119 Option A planning policies explicitly confirmed 2026-10-21. No blanket feature coding permission.

## Read-first order for AI agents

1. Root `AGENTS.md` / `CLAUDE.md` / `.cursor/rules/project.mdc` as appropriate.
2. `docs/DECISIONS.md` (short current index) and `docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md`.
3. `docs/AI/CURRENT-STATE.md`, `docs/AI/HANDOVER-LATEST.md`.
4. Relevant canonical `docs/MVP-D088-CONFIRMED.md`…`docs/MVP-D119-CONFIRMED.md` and earlier `*-CONFIRMED.md`.
5. `docs/OPEN-QUESTIONS.md` and the implementation milestone contract.

## Earlier confirmed decisions and source

- `docs/PLANNING-INDEX-LOCKED-v5.8.md`: full topic-wise inventory for D-001–D-087; file is historically accurate for v5.8 but D-088–D-094 PROPOSED text is now superseded.
- `docs/IMPLEMENTATION-READINESS-v5.8-CONFIRMED-MAP.md`: D-074–D-087 canonical summary.
- Original long decision register preserved exactly: `docs/AI/HISTORY-v5.8-docs-DECISIONS.md`.
- Original AI root banners and readmes preserved exactly under `docs/AI/HISTORY-v5.8-*.md` / `.mdc`. They are historical references only, not current instructions.

## Established MVP invariants

D-028 lean Pending signup, D-029 first automatic Live only after manual approval + true readiness, zero properties valid; D-053/D-063 after-Live owner Publish Updates; D-078 Available & non-Archived public properties; D-083 hidden Blocked/Deactivated sites; D-085 stage Profile mappings; D-088/D-089 session/tenant trust boundaries; D-090/D-107 versioned atomic public snapshots; D-099 opt-in public contact selection; D-113 curated free pilot without removing D-028 registration; D-115 API contract before code; D-117 privacy review before pilot.

## Phase 0 root infrastructure

One root npm-workspaces Git monorepo (already pushed by owner, not independently validated here): frontend/ 4000, admin/ 4001, super-admin/ 4002, backend/ 4003. Previous pnpm `apps/*` architecture proposal is historical and must not be silently reinstated.

## Authority

`CONFIRMED` decisions govern ONLY their specific approved scope. `PROPOSED`, `DISCUSSION` and stale `CURRENT` phrases within older archives are not approvals. Do not infer named vendors, complete security settings, legally compliant state or business feature coding permission.
