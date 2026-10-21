> **v4.2 D-053 later decision (canonical override):** Changes to an **already-Live** website persist privately after section Save/theme Apply; owner must explicitly `Publish Updates` to change the public version. Exact publication validations/failure/sync remain OPEN. First D-029 go-live is still automatic after Super Admin approval and D-033 readiness with NO initial owner publish/submit. Canonical `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`. This file describes an earlier decision and does not override D-053.

> **v4.1 PREVIEW CLARIFICATION:** D-052 Option A is now CONFIRMED: private Website Preview renders only successfully persisted sections + applied theme. D-051 guards dirty editor exit; this does NOT settle updates to an already-Live public site (next D-053 PROPOSED). Canonical `docs/WEBSITE-EDITOR-PREVIEW-D052-CONFIRMED.md`.

# D-050 — CONFIRMED: Explicit Save Changes per Website Section (Option A)

**Decision:** D-050 | **Owner-approved:** Option A | **Status:** CONFIRMED | **Date:** 2026-10-19 | **Bundle:** v3.9 | **Milestone:** M00 Discovery | **Mode:** PLANNING ONLY — NO APP CODE

## Approved interaction

1. **Single focused section at a time.** Agency Admin uses `My Website → Guided Website Editor`, chooses one of the approved D-031/D-032 sections and edits that section's approved fields in its focused form. One section form is active at a time. Do not invent additional mandatory fields or reorder abilities.
2. **Deliberate, section-scoped manual commit.** Each editable section has a visible explicit `Save Changes`-type action. Changes to that section are persisted **only after that action successfully completes**. Merely typing, navigating or entering Preview must not silently autosave the section. `Save Changes` is a *working label/example*, not locked final English copy.
3. **One save scope, not global bulk commit.** The user can save one current section and subsequently edit another. D-050 rejects Global `Save All` as the principal saving model and rejects ordinary autosave for editor section-content changes. Keep individual saves easy to understand on mobile and desktop.
4. **Truthful state and failure handling.** The interface must not claim a section is Saved before persistence succeeds. Feedback should distinguish unsaved/in-progress/saved/failure situations in a non-misleading way. Exact indicators, form validation, retry UX, optimistic state, save timing and network failure mechanics are NOT decided by D-050.
5. **Section rules remain unchanged.** D-031 Core 9 sections, D-032 fields and visibility/reordering controls are canonical: Header/Footer global/fixed, Hero and Contact CTA always visible, About/Services/Properties/Why Choose Us/Team optional with permitted Hide/Show and Move Up/Down. Properties and logo remain optional, zero-property website allowed. Details of how toggles/reordering are committed or batched are still OPEN.
6. **Theme save is a distinct mechanism.** D-049 controls candidate theme preview and explicit Apply/Save of a chosen preset; D-050 controls **content of a current editor section**. Never infer that theme preview commits form edits or vice versa.
7. **Save does not equal Publish.** A successful section Save is a persisted authorized draft/edit, **not an approved public-site publishing trigger**. Do not promise that already Live website visitors instantly see new content. D-029 approves only initial auto-activation after **manual Super Admin approval AND D-033 readiness**; Pending preview stays private and public URL is only shown when truly Live. Post-live draft/public sync and re-publish policy are still OPEN. Do not invent an initial owner Publish/Submit step.

## Example user journey (illustrative; not a final visual design)

- Open My Website hub → Guided Website Editor → choose Hero.
- Edit genuine Hero heading or appropriate Hero image → activate explicit section Save Changes → confirm success only once saved.
- Switch to About and edit it using its own section-level Save Changes control.
- If a user attempts switching sections, visiting Preview or leaving with **unsaved** edits, behavior is **D-051 CONFIRMED** Option A Save / Discard / Stay (`docs/WEBSITE-EDITOR-UNSAVED-D051-CONFIRMED.md`); exact prompt/failure and browser handling still OPEN.
- An agency under Pending approval may work on private drafts; no public link appears. Approved + ready initial activation follows D-029/D-033; what later saved edits do to an already-Live site remains OPEN.

## Not approved / next decisions

- **D-051 CONFIRMED:** protect navigation from dirty current section with Save / Discard / Stay; read `docs/WEBSITE-EDITOR-UNSAVED-D051-CONFIRMED.md`. **D-052 proposed only** for Preview saved-draft synchronization.
- Private Preview rendering of dirty vs saved content, draft sync, autosaved image upload internals, save failure/validation/retry, conflict handling/concurrent sessions, multi-section order/visibility commits, revert/recovery and browser unload cases.
- Post-live editing and production republishing semantics; exact English labels/routes, menu interactions, pixel breakpoints, tenant status/blocked permissions, CRM pilot inclusion.
- Remaining exact numeric/semantic design tokens, accessibility review, motion and Hero crop/gradient settings.

**Authority:** Owner-confirmed D-050 supersedes option alternatives in `docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md` and older D-050 discussion in `docs/WEBSITE-EDITOR-D050-DISCUSSION.md`. This approval does not supersede D-029/D-033, D-031/D-032, D-045–D-049. No coding authorized.
