> **HISTORICAL / RESOLVED BY D-050 CONFIRMED (v3.9, 2026-10-19):** Owner approved **Option A: section-level explicit manual Save Changes**. Alternatives B Global Save All and C Autosave are NOT approved for current editor content. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`; D-051 unsaved navigation strategy remains PROPOSED. Original discussion below is retained as historical context, not a current open choice.

# D-050 — PROPOSED ONLY: Guided Website Editor Saving Strategy

**Status:** NOT APPROVED | **Bundle:** v3.8 | **Date:** 2026-10-19 | **Next decision:** D-050 | **Mode:** PLANNING ONLY — NO APPLICATION CODE

## Existing approvals, not under debate

- D-030 ONE shared public website template; D-031 approved Core 9 section types; D-032 guided per-section fields and eligible show/hide + Move Up/Down behavior. Header/Footer global fixed; Hero and Contact CTA always visible; five optional sections flexible. No mandatory property listing.
- D-045 nonblocking four-step checklist; D-046 grouped My Website navigation; D-048 guided My Website status/edit/Theme/Editor/Preview hub.
- **D-049 CONFIRMED**: Theme Selection compares candidates without changing persisted theme, then explicitly Apply/Save; this approval **does not determine editor form saving**.
- D-033 ready website essentials; D-029 manually Super Admin approved AND ready automatically activates the initial website; Pending previews private, no fake Live URL. No additional Submit/Publish step.

## Exactly one pending question: How should edits within Guided Website Editor be saved?

### Option A — Save Current Section (RECOMMENDED)

An owner edits **one section at a time**, with a clearly accessible **Save Changes** action for that section. A confirmed saved/unsaved/error indication prevents confusion. Section switching may trigger a protection prompt when changes aren't saved (details pending). Straightforward for nontechnical owners; avoid large unsaved batches. **Choosing A would NOT itself approve autosave, post-live instant publication, numeric save behavior or any exact button copy**.

### Option B — Global Save All

Owner can update multiple sections, then commit the **whole website draft** through a single Save All action. Allows batch editing but risks lost work/confusion when navigating. Exact dirty-state prompts and staged draft behavior pending.

### Option C — Autosave with Visible Feedback

Edits persist automatically after a defined delay or field completion; visible Saving/Saved/Error states and retry required. Low click count but complicated failure/conflict, private preview and post-live publishing semantics. No numeric debounce frequency or exact implementation specified by option alone.

## Shared UX regardless of option (conceptual, not confirmed as D-050)

- Focused one-section form, plain-English hints, responsive touch targets, and easy section switching; no required dragging.
- Changes should never be presented as saved if not actually persisted; error states must be distinguishable.
- Maintain tenant authorization; private preview of Pending sites only; do not imply edits automatically update an already Live public site.
- D-032 editable fields remain authoritative; theme candidate save from D-049 separate from website content-editor save.

## Open even after selecting a save strategy

Unsaved-change interception, preview relationship to dirty content, save failure and retry details, optimistic UI vs server acknowledgment, section reordering persistence, concurrent sessions, upload state, draft/live separation and post-live re-publish, exact route/button wording, mobile numeric breakpoints, CRM pilot scope and full accessibility/error QA.

**Example next owner response:** `EstateOS D-050 ke liye Option A/B/C approve karta hoon. D-050 CONFIRMED mark karke planning docs aur AI handover update karo aur v3.9 ZIP banao. Unsaved navigation prompts, preview-sync, publish/live behavior and exact copy/routes pending rakho. Phir next Editor UX decision discuss karo.`
