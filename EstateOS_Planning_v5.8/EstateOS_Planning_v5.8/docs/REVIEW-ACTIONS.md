## v5.6 CURRENT — D-067…D-073 review decisions

D-066 action-specific dialogs/mobile sheets remain. D-022 reason mandatory Request Changes and Reject; D-067 separate Changes Requested; D-068 owner corrections + explicit Resubmit for manual review; D-069 Super Admin may reopen Rejected, never autoapproves. D-071 independent Block and Deactivate reasoned confirmations and Super Admin-only reversible actions; their public/site/session effects OPEN. D-073 critical decision audit + truthful in-app status; automated emails not required. Do not use historical proposals below as authorization. See `docs/SUPER-ADMIN-REVIEW-LIFECYCLE-v5.6.md`.

---

# EstateOS — D-022 Structured Review Actions

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | **D-022 CONFIRMED** | M00 Product Discovery | Planning only

## Scope and precedence

D-022 governs **Request Changes** and **Reject** actions in self-service agency review. It builds upon D-014/D-015 (manual approval, drafts only), D-018/D-021 (owner email verification required before **Approve**) and D-020 (Pending immediately after self-service signup and visible to Super Admin). **D-019 remains SUPERSEDED**: owners do not submit an initial approval request.

## Confirmed action semantics

### Request Changes

1. Authorized Super Admin reviews saved agency data and a private website draft preview when present.
2. Admin chooses **Request Changes** and provides a **mandatory, non-empty reason** explaining what needs correction. A request without a reason must fail server-side.
3. Agency enters a distinct **Changes Requested** review state. Approval and all public publishing remain blocked; agency drafts and authorized preview remain private.
4. The owner can review the reason, correct agency profile and permitted drafts, and explicitly select **Mark Changes Complete**.
5. **Mark Changes Complete** returns the case to the review queue for Super Admin re-review. This is **not** the initial `Submit for Approval` action prohibited by D-020. It does **not** automatically approve, verify email, or publish the website.
6. Super Admin then reviews and selects the next review action. **Approve still requires verified owner email** under D-021.

### Reject

1. Authorized Super Admin chooses **Reject** and provides a **mandatory, non-empty reason**. A reasonless rejection must fail server-side.
2. Agency enters a **Rejected** review state. It is **not approved**, and public website/property publishing remains blocked.
3. **Super Admin may manually reopen a rejected agency** to reconsider it. Reopening must be an explicit authorized action; it never grants approval or publishes content automatically.
4. There is no automatic owner reapplication or automatic reopening implied by D-022.

## State model — business-level, not final database schema

```text
Self-service SIGNUP --> PENDING (Super Admin list immediately; D-020)
PENDING --> REQUEST CHANGES [mandatory reason] --> CHANGES REQUESTED
CHANGES REQUESTED --> MARK CHANGES COMPLETE [owner action] --> PENDING / re-review
PENDING --> REJECT [mandatory reason] --> REJECTED
REJECTED --> ADMIN REOPEN [authorized explicit action] --> RE-REVIEW (exact status policy OPEN)
PENDING --> APPROVE [verified email, D-021; further criteria OPEN] --> APPROVED
APPROVED --> OWNER EXPLICIT PUBLISH (separate operation)
```

No transition here bypasses tenant scoping, RBAC, audit recommendations, the email-verified Approve requirement or public publication guardrails.

## Proposed UX, NOT an approved detailed screen spec

- Super Admin review page shows Request Changes / Reject dialogs with required reason textarea.
- Owner sees the correction reason in a clearly named **Changes Requested** state, with a single **Mark Changes Complete** button after edits.
- Status timeline and review history for admins and owners are recommended.
- After Rejected, owner sees a comprehensible outcome and optional support contact; whether they may continue editing or sign in is **OPEN**.

## Proposed validations / acceptance scenarios

- Reasonless Request Changes and reasonless Reject fail through direct API as well as UI.
- Mark Changes Complete can only be performed by an authorized member of that Changes Requested tenant; it cannot approve or publish.
- Super Admin can re-review after completion without any new initial signup or account creation.
- Rejected tenants cannot publish; only an authorized Super Admin can explicitly reopen.
- Unverified owner email still blocks Approve even after corrections or reopening.
- Preview stays private regardless of review status.

## Still OPEN — do not silently decide

- Exact reason length limits, templates, how admin identifies required corrections, whether specific fields are locked, and whether a meaningful edit is required before Mark Changes Complete.
- Whether Request Changes / Reject / Reopen send email notifications, to whom, when and via which provider. **No notification trigger has been newly approved by D-022.**
- After rejection: owner login/draft edit restrictions, appeals/support path, retention/deletion, reopening status (`Pending` vs a dedicated `Reopened`) and whether email verification must be repeated on changed email.
- Whether email verification is needed before accessing the draft workspace (D-015 timing), and required agency profile data before Approve.
- Rules for super-admin-created agencies, approval concurrent edits and action audits (audit recommended).

**No application code, deployment or integration work authorized.**

## D-023 interaction (confirmed in v1.2)

Detailed agency information, required logo, exact map pin and verification evidence must be present before **Approve** (plus verified owner email D-021), not before Pending visibility or Request Changes / Reject. Admin may use Request Changes with reason when proof/profile is missing or unacceptable. **Mark Changes Complete** is only a corrections return-to-review action and never auto-approves. D-024/D-025 confirm one accepted proof and named proof categories; evidence matching and finer rejection/reopen mechanics remain OPEN. See `docs/AGENCY-PROFILE-REQUIREMENTS.md`.

### D-024 confirmed flexible verification (v1.3)

For Super Admin approval, D-023's verification-document gate is met through **one acceptable business-or-office proof** under D-024; formal company registration is not mandatory and a documented alternative must exist for informal agencies. **D-025 confirms accepted categories and the manual alternative route. Exact matching and alternate-evidence acceptance criteria remain OPEN; D-026 confirms PDF/JPG/PNG, 10 MB per file and mobile camera upload.** A file upload alone never auto-approves an agency. Do not add proof fields to the six-field initial signup or delay immediate Pending visibility. See `docs/VERIFICATION-PROOF-POLICY.md`.

### D-025 accepted proof categories (confirmed)

**D-025 CONFIRMED — Accepted proof categories (Option A):** office rental/lease agreement; office ownership document; office utility bill; business registration certificate; or trade association membership proof. If none is available, an agency may submit alternative business/office evidence for **explicit manual Super Admin review**. Any **one acceptable proof** satisfies D-024; no universal formal registration requirement. Submission alone does not establish acceptability, verify an agency, or activate/publish its site. See `docs/ACCEPTED-VERIFICATION-DOCUMENTS.md`. Exact evidence matching and retention remain OPEN; D-026 confirms upload formats/size.

## D-026 (CONFIRMED) — verification-file upload boundary

For business/office proof uploaded **after minimal registration** (including alternative proof): **PDF (.pdf), JPG/JPEG (.jpg/.jpeg), PNG (.png)** only, **maximum 10 MB per individual file**, and a **mobile camera-photo upload option**. The file format/size approval does not automatically accept evidence or approve/publish the agency. D-027 private access is CONFIRMED; file count, storage vendor/delivery implementation, malware scanning, evidence matching, and retention/deletion remain **OPEN**. See `docs/VERIFICATION-UPLOAD-RULES.md`; next decision D-027 concerns document access/privacy.
