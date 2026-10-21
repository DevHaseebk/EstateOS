> **v3.9 ACTIVE — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.8 D-049 current override:** Theme picker previews candidates without saving, with explicit Apply/Save to commit. Cancel/Back preserves the saved style. Confirmed: `docs/THEME-SELECTION-D049-CONFIRMED.md`. D-050 editor content save is UNAPPROVED (`docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md`). Historical proposals below may use older undecided wording; do not infer post-live publication or new approval gates.

> **v3.7 OVERRIDE:** D-048 Option A **Guided My Website Hub** is now CONFIRMED in `docs/MY-WEBSITE-HUB-D048-CONFIRMED.md`. The My Website *hub hierarchy only* is approved; Theme Selection save/preview and Guided Editor Save behavior below remain UNAPPROVED. Next options: `docs/THEME-SELECTION-D049-PROPOSAL.md`; editor: `docs/WEBSITE-EDITOR-D050-DISCUSSION.md`.

# My Website → Theme Selection → Website Editor → Preview — Detailed UX Notes (PROPOSED)

**Status:** discussion draft only; not a new approved screen design. **Bundle:** v3.6.  
**Confirmed foundation:** D-029, D-030–D-035, D-037–D-043, D-044–D-047. **D-048 landing Option A is CONFIRMED in v3.7; all specific subordinate flows remain PROPOSED.**

## Proposed end-to-end user flow

`Overview → My Website → Choose Theme / Edit Website / Private Preview → Super Admin reviews and approves → real public URL appears only if essential readiness met`.

Agency user can enter from Overview CTA or D-045 direct task shortcuts. No forced sequence and no extra manual Submit/Publish button. While Pending, edit and private preview are permitted under tenant authorization. Adding properties is optional.

## Screen A — My Website (hub) — D-048 Option A CONFIRMED (only hierarchy)

| Component | Candidate information | Proposed action | State constraints |
|---|---|---|---|
| Status header | Actual approval and website availability distinct | Contextual website action | Never show a fake public URL |
| Website essentials | Human-readable missing D-033 requirements only | Go to relevant editing task | Logo/About/Properties not required |
| Current theme | One of three fixed palettes and font pairings | Choose Theme | Exactly one shared template |
| Editor access | Website sections/content | Edit Website | Draft permission for Pending; post-live mode OPEN |
| Preview access | Private draft preview while Pending | Preview Website | Authenticated/authorized; do not leak draft content |
| Live URL | Only populated after actual activation | Open/Copy real link | Hidden if Pending/Approved-but-unready |

**Suggested responsive approach:** desktop main content card hierarchy with concise action links; mobile same content stacked. Exact menu, breakpoint numbers and copy are OPEN.

## Screen B — Theme Selection (candidate UX, not confirmed)

- Present precisely **three** theme cards: **Modern Light**, **Warm Editorial**, **Contemporary Dark**, all using the **same** Core 9 section template and fixed D-042 palette values.
- Explain that this changes **style**, not template structure or the agency content. Font map: Manrope/Inter (Modern Light + Dark), Playfair Display headings/Inter body/UI (Warm Editorial).
- Candidate card content: title, visual sample, selection state and one obvious action. On mobile stack cards and keep selection reachable without hover.
- Open questions needing separate approval: does tapping instantly save or first preview? Can the owner compare themes without changing saved selection? What is the exact confirmation/undo behavior? How is unsaved editor content protected? What is the saved/theme preview distinction?
- Never add custom HEX editing, extra templates, required logo or mandatory property step.

## Screen C — Guided Website Editor (candidate UX, not confirmed)

- The approved nine sections are: **Header (fixed)**, **Hero (required)**, **About (optional)**, **Services (optional)**, **Properties (optional)**, **Why Choose Us (optional)**, **Team (optional)**, **Contact CTA (required)**, **Footer (fixed)**. Header/Footer and two essential sections retain D-032 constraints.
- Candidate two-part layout: simple selectable section list + focused field form. On mobile, section list above content or accessible via lightweight panel; **only one active form at a time**.
- Fields and controls use `docs/SECTION-FIELDS-D032-CONFIRMED.md` as canonical; no new required fields introduced. Eligible optional sections can Hide/Show and Move Up/Down; no drag-only sorting. Ensure clear feedback about hidden sections and small-screen controls.
- Keep full-bleed Hero image with directional text gradient (D-035/D-043), one shared typography scale (D-040/D-041), and accessibility intent. Exact crop, upload limits, overlay numbers and validation messages OPEN.
- Open questions requiring owner approval: per-section Save vs global Save, autosave vs manual save, error/loading/dirty states, preview with unsaved edits, restore/discard, image uploads/fallback licensing, post-live edit and republish policy. Do not assume a live site changes on each edit.

## Screen D — Preview and website status (candidate UX)

- Authenticated private draft preview for Pending or unready sites; no public URL. Preview remains under My Website.
- Candidate desktop/mobile viewport switch (not approved). Candidate Back to Editor and status badges (exact labels TBD).
- Actual **Open/Copy Live Link** only when the public website is truly live, approved and ready; no placebo link.
- Later decision: how approved-but-unready content triggers activation when it becomes ready, and how edits to already-live websites are reviewed/applied.

## Case-by-case acceptance considerations (proposal, not implementation rules)

| Situation | UX intent | Open implementation detail |
|---|---|---|
| Registered and Pending, zero listings | User edits one template and privately previews; no publication | Exact status language |
| Selected theme but no Hero heading | Show incomplete readiness state, guide to Hero form | How completion progress is persisted |
| Valid phone but empty WhatsApp | Site can still be ready under D-033 | Validation specifics |
| Hero image not uploaded | Licensed platform default can qualify, if appropriate | Default rights/provider and picker behavior |
| Approved but incomplete | No public link, clear next action | Recheck trigger when ready remains OPEN |
| Live then owner edits | Do not pretend post-live policy is decided | Save/publish/revert workflow OPEN |
| Blocked or deactivated | Do not suggest site is live or edit is permitted | Admin policy and access rules OPEN |

## Next UX approval sequence (suggested, not committed)

**D-048 My Website Hub** → future independent decisions on **Theme Selection interaction** → **Guided Editor navigation/save behavior** → **Preview and live edit policy** → Agency Profile and optional Properties → Super Admin screens. Keep each approval small and update shared Markdown/AI handover; **no code until owner explicitly authorizes it**.
