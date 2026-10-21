# EstateOS — Project Planning v5.9

EstateOS is a multi-tenant real estate agency website and property-management SaaS focused on a small Karachi/Pakistan pilot. This archive is a **PLANNING PACKAGE, not the runnable source code**. Preserve code already produced by Codex in the existing project root when installing documentation.

## Source of truth

- [Start here](START-HERE-ESTATEOS-v5.9.md)
- [Active confirmed planning index](docs/PLANNING-INDEX-LOCKED-v5.9.md)
- [Current decision register](docs/DECISIONS.md)
- [All new D-088–D-119 confirmed policies](docs/IMPLEMENTATION-READINESS-v5.9-CONFIRMED-MAP.md)
- [Current AI state](docs/AI/CURRENT-STATE.md)
- [Latest AI handover](docs/AI/HANDOVER-LATEST.md)
- [Open feature implementation contracts](docs/OPEN-QUESTIONS.md)
- [Phase 1 Codex gated implementation brief](docs/AI/PHASE-1-AUTH-TENANT-CODEX-PROMPT.md)

## Infrastructure (approved)

One root npm-workspaces Git repository: frontend/ port 4000, admin/ 4001, super-admin/ 4002, backend/ 4003. Existing user Git repo/remote already pushed per owner, do not reinitialize or push without permission.

## Unchanged core policies

D-028 valid lean signup creates Pending; D-029 automatic FIRST public website activation on manual approval AND D-033 genuine readiness (public contact selection D-099), zero properties okay and no initial owner Publish. D-053/D-063 deliberate after-Live Publish Updates, atomic with safe rollback. D-072 two roles and D-080 CRM deferred.

## Historical preservation

All old v5.8 relative file paths retained; original long root rule/README/decision/handover files also saved as byte-for-byte archival copies in `docs/AI/HISTORY-v5.8-*`. This current README replaces an old append-only banner chain. The `apps/.gitkeep` and `packages/.gitkeep` in full archive are historical markers ONLY; absent from root-ready package.

**Approvals are planning policy, not blanket auth/tenant coding authorization.**
