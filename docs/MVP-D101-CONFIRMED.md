# EstateOS — D-101 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Private previews.  
**Canonical decision:** Authenticated management-host private website preview.

## Approved scope

Render saved-draft website preview exclusively through an authorized management-host route/facade with backend authorization and appropriate tenant/reviewer scope; never expose draft through an unsecured public tenant URL.

## Boundaries and implementation details not approved

D-052 only saved changes/current applied theme visible; D-065 authorized Super Admin can review. Exact rendering reuse approach, URLs, short-lived fetch controls and CSP remain open.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
