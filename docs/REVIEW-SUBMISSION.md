# EstateOS — Historical review submission decision

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | Status: **D-019 SUPERSEDED BY D-020**

D-019 previously required the owner to verify email, finish required profile fields and click **Submit for Approval** before the Super Admin could review an agency. **This is no longer active.**

## Current authority

Read `docs/APPROVAL-REVIEW-FLOW.md` and `docs/DECISIONS.md` (D-020). Registration itself now creates a **Pending** agency visible immediately to the Super Admin, who can see available agency data and private website draft preview, then **Approve / Reject / Request Changes**.

- Do **not** implement an owner `Submit for Approval` gate to Super Admin visibility.
- Agency profile details remain editable in the draft workspace while pending (D-015); exact review/effect rules pending.
- Email verification (D-018) stays a separate state. **D-021 now confirms it gates the Admin Approve action**; unverified owner email blocks Approve. This is **not** a return of the deprecated owner `Submit for Approval` step.
- Approval does not publish the site; the owner publishes explicitly (D-014/D-015).

This file is retained solely so AI assistants reading an earlier handover know why the previous design changed.
