# EstateOS — D-033: Minimum Website Readiness (CONFIRMED)

**Decision: D-033, Option A — Essential Website Details | Approved 2026-10-18 | Planning v2.2 | M00 PLANNING ONLY**

## Authority and scope

This is the current MVP definition of a *ready* agency website for **D-029 automatic initial activation**. It overrides any more demanding older readiness *proposals* or deferred D-023 business-verification conditions. It does **not** waive D-014 manual Super Admin approval or the D-015 restriction on publishing Pending agencies.

## The complete required checklist

A website is content-ready only when **all** the following are true:

1. **The one approved MVP website template (D-030) has been selected.**
2. **Agency display name exists** and is not merely a sample/demo placeholder.
3. **Hero heading contains genuine non-empty content** (not sample filler).
4. **Contact CTA includes at least one usable public contact method: phone OR WhatsApp.** A second method is optional; phone/WhatsApp syntax and link usability must be validated at the app layer. Requiring OTP or ownership verification is *not* an MVP gate (D-028).
5. **Hero has a suitable image/visual:** either an agency-uploaded image **OR** a legitimate platform-provided default visual appropriate to the selected template. Any built-in asset must be owned or correctly licensed and available before it is used in a live site. The exact asset choice and website-image format/size/crop rules are separate OPEN decisions.

**Not required for site readiness:** uploaded logo (show an agency-name text fallback), Hero subtitle, About text, Service cards, Why Choose Us, Team, Property listings, Testimonials/FAQ, exact office map pin, verification documents or email-verification gate. The zero-property agency remains a first-class supported scenario. Since Hero and Contact CTA are always-visible sections (D-032), a ready page cannot hide them.

## Public activation gate

| Agency / site condition | Public website / link |
|---|---|
| Pending, even if content-ready | **No public site; private preview only** |
| Approved + all 5 readiness criteria satisfied | **Automatically activate initial site; then show tested working public URL** |
| Approved + any readiness criterion missing | **No public site or broken public URL; show missing-item guidance** |
| Approved + zero properties | **May activate** when 5 readiness criteria satisfied; do not display fake properties |

Never show sample agency names, demo listing data, fabricated services/agents or misleading broken CTAs on the public site. If a platform default hero visual is unavailable or unlicensed, it does **not** satisfy the Hero requirement; ask for a valid upload until a permitted default exists.

## Proposed implementation / QA guidance (NOT separate owner decisions)

- Use a single server-side `getReadinessIssues(site, agency)` rule for approval/publishing eligibility; show exactly the same messages to Agency Owner and Super Admin. UI-only checks are insufficient.
- Validate the selected template, saved data, correct tenant and accessible allowed media; safely handle missing optional sections without empty headings or placeholder text.
- Avoid claiming the site is live or showing its URL until the publication actually succeeded.
- Example checks: pending owner with all essentials is still private; approved owner with missing contact remains unpublished; approved owner with a safe platform-default hero is eligible; zero properties must not block.
- Logo absent should produce text branding, not a blank/broken image. Without About or Services content, hide empty optional sections gracefully.

## Decisions intentionally still OPEN

- If **agency was approved while unready** and later completes a missing field: exact trigger to retry initial auto-activation (on Save, on a Complete Setup action, etc.).
- Post-live edits: direct updates vs draft/explicit Publish vs revision-based workflow.
- Exact contact formatting rules, page and CTA routing, fallback hero asset selection/licensing, website image formats/size/crop, media upload limits, text/card caps, and theme preset count/colors/fonts.
- Block vs Deactivate public routing and reactivation behavior.

**No application coding, scaffolding, or deployment has been authorized.**
