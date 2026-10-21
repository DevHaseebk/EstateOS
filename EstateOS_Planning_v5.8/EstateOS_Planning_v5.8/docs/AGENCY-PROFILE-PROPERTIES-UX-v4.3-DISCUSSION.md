> **v4.4 STATUS OVERRIDE:** D-055 **one-page Agency Profile essentials-first + expandable optional details layout is CONFIRMED** in `docs/AGENCY-PROFILE-UX-D055-CONFIRMED.md`. Older D-055-unapproved phrases below are historical. Optional Properties list and Add/Edit models remain UNAPPROVED; D-056 proposal and detailed screen discussion in `docs/PROPERTIES-LIST-D056-PROPOSAL.md` / `docs/PROPERTIES-SCREENS-D056-DISCUSSION.md`. No code.

# Agency Profile + Optional Properties — Screen-by-Screen UX Discussion (v4.3)

**Status:** PROPOSED / FOR DISCUSSION, not confirmed fields or flows | **Date:** 2026-10-19 | **Mode:** PLANNING ONLY

This screen map uses the previously approved **D-044 task-first dashboard, D-045 nonblocking setup checklist, D-046 grouped navigation, D-047 Overview hierarchy, D-048 My Website hub, D-049–D-054 draft / Preview / publish rules**. It is **not** permission to implement. Suggested names below are working English copy, not approved final labels.

## Agency Profile — recommended candidate screen, D-055 unapproved

**Navigation:** Agency Admin → Agency Profile (candidate top-level item under D-046; final labels/routes pending).

1. **Agency essentials (visible immediately):** agency name, owner name, usable contact phone/WhatsApp, email, subject to actual account/registration source of truth and future permissions/requiredness decision.
2. **Optional business info:** about/short description, office location/service area, logo, optional socials/secondary contacts. Do not enforce office address, logo or KYC uploads as requirements for pilot approval or D-033 readiness.
3. **Editing:** simple labeled controls, inline validation, a deliberate form-level Save action as a proposed UX. Warn on unsaved navigation *only if separately approved for Profile*; D-051 is currently specific to current Website Editor sections.
4. **Mobile:** one column, clear labels and large touch targets; no exact breakpoint number confirmed.
5. **Public website interaction (OPEN):** profile contact edits that feed website must not silently break D-053 already-Live draft/publish separation. Define profile-to-website synchronization and readiness recalculation separately.

## Properties — optional module (proposed)

**Purpose:** Agent with zero properties still has a valid professional agency website; adding properties is optional. Make this screen useful for an agency that wants listings without forcing data entry just to launch.

### Empty state

A friendly message such as 'No properties added yet' and optional **Add Property** action; do not display errors or suggest the website cannot go Live with zero listings. Property section itself may be hidden under D-032.

### Listing view

Candidate rows/cards: thumbnail (if available), title, location/area, sale/rent type, asking price, a simple status, and Edit/Remove actions. This is a *candidate schema/view only*, not confirmed fields or sorting, permissions, delete semantics, publication states or required photos. Avoid analytics-first reports or CRM dependency.

### Add/Edit Property

Candidate groups:
- **Basics:** property title/type, sale or rent, asking price, area/neighborhood.
- **Details:** size/unit, beds, baths, floor/other highlights, short description.
- **Photos:** optional gallery with accessible reorder/remove states; exact limits, formats, crop/security and mandatory-photo policy OPEN.
- **Status:** candidate availability/draft visibility; exact list/archive/publish/deactivate behavior OPEN.

**Important publishing boundary:** User approval of D-053 does not automatically specify whether a property record save changes the already-Live public site, whether Properties shares website Publish Updates, or whether individual property listings have a separate release lifecycle. Flag this for explicit future decision; do not infer.

## Recommended planning sequence

- **D-055:** Agency Profile layout (A one-page essentials + optional details, recommended; B tabs; C wizard).
- **D-056+ (not yet proposed as an option contract):** exact Profile editing/source of truth, optional Properties listing and form behavior, property-to-public-site update rules, then Super Admin review/approval/blocked states.
- **Still pending across all:** final copy/routes, responsive breakpoints, Profile/Property validation/save/error handling, security/access controls, CRM/Inquiries pilot inclusion.

**Preserve:** D-029 initial automatic activation, D-033 minimal readiness, D-053 explicit post-live Publish Updates, D-054 compact truthful draft/live indicators and no misleading status.
