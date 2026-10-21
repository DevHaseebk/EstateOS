# EstateOS — D-089 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Security and accounts.  
**Canonical decision:** Server-enforced agency scope with denial tests.

## Approved scope

Every tenant-owned read/write is authorized and filtered using agencyId derived from authenticated server-side context, via centralized deny-by-default repository/service boundaries; include cross-tenant negative tests.

## Boundaries and implementation details not approved

Never trust URL/query/body agencyId as authorization. Exact schema/index strategy and per-route contracts remain milestone-specific. Shared database D-076 remains.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
