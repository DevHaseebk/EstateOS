> **v3.9 ACTIVE — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.8 D-049 current override:** Theme picker previews candidates without saving, with explicit Apply/Save to commit. Cancel/Back preserves the saved style. Confirmed: `docs/THEME-SELECTION-D049-CONFIRMED.md`. D-050 editor content save is UNAPPROVED (`docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md`). Historical proposals below may use older undecided wording; do not infer post-live publication or new approval gates.

> **v3.2 LATEST CONFIRMED — D-043 Option A:** Full-Bleed Hero has a **directional dark gradient concentrated behind Hero text and CTA** (all three themes; responsive coverage). Canonical `docs/HERO-OVERLAY-D043-CONFIRMED.md`. Older statements calling D-043 "proposed" are historic. **Exact overlay alpha/HEX/stops/crop, other semantic colors, contrast checks, numeric spacing/radii, animations, fluid interpolation remain OPEN.** **NEXT D-044 PROPOSED ONLY:** Agency Admin dashboard/home UX (`docs/DASHBOARD-UX-D044-PROPOSAL.md`). **PLANNING ONLY.**

# EstateOS — D-034 CONFIRMED: Three Premium Theme Presets

> **v3.1 latest D-042 override:** The 12 core background/surface/primaryText/accent HEX values have been APPROVED as Refined Neutral (see `docs/COLOR-HEX-D042-CONFIRMED.md`). Any older statements below that these exact values are still OPEN are historical. Muted/on-accent/border/focus/interaction colors, accessibility QA, Hero overlay and numeric spacing/radii remain OPEN; D-043 overlay approach is next PROPOSED.



> **v2.4 HISTORICAL NOTE — D-035 active Hero choice:** Full-Bleed Image Hero is CONFIRMED for all three presets (`docs/HERO-D035-CONFIRMED.md`). Any earlier notes labeling the *Hero layout itself* OPEN refer to historical planning only. The overlay numeric tokens, exact font/color values, media and mobile breakpoint limits remain OPEN; D-036 was subsequently CONFIRMED as Option B Editorial Contrast in v2.5; exact fonts still OPEN.


**Owner decision:** D-034 Option A | **Date:** 2026-10-18 | **Status:** CONFIRMED | **M00 planning only**

> **v2.6 COLOR CONTROL OVERRIDE:** D-037 Option A CONFIRMED — every preset has one **fixed curated palette**, no user custom HEX/extra accent swatches/logo-derived accents. **Exact HEX values are OPEN**. Read `docs/COLOR-PALETTES-D037-CONFIRMED.md`.

> **v2.5 TYPOGRAPHY OVERRIDE:** D-036 **Option B Editorial Contrast** is now CONFIRMED: sans headings/body in Modern Light & Contemporary Dark; serif **display** headings + sans body/UI in Warm Editorial. Canonical `docs/TYPOGRAPHY-D036-CONFIRMED.md`. Exact font family names/HEX values remain OPEN.

## Approved for MVP

One premium, section-based agency website template (D-030) must offer exactly **three curated theme presets**:

1. **Modern Light** — airy light surfaces; charcoal text; restrained cool-blue-gray accents.
2. **Warm Editorial** — warm ivory surfaces; deep brown text; restrained brass-like accents.
3. **Contemporary Dark** — deep charcoal surfaces; light warm text; restrained accents.

Presets are **styling choices on ONE shared template** — not three independent layouts or separately maintained template implementations. The same D-031 Core 9 section registry, D-032 fields/visibility/move controls, optional property listings and D-033 site readiness apply to every preset. Theme selection should be straightforward for nontechnical agency owners. Exact editor preview UI and save/update behavior remain OPEN; agency-facing colors are fixed by D-037, but precise color values are not approved.

## Approved scope boundaries

- Exactly 3 named presets for the initial 2–3-agency pilot; do not generate additional themes by default.
- Do **not** add unrestricted custom hex-pickers or a full visual designer as part of D-034.
- Maintain the same content schema and section layout system across themes.
- Styling must work at mobile and desktop sizes, including the no-property state.
- A chosen style must not make contact information or conversion actions unusable.

## Explicitly NOT approved by D-034

- **Exact hex/color tokens**, gradients, contrast pairings and surface hierarchy.
- **Exact font families**, weights, text scales, licensing and loaded assets.
- **Hero layout/variants**, animation presets, card shapes, image crops or navigation behavior.
- Detailed breakpoints, spacing values, alternate logo treatments and mobile component layout.
- Media upload limits, image policies/rights and post-approval editing/publishing workflow.

Discuss visual direction in **`docs/VISUAL-D035-PROPOSAL.md`**; keep it **PROPOSED/OPEN** until separately approved. No app source code, scaffolding or deployment is authorized.
