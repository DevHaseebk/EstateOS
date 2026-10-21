# EstateOS — Flexible agency verification policy (D-024)

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | Bundle **v1.5** | M00 Product Discovery | **D-024 CONFIRMED** | PLANNING ONLY

## Confirmed decision

**D-024 — Flexible Verification (Option A), CONFIRMED:** Exactly **one acceptable business-or-office proof** from an approved category is sufficient for the document-evidence requirement before Super Admin Approve. **Formal company registration is not mandatory**; agencies without formal registration must have an acceptable alternative route. Super Admin reviews the submitted proof and can Approve (only when all other gates pass), Request Changes or Reject. D-025 confirms accepted categories plus a manual alternative; exact acceptability/matching checks, D-026-confirmed storage/retention, evidence matching and exceptions are still **OPEN**; upload formats/limits are CONFIRMED by D-026 and must not be invented. Never make a government registration document, NTN, CNIC, SECP certificate or second proof universally mandatory.

### Boundaries with previously approved decisions

1. D-016/D-017: signup remains only six required inputs. Proof uploads do **not** move into the registration form.
2. D-020: on signup the agency is **Pending immediately** and visible to authorized Super Admin even with no proof uploaded.
3. D-015: pending owners can prepare private profile and website/property drafts; publishing is blocked.
4. D-021 and D-023: before **Approve**, owner email must be verified and the detailed business profile must be complete (including logo, office address, map pin and verification evidence). The proof criterion under D-024 is **at least one accepted business-or-office document**, not a formal incorporation requirement.
5. D-022: Super Admin can request corrections or reject with a mandatory reason. Rejected cases can be manually reopened. No step triggers automatic approval or publication.
6. D-019 is superseded: **no initial Submit for Approval** is needed to appear in the queue. `Mark Changes Complete` remains specific to correction cycles.

## Proposed reviewer checklist — NOT YET OWNER-APPROVED

- Display selected document category, private preview and submission date.
- Let reviewer decide whether the document is sufficient under a *future agreed list* of allowed business/office proofs; **uploaded != accepted**.
- Mark missing/unacceptable proof as not eligible for Approve; keep Request Changes/Reject actions available with mandatory reasons.
- Log decision, reviewer, evidence reference and reason. Keep sensitive documents out of public website/CDN and ensure tenant-scoped private access.
- Do not presume automatic OCR, external registry checks, identity verification, or that having a document establishes legal business status.

## D-025 — Resolved: categories and alternative proof route

D-025 Option A confirmed the following proof routes (see `docs/ACCEPTED-VERIFICATION-DOCUMENTS.md`):

1. **Office rental or lease agreement**.
2. **Office ownership document**.
3. **Office utility bill**.
4. **Business registration certificate**.
5. **Trade association membership proof**.
6. **Alternative business/office evidence**, when none of the listed types is available, via explicit Super Admin manual review; reviewer must decide adequacy case by case. This is a fallback route, **not** a waiver of the one-acceptable-proof requirement.

The alternatives category is not an automatic exemption; one **acceptable** piece of supporting evidence must still be manually reviewed. The particular matching criteria, evidence recency, and exact examples of allowable alternatives have not yet been approved.

## Still OPEN

- Exact acceptance/matching rules for confirmed types and manual alternative, recency rules, acceptable issuer, minimum visible fields and redaction.
- Whether one proof must match exact agency name, office address, or mapped location; how differences get resolved.
- File types and max per-file size **CONFIRMED by D-026**; virus scanning, storage access, retention/deletion, audit and review permissions remain OPEN.
- Home-based/no-office cases given D-023's required office address and exact pin.
- Public exposure of office pin/address, verified vs approved UI states and notifications.

**No code or integrations are authorized.**

## D-026 (CONFIRMED) — verification-file upload boundary

For business/office proof uploaded **after minimal registration** (including alternative proof): **PDF (.pdf), JPG/JPEG (.jpg/.jpeg), PNG (.png)** only, **maximum 10 MB per individual file**, and a **mobile camera-photo upload option**. The file format/size approval does not automatically accept evidence or approve/publish the agency. **D-027 now CONFIRMS private storage and authorized owner/reviewer preview/download, with server-side tenant/role checks and no public URLs.** File count, storage vendor/delivery design, malware scanning, evidence matching and **retention/deletion (next D-028)** remain OPEN. See `docs/VERIFICATION-UPLOAD-RULES.md` and `docs/VERIFICATION-DOCUMENT-ACCESS.md`.
