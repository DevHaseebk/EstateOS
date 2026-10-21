# EstateOS — D-090 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Website publishing and activation.  
**Canonical decision:** Immutable versioned public snapshots and atomic pointer.

## Approved scope

Each successful publication creates immutable versioned public material and atomically switches one authoritative Live revision pointer. Public reads use the committed revision only, preventing partially published website/theme/eligible-property changes.

## Boundaries and implementation details not approved

Physical storage, Mongo transaction/compare-and-swap details, media version binding, cache invalidation and rollback mechanics remain implementation-specific. D-079 all-or-nothing and D-087 safe retry are preserved.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
