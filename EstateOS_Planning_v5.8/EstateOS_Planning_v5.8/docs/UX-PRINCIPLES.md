> **v3.9 ACTIVE — D-050 OPTION A CONFIRMED (2026-10-19):** Guided Website Editor uses **explicit section-level manual `Save Changes`** on the current section. No ordinary autosave or global Save All as the main model. Save success means **persisted authorized draft/edit, NOT automatic production republish**. D-049 theme Apply stays separate. Canonical `docs/WEBSITE-EDITOR-SAVING-D050-CONFIRMED.md`. **NEXT D-051 PROPOSED ONLY:** unsaved-section navigation protection (`docs/WEBSITE-EDITOR-UNSAVED-D051-PROPOSAL.md`). Unsaved warnings, Preview sync, post-live publication, exact English labels/routes, pixel breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY — NO APP CODE.**

> **v3.8 HISTORICAL SNAPSHOT — D-049 OPTION A CONFIRMED (2026-10-19):** Theme Selection under the D-048 My Website hub previews a candidate WITHOUT changing the currently saved preset. Only an intentional explicit **Apply/Save** saves the selected preset; Cancel/Back without applying preserves the previous saved theme. One template, all content preserved; private Pending preview only. **No post-live theme publication behavior approved.** Canonical `docs/THEME-SELECTION-D049-CONFIRMED.md`; old A/B/C proposal HISTORICAL. **NEXT D-050 PROPOSED ONLY:** Guided Editor content saving via section Save (A recommended), global Save All (B), or autosave (C), `docs/WEBSITE-EDITOR-SAVING-D050-PROPOSAL.md`. Exact English labels/routes, preview surface, editor/publish semantics, mobile breakpoint pixels, checklist progress and CRM pilot scope OPEN. **PLANNING ONLY / NO APP CODE.**

> **v3.6 active owner decision:** D-047 Option A **CONFIRMED** Agency Overview status-first → one main CTA → D-045 four-item checklist → optional Add Property. D-048 My Website hub A/B/C **PROPOSED only**. Canonical `docs/AGENCY-ADMIN-OVERVIEW-D047-CONFIRMED.md`, `docs/MY-WEBSITE-HUB-D048-PROPOSAL.md`. Planning-only; no code.

> **v3.5 ACTIVE D-046 OVERRIDE:** Grouped Agency Admin navigation (Option A) CONFIRMED; Theme/Editor/Preview are **My Website** subordinate actions, not top-level links. See `docs/AGENCY-ADMIN-NAVIGATION-D046-CONFIRMED.md`. Detailed proposed screen inventory: `docs/AGENCY-ADMIN-SCREEN-MAP-v3.5-PROPOSAL.md`. D-047 Option A Overview screen hierarchy is CONFIRMED; D-048 hub screen hierarchy is proposed only. Historical menu/UX descriptions below remain proposals where not explicitly confirmed; routes, labels, breakpoints, CRM scope open. Planning only.

> **v3.4 CURRENT — D-045 Option A CONFIRMED:** Agency Admin Overview has a **compact, nonblocking four-step setup checklist** (Agency Details, Choose Theme, Customize Website, Preview Website); tasks can be visited in any order and Properties remain optional. Canonical: `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md`. **NEXT D-046 PROPOSED ONLY**: navigation/screen grouping in `docs/AGENCY-ADMIN-NAVIGATION-D046-PROPOSAL.md`. Exact page labels/routes, responsive breakpoints and pilot CRM scope remain OPEN. **PLANNING ONLY / NO CODING.**

> **v3.0 typography priority:** D-041 Balanced Premium endpoints CONFIRMED (Hero 40→72px, H2 28→44px, body 16px) under D-040 fluid scaling, across all three theme presets. Interpolation, font weights/line heights, exact colors/spacing/motion and media limits are still UNAPPROVED. See `docs/TYPOGRAPHY-METRICS-D041-CONFIRMED.md`.

