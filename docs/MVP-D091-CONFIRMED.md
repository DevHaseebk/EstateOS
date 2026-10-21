# EstateOS — D-091 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Website publishing and activation.  
**Canonical decision:** Idempotent committed-change first activation with reconciliation.

## Approved scope

After successful agency approval or saved readiness-relevant changes, re-evaluate D-033 readiness and approval; if both eligible, create first public snapshot once via idempotent activation, with reconciliation for stuck cases.

## Boundaries and implementation details not approved

Initial owner Publish/Submit button is forbidden (D-029). Zero properties valid (D-084). Retrying cannot show Live until pointer activation really succeeds (D-119). Exact event transport, reconciliation cadence, concurrency boundaries OPEN.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
