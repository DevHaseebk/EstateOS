# EstateOS — D-039 PROPOSAL: Curated Font Families

**Status: HISTORICAL PROPOSAL — D-039 Option A CONFIRMED (v2.8)** | **PLANNING ONLY**

## Already confirmed

- D-036: Modern Light and Contemporary Dark use modern **sans-serif headings and body**. Warm Editorial uses a restrained **serif for display headings only** and **sans-serif for paragraphs, buttons, labels, inputs and navigation**.
- D-038: same component geometry, spacing scale, responsive layout, card/button shapes across ALL three; fonts are visual design tokens, not new templates or different layouts.
- D-037: only fixed curated palettes. Exact HEX values are still pending.

> **RESOLVED:** Owner selected **Option A**. Canonical specification: `docs/FONT-FAMILIES-D039-CONFIRMED.md`. Other options are not active.

## Historical choices (do not re-ask unless owner reopens the decision)

### Option A — Manrope + Inter, Playfair Display for Warm Editorial (recommended)

- Modern Light: **Manrope** display/headings; **Inter** body & UI.
- Contemporary Dark: **Manrope** display/headings; **Inter** body & UI.
- Warm Editorial: **Playfair Display** for display/hero/major section headings; **Inter** body & UI.
- Notes: coherent, premium, legible; two role-specific heading families and one reusable body font. Final weights/letter-spacing TBD.

### Option B — Plus Jakarta Sans + Inter, DM Serif Display for Warm Editorial

- Modern Light & Contemporary Dark: **Plus Jakarta Sans** headings, **Inter** body/UI.
- Warm Editorial: **DM Serif Display** display headings, **Inter** body/UI.
- Notes: slightly stronger contrast between sharp modern and classic editorial headings.

### Option C — One sans family for everything + single elegant display serif

- Modern Light & Contemporary Dark: **Inter** heading/body/UI.
- Warm Editorial: **Cormorant Garamond** for display headings and **Inter** for body/UI.
- Notes: fewer font families, but Cormorant requires extra legibility and mobile-size testing.

These were **candidates** before D-039. Option A family names are now CONFIRMED; licensing, font sources and hosting still require verification. Check font licensing, available weights, language support, CLS/performance, accessible small-screen display, and implementation details before development. Do not redistribute font files in the planning package.

## Still explicitly OPEN after selecting D-039

Actual font weights, numerical heading/body scale and line heights, exact palette HEX values, spacing/radius values, Hero overlays, media constraints and animations. If a nominated family is unsuitable, ask owner before substituting.

## Proposed acceptance criteria for later implementation (not yet approved)

- Long agency names and long headings wrap without overflow on a small mobile screen.
- Hero CTA and all form/navigation text remain easily readable on images.
- Font fallbacks avoid layout shifts; do not depend on loading unlicensed fonts.
- Public pages and dashboard remain responsive and fast.
