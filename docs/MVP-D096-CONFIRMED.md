# EstateOS — D-096 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Security and accounts.  
**Canonical decision:** Identity-verified support-assisted account recovery.

## Approved scope

Password recovery for pilot relies on a controlled, identity-verified support workflow and a short-lived, one-use reset token/link; invalidate old sessions and avoid dependency on automated email delivery.

## Boundaries and implementation details not approved

No mandatory email verification/KYC gate at signup (D-028). Define safe identity-check criteria, delivery channel, reset lifetimes and audit before implementation; no plaintext password disclosure.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
