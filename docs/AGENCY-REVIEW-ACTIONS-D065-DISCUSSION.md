> **v5.5 precedence:** D-066 Option A review action dialogs/mobile sheets CONFIRMED. Seven follow-up D-067–D-073 choices are PROPOSED ONLY; see `docs/SUPER-ADMIN-BATCH-D067-D073-PROPOSAL.md`. Prior references to D-066 pending are HISTORICAL.

> **v5.4 precedence:** D-065 **CONFIRMED Option A one-page Agency Review Detail**. The below working D-065 discussion is HISTORICAL; reason-entry UI, action confirmations and transitions are still OPEN. Read confirmed `docs/AGENCY-REVIEW-DETAIL-D065-CONFIRMED.md` and **unapproved D-066** `docs/AGENCY-REVIEW-ACTIONS-D066-PROPOSAL.md`.

# Agency Review Detail / Actions — v5.3 Working Discussion (NOT APPROVED)

**Status: proposed UX discussion only.** D-064 confirmed Review Queue First; review-detail layout is next D-065.

## Information hierarchy candidate

1. Agency & owner information summary (the lean D-028 supplied name, agency, mobile, WhatsApp, email; exact access, provenance and UI display OPEN).
2. Agency review state (Pending, review reason as legitimately applicable) **versus** website readiness (D-033 essential conditions) shown separately; no public website link until genuinely Live under D-029.
3. **Authorized private** saved-draft website preview; exact snapshot content/permissions OPEN; never make public.
4. Existing D-022/D-028 approval decisions: Approve, Request Changes, Reject. Reasons needed for Request Changes/Reject under D-022; detailed form and confirmations OPEN.
5. Secondary operations (agency directory, Block/Deactivate where already permitted); placement, permission and effects OPEN.

## Proposed journey (illustration only)

Dashboard Pending queue → select Review → inspect agency/contact + distinct preview/readiness → optionally inspect private preview → choose authorized decision → follow approved reason/validation and success/error UX (yet to be specified) → return to truthful queue/directory state. **No automatic approvals, new verification gates or initial owner Publish button.**

## Hard questions before engineering

- Which Super Admin identities may view private drafts and take each action; how are errors and concurrent approvals handled?
- What are the exact D-022 reason UI and post-rejection reopen/correction states, reconciled with D-028 lean pilot?
- Can agency approval proceed while site is unready? **Yes in principle**, but no public site until ready under D-029; exact trigger when it later becomes ready is OPEN.
- What evidence, if any, can admin inspect without restoring deprecated mandatory KYC/doc requirements?
- What status events and audit/history/notification expectations are included in pilot? OPEN.
- How are Block/Deactivate and Restore/Reactivate handled and what is their effect on public site? OPEN.
- Exact labels, routes, queue sorting, mobile breakpoints and pilot CRM? OPEN.

D-065 selection approves layout only; detail action micro-interactions and status transitions remain separate decisions.