> **v3.1 latest D-042 override:** The 12 core background/surface/primaryText/accent HEX values have been APPROVED as Refined Neutral (see `docs/COLOR-HEX-D042-CONFIRMED.md`). Any older statements below that these exact values are still OPEN are historical. Muted/on-accent/border/focus/interaction colors, accessibility QA, Hero overlay and numeric spacing/radii remain OPEN; D-043 overlay approach is next PROPOSED.


# EstateOS — UX principles


> **v2.5 / ACTIVE D-035 + D-036:** Full-Bleed Image Hero CONFIRMED on all three presets (`docs/HERO-D035-CONFIRMED.md`); Editorial Contrast typography CONFIRMED Option B (`docs/TYPOGRAPHY-D036-CONFIRMED.md`): Warm Editorial serif DISPLAY headings + sans body/UI; other two presets sans headings/body. Any old D-035/D-036 OPEN references in historical notes are superseded. Exact font names, HEX colors, overlay metrics, media rules and breakpoint values remain OPEN; next D-037 color controls are PROPOSED only.


> **MVP SCOPE UPDATE (D-028):** Any historical requirement in this document to verify email/proofs/map as an approval prerequisite is **deferred for the 2–3 agency pilot**. Current active product scope: `docs/MVP-RESET-v1.7.md`.


Updated: 2026-10-17

## Confirmed experience rules

1. **Premium visual design**, without visual clutter or complicated controls.
2. **Low-learning-curve interfaces** for real estate agency staff who may be less comfortable with computers.
3. **Desktop and mobile are equally important**; critical workflows (website edit, property entry, inquiries, contacting leads) cannot be desktop-only.
4. **Simple English** for all admin navigation, labels, errors and helper text. Avoid technical language and unexplained jargon.
5. Websites must still make sense with **zero property listings**.

## Confirmed registration UX implications (D-016)

- Initial self-service registration requires six fields after D-017: **Owner Full Name, Agency Name, Mobile Number, WhatsApp Number, Email Address, Password**. D-016 originally approved five, subsequently amended by D-017.
- Additional agency details are completed in the dashboard, not required at initial signup.
- Keep registration straightforward on **both desktop and mobile** with **simple English**. Exact layout and validation copy remain OPEN. The signup verification link is CONFIRMED D-018; link completion (not merely sending an email) verifies ownership. D-020 instead places registration straight into Pending, visible to Super Admin; D-019 `Submit for Approval` requirement is superseded. D-021 now blocks the Super Admin Approve action until owner email is verified; the admin can still review Pending data and private preview. Other notification recipients/events and draft access before verification remain OPEN. D-025 confirms proof categories, while matching/upload details remain OPEN; **D-023 detailed profile, logo, exact map pin and verification evidence are CONFIRMED required before Approve**. Proposed WhatsApp marketing consent must be separately and clearly presented, not presumed from contact entry.

## Confirmed pending-approval UX implications (D-015)

- The pending owner can manage profile/branding, website drafts and property drafts on **desktop and mobile**.
- Show an unmistakable `Pending Approval` status and clearly distinguish **Save Draft** from the disabled/unavailable **Publish** action.
- Website draft previews are **private**, not live links shared with customers.
- Signup email verification link is required D-018. D-020 places agencies in Pending immediately upon registration, visible to Super Admin. **D-021: show clear unverified-email approval ineligibility to Super Admin; Approve must also be refused server-side.** Do not gate Admin review behind `Submit for Approval`; draft work remains private.
- Exact UX (expired/resend, profile checklist, review status, changes requested) and other notification flows need design approval.

## Proposed UX acceptance heuristics — pending detailed approval

- Large touch targets, responsive layouts, readable text, consistent headings and accessible contrast.
- Descriptive buttons (`Add Property`, `Save Draft`, `Publish Website`) instead of icon-only actions.
- Predictable navigation; a short property listing form with progressive disclosure rather than an overwhelming single screen.
- Lead statuses and follow-up dates explained in plain words.
- Critical actions should show confirmation and recovery paths, especially publishing, deleting or suspending.
- Explicit indicators for draft/published and public/private data.
- Useful mobile alternatives to desktop-only drag interactions (Move Up/Down controls).
- Include meaningful empty, loading, success, error, and offline/interrupted connection states.
- Test actual common mobile widths as well as desktop, with representative long agency/property text.
- Short onboarding using easy defaults; allow owners to postpone adding listings.

