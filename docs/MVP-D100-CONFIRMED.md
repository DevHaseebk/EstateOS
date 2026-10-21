# EstateOS — D-100 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Profile and website sync.  
**Canonical decision:** One manual Save Profile with dirty-navigation guard.

## Approved scope

D-055 one-page Agency Profile uses explicit Save Profile for its whole form; unsaved exit shows Save/Discard/Stay; saved mapped public-eligible fields stage a PRIVATE site draft using D-085.

## Boundaries and implementation details not approved

For already-Live sites, Profile Save never auto-publishes; D-053 Publish Updates applies. Exact form fields/requiredness and validation, failure recovery and selection mapping remain open.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
