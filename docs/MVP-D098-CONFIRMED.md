# EstateOS — D-098 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Security and accounts.  
**Canonical decision:** Revocable limited-lifetime management sessions.

## Approved scope

Maintain revocable backend sessions scoped per management portal, enforce idle and absolute expiry, apply login throttling and revoke on logout or password reset.

## Boundaries and implementation details not approved

Store/TTL, allowed session counts, precise expiry durations, device behavior, CSRF handling and cookie attributes belong to Phase 1 contract.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
