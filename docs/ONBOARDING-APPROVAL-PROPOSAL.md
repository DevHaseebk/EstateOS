# Agency Onboarding + Activation (MVP-first after D-028)

## Confirmed MVP journey

1. **Create account/agency**: self-registration and Super Admin-created agency channels both retained from D-010. Sign-up information stays basic; final streamlined field requiredness still open.
2. **Pending** right after signup, automatically visible in platform Super Admin (D-020).
3. **Draft-only agency workspace** while Pending (D-015): agency profile, template selection, hero/logo/section images and content; optional property draft(s); private preview.
4. **Super Admin review**: inspect saved contact/profile data, selected template and private website preview; manual Approve; can Block/Deactivate.
5. **Public link — D-029 CONFIRMED**: after manual approval, a **ready** website automatically publishes and owner dashboard shows the working link. If not ready, agency remains approved but no public link is exposed; content-completeness requirements are still OPEN. No separate initial Publish button is required.

## Current limits

- No owner `Submit for Approval` gate (D-019 superseded).
- **No mandatory email verification, business documents, proof matching, or precise office-map-location gate in the pilot** (new D-028 overrides MVP implementation of D-018/D-021/D-023–D-027). Historical details retained for future.
- `Request Changes` / `Reject` action patterns from D-022 are historically approved; implement only if needed within a very small, understandable status flow. Do not add heavy correction management to MVP without owner scope sign-off.
- Distinguish Pending vs Approved vs Blocked vs Deactivated; exact meaning and recovery procedures for last two are still OPEN.
- Never use a public URL for a Pending private preview; preview authorization must be server-enforced.

## Special case: zero properties
Agency can fully set up and publish a professional website without uploading any property. Hide empty listings; show About/Services/Contact. Dummy/fake listings are unacceptable.

## Next decisions
D-030 CONFIRMED: one premium customizable template with theme presets; D-031 Core 9 sections confirmed; exact website readiness fields / section controls (D-032+); post-approval content update behavior; signup field requiredness; Block/Deactivate semantics.


---

**Current v2.3 override (D-032/D-033/D-034 CONFIRMED):** Core 9 guided fields/visibility and Move Up/Down, Essential Website Readiness, and three named presets are APPROVED. Exact character/card/media limits, theme hex/font tokens, Hero layout and post-live publication rules remain OPEN. Read `docs/SECTION-FIELDS-D032-CONFIRMED.md`, `docs/SITE-READINESS-D033-CONFIRMED.md`, `docs/THEME-D034-CONFIRMED.md`. No coding authorized.
