# D-071 — CONFIRMED Option A: Reversible Block and Deactivate Actions

**Date:** 2026-10-21 · **Status:** CONFIRMED — Option A, planning/UX scope only. **No application business-feature coding approval.**

**Original owner approval:** D-071 Option A in one explicit seven-decision batch, D-067 through D-073. **Source proposal:** `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md` (HISTORICAL/RESOLVED).

## Approved scope

- Present **Block** and **Deactivate** as **distinct operational Super Admin controls**. They are not synonyms for Rejected, property Archive, or owner correction request.
- Each control requires an **explicit reason and confirmation** and is **reversible only by an authorized Super Admin**; administrative reactivation/unblocking available as appropriate.
- Correctly record these critical actions in the D-073 audit history.
- **Not decided:** whether Block versus Deactivate should alter login sessions, website public visibility, publishing, billing, etc. Do not infer public takedown/automatic website status change.

## Still OPEN

Detailed semantics, allowed starting states, mutual exclusivity/combination and transitions, website and session effects, reason length/visibility, unblocking workflow names, confirmation error handling, audit schema, authorization and concurrency.

## Invariants preserved in full

- **D-022:** Request Changes and Reject both require a reason; detailed text limits, validation rules and delivery method still undecided.
- **D-028:** self-registration and Super Admin agency creation with lean Pending/manual-review onboarding, no mandatory KYC, document, verified-email or proof-of-office gate.
- **D-029 + D-033:** FIRST agency website public Live occurs AUTOMATICALLY when manual Super Admin agency approval AND website essentials readiness are BOTH fulfilled; approved-but-unready remains nonpublic, ZERO properties valid; NEVER introduce an owner initial Publish/Submit or mandatory correction resubmit in normal signup.
- **D-053 + D-063:** on ALREADY-LIVE websites saved theme, section and eligible property changes join a single explicit authorized owner Publish Updates; no per-property Publish action/auto-sync or Super Admin re-review each change.
- **D-064 + D-065 + D-066:** queue-first Super Admin dashboard; one-page Review Detail with separate review/site-readiness and private authorized preview; action-specific confirmation dialogs/mobile sheets.
- **Phase 0:** already-authorized scaffold ONLY, root npm workspaces with frontend/ 4000, admin/ 4001, super-admin/ 4002, backend/ 4003; Codex success/build has NOT been inspected/verified, and business-feature implementation authorization has NOT been given.


## Implementation authorization

This decision clarifies product behavior/screen direction. **Do not implement** API, screens, auth, state transitions, email, or CRM from this document alone; beyond the previously authorized Phase 0 scaffold, obtain a separate explicit implementation task.
