# EstateOS — D-033 historical options (Option A selected)

**Historical choices recorded for decision D-033. Option A is CONFIRMED as of 2026-10-18. Canonical spec: `docs/SITE-READINESS-D033-CONFIRMED.md`. Planning only.**

## Why this decision matters

D-029 confirms: Super Admin approves agency; if its draft website is *ready*, initial website is **automatically** activated and its working URL appears. D-029 did not define ready. D-032 confirms the required visible sections and their fields but **does not** define which values must be filled to go live. We need a small, clear checklist for the 2–3 agency pilot.

### Option A — Essential Contact & Hero (**SELECTED / CONFIRMED**)
- Template selected; agency display name exists.
- Hero has a real heading.
- Contact CTA has at least one usable public phone or WhatsApp destination.
- Hero has a suitable visual **either** uploaded by owner **or** a legitimate platform-provided default (availability/license is separate implementation decision).
- Logo can fall back to agency name; About/Services/Team/Properties are not mandatory.
- Never publish placeholder agency names, demo properties, fake agents or non-working links.

### Option B — Branded Agency Site
- Agency display name, logo, hero heading, hero uploaded image, and valid public contact method.
- At least one meaningful About paragraph or genuine service card.
- Properties, Why Choose Us, Team optional.

### Option C — Strong Profile First
- Agency display name, logo, hero image/heading/subtitle, valid contact, About text and at least one genuine service card.
- More content before launch; delays some small agencies.

## Open integration details whichever option wins

- When Super Admin approved an **unready** site: which edit/save event attempts initial activation again?
- If no hero image exists, what platform-owned default media is safe and licensed to use?
- Do we require verification of phone numbers, or simply syntactic validation? (MVP verification gates are deferred D-028.)
- How to show readiness progress and actionable missing-field messages on mobile.
- Details of block/deactivate URL behavior and edits after go-live remain separate decisions.

**D-033 owner approval is recorded. Use the canonical confirmed spec for the current requirements; additional integration details above remain open. No code authorized.**
