> **ACTIVE MVP NOTE (v1.8):** D-028 defers detailed verification/email gates. D-029 confirms automatic publication of a ready website after Super Admin approval; any old wording below requiring separate initial owner Publish is historical future-scope. Read `docs/WEBSITE-ACTIVATION-D029.md`.

# Approval Eligibility — active MVP (D-028)

## Current conditions

- Self-service registration creates **Pending**, instantly visible to Super Admin.
- Super Admin reviews available agency information plus private website draft and may manually **Approve**.
- **For this 2–3 agency MVP, email verification, document verification, mandatory logo, and exact map location are not approval prerequisites.** These were earlier D-018/D-021/D-023–D-027 decisions and are **explicitly deferred for pilot by D-028**.
- Any minimum basic profile fields that must be present at approval are OPEN and should be agreed before backend validation is built.
- Super Admin control actions Block/Deactivate are confirmed by D-028; precise state transition/visibility details are OPEN.
- Only authorized platform admin actions may alter activation; never trust browser-supplied status.
- Public website link unavailable/blocked until agency approved. Whether it is instantly live at approval depends on OPEN D-029.

## Historical reference
D-021 required verified email, D-023 required detailed profile/logo/map/proof, D-024–D-027 specified document review rules. **Do not implement those as MVP gates.** See `docs/DECISIONS.md` for audit trail.
