> **v4.2 D-053 later decision (canonical override):** Changes to an **already-Live** website persist privately after section Save/theme Apply; owner must explicitly `Publish Updates` to change the public version. Exact publication validations/failure/sync remain OPEN. First D-029 go-live is still automatic after Super Admin approval and D-033 readiness with NO initial owner publish/submit. Canonical `docs/POST-LIVE-UPDATES-D053-CONFIRMED.md`. This file describes an earlier decision and does not override D-053.

> **v4.1 PREVIEW CLARIFICATION:** D-052 Option A is now CONFIRMED: private Website Preview renders only successfully persisted sections + applied theme. D-051 guards dirty editor exit; this does NOT settle updates to an already-Live public site (next D-053 PROPOSED). Canonical `docs/WEBSITE-EDITOR-PREVIEW-D052-CONFIRMED.md`.

> **v3.9 ACTIVE — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

# D-049 — CONFIRMED: Preview Candidate Theme, Then Explicit Apply/Save (Option A)

**Decision ID:** D-049 | **Owner approval:** Option A | **Status:** CONFIRMED | **Date:** 2026-10-19 | **Bundle:** v3.8 | **Mode:** PLANNING ONLY — NO APPLICATION CODE

## Approved behavior and boundaries

1. **Exactly 3 approved presets only**: Modern Light, Warm Editorial, Contemporary Dark; these change styling of the **one** shared premium website template, without changing agency identity, section contents, section ordering, properties, D-033 site readiness or review status. D-034, D-037–D-042 are authoritative for preset fonts/colors/design geometry. No custom palette/font picker.
2. **Explicitly distinguish current saved theme from candidate preview.** Theme Selection clearly identifies the currently saved choice. Selecting/tapping a different theme opens or updates a *nonpersistent candidate comparison/preview*. The saved selection does not change merely through browsing, focusing, switching candidates or navigating previews. The exact preview UI surface (inline/full-screen/other) is OPEN.
3. **Apply/Save is the deliberate commit action.** The owner explicitly confirms candidate selection with an Apply/Save action. Only a successful save updates the agency's persisted theme configuration. The exact English CTA text, network/save feedback, loading/failure behavior, recovery and conflicts are OPEN and require further UX specification. Never portray a failed save as successful.
4. **Cancel/back without applying preserves the previously saved theme.** Do not silently persist a viewed candidate. Do not invent an initial publish/review step, or treat candidate preview as activation. Leaving with no applied change retains previously saved selection; exact discard affordance/copy remains OPEN.
5. **Preview permissions remain binding.** For Pending/incomplete agencies, preview and candidate theme comparisons are private and authorized to that agency. Never expose a draft URL publicly or display a fake Live link. Public link is available only after real initial activation under D-029+D-033: **manual Super Admin approval AND site readiness**.
6. **Mobile and desktop parity:** all three candidate presets, saved-choice distinction and explicit Apply/Cancel workflow must be usable by keyboard/touch without hover-only UI; specific breakpoints/layout are OPEN.

## Concise expected user journey (conceptual, not final screen/route specification)

- Agency owner opens **My Website → Theme Selection** via the D-048 hub or approved onboarding shortcut.
- The current saved theme is visually identified. Owner previews one or more candidate themes; seeing them is nonpersistent.
- Owner presses an explicit **Apply/Save** action on chosen candidate. On a successful save, the candidate becomes the saved theme. Alternatively, navigating back/canceling leaves saved theme unchanged.
- Website content/sections/agency data stay intact throughout theme comparison; section-edit saving belongs to separate D-050.

## Acceptance criteria for later implementation planning (not authorization to code)

- Choosing A then B for comparison, without Apply, does not mutate the last saved theme.
- Explicit Apply persists the chosen theme for the correct authorized tenant only and returns correct saved-choice representation; failure never gives false success feedback.
- Cancel or Back without applying preserves the saved theme.
- Candidate preview does not become public or alter agency approval/readiness state; there is no new owner Publish/Submit gate.
- All three approved theme styles render on one shared site structure with prior font and exact four-role HEX decisions.

## Important decisions that D-049 does NOT settle

- **Post-live theme changes, draft/live snapshots or republishing**: whether Apply affects a published website, a staged draft only, or requires another action is NOT decided; do not silently push changes to production or promise instant Live updates.
- How Apply interacts with **unsaved Guided Editor fields**, approved section-level manual Save Changes, preview syncing, or concurrent browser sessions is OPEN.
- Exact CTA/cancel wording, route paths, preview presentation, error/toast/loading/undo states, persisted version history, browser back navigation, keyboard/accessibility QA and device breakpoint numbers are OPEN.
- D-050 Guided Editor section-level explicit Save Changes is CONFIRMED in `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`; subsequent validation/recovery details remain UNAPPROVED.
- Pilot CRM/Inquiries, remaining semantic colors, numeric spacing/radii/overlay/crop, and motion remain OPEN.

**Precedence:** This confirmed spec supersedes D-049 A/B/C alternatives in `docs/THEME-SELECTION-D049-PROPOSAL.md` (historical) and narrow contradictory older generic theme-save ideas. All other confirmed decisions retain precedence. No application code or implementation is approved by this document.
