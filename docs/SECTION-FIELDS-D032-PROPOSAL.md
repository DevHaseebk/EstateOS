# EstateOS — D-032 Proposed Section Fields & Editor Controls

**Planning v2.1 | Historical options document. D-032 Option A is CONFIRMED 2026-10-18. Canonical approved rules: [`SECTION-FIELDS-D032-CONFIRMED.md`](SECTION-FIELDS-D032-CONFIRMED.md).**

## Simple editing philosophy

The user may be a property dealer with limited digital experience. Use a few plain-English inputs per section, sensible layouts, image upload with preview, no arbitrary HTML/JS/CSS, no technical JSON forms, and no freeform pixel positioning. Public and private previews should use the same section renderer when later implemented. The template's overall visual quality should not depend on filling every optional field.

## Previously proposed field matrix (initial field types/categories approved by D-032 Option A; exact limits remain OPEN)

| Section | Editable fields (proposed) | Data input | Visibility/behavior (proposed, NOT confirmed) |
|---|---|---|---|
| **1. Global Header** | Agency display name; logo upload; contact button label; choose WhatsApp or phone as contact button | Short text, image, select | Fixed globally; show contact button when a valid contact exists; navigation auto-derived from available site sections/routes |
| **2. Hero** | Main heading; short subtitle; hero image; primary CTA label; CTA destination (`Contact` or `Properties`) | Short text, textarea, image, select | Fixed lead section; CTA falls back to Contact if Properties empty; image needs safe mobile crop |
| **3. About** | Heading; agency story/description; optional supporting photo | Text, textarea, image | Show/hide proposed; no invented history or business claims |
| **4. Services** | Heading; service cards (each title + short summary + icon chosen from whitelist) | Repeatable cards | Show/hide proposed; sample labels Buy/Sell/Rent but only real services should be shown |
| **5. Properties** | Heading; enable/disable; display count preset (`3` / `6`); ordering (`newest` / `featured`) | Toggle, select | Optional; query tenant's actual published properties; zero items should hide section or provide truthful no-listing CTA (choice OPEN) |
| **6. Why Choose Us** | Heading; benefit cards (title + brief explanation + icon) | Repeatable cards | Show/hide proposed; no fabricated percentages, achievements or awards |
| **7. Team** | Heading; agent cards (name, role, photo, optionally phone/WhatsApp) | Repeatable cards + image | Show/hide proposed; only genuine staff; zero team members should not create empty layout |
| **8. Contact CTA** | Heading; short message; displayed phone; WhatsApp number; contact email; city/office address display | Text, short textarea, phone/email | Keep a prominent working contact method; no fake map pin or mandatory office verification |
| **9. Global Footer** | Display name/logo reuse; office area/city; phone/WhatsApp; email; social links (optional) | Profile values + editable overrides | Always global; avoid exposing nonpublic owner details; no invented socials |

### Field constraints — proposed, not confirmed

- Keep titles/CTA labels reasonably short (e.g. headings around 80 characters, CTA label around 24); design should gracefully handle longer genuine text. Exact max lengths OPEN.
- Repeatable Services, Why Choose Us and Team could initially support **up to 4–6 items** per section, but the exact limit OPEN.
- Prefer **one image per simple section** rather than gallery systems. Image dimensions, type, MB limit, crop handling are OPEN and separate from historical D-026 business-doc formats.
- Contact phone/WhatsApp may prefill from agency profile but **owner must be able to choose what appears publicly**. Raw registration PII must not silently become public.
- D-033 later confirmed: agency name, Hero heading, phone OR WhatsApp and uploaded OR suitable platform-default Hero visual are required; logo/About/Services/Properties optional. See canonical readiness spec.

## Historical proposed controls (Option A now CONFIRMED by D-032; consult canonical spec)

- **Header and Footer**: global, not removable and not reorderable.
- **Hero and Contact CTA**: recommend always on for site usability, editable but not removable.
- **About, Services, Why Choose Us and Team**: recommend optional show/hide and reorder among content sections.
- **Properties**: optional, user can hide. For zero listings, don't show fake cards or blank grid.
- **Order**: prefer `Move Up`/`Move Down` controls for simplicity and mobile accessibility; no unrestricted drag-and-drop builder.
- **Visual choices**: approved D-030 theme presets exist; D-034 now CONFIRMS exactly three named presets; hex colors, custom design controls, font/crop options remain unapproved.
- **Saving and publishing**: editor may show `Save Draft` and private preview, but post-approval changes require a separate decision; **initial** live activation follows D-029.

## Historical decision options for D-032 (Option A selected)

**Option A — Guided/Minimal editor (SELECTED / CONFIRMED):** Accept proposed fields above as the **initial field inventory**, keep Header/Footer fixed and Hero/Contact always on, make About/Services/Why Choose Us/Team/Properties hideable, allow content section reordering with Move Up/Down. Field count/lengths and image policy may be refined next.

**Option B — Fixed-layout editor:** Same proposed field inventory and toggles for optional sections, but disallow section reordering entirely. Simplest testing and consistently polished design.

**Option C — Flexible editor:** Same proposed field inventory, all non-global sections can be hidden and rearranged, including Hero/Contact. More flexibility but more empty/weak homepage states to validate.

> D-032 approval confirms field **types/categories and section behavior**, not commit to exact character limits, upload constraints, exact theme hex/font values (names/count confirmed later in D-034), content-readiness checklist (later confirmed D-033), nav route structure or post-launch publish rules. OPEN items require later approval.

## Next decisions after D-032

1. D-033 (NOW CONFIRMED): Site readiness checklist for D-029 automatic go-live — see `docs/SITE-READINESS-D033-CONFIRMED.md`. D-034 subsequently CONFIRMED the three curated presets; next D-035 Hero composition is OPEN.
2. Theme presets and styling boundaries (D-034 tentative).
3. Preview/save/publish updates after first go-live (D-035 tentative).
4. Property listing fields, contact/lead handling, route/page structure, and responsive mockups.

**Planning only — no implementation authorization.**
