# EstateOS — Verification upload rules (D-026)

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | Bundle **v1.5** | M00 — Product Discovery | **D-026 CONFIRMED** | PLANNING ONLY

## Approved: Option A — Standard Upload

Verification documents submitted by an agency owner during agency-profile completion may use:

| Rule | Approved requirement |
|---|---|
| Allowed document formats | **PDF, JPG/JPEG, PNG** (`.pdf`, `.jpg`, `.jpeg`, `.png`) |
| Maximum file size | **10 MB per file** (the *individual* uploaded file, not a combined quota) |
| Mobile capture | The upload UI must **support choosing/taking a document photo using the mobile camera**, as well as selecting an existing file |
| Where it applies | D-024/D-025 standard business/office proof and Super Admin-reviewed alternative evidence |
| Signup | **Not** on initial six-field signup; upload in agency dashboard profile onboarding |

The approval does **not** specify how many optional attachments may be added, a storage quota per tenant, image resizing/compression, cropping, document pages, a storage provider, automatic OCR, reviewer matching criteria, or any certification standard.

## Relationship to confirmed workflow

1. **D-020:** self-service signup creates **Pending** immediately and is visible to authorized Super Admin, even without a document.
2. **D-015:** Pending agency may upload/edit verification evidence in a restricted draft-only workspace; no public website/property publication.
3. **D-021:** owner email verification is a separate prerequisite to Super Admin approval.
4. **D-023:** detailed agency profile with logo and exact office map pin is required before approval; evidence is part of this checklist.
5. **D-024/D-025:** one **accepted** business/office proof is sufficient, from listed categories or approved manual alternative. An uploaded file is never automatically accepted.
6. **D-022:** Super Admin can Request Changes or Reject with a required reason if the submitted material is missing/unclear/unsuitable. `Mark Changes Complete` exists only for correction cycles.
7. Approval **never** publishes a website automatically.

## Proposed implementation and UX guidance — not separately approved

- File-picker uses supported format hints; on mobile, provide a clear **Take Photo / Choose File** affordance. Browser/device camera behavior varies; do not assume a camera is present or force its use.
- Validate uploads on the server: file size in bytes, detected file signature/structure, safe MIME, and extension consistency. **Do not trust the extension or client MIME alone.** Clearly explain disallowed formats and oversized files in simple English.
- Consider safe parsing/virus scanning and secure private object storage. Uploaded proofs should **never** be embedded in public agency website pages. D-027 CONFIRMS private storage and authenticated, authorized agency-owner and Super Admin reviewer preview/download; delivery technology and retention remain unapproved.
- Avoid putting document content into logs or AI context; store metadata separately. Treat external uploaded content as untrusted.

## Explicitly OPEN — do not infer from D-026

- **D-027 CONFIRMED:** private storage; authenticated agency owner can preview/download own agency files and authorized Super Admin reviewers can preview/download for verification. No public URLs; every access checked server-side. See `docs/VERIFICATION-DOCUMENT-ACCESS.md`.
- Antivirus/malware scanning approach, encryption/provider, backups, sensitive-data redaction, delivery strategy (e.g. signed URLs), audit details and exact allowable count.
- Retention/deletion after rejection, account closure or approval; exact document matching and recency checks; whether administrators can download or only preview.
- Next D-028: retention/deletion. Handling HEIC/WEBP photos: **not approved as accepted upload formats**. Camera capture should produce a permitted format or provide user-friendly conversion guidance; do not silently expand accepted formats.

**No app implementation is authorized.**
