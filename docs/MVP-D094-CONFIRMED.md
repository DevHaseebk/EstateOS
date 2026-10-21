# EstateOS — D-094 CONFIRMED (Option A)

**Status:** CONFIRMED by product owner on 2026-10-21, for MVP planning policy only.  
**Category:** Deployment.  
**Canonical decision:** Three independent Next.js deployments plus protected API.

## Approved scope

Deploy frontend/, admin/ and super-admin/ as separate Next.js applications, with a separately protected backend/ API and managed MongoDB/media. Keep staging/production secrets isolated; wildcard domain/TLS required before public tenant launch.

## Boundaries and implementation details not approved

No hosting provider, domain, DNS vendor, certificate mechanism, secret names or cutover plan is chosen by this decision. Dev ports 4000/4001/4002/4003 unchanged.

## Prior decisions and authority

This decision complements (and does not silently supersede) D-022 mandatory review reasons, D-028 lean Pending signup, D-029/D-033/D-077/D-084 first automatic go-live on approval + readiness, D-053/D-063/D-079/D-087 deliberate atomic **post-Live** Publish Updates, D-072 two pilot roles, D-075/D-076 platform subdomains/shared MongoDB, and Phase 0 four root npm-workspace apps. Where a historical proposal uses different A/B/C wording, this canonical **owner-selected** Option A controls.

## Coding gate

This is a planning decision, **not** blanket authorization to implement product features. D-115 requires a reviewed feature-level API/schema/security/error contract and explicit milestone approval before relevant code is written.
