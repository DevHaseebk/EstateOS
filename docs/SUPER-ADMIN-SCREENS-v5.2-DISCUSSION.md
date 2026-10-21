> **v5.5 precedence:** D-066 Option A review action dialogs/mobile sheets CONFIRMED. Seven follow-up D-067–D-073 choices are PROPOSED ONLY; see `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md`. Prior references to D-066 pending are HISTORICAL.

> **v5.5 CURRENT / AUTHORITATIVE — D-066 OPTION A CONFIRMED (2026-10-21):** Super Admin **Approve, Request Changes and Reject** use **distinct focused confirmation dialogs on desktop / responsive sheets on mobile**; Request Changes and Reject require reasons under **D-022**; confirmation is explicit and Cancel does not mutate. This approves **UX presentation only**, not exact status transitions, reason validation, permissions, notifications or backend actions. Canonical `docs/AGENCY-REVIEW-ACTIONS-D066-CONFIRMED.md`; old proposal historical. **NEW FAST-TRACK: D-067 THROUGH D-073 ARE SEVEN UNAPPROVED BATCH CHOICES** in `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md`; NEVER infer approval from recommendation. **UNCHANGED:** D-028 lean immediate Pending signup with manual Super Admin agency review and no new KYC/verified-email gate; D-029 + D-033 FIRST agency public website Live **AUTOMATIC** after manual approval AND genuine site readiness (zero-property websites allowed, no initial owner Publish/Submit); D-053 + D-063 already-Live saved website/theme/eligible property changes require deliberate owner **Publish Updates**. D-064 queue-first dashboard, D-065 single-page Review Detail with authorized PRIVATE Preview unchanged. **Phase 0 ONLY** previously owner-authorized Codex scaffolding: npm workspaces, root `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003; Codex completion UNVERIFIED, no product feature coding authorized. Property public visibility, status semantics, security/tenant isolation, exact routes/breakpoints and CRM pilot scope remain OPEN.

> **v5.4 active precedence:** D-064 queue-first dashboard and D-065 single-page Review Detail **both CONFIRMED**. Original historical screen map and options below are not authority on unresolved states/transitions. Next action confirmation UX D-066 **PROPOSED ONLY** in `docs/AGENCY-REVIEW-ACTIONS-D066-PROPOSAL.md`.

> **v5.3 precedence:** D-064 Option A **CONFIRMED**: review queue first, direct Review action, agency directory secondary. The heading/options below are a historical v5.2 discussion. D-065 Agency Review Detail choices in `docs/AGENCY-REVIEW-DETAIL-D065-PROPOSAL.md` remain **PROPOSED ONLY**.

# Super Admin — Pilot Screen Map & Review UX Discussion (v5.2; NOT APPROVED)

**Status: discussion only. D-064 dashboard hierarchy is not yet confirmed.** No app code.

The Super Admin serves **2–3 pilot real-estate agencies**, including those self-registered and created by an admin. Manual approval is already established; this document sketches screens without introducing approvals/verification gates.

| Proposed screen | Purpose | Illustrative actions (exact UX unapproved) |
|---|---|---|
| Dashboard | Surface actual pending reviews and manageable agency state | Review Pending / View Agencies |
| Pending Agencies | Inspect real self-service registrations awaiting decisions | Open Agency Review |
| Agency Review Detail | Inspect account/contact, website draft/private preview and readiness without public disclosure | Approve / Request Changes / Reject, where allowed |
| All Agencies | Look up owner-created and self-registered agencies by real status | View Profile / Manage Status |
| Agency Management | Maintain active/approved/blocked/deactivated status and audit trail | Block / Deactivate / reinstate where permitted |
| Super Admin Settings | Operational admin preferences | Profile/security settings pending |

## Guardrails

- Don't confuse D-033 **site readiness** with whether Super Admin can approve the agency; an **Approved but not-yet-website-ready** state is possible, without a public link.
- Public website activation follows **D-029** only after BOTH manual approval and website readiness. No owner Submit/Publish gating initial go-live.
- D-028 lean pilot supersedes heavy legacy proof/logo/map and email verification prerequisites. Keep the six-field registration simple.
- D-022 structured review with reasons, changes-complete and reopen concepts is documented historically, but exact controls/what is in the MVP must be reconciled before coding, not automatically expanded by this sketch.
- D-053/D-063 explicit Publish Updates on already-Live saved content/theme/eligible property changes are agency publication actions, not an additional Super Admin editorial review queue.
- Specific row columns, searchable fields, final screen names/routes, mobile behavior, access control, admin audit/notifications, deactivation behavior and agency status transition details remain open.

## D-064 candidate hierarchy

- A: **Review queue first (recommended)** — pending agencies / one Review action as main focus; directory and operations secondary.
- B: Agency directory first — search/filter main focus; queue secondary.
- C: Analytics first — stats/charts main focus; queue secondary.

This is **NOT** a D-064 confirmation. No application coding.