## Pending UI design decisions

- Color palette, typography, accessibility thresholds and approved design references.
- Navigation layout, number of form steps, website editor behavior on phones.
- Public site language and translation strategy. Admin language is confirmed **simple English**.

### Review UX rules now confirmed (D-022)

Do not hide agency review reasons from the owner who needs to fix issues. Show unambiguous **Changes Requested** and **Rejected** states and a clear **Mark Changes Complete** action only for corrections. Super Admin Reject and Request Changes must collect a reason; details of notifications and rejected-owner edit access remain OPEN. Mobile layouts must make those actions readable and hard to mis-tap.

### Detailed onboarding UX — D-023 CONFIRMED requirement

Keep initial registration to **six fields**. After signup, give owner clear simple-English mobile/desktop-friendly sections for business information, office map pin, mandatory logo upload and mandatory verification evidence. Show checklist progress without blocking the account from appearing in the Super Admin Pending queue. Reviewer sees missing items and cannot Approve until checklist + verified email pass. Upload UX design, acceptable proof policy and public office address visibility remain OPEN.

### D-024 confirmed flexible verification (v1.3)

For Super Admin approval, D-023's verification-document gate is met through **one acceptable business-or-office proof** under D-024; formal company registration is not mandatory and a documented alternative must exist for informal agencies. **D-025 confirms accepted categories and the manual alternative route. Exact matching and alternate-evidence acceptance criteria remain OPEN; D-026 confirms PDF/JPG/PNG, 10 MB per file and mobile camera upload.** A file upload alone never auto-approves an agency. Do not add proof fields to the six-field initial signup or delay immediate Pending visibility. See `docs/VERIFICATION-PROOF-POLICY.md`.

### D-025 accepted proof categories (confirmed)

**D-025 CONFIRMED — Accepted proof categories (Option A):** office rental/lease agreement; office ownership document; office utility bill; business registration certificate; or trade association membership proof. If none is available, an agency may submit alternative business/office evidence for **explicit manual Super Admin review**. Any **one acceptable proof** satisfies D-024; no universal formal registration requirement. Submission alone does not establish acceptability, verify an agency, or activate/publish its site. See `docs/ACCEPTED-VERIFICATION-DOCUMENTS.md`. Exact evidence matching and retention remain OPEN; D-026 confirms upload formats/size.

## D-026 (CONFIRMED) — verification-file upload boundary

For business/office proof uploaded **after minimal registration** (including alternative proof): **PDF (.pdf), JPG/JPEG (.jpg/.jpeg), PNG (.png)** only, **maximum 10 MB per individual file**, and a **mobile camera-photo upload option**. The file format/size approval does not automatically accept evidence or approve/publish the agency. **D-027 now CONFIRMS private storage and authorized owner/reviewer preview/download, with server-side tenant/role checks and no public URLs.** File count, storage vendor/delivery design, malware scanning, evidence matching and **retention/deletion (next D-028)** remain OPEN. See `docs/VERIFICATION-UPLOAD-RULES.md` and `docs/VERIFICATION-DOCUMENT-ACCESS.md`.


---

**Current v2.3 override (D-032/D-033/D-034 CONFIRMED):** Core 9 guided fields/visibility and Move Up/Down, Essential Website Readiness, and three named presets are APPROVED. Exact character/card/media limits, theme hex/font tokens, Hero layout and post-live publication rules remain OPEN. Read `docs/SECTION-FIELDS-D032-CONFIRMED.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/THEME-D034-CONFIRMED.md`. No coding authorized.

## v2.2 active MVP readiness override (D-033 CONFIRMED)

