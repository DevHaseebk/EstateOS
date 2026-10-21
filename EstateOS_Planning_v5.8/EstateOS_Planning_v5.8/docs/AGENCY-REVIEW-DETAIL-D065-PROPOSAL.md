> **HISTORICAL / RESOLVED (v5.4, 2026-10-21):** Owner selected **D-065 Option A**; single-page Review Detail layout is now **CONFIRMED**. This original A/B/C comparison remains for audit but is **NOT** the current open choice. See `docs/AGENCY-REVIEW-DETAIL-D065-CONFIRMED.md`. **NEXT D-066 PROPOSED ONLY** action confirmation UX: `docs/AGENCY-REVIEW-ACTIONS-D066-PROPOSAL.md`. Any text below saying D-065 unapproved is an outdated v5.3 snapshot.

# D-065 — PROPOSED ONLY: Agency Review Detail UX + Decision-Action Placement

**Status:** NOT APPROVED. D-064 queue-first dashboard has been confirmed, **not** D-065. No product-feature coding authorized by this proposal.

## User job

A Super Admin selects a pending agency via the D-064 **Review** action, inspects submitted agency/contact information and its **authorized private website draft/preview**, understands site readiness separately from agency approval, and chooses an existing D-022 / D-028-supported review decision. Keep manual decisions deliberate, accessible and auditable without creating signup verification gates.

### Option A — Single Review Page: summary first + clearly separated decision panel (RECOMMENDED)

- One responsive **Agency Review Detail** page.
- Start with agency/owner identity and contact summary; display actual review status and site-readiness indicator as **distinct** concepts, followed by optional private draft Preview shortcut. Preview never means the website is public.
- Below or alongside the details, keep the three existing actions **Approve**, **Request Changes**, **Reject** clearly discoverable, visually separated from passive information and any destructive agency management actions.
- Request Changes / Reject require D-022 reason; exact field placement and confirmation flow are separately OPEN.
- When no meaningful info exists, use truthful missing-value treatment, not invented KYC/proof requirements.
- Desktop may use a summary content area plus compact decision rail; mobile should stack naturally. Numeric breakpoints OPEN.
- Single screen lowers navigation complexity for initial 2–3 agency pilot.

### Option B — Two-tab Review Page (Information | Decision)

- Tabs keep agency/profile/site details separate from decision actions.
- Cleaner detail surface but extra context-switching before making an approval decision.
- Existing D-022 reasons still mandatory for Request Changes / Reject; approval/rejection semantics unchanged.

### Option C — Guided Review Wizard (Details → Private Preview → Decision)

- Step-by-step review flow with progress.
- More structure but implies extra clicks and potential unnecessary gatekeeping for lean pilot; all three approved decision concepts remain available as permitted.
- A preview step cannot be an approval prerequisite unless separately approved; D-033 readiness must not be conflated with D-028 manual agency approval.

## D-065 approval boundary

Only the **review-detail screen layout and placement/access to pre-existing actions** will be decided. It will not confirm technical status enums, transitions, role/permission matrix, reason-field UI/validation, confirmations, who can approve what, rejection re-open behavior, completeness checks, audit, notification, post-action routing, or blocked/deactivated effects. Reconcile existing D-022 details before coding—not via assumption.

## Invariants

D-028 lean signup, D-022 reason-based Request Changes and Reject, D-029 + D-033 initial auto-public activation (BOTH conditions; no initial owner Publish/Submit; zero-property valid), and D-053/D-063 explicit later owner Publish Updates remain unchanged. Agency Approved-but-not-site-ready is a legitimate private, non-Live state.

**Next owner decision: A, B or C.** After approval, document as D-065 confirmed in a new versioned ZIP; do not treat this proposal as authorized implementation.
