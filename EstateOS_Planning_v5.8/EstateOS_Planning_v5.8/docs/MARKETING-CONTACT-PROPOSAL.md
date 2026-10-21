# EstateOS — WhatsApp contact and marketing plan

> **FUTURE / HISTORICAL SPEC — NOT A CURRENT MVP REQUIREMENT (D-028, 2026-10-17).** Earlier approved details are preserved for future reference. For the current 2–3 agency pilot, **do not implement mandatory email/identity/doc/map verification or complex review gates**. Use `docs/MVP-RESET-v1.7.md` and current `docs/DECISIONS.md` D-028 over contradictory text below.


Updated: 2026-10-17 | M00 — Planning only

## CONFIRMED (D-017)

- Self-service agency signup captures a **separate required WhatsApp Number** in addition to Owner Mobile Number.
- EstateOS wants agency contact data available for future sales/marketing engagement.
- D-018 confirms **signup owner-email verification link**. D-020 makes agency Pending and visible to Super Admin on registration; the old D-019 owner submission gate is superseded. Whether Super Admin receives an automatic registration notification is OPEN. Other operational email notification events/recipients and email provider are **not yet specified**.
- This amends original D-016 from five to **six** basic signup inputs. Do not silently remove the Mobile Number or replace it with WhatsApp.

## RECOMMENDED, NOT APPROVED — trustworthy outreach workflow

1. Show a concise signup notice explaining contact purposes.
2. Keep any **WhatsApp promotional opt-in** separate from required registration and unchecked by default; do not imply that submitting WhatsApp number signs the owner up to offers.
3. Save `whatsappNumber` separately from `mobileNumber`, even when identical. Optional proposed UI shortcut: `Same as mobile number`.
4. Record a separate marketing preference such as `marketingConsent.whatsapp = { granted: boolean, grantedAt: date|null, source: string|null, withdrawnAt: date|null }` (illustrative schema only).
5. Make preference changes/unsubscribe easy. Admin marketing views filter recipients based on explicit current permission; do not export entire signup dataset for unsolicited bulk campaigns.
6. Restrict access to contact data to authorized roles, document retention/deletion rules, and audit bulk export actions.
7. Any automated WhatsApp marketing must follow applicable law and WhatsApp Business policy (not approved for MVP).

**WhatsApp Business policy reference:** https://business.whatsapp.com/policy/ — outbound messages need recipient opt-in; possession of a phone number alone is insufficient.

## Email notification vs verification

- `signupEmailVerification`: **CONFIRMED D-018**, owner receives verification link after signup. Other operational notification events/recipients **OPEN**.
- `emailVerified`: owner-email ownership must be confirmed through a valid link (D-018). Storage/schema, expirations and state transitions are PROPOSED; never set verified simply because an email was dispatched/delivered.
- Distinguish essential operational communications (e.g., application review status) from promotional campaigns.

## Decision queue

- D-018 RESOLVED: signup verification link goes to owner email; **D-020 now makes agency Pending immediately upon registration**; whether email verification gates Admin Approve or pre-verified draft-dashboard access is OPEN.
- OPEN: which event(s) send email, and recipients: owner, Super Admin, or both?
- OPEN: optional marketing opt-in at signup vs in account settings, SMS/WhatsApp automation provider and public-number display.
