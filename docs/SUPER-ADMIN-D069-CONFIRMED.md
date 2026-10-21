# D-069 — CONFIRMED Option A: Rejected Agency Recovery

**Date:** 2026-10-21 · **Status:** CONFIRMED — Option A, planning/UX scope only. **No application business-feature coding approval.**

**Original owner approval:** D-069 Option A in one explicit seven-decision batch, D-067 through D-073. **Source proposal:** `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md` (HISTORICAL/RESOLVED).

## Approved scope

- A **Rejected** agency retains its recorded required rejection reason and remains unapproved/nonpublic as a matter of rejection status (subject to any separate suspension/public-side complexities).
- An **authorized Super Admin** may explicitly **Reopen for Review**; the agency re-enters a manual review workflow and is NOT automatically approved, not forced to duplicate its registration and never auto-published merely by reopening.
- Standard agency-owner appeal/reconsideration feature is **not** included by this choice.

## Still OPEN

Who precisely can reopen, eligibility and maximum attempts, record/history preservation implementation, exact reopened backend state, owner edit permissions, confirmations/notifications and duplicate/concurrent review handling.

## Invariants preserved in full

- **D-022:** Request Changes and Reject both require a reason; detailed text limits, validation rules and delivery method still undecided.
- **D-028:** self-registration and Super Admin agency creation with lean Pending/manual-review onboarding, no mandatory KYC, document, verified-email or proof-of-office gate.
- **D-029 + D-033:** FIRST agency website public Live occurs AUTOMATICALLY when manual Super Admin agency approval AND website essentials readiness are BOTH fulfilled; approved-but-unready remains nonpublic, ZERO properties valid; NEVER introduce an owner initial Publish/Submit or mandatory correction resubmit in normal signup.
- **D-053 + D-063:** on ALREADY-LIVE websites saved theme, section and eligible property changes join a single explicit authorized owner Publish Updates; no per-property Publish action/auto-sync or Super Admin re-review each change.
- **D-064 + D-065 + D-066:** queue-first Super Admin dashboard; one-page Review Detail with separate review/site-readiness and private authorized preview; action-specific confirmation dialogs/mobile sheets.
- **Phase 0:** already-authorized scaffold ONLY, root npm workspaces with frontend/ 4000, admin/ 4001, super-admin/ 4002, backend/ 4003; Codex success/build has NOT been inspected/verified, and business-feature implementation authorization has NOT been given.


## Implementation authorization

This decision clarifies product behavior/screen direction. **Do not implement** API, screens, auth, state transitions, email, or CRM from this document alone; beyond the previously authorized Phase 0 scaffold, obtain a separate explicit implementation task.
