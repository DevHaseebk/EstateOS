# EstateOS — D-118 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Admin-created accounts.  
**Canonical decision:** Secure one-time invitation for admin-created agency owner.

## Approved scope

D-028 Super Admin-created agency path uses a one-time owner activation/invitation process in which the owner chooses their own password; no shared hardcoded or admin-disclosed permanent passwords.

## Boundaries and implementation details not approved

Does not remove self-service registration or require verification/KYC. Exact invitation delivery, expiration, claim authorization and duplicate-account handling are implementation contracts.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
