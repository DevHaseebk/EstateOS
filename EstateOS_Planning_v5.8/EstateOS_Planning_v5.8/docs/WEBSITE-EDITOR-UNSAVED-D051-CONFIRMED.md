> **v4.2 D-053 later decision (canonical override):** Changes to an **already-Live** website persist privately after section Save/theme Apply; owner must explicitly `Publish Updates` to change the public version. Exact publication validations/failure/sync remain OPEN. First D-029 go-live is still automatic after Super Admin approval and D-033 readiness with NO initial owner publish/submit. Canonical `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`. This file describes an earlier decision and does not override D-053.

> **v4.1 PREVIEW CLARIFICATION:** D-052 Option A is now CONFIRMED: private Website Preview renders only successfully persisted sections + applied theme. D-051 guards dirty editor exit; this does NOT settle updates to an already-Live public site (next D-053 PROPOSED). Canonical `docs/WEBSITE-EDITOR-PREVIEW-D052-CONFIRMED.md`.

# D-051 — CONFIRMED: Save / Discard / Stay Guard for Unsaved Website Section Edits (Option A)

**Decision:** D-051 | **Owner-approved:** Option A | **Status:** CONFIRMED | **Date:** 2026-10-19 | **Bundle:** v4.0 | **Milestone:** M00 Discovery | **Mode:** PLANNING ONLY — NO APP CODE

## Approved UX contract

1. **Scope.** When an Agency Admin has edited the *currently focused Guided Website Editor section* and tries navigating away from it **without having saved those edits**, show a clear protective prompt. Examples include switching to another website section, returning to My Website, or opening Website Preview. The mechanism must work with D-046 grouped navigation and D-048 Guided My Website Hub; precise router/browser-event coverage is not part of this decision.
2. **Save Changes.** Choose **Save Changes** to invoke D-050's **explicit current-section save**. Proceed to the originally requested destination **only when that section save actually succeeds**; never imply that a pending or failed save succeeded. Exact failure validation, messages and retry implementation remain OPEN. Save is to the authorized editing/draft state, **not an instruction to publish** changes to an already-Live website.
3. **Discard Changes.** Choose **Discard Changes** to intentionally abandon only the current section's **unsaved edits**, then continue to the original destination. The previously committed section state remains preserved. Discard must not remove previously saved edits, another section's work, the active approved template, or the user's theme selection.
4. **Stay / Continue Editing.** Choose **Stay** (working label: Continue Editing) to cancel requested navigation and keep the current section's unsaved inputs available for further editing. Do not silently discard or silently autosave.
5. **Trigger.** This protection is for genuine **unsaved changes**, not every ordinary navigation. A section with no dirty edits should remain easy to navigate. The exact comparison/dirty-state algorithm, pending image upload semantics and reset behavior are future detail decisions.
6. **Honest language & accessible interaction.** The choices must make potential data loss understandable and be usable on desktop and mobile. **Exact English prompt text, layout, modal versus another equivalent accessible surface, focus management, browser Back/reload/tab close limitations, save failure and retry UX are still OPEN.** D-051 confirms the three-action decision model, not final component implementation.

## Intended user flow (not finalized visual design)

- Hero is open; owner types a new genuine heading and attempts to open About.
- Unsaved-changes prompt offers *Save Changes*, *Discard Changes*, *Continue Editing/Stay*.
- Save: perform section-only manual commit; on successful persistence, continue to About. Failed save must not be treated as success; exact error UX will be designed later.
- Discard: revert unsaved Hero inputs to the previous saved Hero state; continue to About.
- Stay: keep the entered heading unsaved and remain on Hero.
- Repeat the same protection when entering My Website hub or Website Preview from a dirty section. This decision does **not** answer what Preview renders (saved-only or working-unsaved content): D-052 will address it.

## Important boundaries from prior decisions

- **D-050:** one section focused at a time; explicit manual Save per section. D-051 does NOT authorize autosave or global Save All.
- **D-049:** selecting a candidate theme for comparison does not commit; explicit Apply/Save commits a chosen theme. Theme confirmation/abandonment remains governed by D-049 and its future detailed theme editing spec; do not automatically apply this section guard to theme choice.
- **D-029/D-033:** manual Super Admin approval AND minimum site readiness trigger first automatic go-live, without a new owner Publish/Submit step. Pending previews remain tenant-private. Saved edits to an *already-Live* site must NOT silently be promised to update the public site; post-live staging/republishing policy is OPEN.
- **D-031/D-032:** Header/Footer fixed; Hero and Contact CTA always visible; five eligible optional sections may hide/show and use Move Up/Down. This confirmation does not decide how toggles, ordering or media uploads persist.
- **D-028/D-045:** lean 2–3 agency pilot, no forced wizard, no mandatory property; zero-property websites allowed.

## OPEN after D-051

**D-052 proposed next:** what Website Preview renders after successful saves or during unsaved edits—choose saved-draft-only, temporary unsaved working preview, or an explicit comparison mode. Also OPEN: exact prompt copy/design and failure states, browser unload protection, cross-tab conflicts, preview synchronization/refresh, accessibility testing, post-live edit/republish, exact routes/labels, numerical breakpoints, media/crop, CRM pilot inclusion, remaining UI design tokens.

**Authority:** This file supersedes the A/B/C unresolved options in `docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md` (retained as historical). It does **not** approve anything inside the next `docs/WEBSITE-EDITOR-PREVIEW-D052-PROPOSAL.md` proposal. No application code authorized.
