# EstateOS — Verification document privacy and access (D-027)

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | Planning v1.6 | M00 Product Discovery | **D-027 CONFIRMED** | **PLANNING ONLY**

## Approved decision — Option A: Private Storage + Authorized Preview & Download

Verification documents provided as business/office proof are **private**, not website/media assets. The following is owner-approved:

1. **Agency owner** may view, preview and download **their own agency's** verification documents after authentication and authorization.
2. **Authorized Super Admin reviewers** may view, preview and download the documents needed to review agencies. Access is based on authenticated reviewer authorization rather than unrestricted platform/public access.
3. Verification documents must **never be publicly accessible**, publicly listed, embedded in public agency websites, or exposed using permanent public file URLs. Public agency site visitors and other agencies must not receive document content.
4. **Every access attempt** to private documents (including preview/download) must be authorized **server-side**, checking the authenticated caller's role, appropriate agency/tenant scope and access to the requested resource. Hiding UI controls alone is not protection.
5. Protect file requests on both application endpoints and underlying storage delivery mechanisms. Do not return unrestricted bucket paths or reusable public links.

**Scope:** D-027 covers agency verification proofs and alternative business/office evidence under D-023–D-026. It does not change permissions for separately published **agency logos, public property photos, or website media**.

## Approved permission matrix (only the two explicitly approved role groups)

| Actor | Private preview | Private download | Notes |
|---|---|---|---|
| Authenticated agency **owner**, for own tenant | Allowed | Allowed | No cross-tenant access |
| **Authorized Super Admin reviewer** | Allowed | Allowed | Purpose: agency verification/review |
| Other agency's owner | Denied | Denied | Tenant isolation |
| Public visitor / unauthenticated request | Denied | Denied | No public documents or URLs |
| Other agency staff / other platform admins | **OPEN** | **OPEN** | Do not grant by assumption; remain denied until expressly authorized by a later decision |

Document **upload/replace/remove** privileges beyond the previously approved owner onboarding upload path, reviewer assignments, and special staff delegation are **not established** by D-027.

## Relationship to existing decisions

- D-016/D-017: initial signup stays six fields; evidence is uploaded later during onboarding.
- D-015: while Pending, owner has private draft workspace; website/property public publishing remains blocked.
- D-020: agency enters Super Admin Pending queue immediately on registration; authorized reviewers see available agency information and **private** draft preview.
- D-021: Super Admin Approve still requires verified owner email.
- D-022: Request Changes/Reject require reason, with corrections and manual reopening process.
- D-023: detailed business profile, logo, map location and evidence are approval prerequisites.
- D-024/D-025: at least one **accepted** proof from named categories or reviewed alternative is required; a file being uploaded does not mean proof is accepted.
- D-026: PDF/JPG/JPEG/PNG, 10 MB **per file**, mobile camera upload for verification files.
- D-027: **private storage and authenticated, tenant/role-authorized preview & download** are now CONFIRMED.

## Technical guidance — PROPOSED, not a technology/provider approval

- Store file blobs in a **nonpublic storage container/bucket** and private metadata in the application's tenant-scoped records.
- Prefer short-lived authenticated delivery (such as time-limited URLs minted only after server authorization, or server-streamed bytes). D-027 does not approve a particular provider, URL lifetime, storage SDK or delivery approach.
- Do not log private file contents or disclose provider object keys in public APIs. Avoid embedding documents in messages to AI tools.
- Consider auditing reviewer accesses/downloads and verifying content signatures/scanning files before safe preview. Audit retention, scanning implementation and file renderer are still open.
- Design clear errors for unauthorized access and missing files; no anonymous fallback paths.

## Explicitly OPEN (do not infer a rule)

**D-028 proposed next:** retention and deletion policy for documents after agency approval, rejection, account closure or explicit deletion request; backup deletion behavior. Additional open topics include storage vendor, encryption specifics, malware scanning, exact reviewer-role assignment, access/download audit events and retention, uploaded file count, redaction, legal/compliance rules, cross-role delegation and rejected-agency owner permissions.

**This is documentation only. No application code was written or authorized.**
