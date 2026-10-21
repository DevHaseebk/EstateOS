> **D-063 v5.2 interpretation:** On already-Live sites, genuinely saved unpublished *eligible property changes* now share the website-level D-053 Publish Updates trigger; My Website compact Live/unpublished status remains, but exact change detection and property eligibility are still OPEN. First go-live D-029 automatic unchanged.

# D-054 — CONFIRMED: Compact Live Status + Unpublished Changes

**Decision:** D-054 | **Status:** CONFIRMED | **Option:** A | **Approved:** 2026-10-19 | **Bundle:** v4.3 | **Milestone:** M00 / Agency Website UX | **Mode:** PLANNING ONLY — NO APP CODING

## Owner-approved choice — scope and hierarchy

For an agency website **that is already Live**, the D-048 **Guided My Website Hub** adopts a **compact status-first presentation**:

1. **Public site status is truthful.** Clearly present that the agency's public website is currently Live, independent of any working or saved private draft changes. A Live badge means an actually published website exists; do not show a fabricated public URL or imply its current public content has updated merely because an owner saved draft content.
2. **Private draft state is distinct.** When the **saved draft really differs** from the currently published site, display an understandable **unpublished changes** indicator. Do **not** display a misleading pending-changes state when there are no unpublished saved changes. Unsaved editor input or an unapplied candidate theme is **not** a saved unpublished change.
3. **One contextual subsequent-update action.** When appropriate to the actual saved-draft-versus-Live state, visibly offer a primary **Publish Updates**-kind action. This action follows D-053: only a deliberate, authorized post-live publish can change the public website, and only genuine success can justify a published confirmation. The English button wording is a *concept*, not finalized copy. Exact disabled/hidden states, validation, permission, publish mechanics and errors remain OPEN.
4. **Keep easy website tools accessible.** Editing, Theme Selection and Private Preview remain within D-046/D-048 My Website grouping; avoid a mandatory diff report or permanently split Draft/Live workspace on the hub. Simple, equally understandable desktop/mobile hierarchy is a design intent; exact layout pixels are OPEN.

## Examples (behavioral, not implementation contract)

| Actual situation | Correct hub presentation | Constraints |
| --- | --- | --- |
| Public site Live; saved draft matches published content | Accurate Live status; no false pending-changes notice | Exact empty state/UI remains OPEN |
| Public site Live; saved Hero/theme changes have not been published | Live status **and separately** unpublished-changes indicator, contextual Publish Updates | Public visitors still see last successfully published state |
| Dirty Hero form has unsaved input only | Do **not** represent that input as a saved unpublished change | D-050 explicit Save + D-051 Save/Discard/Stay still apply |
| Candidate theme previewed but never Applied | Existing saved theme remains; no change implied by preview | D-049 preview-before-explicit-Apply rule |
| Pending agency or Approved-but-unready site that has **never** gone Live | Show real pending/readiness state and setup guidance, not fake Live/publish-update state | No public link and no owner first-time Publish/Submit gate |
| A post-live publication fails | Never mark the update public without actual confirmed success | Failure/retry/rollback UX explicitly OPEN |

## Critical cross-decision compatibility

- **D-029 / D-033 automatic FIRST go-live is unchanged:** initial public activation requires manual Super Admin agency approval **AND** website minimum readiness, then occurs automatically. **No initial owner Publish, Publish Updates or Submit for Approval gate.** An Approved-but-unready site stays nonpublic; later readiness trigger is OPEN.
- **D-053 applies to already-Live websites ONLY:** current-section D-050 Save and D-049 theme Apply update private saved draft; D-052 Private Preview shows only successfully saved draft/theme. The actual public website changes only after authorized explicit post-live Publish Updates succeeds.
- **D-047 / D-048:** Overview remains real status → single next-action → D-045 nonblocking checklist → optional Property shortcut. My Website hub remains status/readiness → contextual main edit/action → Theme, Editor, Preview shortcuts; D-054 refines its **already-Live status/pending-changes treatment** without replacing the approved task-first UX.
- **D-028 / D-031 / D-032:** lean 2–3 agency pilot, one template with nine sections and five optionally hide/reorderable sections. Zero properties is valid. No reopening KYC/verification/CRM requirements.

## Explicitly OPEN; NOT approved by D-054

- Detection/comparison algorithm (revision IDs, field-level diff, equality normalization, number of modified sections, timestamps), caching/sync and reliability across tabs and sessions.
- Exact English copy, labels, CTA location, enabled/disabled state, permissions, restricted/blocked website handling, error/success text and accessibility details.
- D-053 publish content scope, validation, conflicts, atomicity, failures, retry/rollback, public cache propagation, audit/history and consistency guarantees.
- Initial Approved-but-unready readiness recheck trigger; preview URLs/access, numerical responsive breakpoints and design token gaps.
- Pilot Inquiries/CRM inclusion, Agency Profile exact fields/form layout, optional Property CRUD fields/media/listing behavior and Super Admin UX.

## Outcome / implementation guardrails

An agent must be able to tell **(a) whether the public website is actually Live** and **(b) whether a successfully saved private draft has unpublished changes** without interpreting technical release management screens. Do not silently publish draft, show fake pending status, or conflate publication with initial launch. **This document authorizes planning only, not application code.**

**Canonical:** Supersedes alternatives in `docs/MY-WEBSITE-DRAFT-LIVE-D054-PROPOSAL.md`, retained as historical context.