The older registration/verification language in the historical paragraphs above is **not an active MVP approval gate**, as D-028 deferred it. For MVP initial website go-live, only require the selected single template, genuine agency display name, meaningful Hero heading, usable phone **OR** WhatsApp, and a suitable uploaded **OR** properly licensed platform Hero visual (plus manual Super Admin approval). An agency logo **is optional**; render clean text branding when absent. About, Services, Team and Properties are optional; zero listings are valid. `docs/SITE-READINESS-D033-CONFIRMED.md` is canonical. Exact image limits, post-publish edits and design tokens are still OPEN.


## v2.3 visual styling clarification (D-034 CONFIRMED)

One public template uses **three curated presets** (Modern Light, Warm Editorial, Contemporary Dark). Agency admin should have a simple theme-selection control, but its exact UI is still PROPOSED. Preset switching must not produce different required content or allow a Pending tenant's site to become public. **HISTORICAL v2.3 note:** Later D-035 approved the Full-Bleed Hero, D-036 approved Editorial Contrast font categories and D-037 fixed palette controls. Exact HEX values, font families, animation and mobile breakpoint metrics remain OPEN; the old `docs/VISUAL-D035-PROPOSAL.md` is not an active decision. Historical mandatory email/proof UX above is overridden by D-028 for the pilot.

## Confirmed theme simplicity (D-037, v2.6)

Agency owner chooses only among Modern Light, Warm Editorial and Contemporary Dark. Each choice has one fixed curated color palette; never show color-level controls, extra accent palettes or logo-based color recommendations in MVP. Exact color values remain a pending design decision. Public theme selection must not complicate a stable, accessible Admin UI.

## v2.9 typography UX decision (D-040 CONFIRMED)

Use a **single fluid responsive semantic typography scale** across the three public agency-site themes (Modern Light, Warm Editorial, Contemporary Dark). Keep heading/CTA readable over full-bleed photos on narrow/mobile screens; honor browser zoom/text resizing. D-039 fonts remain binding; exact sizes/weights/line heights are OPEN, do not invent them. See `docs/TYPOGRAPHY-SCALE-D040-CONFIRMED.md`.


## v3.3 D-044 Task-First Agency Admin direction (CONFIRMED)

The pilot's Agency Admin Overview is task-first: surface current status, next website setup action and simple access to edit/preview; properties remain optional. Prefer clear desktop sidebar-style navigation and a compact understandable mobile menu over analytics-first charts. **D-044 does not approve exact navigation labels, a screen list, an onboarding checklist, or CRM/Inquiries inclusion.** Canonical `docs/DASHBOARD-UX-D044-CONFIRMED.md`; next UX screen map/checklist proposal `docs/AGENCY-ADMIN-SCREENS-D045-PROPOSAL.md` is UNAPPROVED. All code remains unauthorized.


## v3.4 active UX override — D-045 confirmed

Agency Admin Overview uses a compact, nonblocking four-task setup checklist. **No compulsory wizard**, no property requirement and no extra first-time Publish/Submit action. The setup tasks deep-link to Agency Details, Choose Theme, Customize Website and private Preview; order is up to the owner. The old D-023 document/map verification requirements in historical paragraphs above are **deferred under D-028**; do not surface them as current MVP gates. Exact screen names, menu routing and breakpoint sizes remain OPEN. See `docs/AGENCY-ONBOARDING-D045-CONFIRMED.md` and proposed `docs/AGENCY-ADMIN-NAVIGATION-D046-PROPOSAL.md`.


## v4.0 confirmed Agency Admin editor protection (D-051)

If a user tries leaving a dirty current Website Editor section for another section, My Website or Preview, present **Save / Discard / Stay**. Save navigates only after D-050 section persistence actually succeeds; Discard abandons only current unsaved edits; Stay retains edits in place. This does not enable autosave, publish changes to live sites, or finalize exact modal/browser unload behavior. Preview data source remains D-052 PROPOSED. See `docs/WEBSITE-EDITOR-UNSAVED-D051-CONFIRMED.md`.
