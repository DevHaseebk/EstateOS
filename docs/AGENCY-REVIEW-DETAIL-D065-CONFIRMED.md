> **v5.5 CURRENT / AUTHORITATIVE — D-066 OPTION A CONFIRMED (2026-10-21):** Super Admin **Approve, Request Changes and Reject** use **distinct focused confirmation dialogs on desktop / responsive sheets on mobile**; Request Changes and Reject require reasons under **D-022**; confirmation is explicit and Cancel does not mutate. This approves **UX presentation only**, not exact status transitions, reason validation, permissions, notifications or backend actions. Canonical `docs/AGENCY-REVIEW-ACTIONS-D066-CONFIRMED.md`; old proposal historical. **NEW FAST-TRACK: D-067 THROUGH D-073 ARE SEVEN UNAPPROVED BATCH CHOICES** in `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md`; NEVER infer approval from recommendation. **UNCHANGED:** D-028 lean immediate Pending signup with manual Super Admin agency review and no new KYC/verified-email gate; D-029 + D-033 FIRST agency public website Live **AUTOMATIC** after manual approval AND genuine site readiness (zero-property websites allowed, no initial owner Publish/Submit); D-053 + D-063 already-Live saved website/theme/eligible property changes require deliberate owner **Publish Updates**. D-064 queue-first dashboard, D-065 single-page Review Detail with authorized PRIVATE Preview unchanged. **Phase 0 ONLY** previously owner-authorized Codex scaffolding: npm workspaces, root `frontend/` 4000, `admin/` 4001, `super-admin/` 4002, `backend/` 4003; Codex completion UNVERIFIED, no product feature coding authorized. Property public visibility, status semantics, security/tenant isolation, exact routes/breakpoints and CRM pilot scope remain OPEN.

# D-065 — CONFIRMED: Single-Page Agency Review Detail (Option A)

**Decision:** Owner approved **D-065 Option A on 2026-10-21**. **Status: CONFIRMED for review-detail information hierarchy and action placement ONLY.** This document is a UX planning artifact; it is NOT implementation authorization.

## Approved layout and navigation

1. From the D-064 **queue-first Super Admin dashboard**, one direct **Review** action opens a **single responsive Agency Review Detail screen**. No tabbed review flow or compulsory multi-step wizard.
2. The page opens with a truthful **agency + owner identity / contact summary** derived from existing D-028 lean registration/profile data, without inventing or demanding extra KYC/proof, office address, map pin or document uploads.
3. Clearly separate **manual agency review/approval state** from **website readiness**. Agency can be approved but the public site remains unavailable until D-033 readiness; showing a preview/readiness label MUST NOT imply the agency website is Live.
4. Provide an **authorized PRIVATE saved-draft website Preview** entry point as a supporting review action. It is not a public preview link; exact access rules, content snapshot and permission enforcement are separately OPEN. Preview is not a new mandatory agency-approval prerequisite.
5. Keep the established **Approve, Request Changes, Reject** decisions visually **distinct and discoverable** in their own review-decision region, separated from passive summary content and from Block/Deactivate/destructive agency management actions. Exact enablement, disabled states, sequence, reason capture and confirmations remain pending D-066 and later decisions.
6. Responsive single-page approach: content and action region can sit beside one another on wide screens and stack naturally on mobile. **No numeric breakpoints or fixed sticky behavior approved** by D-065.

## Existing decisions MUST remain unchanged

- **D-022** — Request Changes and Reject require reasons. D-065 does not waive reasons or decide reason field placement, word limits, moderation protocol or post-action messages. Historical D-022 correction/reopen workflows must be reconciled before feature development.
- **D-028** — Lean signup and immediate Pending, with manual Super Admin review; self-signup and Super Admin-created agencies supported. No new mandatory verified email/KYC/office proof.
- **D-029 + D-033** — **FIRST-EVER** public website activation is **automatic** only when Super Admin has approved the agency AND actual essential site-readiness conditions are met; approved-but-not-ready is **not Live**. **NO owner initial Publish/Submit** gate; a site with **ZERO properties** is valid. Exact readiness recheck after approval remains OPEN.
- **D-053 + D-063** — On **ALREADY-LIVE** websites, eligible successfully saved website content/theme/property updates require the existing authorized **Publish Updates** action. No Super Admin review queue for every subsequent edit.
- **D-064** — Queue-first Super Admin dashboard with a clear Review action and secondary All Agencies directory remains confirmed.
- **Phase 0** — Owner authorized only a four-root-app npm-workspace scaffold, ports 4000–4003, not this screen's implementation. No app code in this planning ZIP; Codex scaffold execution cannot be presumed successful.

## OPEN / explicitly not approved by D-065

- **D-066 NEXT (PROPOSED ONLY):** presentation and confirmation flow of the existing three review actions; reason-entry UI and required-value validation remain open even though reason requirement itself is already established.
- Exact backend statuses, action eligibility, transitions, approval confirmation, Request Changes/Rejection reason form UX, incomplete agency profile behavior, post-decision navigation, correction/resubmission/reopen, review audit and notification mechanism, unauthorized/private Preview access, conflict/concurrent-review and failure states.
- Dashboard queue row/filters/sorting, final labels, URLs/routes, focus/keyboard behavior, device breakpoints, side-rail/sticky details, Block/Deactivate consequences and CRM/Inquiries pilot inclusion.
- Website readiness checking/recheck trigger and property publishing/visibility eligibility for first and subsequent public versions.

## Prior candidate status

The v5.3 `docs/AGENCY-REVIEW-DETAIL-D065-PROPOSAL.md` compares A/B/C **historically**. **A is approved; B and C are not approved.** The canonical record is this file and `docs/DECISIONS.md` current section.
