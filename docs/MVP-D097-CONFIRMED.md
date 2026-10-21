# EstateOS — D-097 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Security and accounts.  
**Canonical decision:** Validate six lean signup fields with no verification gate.

## Approved scope

On the server validate owner name, agency name, mobile, WhatsApp, email and password; normalize and enforce unique email, reject weak passwords and malformed contact values while signup creates Pending immediately when valid.

## Boundaries and implementation details not approved

No required email verification, business proof, KYC, address/map or approval prerequisite before Pending (D-028). Exact regex, lengths, normalization and rate limits are API-contract details.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
