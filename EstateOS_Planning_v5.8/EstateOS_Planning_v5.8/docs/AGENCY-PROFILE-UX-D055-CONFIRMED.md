# D-055 — CONFIRMED: One-page Agency Profile, essentials first

**Owner decision:** Option A | **Status:** CONFIRMED | **Date:** 2026-10-19 | **Bundle:** v4.4 | **Mode:** PLANNING ONLY

## Scope of approval — screen composition, not field policy

- Agency Admin has **one simple Agency Profile page**, rather than tabs or a guided wizard.
- **Core agency identity/contact essentials are immediately visible**, with clear form grouping and short guidance for a nontechnical small real-estate office owner.
- **Secondary optional business information is grouped beneath** in a clearly discoverable expandable/collapsible area to reduce distraction. Examples to explore include description, office/service area, logo and optional links; these examples are **NOT approved required fields**.
- On narrow screens this remains a straightforward vertical, touch-friendly form; on desktop use a restrained readable content width. Exact responsive breakpoints, columns and numerical spacing remain **OPEN**.
- Owner can reach this page from D-046 grouped navigation and the D-045 nonblocking Agency Details checklist task. The checklist does not become a publication gate.
- This is the screen layout decision only. One clear profile-specific Save action is a **candidate interaction**, not an approved validation, persistence, autosave, exit warning or publish policy.

## Concrete conceptual screen hierarchy (NOT final copy/fields)

1. Page header — agency identity/profile explanation.
2. Primary group — agency name, owner identity, mobile/WhatsApp and email **as candidate fields**; distinguish account contact from public agency contact in subsequent decisions.
3. Secondary collapsible group — description, service/office location, logo, social or secondary contacts **as candidate optional fields**.
4. Clear form action area — proposed deliberate Save Changes plus real validation feedback; exact action/cancel/dirty state **OPEN**.

## Guardrails inherited from approved decisions

- D-028 lean 2–3 agency pilot, no new company registration proof/KYC/map/email-verification gate; D-033 site readiness still only requires one selected template, genuine agency name and Hero heading, usable phone OR WhatsApp, and appropriate uploaded/licensed Hero photo. **Logo, About, Services, Properties and extended profile details NOT prerequisites.**
- D-029 FIRST website publication remains automatic after Super Admin agency approval AND D-033 readiness; **no initial owner Publish or Submit gate.**
- D-049 explicit theme Apply, D-050 per-website-section manual Save, D-051 dirty-section Save/Discard/Stay, D-052 saved-draft Preview, and D-053 already-live explicit Publish Updates are **website-specific approvals**, not blanket approval of profile form Save, field synchronization or automatic public-page updates.
- If future Agency Profile edits affect public website data, their source-of-truth and draft-versus-live treatment **must be explicitly decided** and cannot bypass D-053 for already-live websites.
- Agency may retain zero Properties. D-054 compact truthful Live/pending-draft indicators remain conditional on real states.

## Explicitly NOT approved by D-055

Exact field inventory/requiredness, input validation and permissions, owner/account email changes, profile save/cancel/error handling, lost-edit prompts, logo upload policy, profile-to-site sync and source of truth, whether changing essential details affects readiness, final labels/routes, mobile pixel breakpoints, Inquiries/CRM scope and optional Property CRUD/publication semantics.

## History and next decision

`docs/AGENCY-PROFILE-UX-D055-PROPOSAL.md` is a **RESOLVED HISTORICAL** A/B/C option list; do not interpret B or C as approved. Next **D-056 PROPOSED ONLY** optional Properties list UX in `docs/PROPERTIES-LIST-D056-PROPOSAL.md`. Accompanying Add/Edit details in `docs/PROPERTIES-SCREENS-D056-DISCUSSION.md` are not a confirmed model. **NO APPLICATION CODE.**
