# D-064 — CONFIRMED: Super Admin Dashboard Prioritizes Pending Review Queue

**Status:** CONFIRMED — owner chose **Option A** on 2026-10-21. **Planning UX only.**

## Owner-approved scope (dashboard information hierarchy only)

The default **Super Admin dashboard** prominently leads with **agencies awaiting a manual review decision**. Present a truthful pending-reviews summary and a **single obvious direct Review action per queued agency** that opens the agency review-detail view. The agency directory and routine agency management summaries/shortcuts remain **secondary**; analytics/charts do not dominate the pilot dashboard. Prioritize fast human review of 2–3 pilot agencies, not operational vanity metrics.

- A review-queue-first dashboard is confirmed, **not** a detailed queue card/row schema or complete filter system.
- A direct Review action links toward the detail UX, but exact route, label, ordering, pagination and authorization are **OPEN**.
- If no agencies genuinely await decisions, show an appropriate clear empty state; do not fabricate pending records or meaningless approval metrics.
- Responsive access is required; exact mobile arrangement and numerical breakpoints are **OPEN**.
- All Agencies remains accessible as a secondary destination; exact navigation and agency-directory UX **OPEN**.

## Non-negotiable existing approval and publication rules

- **D-028 lean pilot:** Self-registration and Super Admin agency creation both supported; self-registration makes agency Pending immediately. Owner can privately edit/preview while Pending. No new mandatory verified-email, KYC, physical office proof, map pin, logo or document gate is introduced by this dashboard decision.
- **D-022 structured agency review:** Request Changes and Reject are reason-based approved review concepts; original owner correction/review flows remain historically documented. This dashboard approval does **not** redesign, bypass or silently re-specify statuses/transitions/reasons.
- **D-029 + D-033 first-ever automatic go-live:** public site becomes Live only after BOTH manual agency approval AND essential website readiness. If approved but unready, site is still not public; **NO initial owner Publish/Submit** requirement and **ZERO properties** is valid.
- **D-053 + D-063 subsequent publishing:** already-Live website edits (saved content, applied theme and eligible saved property changes) use the existing owner **Publish Updates** boundary, not new Super Admin editorial review on every change.

## Explicitly NOT approved by D-064

The detailed Review screen UI and placement of agency identity/contact/profile summary, private saved-draft preview, site readiness, action tray, review notes or reason form; exact pending queue columns, sort/filter/badges; agency creation/edit/deactivation workflows; statuses and transitions, moderation permission/audit, reason validation and notifications; all final labels/routes, responsive pixel breakpoints and CRM/Inquiries pilot inclusion. These remain OPEN or governed by older independently approved decisions.

## Next D-065 PROPOSED ONLY

Read `docs/AGENCY-REVIEW-DETAIL-D065-PROPOSAL.md` and `docs/AGENCY-REVIEW-ACTIONS-D065-DISCUSSION.md`: choose the *layout* for reviewing an agency and exposing pre-existing Approve / Request Changes / Reject actions. The exact decision mechanics are not implied by selecting a layout.
