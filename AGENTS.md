# EstateOS — Project Rules (CURRENT v5.9)

**Owner authority:** User approved all D-088–D-119 Option A on 2026-10-21 as planning POLICY, not blanket permission to write feature code. D-001–D-087 prior confirmed requirements remain intact.

## Mandatory read order

1. `docs/PLANNING-INDEX-LOCKED-v5.9.md`, `docs/DECISIONS.md`, `docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md`.
2. `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md`.
3. Feature-specific canonical `*-CONFIRMED.md` docs; check `docs/OPEN-QUESTIONS.md`.

## Precedence

Current owner-confirmed canonical specs > preceding confirmed specs at their actual scope > proposals/discussions/historical banners. Old proposal A/B/C letters are NOT automatically current selections. Escalate actual contradictory confirmed policies instead of silently inventing a supersession. Historical v5.8 full root rules retained in `docs/AI/HISTORY-v5.8-AGENTS.md` (never treat as active).

## Nonnegotiables

- D-028: self-service and Super Admin-created agencies, valid signup immediately Pending, no mandatory KYC/email-verification gate. D-022 mandatory reasons for Request Changes/Reject.
- D-029/D-033/D-077/D-084/D-091/D-099: first public website Live automatically only after Super Admin approval + genuine readiness incl consciously selected public phone/WhatsApp, with zero properties valid and NO owner initial Submit/Publish.
- D-053/D-063/D-079/D-087/D-090: already-Live draft changes only via deliberate owner atomic Publish Updates; old Live preserved on failure.
- D-072: Super Admin and Agency Owner only in pilot. D-080/D-113: no CRM/billing in free pilot.
- D-074/D-081/D-088/D-089: secure separate management session host boundaries, CSRF/Origin checks and trusted agencyId data scoping; cross-tenant tests.
- D-083: Blocked/Deactivated agency websites non-public; restore eligibility recheck.
- D-115: write/approve versioned REST auth+tenant+error contract BEFORE implementing each product feature.

## Code repository

One root npm workspaces monorepo (`frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003). Root Git already initialized/pushed per owner; do not `git init` or push without permission. Old pnpm/apps/packages setup proposals historical.

## Agent workflow

Before task: inspect actual code, Git and active decisions; identify explicit authorized scope. During: small secure changes only within scope. After: run available checks and record actual outcomes, files and next steps in current state and handover. Never invent successful tests, provider choices, approval, legal compliance or launched sites.
