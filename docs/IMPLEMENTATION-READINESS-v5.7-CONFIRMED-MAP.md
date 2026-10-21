# EstateOS v5.7 — Confirmed Implementation-Readiness Policy Map

**2026-10-21. D-074–D-080 ALL CONFIRMED Option A (seven independent approvals).** This is a product/architecture policy map, not final design of API/schema/security or an authorization to code product features.

| Decision | Confirmed scope | Implementation still OPEN |
|---|---|---|
| D-074 | Server-managed HttpOnly/Secure cookie sessions validated on backend | Session store, CSRF/SameSite, rate limit, reset, expiration/revocation, auth APIs |
| D-075 | One frontend/ for platform subdomains; custom domains deferred | DNS, TLS, wildcard routing, slug rules, preview host |
| D-076 | Shared MongoDB; tenant records scoped to server-trusted agencyId | Exact schema, compound indexes, authorization matrix, isolation tests |
| D-077 | After saved readiness-affecting changes or approval, automatically recheck BOTH first-Live gates | Trigger coverage, idempotency, retry/reconciliation, snapshot implementation |
| D-078 | Public snapshots list only Available and non-Archived properties | Initial eligible property selection, restored records, exact status transitions |
| D-079 | Owner Publish Updates creates atomic public revision on already-Live sites; old Live intact on failed publish | Versioning, errors/rollback, cache invalidation, concurrency, idempotency |
| D-080 | No CRM/inquiry inbox in 2–3 agency pilot; public Contact/WhatsApp CTA stays | Exact contact mapping, privacy and optional future CRM |

## Two distinct publication moments (NEVER CONFLATE)

**FIRST public go-live:** D-028 manual Super Admin approval AND D-033 site readiness. D-029+D-077 automatically trigger first Live when BOTH become true, without any owner initial Submit/Publish; ZERO saved properties valid. First snapshot property inclusion remains open until D-084 or equivalent.

**AFTER website already Live:** D-050/D-061 private saved edits, applied theme and saved eligible property edits remain private; D-053+D-063 require intentional owner **Publish Updates**; D-079 establishes all-or-nothing published revision. D-078 determines which published property statuses are visible; it does not itself authorize instant public status change.

## Tenant and access boundaries

D-072 Owner cannot access other agency data; D-074 sessions do not replace per-request server auth; D-075 subdomain value does not give authorization; D-076 requires tenant scope enforced for every query/write and trusted agencyId derived server side. D-071 public/session effects on Block/Deactivate still open.

## Phase 0 code permission

Root npm workspaces and **exactly four application folders** `frontend/` :4000, `admin/` :4001, `super-admin/` :4002, `backend/` :4003. User authorized ONLY Codex Phase 0 skeleton and its minimal health endpoint; whether scaffold/build works is unverified. These decisions do not permit implementing features.

## NEXT seven decisions (PROPOSED ONLY)

D-081 portal session boundaries; D-082 subdomain slug change; D-083 blocked/deactivated public-site access; D-084 first public snapshot property inclusion; D-085 Agency Profile/public draft synchronization; D-086 media privacy/processing; D-087 failed Publish Updates retry/feedback. See `docs/IMPLEMENTATION-READINESS-BATCH-D081-D087-PROPOSAL.md`.
