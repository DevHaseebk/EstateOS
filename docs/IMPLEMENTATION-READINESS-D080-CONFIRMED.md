# D-080 — Defer internal CRM and inquiry inbox for pilot — CONFIRMED Option A

**Status: CONFIRMED (owner explicit approval, 2026-10-21).** Product/technical **policy only**, NOT detailed source-code architecture, API contracts or authorization to implement business functionality.

## Exact approved scope

For first 2–3 agencies, do not implement internal lead CRM, inquiry inbox, follow-up pipeline or message storage. Use website Contact CTA / WhatsApp pathway under existing site UX, with no claim of captured/saved leads.

## Cross-decision constraints

- Preserve D-031 public Contact CTA; D-028 lean signup.
- Preserve D-022 mandatory Request Changes/Reject reasons; D-028 immediate Pending self-signup/manual review with no mandatory KYC/document/verified-email gate; D-029+D-033 automatic first public Live after manual approval and genuine readiness; zero-property site valid, NO initial owner Publish or Submit; D-053+D-063 deliberate owner Publish Updates on already-Live saved eligible changes.
- Preserve D-064–D-073 Super Admin product policies and Phase 0 root npm workspaces: `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003.

## Specifically NOT approved / OPEN

Contact source mapping, consent/privacy, destination validation, contact link and button UX, any later inquiry forms, CRM implementation, plan/pricing/billing decisions remain open. Not permission to build marketing automation.

No blanket feature-development authorization. Only the previously owner-authorized Phase 0 skeleton task may execute until separate explicit feature implementation tasks are approved.

## Acceptance criteria for design interpretation (NOT code acceptance tests)

- No AI agent treats the other A/B/C options as selected or silently finalizes an OPEN item.
- No change to initial automatic public activation, private drafts or already-Live deliberate Publish Updates.
- Any downstream API/schema/UI spec must cite this D-ID and distinguish business outcome from implementation choices.
