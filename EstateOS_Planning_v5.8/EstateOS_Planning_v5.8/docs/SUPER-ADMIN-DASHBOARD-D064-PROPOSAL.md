> **HISTORICAL / RESOLVED (v5.3, 2026-10-21):** Owner approved **D-064 Option A (Review Queue First)**. This A/B/C proposal remains archived for traceability, NOT an open choice. Current source: `docs/SUPER-ADMIN-DASHBOARD-D064-CONFIRMED.md`. Next decision D-065 is PROPOSED ONLY.

# D-064 — PROPOSED ONLY: Super Admin Dashboard Information Hierarchy

**Status: OPEN — NO CHOICE APPROVED** | EstateOS Planning v5.2 | Planning only; no app code.

## Decision question

When the small pilot Super Admin opens their main dashboard, what should be most prominent? Focus on a usable, low-noise internal tool, **NOT** new eligibility gates or changes to owner-approved agency review policy.

### Option A — Review Queue First (RECOMMENDED)

- Start with **agencies awaiting manual decision**; surface concise pending count and a clear `Review Agency` action.
- Show secondary agency directory/approved/blocked summaries and basic operational shortcuts below.
- On the review-details screen, clearly distinguish business/contact summary, saved agency website draft/private preview, readiness indicator, and existing manual actions: Approve, Request Changes, Reject (with existing D-022 reasons), Block/Deactivate as previously approved and applicable.
- Show only truthful statuses; do not invent extra steps or silently auto-approve agencies. An owner registration is Pending automatically per D-028-era pilot precedence. No new mandatory KYC/email/map/proof gate.
- This option confirms only **dashboard hierarchy** if chosen. Exact statuses, filtering, multi-step review actions, button labels, and detailed agency review UX need follow-on decisions.

### Option B — Agency Directory First

- Main dashboard prioritizes searchable/filterable list of ALL agencies, their actual statuses and quick navigation.
- Pending review count and direct queue access appear as a secondary summary.
- Useful once agencies grow, less focused for a 2–3 agency pilot.

### Option C — Metrics/Analytics First

- KPI cards, charts and signup statistics dominate; agency queue and review details are secondary modules.
- Familiar SaaS look but creates analytics/data-maintenance scope not justified for pilot.

## Previously approved invariants

- **D-028 lean pilot:** both self-service and Super Admin creation are supported; basic signup creates a Pending agency, owner can privately draft and preview; Super Admin manually approves/rejects/requests changes. Deferred verification/document gates remain deferred.
- **D-022 reason-based review** and admin agency management should not be silently removed; exact pilot action UX/order and status machine can be detailed later.
- **D-029 initial automatic go-live** ONLY when manual Super Admin approval and D-033 readiness both true; no initial owner Publish/Submit button; zero-property agency websites valid.
- **D-053/D-063** already-Live subsequent updates: saved section/theme/eligible property edits remain private until the **existing explicit Publish Updates** action; that is an agency-owner content publication workflow, not a new Super Admin re-approval step.
- **D-062** available/sold/rented and reversible archive for property records are independent of agency approval.
- Details of authorized Super Admin information visibility, initial pending queue ordering, review details fields, filters, block/deactivate impact, notifications/audit, legal/compliance and operational edge cases stay OPEN.

## Next decision handoff

Ask owner to choose **A (recommended), B or C**. Only after approval should D-064 be marked confirmed in v5.3. Next useful detailed UX decision: Super Admin agency review-detail screen and actions, preserving all existing approval requirements. No implementation code.
