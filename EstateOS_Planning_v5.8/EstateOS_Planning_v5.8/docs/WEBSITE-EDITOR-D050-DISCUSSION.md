> **HISTORICAL / RESOLVED BY D-050 CONFIRMED (v3.9, 2026-10-19):** Owner approved **Option A: section-level explicit manual Save Changes**. Alternatives B Global Save All and C Autosave are NOT approved for current editor content. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`; D-051 unsaved navigation strategy remains PROPOSED. Original discussion below is retained as historical context, not a current open choice.

> **v3.8 clarification:** D-049 Theme Selection preview-before-explicit-Apply is CONFIRMED in `docs/THEME-SELECTION-D049-CONFIRMED.md`. This D-050 *editor content saving* discussion is still UNAPPROVED; current focused A/B/C choice lives in `docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md`. Never conflate theme Apply with Editor save or instant Live-site republishing.

# Guided Website Editor — D-050 Discussion (PROPOSAL, NOT CONFIRMED)

**Bundle:** v3.7 | **Status:** FOR DISCUSSION ONLY | **Not the approved D-050 decision** | **Mode:** PLANNING ONLY

## Approved foundations / no change

- D-048 My Website hub offers a main edit action and a separate direct Editor shortcut. D-046 keeps Editor inside My Website; D-045 onboarding shortcut can open Editor independently.
- D-031 nine approved sections: **Header** (fixed), **Hero** (visible), **About** (optional), **Services** (optional), **Properties** (optional), **Why Choose Us** (optional), **Team** (optional), **Contact CTA** (visible), **Footer** (fixed).
- D-032 one approachable form/section at a time, no drag-only ordering. Eligible optional sections may toggle Show/Hide and Move Up/Down; Header/Footer global and fixed; Hero/Contact CTA always visible. Exact editable fields: `docs/SECTION-FIELDS-D032-CONFIRMED.md`.
- D-035/D-043 full-bleed image Hero plus directional dark gradient. Hero text/image controls must respect D-033 minimum readiness. Existing agency contacts can supply phone OR WhatsApp; do not demand both or require logo/properties.
- Save/publish semantics, field limits, notifications, accessibility states and post-live edit flow are not yet confirmed.

## Candidate screen: a friendly two-area editor (not approved)

| Area | Content/interaction | Mobile consideration |
|---|---|---|
| Header | Back to My Website; true draft/live status; Preview shortcut (authorized private preview when Pending) | Short toolbar, no fake public URL |
| Section chooser | 9 named sections; fixed/required/optional explanations; eligible Hide/Show, Move Up/Down | Vertical list, selection panel or dropdown; never drag-only |
| Editing form | One chosen section's fields with plain labels and examples; Hero heading and safe hero image upload/default | Full-width large inputs with media picker |
| Actions | Visible explicit save state and error feedback, but actual Save/Autosave strategy is undecided | Reachable buttons, no hover-only controls |
| Preview | Private preview when Pending, only real Live link when actually published | Device selector and unsaved edits policy OPEN |

## Proposed walkthrough to review with owner

1. Owner enters My Website hub, sees readiness, chooses primary `Edit` shortcut.
2. Editor opens the first relevant section (which one is not yet decided) with a clear list to switch to other sections.
3. Owner edits Hero text/photo or any allowed fields; the form clearly explains which essentials are missing (without a new publish requirement).
4. Optional About/Services/Properties/Why Choose Us/Team can be hidden/shown and reordered using simple Up/Down commands. The Properties section can be omitted entirely; no properties need to be created.
5. Owner intentionally saves, or receives unambiguous autosave confirmation — strategy not yet decided; errors must not look like successful saves.
6. Owner privately previews as authorized. Behavior when changes are unsaved or site already Live is undecided; no implicit instant production update.

## Suggested D-050 NEXT-AGAIN decision (unapproved alternatives)

- **A — Section-level explicit Save (recommended):** one current section form at a time with a clear Save changes action, saved/unsaved/error states; a Preview shortcut. No forced Save on every input.
- **B — Global Save All:** edit multiple sections, then commit the overall draft with a single Save All action; risk of losing work when navigating.
- **C — Autosave:** persist changes after edits with visible feedback/restore handling; less clicking but more complex error and Live-site semantics.

Any of these approaches still needs detailed unsaved-change protection, draft/live separation and publish semantics approved separately. Do NOT code from this proposal.
