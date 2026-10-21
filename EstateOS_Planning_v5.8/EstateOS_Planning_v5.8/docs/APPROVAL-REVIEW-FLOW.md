## v5.6 CURRENT — Super Admin correction/review lifecycle

D-067–D-069 CONFIRMED: Request Changes with D-022 mandatory reason produces separate **Changes Requested** disposition; owner sees reason, edits permitted private fields and explicitly **Resubmits for Review** under D-068; request returns to **Pending manual review**, not automatic Approve. Rejected keeps reason; authorized Super Admin may Reopen for manual review. This is NOT standard signup Submit or first public website Publish. First site Live automatic after actual Super Admin approval + D-033 readiness, zero properties permitted (D-029). Exact persisted enums, transitions, guards, permissions and errors still OPEN. Read `docs/SUPER-ADMIN-REVIEW-LIFECYCLE-v5.6.md`.

---

# Super Admin Agency Review — pilot version

## Confirmed intent

- Agency automatically Pending immediately on self-service registration; platform Super Admin shows **all agencies** and their saved data and authorized private site preview.
- Super Admin manually **Approves** to permit eventual public site activation; **Block** and **Deactivate** are available platform actions (D-028).
- Public website link not shown / not usable before approval.
- No mandatory proof documents, exact office map verification or verified-email approval check for MVP.

## Prior approved actions, now low-priority

D-020/D-022 established **Reject** (reason required), **Request Changes** (reason required and owner marks complete), and admin reopen rejected. Keep history but avoid forcing a complex correction-review workflow into the 2–3 agency pilot unless owner reconfirms its necessity. Platform admin may still need basic reject/change feedback as a small UI action.

## Still to approve

- **D-029 CONFIRMED:** Admin Approve automatically publishes a **ready** site and exposes its live URL; approved but unready site remains unpublished with no live link. Exact readiness checklist is CONFIRMED D-033; retry behavior OPEN. See `docs/SITE-READINESS-D033-CONFIRMED.md` and `docs/WEBSITE-ACTIVATION-D029.md`.
- Block vs Deactivate meanings: owner login allowed? website 404/disabled page? reactivation rights? effect on previously published properties?
- Minimal review data needed; if incomplete, how admin handles readiness.

## Security

Approval and platform actions are server-side authorized. Preview is private. No tenant data leakage. Status changes recorded in a minimal admin activity log (proposed).
