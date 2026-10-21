> **RESOLVED — HISTORICAL ALTERNATIVES ONLY (v4.4 / 2026-10-19):** Owner confirmed **D-055 Option A**, one-page Agency Profile with visible essentials and expandable optional secondary details. Canonical approved scope is `docs/AGENCY-PROFILE-UX-D055-CONFIRMED.md`. The older OPEN / NOT APPROVED wording below is an archived v4.3 proposal, not current status. Exact required fields, Profile Save/unsaved states, publication/sync and routes remain OPEN. **NEXT D-056 is PROPOSED ONLY**, `docs/PROPERTIES-LIST-D056-PROPOSAL.md`. No app code.

# D-055 — PROPOSED ONLY: Agency Profile Screen UX

**Status:** OPEN — NOT APPROVED | **Created:** 2026-10-19 | **Bundle:** v4.3 | **Mode:** PLANNING ONLY

## Question to owner

Inside D-046 grouped Agency Admin navigation, how should **Agency Profile** present agency and contact information for a nontechnical small real-estate office owner? Choose **layout/interaction hierarchy only** here; do not treat the proposed exact field list, requiredness or routes as already approved.

### Option A — One Simple Page: Essentials First + Optional Details (RECOMMENDED)

- One easy-to-scan profile page. Essential agency/contact inputs are prominent; optional business description, office/service area, logo and contact extras in a compact secondary/expandable section.
- One clear profile-specific Save Changes action; validation and save-state feedback must be honest. The exact button text and field-level requirements remain open.
- A user can edit basic profile independently of the website section editor; where overlapping data affects the public website, synchronization/publication implications are **NOT YET DECIDED** and must preserve D-053 for already-Live sites.
- Responsive single-column mobile layout; comfortable desktop form width. No forced wizard or mandatory business-document uploads.
- **Recommended for 2–3 agency pilot**: least navigation and lowest cognitive load.

### Option B — Two or Three Simple Tabs

- Separate Agency Details, Contact, and Optional Branding tabs; reduced form height but extra navigation/tabs to learn.
- Save/update scope for tabs and synchronization with public website remain open.

### Option C — Guided Multi-Step Profile Wizard

- Sequential small pages for Business, Contact and Branding; more guided but introduces steps and potential completion friction.
- Must not create a new Super Admin approval, first publish, KYC or forced profile-completion gate.

## Proposed field buckets — do NOT approve requiredness from this document

- **Known basic registration context:** agency name, owner name, mobile, WhatsApp, email (see D-016/D-017 and `docs/REGISTRATION-FLOW.md`). D-033 published-site readiness only needs real agency name, genuine Hero heading, usable **phone OR WhatsApp**, a selected template and a legitimate Hero image; do not accidentally require all optional profile fields for site readiness.
- **Candidate optional details:** agency description, office/service area/address, logo, social/contact links. Logo is not a mandatory readiness/approval item.
- **Not MVP prerequisites:** business registration certificates, location/map verification, office lease evidence, email/KYC/document gates; D-028 defers these.
- Owner vs agency contact identities, account email edits, password/security, requiredness and public profile vs website section source of truth are OPEN.

## Compatibility

D-045 nonblocking onboarding links to Agency Details; D-047 Overview status-first; D-048 My Website separate hub; D-050 editor saves a current **website section** and does not define Profile save behavior. D-053/D-054 protect the public already-Live version from implicit edits. Zero property records remains valid.

## Parallel Properties UX discussion

Read `docs/AGENCY-PROFILE-PROPERTIES-UX-v4.3-DISCUSSION.md`. Property list/add/edit/media fields and whether their saved changes appear in the already-Live public website need further owner approval. Do not assume full CRM/Inquiries in pilot.

## Explicitly OPEN

Selection of A/B/C; detailed field inventory and validation, Save/cancel/unsaved warnings for Profile, role permissions, photo storage/crop, sync with public website, final English copy/routes/breakpoints, property workflows and CRM scope. **No implementation.**
