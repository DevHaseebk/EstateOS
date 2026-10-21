# EstateOS — Accepted verification proof categories (D-025)

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | Bundle **v1.5** | M00 Product Discovery | **D-025 CONFIRMED** | PLANNING ONLY

## Approved owner decision — Option A

**D-025 CONFIRMED — Accepted proof categories (Option A):** office rental/lease agreement; office ownership document; office utility bill; business registration certificate; or trade association membership proof. If none is available, an agency may submit alternative business/office evidence for **explicit manual Super Admin review**. Any **one acceptable proof** satisfies D-024; no universal formal registration requirement. Submission alone does not establish acceptability, verify an agency, or activate/publish its site.

## Approved list — one acceptable proof is sufficient

1. **Office rental or lease agreement**.
2. **Office ownership document**.
3. **Office utility bill**.
4. **Business registration certificate**.
5. **Trade association membership proof**.
6. **Alternative business/office evidence**, when none of the listed types is available, via explicit Super Admin manual review; reviewer must decide adequacy case by case. This is a fallback route, **not** a waiver of the one-acceptable-proof requirement.

There is **no rank ordering** among the five named categories. An office proof OR business proof may suffice. The flexible alternative route exists for informal agencies that do not have those document types. A manual reviewer can **Request Changes** with a mandatory reason if the evidence is missing, unclear, or unacceptable, or **Reject** with a mandatory reason (D-022). Admin approval is manual, not triggered by document upload.

## Relationship to other confirmed requirements

- D-016/D-017: Signup still has six fields only. Evidence is uploaded during dashboard onboarding, not initial registration.
- D-020: Agency enters the **Pending** Super Admin review list immediately after registration, even without evidence.
- D-015: While not approved, profile/site/property changes remain draft-only and public publishing is blocked.
- D-021: Owner's email must be verified **before** Super Admin can Approve.
- D-023: City, area, office address, short agency description, logo, exact map pin, plus agency evidence must be completed before Approve.
- D-024: **At least one accepted** proof is enough; formal business registration is not mandatory.
- D-022: Request Changes and Reject require reasons; a corrections cycle uses **Mark Changes Complete** for re-review; rejected agencies may be reopened by Super Admin.
- D-019: Superseded; no initial owner 'Submit for Approval' to enter Pending.

## Suggested implementation behavior — PROPOSED, NOT APPROVED

- Agency profile UI: choose one of the five named categories or **Other — submit alternative proof for review**, then attach evidence and optionally explain any name/address mismatch.
- Super Admin review UI: show document type, attachment in a private authenticated viewer, owner email verification state, other profile requirements, and reviewer decision with audit trail. The reviewer must **explicitly mark evidence acceptable** before completing Approve. This is a recommended process, not a finalized data model or screen contract.
- If the selected proof category differs from the business/office details, request explanatory corrections instead of assuming legal company registration is required.
- Implement authenticated, authorization-checked access to evidence and avoid public URLs.

## Open decisions — don't invent policy

**Still OPEN (do not assume):** precise issuer/name/address matching, document age/recency, acceptable alternative evidence criteria beyond manual reviewer discretion, D-026-confirmed file formats/size, number of optional uploads, malware scanning, redaction, staff-role delegation beyond D-027, retention/deletion, public office-address exposure and home-based office handling. Private uploaded evidence must never be published on the agency website.

Suggested D-026 CONFIRMED: is **document file format and maximum upload size**; D-027 now confirms private storage and authorized owner/reviewer preview/download, while provider, deletion/retention and delivery technology remain open. Exact alternative evidence examples, matching, retention and deletion remain OPEN.

**Planning only. No application implementation authorized.**

## D-026 (CONFIRMED) — verification-file upload boundary

For business/office proof uploaded **after minimal registration** (including alternative proof): **PDF (.pdf), JPG/JPEG (.jpg/.jpeg), PNG (.png)** only, **maximum 10 MB per individual file**, and a **mobile camera-photo upload option**. The file format/size approval does not automatically accept evidence or approve/publish the agency. **D-027 now CONFIRMS private storage and authorized owner/reviewer preview/download, with server-side tenant/role checks and no public URLs.** File count, storage vendor/delivery design, malware scanning, evidence matching and **retention/deletion (next D-028)** remain OPEN. See `docs/VERIFICATION-UPLOAD-RULES.md` and `docs/VERIFICATION-DOCUMENT-ACCESS.md`.
