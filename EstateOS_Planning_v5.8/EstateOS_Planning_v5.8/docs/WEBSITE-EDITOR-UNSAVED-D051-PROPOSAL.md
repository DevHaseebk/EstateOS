> **HISTORICAL / RESOLVED BY D-051 CONFIRMED (v4.0, 2026-10-19):** Owner approved **Option A: Save / Discard / Stay** when leaving a dirty current Website Editor section. Option B inline block and Option C local dirty-form retention are NOT approved for MVP. See canonical `docs/WEBSITE-EDITOR-UNSAVED-D051-CONFIRMED.md`. The original A/B/C wording below is preserved as history, not a current open question.

# D-051 — PROPOSED ONLY: Protect Unsaved Section Edits During Navigation

**Decision:** D-051 | **Status:** NOT APPROVED | **Bundle:** v3.9 | **Date:** 2026-10-19 | **Mode:** PLANNING ONLY — NO APP CODE

## Approved prerequisites (not being voted on)

- D-050 **CONFIRMED Option A:** the focused section has an **explicit Save Changes** commit. There is no ordinary form autosave and no global Save All.
- D-049 explicit Apply/Save for candidate themes is **separate**; D-046/D-048 grouped My Website/Theme/Editor/Preview navigation remains.
- Tenant-private Pending previews, real links only after D-029+D-033 initial activation; editing a live site does NOT imply instant republishing. No forced wizard/property add.

## One next question: What happens when an owner tries to leave a section with unsaved edits?

### Option A — Save / Discard / Stay guard (RECOMMENDED)

When navigating to another section, My Website hub or Preview while current section has unsaved edits, offer clear choices to **Save Changes**, **Discard Changes**, or **Continue Editing/Stay**. Save must succeed before proceeding via Save. Discard intentionally removes unsaved changes for that section. Exact modal layout/copy, browser back/reload handling and error recovery remain for a later spec. **No silent autosave**.

### Option B — Require resolution inline before navigation

Instead of a modal, prevent changing sections until the owner explicitly **saves or discards** current changes in the editor's inline action area. Less chance of accidental loss, but potentially frustrating for inexperienced agents.

### Option C — Keep temporary dirty inputs while changing sections

Allow switching among forms while locally retaining unsaved draft input with visible `Unsaved` markers per section; only an explicit Save commits. Navigating away from the editor, refreshing or using Preview still requires a separate policy. More complex recovery state.

## Still OPEN regardless of choice

Exactly when a form becomes dirty; field/image upload error rules; beforeunload/browser Back limits; draft preview should show persisted saved content or dirty local changes; cross-tab editing/concurrency, retries; whether saved edits to a Live site are staged/published; final labels/routes/mobile pixel breakpoints, CRM pilot scope.

**Suggested owner answer:** `EstateOS D-051 ke liye Option A/B/C approve karta hoon. D-051 CONFIRMED mark karke planning Markdown + AI handover update karo, v4.0 ZIP banao. Exact modal copy, Preview sync, post-live publish, routes, breakpoints aur CRM pending rakho. Phir next Editor UX decision discuss karo.`
