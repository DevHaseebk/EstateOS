# EstateOS — D-105 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Media processing and storage.  
**Canonical decision:** Managed object storage, private originals, public safe derivatives.

## Approved scope

Store uploaded media in managed object storage (S3-compatible or equivalent), keep originals protected, publish only authorized privacy-clean optimized image derivatives.

## Boundaries and implementation details not approved

Supplier, buckets, lifecycle, access signing, CDN, retention and secure deletion semantics OPEN. D-059 optional gallery and D-060 10 files max/5 MB/JPEG PNG WebP unchanged.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
