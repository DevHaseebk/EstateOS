# D-067 — CONFIRMED Option A: Agency Review State Representation

**Date:** 2026-10-21 · **Status:** CONFIRMED — Option A, planning/UX scope only. **No application business-feature coding approval.**

**Original owner approval:** D-067 Option A in one explicit seven-decision batch, D-067 through D-073. **Source proposal:** `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md` (HISTORICAL/RESOLVED).

## Approved scope

- An explicit, separately distinguishable **Changes Requested** review disposition exists at the UX/domain-concept level following a **Request Changes** action with D-022 required reason.
- A correction cycle does **not** count as Approved and does not automatically publish a website. Agency owner sees a truthful correction-needed state privately.
- Following an authorized owner **Resubmit for Review** after corrections (D-068), agency returns to the **Pending manual agency review queue** concept; Super Admin must manually review again.
- Approved and Rejected remain distinguishable; D-069 addresses Rejected reopening. These are descriptive business statuses, NOT approved exact backend enum strings or a complete legal transition table.

## Still OPEN

Exact persisted enums/fields, default state, transition preconditions and duplicate resubmissions, versioning/race protection, edit policy, reasons constraints, who sees which history, notifications, failed requests, labels/routes, role enforcement and backend/API representation.

## Invariants preserved in full

- **D-022:** Request Changes and Reject both require a reason; detailed text limits, validation rules and delivery method still undecided.
- **D-028:** self-registration and Super Admin agency creation with lean Pending/manual-review onboarding, no mandatory KYC, document, verified-email or proof-of-office gate.
- **D-029 + D-033:** FIRST agency website public Live occurs AUTOMATICALLY when manual Super Admin agency approval AND website essentials readiness are BOTH fulfilled; approved-but-unready remains nonpublic, ZERO properties valid; NEVER introduce an owner initial Publish/Submit or mandatory correction resubmit in normal signup.
- **D-053 + D-063:** on ALREADY-LIVE websites saved theme, section and eligible property changes join a single explicit authorized owner Publish Updates; no per-property Publish action/auto-sync or Super Admin re-review each change.
- **D-064 + D-065 + D-066:** queue-first Super Admin dashboard; one-page Review Detail with separate review/site-readiness and private authorized preview; action-specific confirmation dialogs/mobile sheets.
- **Phase 0:** already-authorized scaffold ONLY, root npm workspaces with frontend/ 4000, admin/ 4001, super-admin/ 4002, backend/ 4003; Codex success/build has NOT been inspected/verified, and business-feature implementation authorization has NOT been given.


## Implementation authorization

This decision clarifies product behavior/screen direction. **Do not implement** API, screens, auth, state transitions, email, or CRM from this document alone; beyond the previously authorized Phase 0 scaffold, obtain a separate explicit implementation task.
