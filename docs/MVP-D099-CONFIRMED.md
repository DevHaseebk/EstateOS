# EstateOS — D-099 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Privacy, consent and legal.  
**Canonical decision:** Owner expressly selects public Phone or WhatsApp.

## Approved scope

Before phone/WhatsApp is eligible for public website readiness, owner explicitly confirms which number may be shown publicly in website setup. Signup/internal contact details remain private by default; selected mapped values enter private website draft via D-085.

## Boundaries and implementation details not approved

Preserve D-033 Phone OR WhatsApp readiness, D-029 automatic first go-live, and D-028 lean signup. Consent/selection is website content setup, NOT a new signup verification/Submit for Approval or Publish gate. Exact wording, storage and sync edges remain open.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
