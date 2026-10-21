# D-076 — Shared MongoDB, server-scoped agencyId isolation — CONFIRMED Option A

**Status: CONFIRMED (owner explicit approval, 2026-10-21).** Product/technical **policy only**, NOT detailed source-code architecture, API contracts or authorization to implement business functionality.

## Exact approved scope

Pilot tenants share MongoDB database and tenant-owned collections; all tenant-owned reads and writes are authorized and scoped by trusted server-derived agencyId. Never trust or let client-supplied agencyId override identity.

## Cross-decision constraints

- Preserve D-072 agency-scoped owner; D-073 audit policy.
- Preserve D-022 mandatory Request Changes/Reject reasons; D-028 immediate Pending self-signup/manual review with no mandatory KYC/document/verified-email gate; D-029+D-033 automatic first public Live after manual approval and genuine readiness; zero-property site valid, NO initial owner Publish or Submit; D-053+D-063 deliberate owner Publish Updates on already-Live saved eligible changes.
- Preserve D-064–D-073 Super Admin product policies and Phase 0 root npm workspaces: `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003.

## Specifically NOT approved / OPEN

Exact collections/schemas, indexes and uniqueness boundaries, global-versus-tenant records, access matrix, middleware conventions, data migrations, backfill, integration isolation tests and audits remain open. Super Admin cross-tenant access requires explicit authorization.

No blanket feature-development authorization. Only the previously owner-authorized Phase 0 skeleton task may execute until separate explicit feature implementation tasks are approved.

## Acceptance criteria for design interpretation (NOT code acceptance tests)

- No AI agent treats the other A/B/C options as selected or silently finalizes an OPEN item.
- No change to initial automatic public activation, private drafts or already-Live deliberate Publish Updates.
- Any downstream API/schema/UI spec must cite this D-ID and distinguish business outcome from implementation choices.
