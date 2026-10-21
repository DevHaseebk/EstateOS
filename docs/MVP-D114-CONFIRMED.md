# EstateOS — D-114 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Pilot operations.  
**Canonical decision:** Staging, smoke/UAT and rollback before limited launch.

## Approved scope

Use staging with synthetic data, basic automated smoke tests and user acceptance review, followed by an explicit rollback/recovery plan before production pilot for 2–3 agencies.

## Boundaries and implementation details not approved

Exact CI/CD provider, environments, roll-forward plans, health metrics and UAT checklist to be completed per release milestone.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
