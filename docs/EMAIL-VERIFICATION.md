> **ACTIVE MVP NOTE (v1.8):** D-028 defers detailed verification/email gates. D-029 confirms automatic publication of a ready website after Super Admin approval; any old wording below requiring separate initial owner Publish is historical future-scope. Read `docs/WEBSITE-ACTIVATION-D029.md`.

# EstateOS — Owner email verification (D-018)

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | Stage: M00 | **D-018 link and D-021 approval gate CONFIRMED; token/provider details OPEN**

## Confirmed

- Registration sends a verification link to the owner's email (D-018).
- A valid completed link verifies that email address; merely sending the email does not.
- Verification is a **separate state** from the agency's review status and public website publication.
- Agency becomes **Pending on registration** and is visible to Super Admin regardless of email verification (D-020). This **does not** automatically approve or publish the site.
- Pending agency owner has draft-only abilities (D-015), but *whether draft access begins prior to email verification* is OPEN.
- Super Admin can see agency registration data and any authorized private site draft; **D-021 requires blocking Approve until the owner email is verified**, enforced server-side. Other review actions and minimum profile criteria still need decisions.

## Current conceptual flow

```text
Registration --> Agency Pending & Super Admin visible [D-020]
            \-> Verification email --> Valid link --> Owner email verified [D-018]
Verified email --(enables email condition for manual Super Admin Approve, D-021)--> Manual approval [D-014/D-020]
Manual approval --> Owner explicitly publishes [D-015]
```

The earlier verified-email → complete profile → owner `Submit for Approval` prerequisite (D-019) has been **superseded by D-020**. Do not implement it.

## Security recommendations — NOT yet approved as exact specifications

- Cryptographically random, short-lived, single-use token; persist its hash rather than raw token.
- Rate-limit token requests and resend attempts; handle expired/reused links clearly.
- Verify owner identity on server, and never equate `emailSent` with `emailVerified`.
- Configure mail authentication (SPF/DKIM/DMARC); avoid leaking tokens into logs or analytics.
- Make `emailVerifiedAt`, `agencyReviewStatus` and `sitePublishStatus` independent fields in the eventual schema.

## Still OPEN

1. Can the owner use restricted drafts before email verification?
2. Expiry, resend, cooldown, provider, email-change policy, recipients of other notifications.
3. Whether phone/WhatsApp OTP is later required.
4. Minimum additional profile requirements before manual approval, if any.
5. D-022 now confirms mandatory reasons for Reject/Request Changes, owner correction completion, and rejected admin reopening; email verification still gates Approve and not the other review actions. See `docs/REVIEW-ACTIONS.md`.

**Resolved D-021:** unverified owner email always blocks the Super Admin Approve operation; merely entering Pending does not imply approval eligibility.

No application code authorized.

**D-023 cross-check (v1.2):** verified email is necessary but not sufficient for Approve. Detailed agency profile, required logo, office map location and uploaded verification document(s) are also required before the authorized Super Admin can approve. These requirements do not postpone Pending list entry. Exact document types pending D-024. See `docs/AGENCY-PROFILE-REQUIREMENTS.md`.

### D-024 confirmed flexible verification (v1.3)

For Super Admin approval, D-023's verification-document gate is met through **one acceptable business-or-office proof** under D-024; formal company registration is not mandatory and a documented alternative must exist for informal agencies. **D-025 confirms five accepted proof categories plus manual alternative; exact evidence matching and alternate-proof sufficiency criteria remain OPEN.** A file upload alone never auto-approves an agency. Do not add proof fields to the six-field initial signup or delay immediate Pending visibility. See `docs/VERIFICATION-PROOF-POLICY.md`.
