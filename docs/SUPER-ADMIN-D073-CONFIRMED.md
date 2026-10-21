# D-073 — CONFIRMED Option A: Basic Audit History and In-App Status

**Date:** 2026-10-21 · **Status:** CONFIRMED — Option A, planning/UX scope only. **No application business-feature coding approval.**

**Original owner approval:** D-073 Option A in one explicit seven-decision batch, D-067 through D-073. **Source proposal:** `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md` (HISTORICAL/RESOLVED).

## Approved scope

- Persist a **minimal authoritative history/audit record** for agency Approve, Request Changes, Reject, Block, Deactivate, and applicable unblock/reactivation/review-reopen actions; include enough event/actor/agency/outcome information to make reviews accountable, without presuming exact schema.
- Show **truthful in-app status and permitted review reasons** to the relevant Agency Owner and Super Admin as authorized.
- **Automated email, SMS and WhatsApp notifications are NOT mandatory for initial pilot** under this decision. Do not silently build message-delivery systems.
- Event logging is not optional in approved pilot scope; failure handling, event integrity, retention and read permissions are technical open questions.

## Still OPEN

Audit event schema/fields, which actions beyond the minimal set need recording, data retention/redaction/privacy, ordering/timestamps, access and tamper prevention, notice presentation, notifications if any later, operational alerting and retry/transaction semantics.

## Invariants preserved in full

- **D-022:** Request Changes and Reject both require a reason; detailed text limits, validation rules and delivery method still undecided.
- **D-028:** self-registration and Super Admin agency creation with lean Pending/manual-review onboarding, no mandatory KYC, document, verified-email or proof-of-office gate.
- **D-029 + D-033:** FIRST agency website public Live occurs AUTOMATICALLY when manual Super Admin agency approval AND website essentials readiness are BOTH fulfilled; approved-but-unready remains nonpublic, ZERO properties valid; NEVER introduce an owner initial Publish/Submit or mandatory correction resubmit in normal signup.
- **D-053 + D-063:** on ALREADY-LIVE websites saved theme, section and eligible property changes join a single explicit authorized owner Publish Updates; no per-property Publish action/auto-sync or Super Admin re-review each change.
- **D-064 + D-065 + D-066:** queue-first Super Admin dashboard; one-page Review Detail with separate review/site-readiness and private authorized preview; action-specific confirmation dialogs/mobile sheets.
- **Phase 0:** already-authorized scaffold ONLY, root npm workspaces with frontend/ 4000, admin/ 4001, super-admin/ 4002, backend/ 4003; Codex success/build has NOT been inspected/verified, and business-feature implementation authorization has NOT been given.


## Implementation authorization

This decision clarifies product behavior/screen direction. **Do not implement** API, screens, auth, state transitions, email, or CRM from this document alone; beyond the previously authorized Phase 0 scaffold, obtain a separate explicit implementation task.
