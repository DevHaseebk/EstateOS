# EstateOS — D-034 PROPOSAL: Premium Theme Presets & Visual Direction

**HISTORICAL PROPOSAL (v2.2) — D-034 RESOLVED by Option A on 2026-10-18. Current authority: `docs/THEME-D034-CONFIRMED.md`. Exact hex colors, font families and Hero layouts remain OPEN. M00 planning only.**

## Context

D-030 approves **one** premium website template that can be styled using theme presets, not several distinct layouts. D-031 confirms Core 9 sections, D-032 guided editing, and D-033 essential readiness. Agency users have limited computer experience and need an attractive default; desktop/mobile quality is equally important.

## Proposed design invariants (pending detailed signoff)

- All presets keep the **same premium layout/section system**. Preset is a token package (colors, typography accents, button and surface styles), not a separately coded template.
- Clear simple-English control: choose a visual preview card, see desktop/mobile preview, save changes.
- Avoid free-form hex selection and granular designer controls in the pilot unless explicitly approved.
- UI to remain accessible: legible contrast, readable typography, clear focus states and keyboard/mobile use.
- Editor controls and Super Admin should also look modern and uncluttered; public theme selection does not have to reskin admin interfaces.
- Prioritize realistic imagery and helpful zero-listing agency presentation; do not fabricate property cards or credentials.

## Historical D-034 options (Option A was selected)

**Option A — Three curated premium presets (recommended)**
- `Modern Light`: off-white/charcoal with understated blue-gray accent.
- `Warm Editorial`: warm ivory/deep brown with restrained brass accent.
- `Contemporary Dark`: charcoal/near-black with clean ivory text and minimal accent.
- Each preset uses a paired accessible type scale, tuned buttons, section separators and image overlays. The **same page structure** is reused. Agency chooses one preset with visual thumbnails; no custom color picker for MVP. Exact token hex values and font families to be approved at next design review.

**Option B — Two curated presets**
- Modern Light and Contemporary Dark only. Less QA and style variation.

**Option C — One default preset + limited custom brand color**
- One fixed premium base; agency can choose accent color from a controlled palette. Fewer distinct visual moods, potentially simpler maintenance.

## Separate later design decisions (do not infer)

- Exact color values, font families/licensing, spacing and accessible contrast checks.
- Hero layout, default image policy/asset rights, micro-interactions/scroll animations, image crop behavior and mobile breakpoints.
- Whether branding controls allow custom colors/logo shape, header variants or card density.
- Exact media upload formats/size and field length/card count limits.
- Post-activation site updates and published/draft workflow.

**No coding authorized.**
