# EstateOS — D-037 PROPOSAL: Curated Color Palettes & Premium Design Tokens

**Status: HISTORICAL / RESOLVED** | Originally proposed in v2.5 | **Decision D-037 Option A CONFIRMED in v2.6**.

> Read **`docs/COLOR-PALETTES-D037-CONFIRMED.md`** for the binding decision. The A/B/C choices below are retained only for history. Option B and C are not approved for MVP. No HEX values, fonts, overlay values or numerical layout tokens were approved.

## Confirmed boundaries you must not alter

- **D-030:** one reusable section-based premium website template (not three separate coded sites).
- **D-031/D-032:** Core 9 sections and guided editor, optional Properties.
- **D-033:** minimal readiness: selected template, agency name, Hero heading, phone **or** WhatsApp, legitimate Hero image/default.
- **D-034:** exactly three theme presets: Modern Light, Warm Editorial, Contemporary Dark.
- **D-035:** one full-bleed photo Hero with readable heading and contact CTA overlay on mobile/desktop.
- **D-036 Option B:** Modern Light & Contemporary Dark use sans heading/body; Warm Editorial uses restrained serif **display headings** and sans body/UI. **Exact font names remain OPEN.**

## Visual character (descriptive — no approved HEX values)

| Preset | Background / surface mood | Text and accent mood |
|---|---|---|
| Modern Light | Airy off-white / white, softly contrasted surfaces | Charcoal text, restrained cool blue-gray accent |
| Warm Editorial | Warm ivory and natural light neutrals | Deep brown text and muted brass-like accent |
| Contemporary Dark | Dark charcoal with restrained layered surfaces | Warm off-white text and subtle refined accent |

A single semantic token architecture is **proposed**, so components use roles rather than hardcoded per-theme hex values:

| Token family | Examples of proposed roles |
|---|---|
| Foundations | `page-bg`, `surface`, `surface-elevated`, `border` |
| Content | `text-primary`, `text-secondary`, `text-inverse` |
| Actions | `accent`, `on-accent`, `focus-ring`, `link` |
| Hero | `hero-text`, `hero-overlay-start`, `hero-overlay-end`, `hero-cta`, `on-hero-cta` |
| Status | `success`, `warning`, `error` (use judiciously in UI) |
| Type | `font-display`, `font-body` (D-036 role mapping; exact fonts not set) |
| Layout | spacing scale, content width, radius, shadows, responsive breakpoints (exact values open) |

Hero photo brightness varies. A fixed light or dark preset color alone must not determine text readability; design and test a safe overlay/CTA contrast strategy across bright, busy, and dark images. Shared admin UI can have its own predictable accessible design system; public-site themes need not recolor the admin dashboard.

## D-037 — choose the agency-facing palette control (one option)

### Option A — Three fixed curated palettes (SELECTED / CONFIRMED by D-037)
- The three existing presets each have a **fixed designer-vetted palette**, with semantic roles and responsive dark/light contrast.
- Agency owner switches the **preset**; no extra accent swatch or custom color control in the pilot.
- Least complex, easiest to keep premium/consistent and accessible for low-digital-literacy users.

### Option B — Preset + limited approved accent swatches
- Agency chooses one of the three existing presets, then chooses from a **short vetted accent-swatch list** compatible with that preset.
- More agency branding flexibility, but increases contrast/QA combinations and editor complexity.
- Exact number and HEX values of swatches need separate approval.

### Option C — Preset + logo-suggested accent, with safe fallback
- Keep three presets, but suggest a brand accent from uploaded logo colors and map it through contrast-safe token roles.
- Requires robust extraction/contrast fallback; more complexity and surprises if logos are absent or multicolored.
- Exact extraction, human override and fallback rules need separate design approval; not a separate fourth theme.

## Still requires later owner approval — remains OPEN after D-037

Exact HEX values, font names/weights, text sizes, overlay opacities, section spacing, radii, breakpoints, animation and image rules. Do not fill these in by copying moodboard screenshots. **No app code authorized.**
