> **D-063 v5.2 clarification:** Initial agency website Live activation remains AUTOMATIC after manual Super Admin agency approval AND D-033 readiness—no initial owner Publish/Submit step, ZERO properties allowed. D-063 shared Publish Updates applies ONLY to eligible subsequent saved property changes on an ALREADY-LIVE website. Property eligibility in first automatic public snapshot remains OPEN.

# EstateOS — D-029: Automatic website activation after approval (CONFIRMED)


> **v2.4 / D-035 active Hero choice:** Full-Bleed Image Hero is CONFIRMED for all three presets (`docs/HERO-D035-CONFIRMED.md`). Any earlier notes labeling the *Hero layout itself* OPEN refer to historical planning only. The overlay numeric tokens, exact font/color values, media and mobile breakpoint limits remain OPEN; next D-036 typography proposal is NOT approved.


**D-029 confirmed 2026-10-17 · D-033 readiness confirmed 2026-10-18 · planning v2.2.**

## Owner-approved business rule

Super Admin **Approve** activates an agency's **ready** website automatically. No second mandatory owner click on **Publish** for the initial activation. Upon a successful live publication, the agency dashboard shows a public website URL, usable by visitors. An agency may have **zero properties** and still be ready.

This replaces only the earlier **approval -> manual initial Publish** assumption in historical D-015/D-018 documentation. D-014 manual admin approval, D-015 private Pending drafts, D-020 immediate Pending review, and D-028 lean-pilot reset remain valid. D-019 remains superseded by D-020.

## Minimal states and behavior

| Condition | Approved website behavior |
|---|---|
| Agency `Pending` (even if content is complete) | Can edit & privately preview drafts; **no public page**, **no public link** |
| Agency approved and website is ready | Automatically publish saved ready configuration and expose the working website link in agency dashboard |
| Agency approved but website is not ready | Agency remains approved; **no public link**. Show clear missing-item guidance and allow editing; readiness follows **D-033**; automatic recheck trigger remains **OPEN** |
| Agency has zero properties | Not a blocker. Property sections can be hidden or replaced with legitimate agency/services/contact content; never use dummy listings |
| Agency Blocked or Deactivated | Public URL behavior, suspension screen vs 404 and dashboard rights are **OPEN D-031 (future decision)**. Do not assume blocked/deactivated sites remain live |

## Server-side safeguards / planned acceptance tests

1. Public route and link display must check approved tenant + successfully published website. Hiding the URL in UI alone is insufficient.
2. Pending drafts and uploaded draft media may only be retrieved through authorized private preview or edit APIs; never leak via public site API.
3. Approve action must be authorized to Super Admin and safe against repeated click / retried request; publishing should be idempotent.
4. If automatic publication fails, surface a failure status and retry safely; do **not** display a broken live link or claim publication succeeded.
5. Approved site with zero properties renders useful Home/About/Services/Contact content rather than fake property cards.
6. Keep draft vs live content separate so future edits do not unexpectedly modify live content. **Exact post-approval draft/publish mechanism remains OPEN.**

## D-033 confirmed readiness and remaining OPEN integration details

- **CONFIRMED D-033:** selected single template, genuine agency display name, genuine Hero heading, usable public phone OR WhatsApp, suitable owner-uploaded OR legitimate platform-default Hero visual. Logo/About/Services/Team/Properties optional; zero properties valid. See `docs/SITE-READINESS-D033-CONFIRMED.md`.
- Template count and Core 9 fields are settled by D-030/D-031/D-032; D-034 three preset names/count are confirmed; exact theme hex/font values and finer UX/media details remain OPEN.
- Trigger if agency was approved while incomplete and later becomes ready: auto-publish on save, explicit completion action, or re-review? **Not decided.**
- Following approval, whether agency edits automatically update live site or require explicit Save/Publish.
- Exact location of link and whether it appears on the Super Admin agency row as well.
- Block/Deactivate effects on a previously published URL, and status restoration.

**No application code authorized.**

> **D-030/D-033 scope update:** one template + essential go-live readiness are approved. Post-publication changes and approved-but-unready reactivation trigger remain OPEN.

> **D-033 Option A final note:** Logo, About, Services, Properties and Team are not publication prerequisites. Any previously more stringent proposal is historical only.
