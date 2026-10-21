# EstateOS — D-093 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Testing and data quality.  
**Canonical decision:** Minimum automated QA gates.

## Approved scope

Include unit tests for readiness/status decisions; auth/session/tenant negative integration tests; atomic publication rollback/idempotency tests; lint/typecheck/build and smoke checks for all four applications; pilot user acceptance checks.

## Boundaries and implementation details not approved

Tests must run with real recorded results, not inferred from build files. Exact runner/CI service and coverage target are not prescribed. Phase 1 must test cross-tenant leakage and auth boundaries.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
