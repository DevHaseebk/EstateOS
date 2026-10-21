# Super Admin Pilot — Approved Workflow Overview (v5.6)

**Authority:** Business/UX concepts only from D-022, D-028, D-029, D-033 and D-064–D-073. This is NOT a backend state machine or permission matrix, and not feature implementation approval.

## Signup / approval, corrections and rejection

- Self-service and Super Admin agency creation (D-028): lean record with manual agency approval; self-service registration goes directly to **Pending**. No mandatory documents or verified email/KYC gate.
- Super Admin dashboard prioritizes Pending approvals and direct Review; All Agencies directory is secondary (D-064, D-070).
- Review opens one responsive page with agency/contacts, separate site readiness, private authorized saved-draft Preview, and action choices (D-065).
- D-066: Approve, Request Changes and Reject each opens a focused desktop confirmation dialog/mobile sheet. D-022 requires reason for Request Changes and Reject.
- **Approve**: actual agency approval is distinct from site readiness. If website not ready it stays nonpublic; when both approval and readiness meet, **first website Live is automatic**, no owner initial Submit/Publish (D-029/D-033).
- **Request Changes**: record reason, use a separate **Changes Requested** business disposition (D-067), owner sees request, corrects permitted fields privately and explicitly **Resubmit for Review** (D-068); after successful authorized resubmit, return to **Pending manual review**, not automatically Approved or Live. Owner correction resubmit is NOT standard signup Submit/Publish.
- **Reject**: retain mandatory reason; authorized Super Admin may explicitly **Reopen for Review** (D-069), always requires another manual review. No owner appeal mechanism approved.
- **All Agencies** searchable status-filtered desktop list/mobile cards with View/Manage action (D-070); review disposition and public site state must stay distinct.
- **Block vs Deactivate** two distinct reversible operational actions, each reason and explicit confirm, Super Admin-only reactivation; exact session/public effects OPEN (D-071).
- **Roles** pilot only Super Admin and one Agency Owner role, tenant segregation is mandatory (D-072).
- **Audit** minimal authoritative review/moderation history, truthful in-app statuses/reasons; automated emails deferred/not required (D-073).

## Public-site invariants independent of review states

- A site with ZERO properties can first become Live once manually approved and D-033-ready. The technical recheck trigger is OPEN, but activation cannot require owner's initial Publish/Submit.
- Saved website theme/section and eligible individual-property changes on already-Live sites remain private drafts until explicit **Publish Updates** by authorized owner (D-053/D-063). No every-update Super Admin approval.
- Exact property visibility for Sold/Rented/Archived/Restored; public-site effects of agency Block/Deactivate; first-live property snapshot; cache/rollback/atomic publication all OPEN.

## Not yet specified

Real backend enums/legal transitions and guards; reason length, content validation and read policies; concurrency and idempotency; auth/session and tenant resolution; admin permission matrix; audit schema/retention; alert/delivery; UI route/labels/breakpoints; CRM, media details, deploy/QA and full API.

**Only Codex Phase 0 skeleton authorized**, with four root npm workspace application folders and ports 4000–4003. Codex result NOT yet verified.
