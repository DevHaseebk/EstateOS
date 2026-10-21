# EstateOS — D-103 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Property data rules.  
**Canonical decision:** Standard pilot property types and positive PKR prices.

## Approved scope

Offer pilot categories House, Apartment, Plot, Shop, Office and Other. Price must be a positive integer amount in PKR; for Rent display/meaning is PKR per month; City and Area are typed text fields.

## Boundaries and implementation details not approved

D-058 six required Basics unchanged. Exact type slug values, area validation, numerical bounds, currency formatting and special pricing exceptions remain API/UI contract details.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
