> **D-063 v5.2 interpretation:** D-061 whole-record Save remains PRIVATE saved property draft. D-063 now explicitly confirms **eligible** property changes on already-Live websites join D-053 existing deliberate Publish Updates; never silently auto-publish on Save. Exact eligibility/status/archive effects open. See `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`.

# D-061 — CONFIRMED: Whole-Property Manual Save + Save/Discard/Stay Guard

**Decision:** D-061 Option A | **Owner approved:** 2026-10-21 | **Bundle:** EstateOS v5.0 | **Phase:** Planning ONLY; no application implementation authorized.

## Approved scope

For both **Add Property** and **Edit Property**, use **ONE explicit manual Save Property action for the complete one-page property record**. This includes the D-057 Basics group and any expanded optional Property Details and Photos inputs. Do **not** introduce section-by-section Property saves, a primary Global Save All across records, or ordinary autosave.

- D-058: A successful property record Save requires the SIX approved Basics categories to be present: Title, Listing Intent (Sale/Rent), Property Type, Price denominated PKR, City, Area/Neighborhood. These are categories, not finalized validation algorithms or enums. Optional Details and ALL images/cover stay optional.
- D-059: The optional thumbnail gallery, explicit cover choice and simple reorder/remove are part of the overall property form rather than an independently published artifact.
- D-060: The gallery limit is max 10 images per property, max 5 MB each, JPEG/PNG/WebP, with clear per-file invalidity. Exact upload queue and persistence atomicity are still OPEN.
- Do not show a false saved/success indication until **the relevant property record persistence actually succeeds**. Error/validation details and retry implementation are open.

## Guard on unsaved navigation

When the form contains unsaved changes and the user initiates navigation away from Add/Edit Property (e.g., Back to Properties or another Agency Admin destination), offer three clear actions:

| Choice (conceptual, final wording OPEN) | Required behaviour |
| --- | --- |
| **Save** | Attempt the explicit whole-record Save Property. **Only proceed with the intended navigation after a successful save.** If validation/persistence fails, do not claim success and preserve editable inputs; precise feedback/retry remains open. |
| **Discard** | Abandon ONLY the changes not yet persisted during this edit session; then proceed. On Edit, this must not delete/modify the last saved property. On Add, unsaved input alone must not silently create a property. |
| **Stay** (Continue Editing) | Cancel navigation and retain current unsaved inputs in the form. |

Do not implement a forced autosave or a simpler two-choice Leave/Keep Editing policy as D-061's primary protection. This Property form rule is **separately approved** from D-050 website-section Save and D-051 website-section unsaved guard; they have different save scopes.

The approved guard covers intended in-app navigation from a dirty Property form. **Precise browser Back/reload/close interception, mobile gesture handling, dirty-field/photo-upload-state detection, queued files, offline behaviour, long-pending saves and concurrency are NOT yet specified**; do not infer technical contracts from the UX wording.

## Explicit non-decisions / pending specifications

- Exact English labels, Save/Cancel placement, status messages and success navigation destination.
- Exact six-field enums/validators, errors, optional field inventory, currency rules, whether incomplete inputs may exist as temporary unsaved local state.
- **Pending photo uploads at Save**, transaction scope, whether partial uploads may succeed, retries, progress/cancel, orphan media cleanup, storage, security/EXIF/privacy and compression/derivatives.
- Validation, persistence failure handling, server/API response shapes, retry/recovery, save conflicts and permissions.
- Property availability status, sold/rented classification, archive/delete/restore and list filtering (**NEXT D-062 PROPOSED ONLY**).
- Individual-property **public** publishing, updates/withdrawal or relation to D-053 site-level Publish Updates. A property record's successful Save is **not** a decision that it becomes public.
- Agency Profile persistence and public sync, CRM pilot scope, final routes/labels, responsive breakpoint numbers.

## Invariants & precedence

- **D-056**: responsive Agency Admin property cards, zero-property empty state. **D-057**: one responsive Basics-first Add/Edit page with optional expandable Details and Photos. **D-058**: six required Basic categories, no mandatory photos. **D-059/D-060**: gallery and photo guardrails as above.
- **D-029/D-033**: FIRST agency website activation is automatic once manual Super Admin approval and site readiness both hold. There is **NO initial owner Publish/Submit requirement**; a site with ZERO properties remains valid.
- **D-049–D-054**: website content/theme private saved drafts and post-live Publish Updates are separate from a property record lifecycle. Keep D-053 deliberate publishing for changes to an **already-live** website's sections/theme; property-specific public visibility still OPEN.
- Old `docs/PROPERTY-SAVE-UNSAVED-D061-PROPOSAL.md` is historical/resolved: A selected, B and C not approved.
- **NEXT D-062 PROPOSED ONLY:** `docs/PROPERTY-STATUS-ARCHIVE-D062-PROPOSAL.md`.

**No application code authorized.**
