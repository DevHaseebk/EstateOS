# EstateOS — v5.8 Confirmed Architecture and Publishing Map

**CURRENT/AUTHORITATIVE 2026-10-21.** Earlier version-banners and A/B/C proposals in this preserved archive are HISTORICAL. Read this map together with `docs/DECISIONS.md`, `docs/AI/CURRENT-STATE.md` and relevant specific `*-CONFIRMED.md` specs. Policy decisions do not authorize coding.

## D-074–D-087 — all CONFIRMED Option A

| ID | Approved policy | Source |
|---|---|---|
| D-074 | Backend-validated server sessions; browser HttpOnly/Secure cookies | `docs/IMPLEMENTATION-READINESS-D074-CONFIRMED.md` |
| D-075 | Shared public frontend with platform-managed agency subdomains | `docs/IMPLEMENTATION-READINESS-D075-CONFIRMED.md` |
| D-076 | Shared MongoDB; every agency-owned query/write authorized by trusted server `agencyId` | `docs/IMPLEMENTATION-READINESS-D076-CONFIRMED.md` |
| D-077 | Auto-recheck approved+ready after successful relevant saves, activate FIRST website automatically | `docs/IMPLEMENTATION-READINESS-D077-CONFIRMED.md` |
| D-078 | Public property listings include Available AND non-Archived only | `docs/IMPLEMENTATION-READINESS-D078-CONFIRMED.md` |
| D-079 | One atomic all-or-nothing post-Live public snapshot via Publish Updates | `docs/IMPLEMENTATION-READINESS-D079-CONFIRMED.md` |
| D-080 | Internal CRM/inquiry inbox deferred for pilot; contact/WhatsApp CTA remains | `docs/IMPLEMENTATION-READINESS-D080-CONFIRMED.md` |
| D-081 | Dedicated host-scoped management sessions; no public-subdomain admin-cookie sharing | `docs/IMPLEMENTATION-READINESS-D081-CONFIRMED.md` |
| D-082 | Stable agency subdomain slug during pilot; exceptional Super Admin correction only | `docs/IMPLEMENTATION-READINESS-D082-CONFIRMED.md` |
| D-083 | Both Blocked AND Deactivated public websites non-public; re-check before restoration | `docs/IMPLEMENTATION-READINESS-D083-CONFIRMED.md` |
| D-084 | First auto-Live snapshot includes successfully saved eligible Available/non-Archived properties if any; zero allowed | `docs/IMPLEMENTATION-READINESS-D084-CONFIRMED.md` |
| D-085 | Canonical Agency Profile stages mapped business/contact values to private website draft; post-Live Publish Updates required | `docs/IMPLEMENTATION-READINESS-D085-CONFIRMED.md` |
| D-086 | Validate media, strip EXIF/GPS in public derivatives, make optimized display variants, secure originals | `docs/IMPLEMENTATION-READINESS-D086-CONFIRMED.md` |
| D-087 | Publish with truthful result, preserve old Live+draft on failure, safe idempotent explicit retry | `docs/IMPLEMENTATION-READINESS-D087-CONFIRMED.md` |

## Critical workflow invariants

**Registration:** owner name, agency name, mobile, WhatsApp, email, password; self-signup immediately Pending, no mandatory email verification/KYC/business proof/office map. Super Admin manually Approve/Request Changes/Reject; reason mandatory for latter two. Changes Requested owner Resubmit for Review is NOT initial onboarding Submit nor a website publishing gate.

**First-ever site launch:** Super Admin manual agency approval AND genuine D-033 site readiness => automatic first publication; no separate owner Publish/Submit. Must have template, genuine agency name/Hero heading, phone OR WhatsApp and suitable uploaded/permissioned Hero image. Zero properties valid. Include eligible saved properties (D-084). Blocked/Deactivated public access suppressed (D-083).

**Already-live updates:** save website section, theme, profile mapping or property privately; eligible public change only after intentional owner Publish Updates succeeds atomically. Public properties Available + non-Archived only. Status changes do NOT immediately change existing Live until published, except D-083 platform restriction of public website itself.

**Editor:** one shared premium template, nine core sections and three curated themes; website section manual Save with Save/Discard/Stay, preview saved draft and saved applied theme; Properties one-page Basics/Details/Photos, six required fields, optional 10-photo gallery with cover/reorder, one Save Property, availability statuses and reversible Archive/Restore. CRM excluded from pilot.

**Implementation boundary:** D-074..D-087 are CONFIRMED policy, not final schemas/APIs, error/caching/storage/UX specs, deployments, or instruction to code. Phase 0 skeleton alone was separately authorized; build results still unknown until actual repository inspected.

## Still needs explicit scoped implementation planning

Authentication endpoints, CSRF/SameSite/session store/password recovery, cross-site cookie routing; tenant middleware and negative isolation tests; agency/website/property/published revision models and atomic swap contract; readiness trigger idempotency; status/activation/review transition machine; owner Profile mapping and dirty form rules; image media pipeline implementation; cache/CDN invalidation and rollback/retry; audit event schema; exact UI paths/mobile breakpoints; production DNS/TLS; backups/logging/tests/CI/deployment; any paid subscription/billing. D-088 onward are not approved unless owner explicitly approves them.
