# D-082 — Fixed public subdomains for pilot — CONFIRMED Option A

**Date:** 2026-10-21  
**Owner approval:** User approved ALL recommended D-081 through D-087 Option A in one explicit instruction. This file records exactly this decision's policy level; it is NOT permission to implement product features.

## Approved product/architecture policy

CONFIRMED Option A: after assignment, agency platform subdomain slug remains stable during the pilot. Exceptional correction is an expressly authorized Super Admin operation, not owner self-service.

## Still OPEN — do not silently decide

Slug algorithm, uniqueness/reserved names, exceptional rename mechanics, redirects, approval and DNS/TLS setup remain OPEN.

## Existing requirements preserved

- D-022/D-028: lean immediately Pending signup, manual Super Admin review and mandatory reason for Request Changes and Reject; no pilot KYC/email-verification/map-proof approval gate.
- D-029/D-033/D-077: FIRST public website activation is automatic after manual approval AND genuine site readiness, with zero properties valid and no initial owner Submit/Publish.
- D-053/D-063/D-079: later website, theme and eligible property updates on ALREADY-LIVE site require one deliberate Publish Updates; atomic public snapshot; private saved draft unchanged as the publication source.
- D-072/D-076/D-081: pilot roles Super Admin and Agency Owner, trusted server-derived agencyId scopes tenant reads/writes, and separate privileged management session contexts.
- D-059/D-060/D-078/D-084: optional photos; public property eligibility Available and non-Archived only, based on appropriate successfully saved eligible snapshot (not immediate public sync).
- Phase 0 only: root `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003 with root npm workspaces. Codex scaffold execution unverified; no application features authorized.

## Acceptance at policy/design review (NOT code implementation)

- Another assistant can distinguish this confirmed policy from pending backend fields/APIs/UI/edge cases.
- No historical proposals or defaults override the user's confirmed choice.
