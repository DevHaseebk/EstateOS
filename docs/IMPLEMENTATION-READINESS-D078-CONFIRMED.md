# D-078 — Only Available, non-Archived properties in published public listings — CONFIRMED Option A

**Status: CONFIRMED (owner explicit approval, 2026-10-21).** Product/technical **policy only**, NOT detailed source-code architecture, API contracts or authorization to implement business functionality.

## Exact approved scope

Public agency site published snapshot lists property records only if they are Available AND not Archived. Sold, Rented and Archived records do NOT appear in public property listings. Status and archive remain independent management concepts.

## Cross-decision constraints

- Preserve D-062 Available/Sold/Rented + Archive/Restore; D-063 shared Publish Updates.
- Preserve D-022 mandatory Request Changes/Reject reasons; D-028 immediate Pending self-signup/manual review with no mandatory KYC/document/verified-email gate; D-029+D-033 automatic first public Live after manual approval and genuine readiness; zero-property site valid, NO initial owner Publish or Submit; D-053+D-063 deliberate owner Publish Updates on already-Live saved eligible changes.
- Preserve D-064–D-073 Super Admin product policies and Phase 0 root npm workspaces: `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003.

## Specifically NOT approved / OPEN

Already-Live changes to status/archive/public property visibility take effect only after successful D-063 Publish Updates; no silent immediate public sync. First-ever website snapshot eligibility, explicit selected records versus all eligible saved records, restored status/eligibility, search/index/cache, precise default enums remain open.

No blanket feature-development authorization. Only the previously owner-authorized Phase 0 skeleton task may execute until separate explicit feature implementation tasks are approved.

## Acceptance criteria for design interpretation (NOT code acceptance tests)

- No AI agent treats the other A/B/C options as selected or silently finalizes an OPEN item.
- No change to initial automatic public activation, private drafts or already-Live deliberate Publish Updates.
- Any downstream API/schema/UI spec must cite this D-ID and distinguish business outcome from implementation choices.
