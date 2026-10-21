> **v5.5 STATUS UPDATE (2026-10-21): D-066 Option A is now CONFIRMED.** This D-066 A/B/C option document is **HISTORICAL / RESOLVED**, not a current decision request. See `docs/AGENCY-REVIEW-ACTIONS-D066-CONFIRMED.md`. **NEXT unapproved batch D-067–D-073:** `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md`.

# D-066 — PROPOSED ONLY: Agency Review Actions & Confirmation UX

**Status: NOT APPROVED.** The owner approved **D-065 Option A single-page review layout**, **not** an action confirmation/reason UI. Choose **A / B / C** before marking D-066 confirmed. This file is design discussion only, **not permission to build agency approval screens**.

## Situation and immutable obligations

On the D-065 single Review Detail page, an authorized Super Admin may choose **Approve**, **Request Changes**, or **Reject**, subject to the actual agency state/permissions (still OPEN). D-022 already requires **a reason for Request Changes and Reject**. Approval is manual under D-028; no KYC or verified-email prerequisites may be invented. Site readiness is a separate D-033 concern; approval alone **does not** make the public site Live if readiness is missing. The very first Live publication, when approval + readiness are both fulfilled, remains **automatic under D-029** and must never gain an initial owner Publish/Submit gate.

## Option A — Action-specific compact dialogs / responsive sheets (RECOMMENDED)

- Keep D-065 one-page summary visible as background context; clicking an eligible review action opens an **action-specific focused confirmation surface**.
- **Approve:** concise approval confirmation with truthful distinction between agency approval and website readiness/actual public Live state; no invented extra prerequisites. Exact confirmation copy/conditions OPEN.
- **Request Changes:** compact reason-entry surface requiring a reason under D-022, with explicit confirmation (not a one-click silent action). Exact field presentation/length/validation/retention OPEN.
- **Reject:** distinct reason-required confirmation with an appropriate warning; avoid accidental rejections. Exact severity language/status transitions OPEN.
- Cancel returns to the review page without mutating agency state; only successful server-confirmed actions can change UI state. Specific pending/loading/failure/idempotency/concurrency behavior remains OPEN.
- Desktop may use a dialog and mobile a compact sheet; no exact breakpoints or modal implementation approved by this proposal.
- Pros: quick, straightforward for 2–3-agency pilot; strong separation of review choices; no extra destination route. Cons: needs good keyboard/focus/accessibility implementation.

## Option B — Expand-in-place decision panel on the same page

- Selecting Approve, Request Changes or Reject expands a dedicated decision area **within** the D-065 Review Detail page.
- Shows action-specific warning or D-022 required reason and separate Confirm / Cancel operations.
- Pros: no modal overlays, full context visible. Cons: long page, scrolling and accidental mixing of decisions more likely on small screens.

## Option C — Dedicated decision step after action selection

- Each review action opens a focused follow-up **decision step/page** (NOT a compulsory review wizard). Shows minimal agency identity, choice-specific confirmation, D-022 reason when needed, back/cancel.
- Pros: explicit high-attention review. Cons: more navigation and extra route/state handling for lean pilot.

## What D-066 selection would and would NOT decide

An A/B/C approval would establish **how action confirmation/reason entry is organized** around the three existing decisions. It must not silently approve exact role/permission rules, allowed transitions/default status, reason length/content policy/visibility, deadlines, follow-up emails, audit/notification scope, concurrency, post-action route, error handling, or website Live side effects. These remain separate open requirements. Confirmations must never imply that agency approval guarantees immediate public site activation without D-033 readiness.

## Follow-up to discuss after D-066

**D-067 candidate: review status transitions, reason visibility and recovery/correction workflow** for the lean pilot, aligned with D-022 and D-028; exact numbering/topic to be finalized by owner. Block/Deactivate, All Agencies management, permissions/security, audit, and deployment planning follow. None are confirmed here.
