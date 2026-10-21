> **RESOLVED BY D-035 (2026-10-18): Option B Full-Bleed Image Hero is now CONFIRMED.** This document remains as historical options / nonbinding design suggestions. The canonical specification is `docs/HERO-D035-CONFIRMED.md`; alternate Options A and C are NOT approved. Exact fonts/colors/media/motion remain OPEN.

# EstateOS — D-035 PROPOSAL: Premium Visual System & Hero Layout

**Historical proposal from v2.3 | Hero choice resolved by D-035, other details still PROPOSED | M00 — NO CODE**

## Confirmed backdrop

- One shared premium website template, three styles **Modern Light / Warm Editorial / Contemporary Dark** (D-030/D-034).
- Core 9 sections and editor rules (D-031/D-032). Header/Footer globally fixed; Hero & Contact CTA shown; other five sections optional and movable via Move Up/Down.
- D-033: site can go live with agency name, Hero heading, public phone OR WhatsApp, Hero visual (owner-provided or legitimate platform default), selected template; logo/About/Services/Properties not mandatory.
- Equal mobile/desktop priority, simple-English controls, small 2–3 agency pilot and 5–10 developer hours/week.

## Proposed consistent visual foundations — NOT final selections

**Layout:** quiet high-end editorial composition, generous but usable whitespace, readable sections, consistent container widths, deliberate image crops, limited borders/shadows. Do not fake agency facts, property cards, portraits or statistics. Agency without listings should have a convincing services/contact-oriented homepage.

**Typography:** clear distinct display headings and readable sans body by default. Potential headings may use a restrained editorial serif for Warm Editorial, subject to font choice/licensing/accessibility review; this is NOT yet approved. Avoid body text below a comfortable phone-reading size; avoid long uppercase headings. Exact font families and scale remain OPEN.

**Color:** 3 D-034 approved moods, but all actual CSS tokens/hex values are OPEN. Validate accessible foreground/background and focus contrast for ALL presets; do not assume muted accent colors work for small text.

**Buttons/navigation:** one strong contact CTA; agency logo or text fallback; simple link labels; quiet sticky header optional, not approved; always usable keyboard/touch focus behavior.

**Imagery:** real owner-uploaded Hero picture or appropriately licensed platform default; always allow reposition/crop preview in proposed editor (not yet approved). No random unlicensed real-estate imagery. Mobile hero must remain legible and quick to load. Formats/sizes/compression remain OPEN.

**Motion:** subtle fade/reveal on scroll only if respectful of reduced-motion and performance, with no large parallax or heavy libraries for MVP. Animations NOT yet approved.

## D-035: Choose ONE Hero layout for the shared template (all 3 presets)

**Option A — Editorial Split Hero (RECOMMENDED)**
- Desktop: prominent text/CTA column adjacent to large edge-to-edge property/agency image; text contrast unaffected by photo brightness.
- Mobile: stacked text-first, then image; clear contact CTA without covering imagery; responsive crop.
- Strengths: readable, low maintenance, professional even with default image and zero properties.
- Trade-off: less cinematic than photo-overlay layouts.

**Option B — Full-Bleed Image Hero**
- Desktop: large photo across full width, heading and CTA over a carefully controlled overlay.
- Mobile: adapt image and overlay to keep text readable; image may require alternate crop.
- Strengths: cinematic/luxury feel. Trade-off: varied agency uploads make contrast and crops harder to control.

**Option C — Centered Editorial Hero**
- Desktop: centered headline and CTA on a clean surface, followed by a wide Hero image beneath.
- Mobile: the same vertical composition; headline/CTA remains first.
- Strengths: consistent readability and easy mobile adaptation. Trade-off: long initial scroll before later sections.

**Rule for all options:** this is **ONE Hero layout applied to all 3 presets**, not a new set of templates. Both owner-uploaded and authorized platform-default Hero visuals must work. No fake property listing content required.

## Responsive behaviors to approve later (proposal only)

- Mobile-first CSS composition, but test equal-quality desktop experience; exact breakpoint pixels TBD.
- No horizontal overflow; clear 44px-ish minimum touch targets as proposed heuristic (numeric specification TBD).
- Header: simplified mobile navigation with visible contact route; no multi-level nested menu for MVP.
- Desktop editor: list of sections + focused form + preview; mobile editor: section list/form/preview tabs or step sequence, not tiny 3-column UI.
- Property grid collapses responsively; no property card slots or empty fake listings when agency has zero.
- Reasonable responsive image crops and text wrap; check long agency names, WhatsApp button lengths and slow connections.
- Test Modern Light, Warm Editorial and Contemporary Dark at several phone and desktop widths.

## Other open design decisions; do not silently implement

D-036 exact palette tokens/contrast, font choices & licenses; Hero CTA rules, exact UI spacing/type sizes; media rights/formats/limits; motion; preview editing and post-live save/publish; responsive menu details. Scope of these follow-ups is tentative and does not create new approvals.
