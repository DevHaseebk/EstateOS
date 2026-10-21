# D-063 — CONFIRMED: Shared Publish Updates for Saved Property Changes on Already-Live Websites

**Decision:** D-063 | **Status:** CONFIRMED — Option A | **Owner approved:** 2026-10-21 | **Planning bundle:** v5.2 | **Mode:** PLANNING ONLY — NO APPLICATION CODE.

## What is approved

An agency with an **already-Live public website** uses **ONE existing site-level explicit Publish Updates action** to publish its **eligible, successfully saved individual-property changes**, along with eligible saved website-section and applied-theme changes. Owners should not need an additional per-property `Publish Property` or `Unpublish Property` control as the baseline MVP workflow.

1. The agent creates/edits an individual property in the D-057 one-page form and deliberately uses the **D-061 whole-record Save Property**. Successful Save updates the private saved record/draft; **it must not immediately change the public Live site**.
2. Property additions, edits, photos, eligible availability updates and Archive/Restore-related changes may be represented in the saved private state, but **which records are eligible for the public snapshot and whether/how a status or archive affects a public listing are STILL UNAPPROVED**. D-063 does NOT decree Sold/Rented/Archived records visible, hidden, labelled or unpublished.
3. Agency owner can use private D-052 Saved Draft Preview to review saved website content/theme; how property changes render/appear in this preview, and any compare/caching behavior, are still open. **Do not invent final property-preview visibility rules.**
4. Only a deliberate, successfully completed existing **Publish Updates** action (D-053) is the approved trigger for **subsequent property draft-to-public publication** on an already-Live website. Until successful publication, the previous Live public snapshot stays authoritative, subject to separately specified failure/rollback/caching rules. The exact all-or-nothing transaction or inclusion scope remains open.
5. **D-054** My Website Live + Unpublished Changes status and contextual Publish Updates action remains. Actual saved pending eligible property changes fall under the same high-level draft-vs-live framework; the precise change-detection algorithm and display remain open. Never count unsaved inputs or un-applied theme candidates as pending saved changes.

## Important separation: FIRST website launch (D-029) remains AUTOMATIC

**NO NEW INITIAL OWNER PUBLISH / SUBMIT / APPROVAL GATE.** On the very first public website activation, manual **Super Admin agency approval** AND **D-033 minimum website readiness** together lead to **automatic first Live**. There is no required owner click on `Publish Updates`, no additional property mandate, and a zero-property agency remains valid. **Property visibility/eligibility in the first public snapshot is still an open decision**; do not silently assume all saved draft properties must publish or block first launch for lack of properties.

## Decisions preserved

- **D-028:** lean 2–3 small-agency pilot; keep agency approval minimal and do not reintroduce heavy verification, proof documents, or email gates.
- **D-033:** minimum website readiness is template, real agency name, genuine Hero heading, usable phone OR WhatsApp, valid uploaded or licensed platform-default Hero image; Properties are never required.
- **D-049/D-050/D-051/D-052:** theme candidate previews do not apply until explicit Apply, section changes are saved explicitly, Save/Discard/Stay handles dirty navigation, and private website preview contains only successfully saved section draft and applied theme.
- **D-053:** explicit owner-controlled Publish Updates only for already-Live subsequent changes, now explicitly **expanded by D-063 to eligible property records**. No per-update Super Admin review required by this decision.
- **D-056–D-061:** optional responsive Admin property cards, one page Basics + expandable Details/Photos, six required saved-property fields, optional gallery/cover with max 10 JPEG/PNG/WebP images of max 5 MB each and clear per-file feedback, whole-record Save + dirty guard.
- **D-062:** Available/Sold/Rented availability concepts and reversible Archive/Restore, **no permanent Delete MVP**. Internal availability/archive does not by itself establish public visibility/transition rules.

## Still OPEN — must be separately approved before coding

- Which properties are eligible/visible at **first automatic website launch** and in subsequent publication, including absent photos, six required fields, property status (Available/Sold/Rented), archived/restored state, invalid or blocked listings and optional Properties section hidden/not hidden.
- Public-facing SOLD/RENTED badges or filters, archive public removal, change propagation, publish-scope selection, duplicate/invalid records, exact validation and permission checks.
- Atomicity, failure/retry, rollback, version conflicts, cache invalidation/propagation, preview sync/URL, accurate pending-change detection, acknowledgements, activity/audit records and blocked/Deactivated cases.
- Exact property-status enum keys, defaults/transitions and confirmation/restore mechanics; property upload privacy/security/EXIF/processing/progress/retry/transactions.
- UI copy, routes, numerical responsive breakpoints, Profile public synchronization, pilot CRM/Inquiries, Super Admin layout, access and detailed review flows.

## Rejected options / history

- **Option B** separate per-property Publish/Unpublish is not selected as the default MVP model.
- **Option C** immediate automatic public property sync on Save/status/archive is not selected.
- Earlier `docs/PROPERTY-PUBLIC-PUBLISHING-D063-PROPOSAL.md` is **HISTORICAL / RESOLVED**, retained for audit, not active implementation authority.

**No application implementation is authorized.** Read this document alongside D-029 and D-053, and latest `docs/AI/CURRENT-STATE.md` and `docs/AI/HANDOVER-LATEST.md`.
