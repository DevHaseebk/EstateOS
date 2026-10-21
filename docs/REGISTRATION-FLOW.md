## v5.6 CURRENT registration/review distinction

D-028 lean signup enters Pending immediately, Super Admin manually approves/rejects/requests changes, no mandatory new KYC, verified email or business proof. D-068 **Resubmit for Review** is ONLY for a previously Changes Requested correction cycle and is NOT a normal initial registration Submit or first website publication gate; D-029 initial Live automatic after actual approval + site readiness. D-067 separate Changes Requested disposition and D-069 rejected Super Admin reopening are business concepts, exact backend state machine pending.

---

# Agency Registration — current MVP interpretation

## Previously confirmed basic form (D-016 amended by D-017)

- Owner full name
- Agency name
- Mobile number
- WhatsApp number (may use 'same as mobile' checkbox)
- Email
- Password

Owner said **basic data** remains the priority for the 2–3 agency pilot (D-028). Whether all six fields remain compulsory or can be slimmed further is **OPEN**; do not add KYC/document/map-pin fields at registration.

## Registration flow

1. Owner or Super Admin creates agency (D-010); Super Admin provisioning/invite details OPEN.
2. Self-service agency enters **Pending** immediately; visible to Super Admin (D-020).
3. Owner logs into **draft-only** workspace; selects design template and edits company/hero/logo/section content. Properties optional.
4. Super Admin manually approves; site link hidden/blocked until then. D-029 confirms: Approve auto-publishes a ready site and reveals working live URL. If unready, agency approved but no public link; readiness checklist is CONFIRMED D-033 Option A, but the auto-retry trigger after later edits is OPEN. See `docs/SITE-READINESS-D033-CONFIRMED.md`.

## Email

- D-017 signup-related email notifications and D-018 email verification link were historically confirmed.
- **D-028 explicitly defers email verification as a mandatory pilot approval gate.** Sending a simple welcome/agency notification may be useful, but exact minimum messaging for MVP is OPEN; do not build token/OTP/retry workflows just for approval.
- Contact information collection is not consent to promotional marketing; opt-in rules remain a separate future decision.
