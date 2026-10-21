# D-047 — CONFIRMED: Status-First Overview with One Primary Next Action

**Owner approval:** Option A — Status-first Overview with one primary next action  
**Status:** CONFIRMED | **Date:** 2026-10-19 | **Bundle:** v3.6 | **Mode:** PLANNING ONLY

## Scope of approval

D-047 approves the **information hierarchy** for Agency Admin **Overview**. This is a hierarchy/layout decision, **not** final page copy, routing, component specifications, persistence or publishing logic.

1. At the **top**, visibly and clearly communicate the agency's actual approval state and the website's actual state. Do **not** collapse agency review and website readiness into a misleading single status.
2. Prominently present **one contextual primary next action** based on the state, not a wall of equal-priority buttons. Example *nonfinal* labels: `Customize Website`, `Complete Essentials`, or `Open Live Website` where a genuine live URL exists. The action must be relevant and available to the user; do not promise publication when blocked, pending or incomplete.
3. Place the **D-045 four-item nonblocking checklist** below the top status/primary action zone: Agency Details, Choose Theme, Customize Website, Preview Website. Each links directly to its task, in any order. Completion indicators, storage and any collapse behavior are still OPEN.
4. Keep **Add Property** as a clearly optional **secondary shortcut**, never a required setup step, publish gate or primary action overriding essential site readiness.
5. On **mobile**, preserve the hierarchy: status → contextual single primary action → four tasks → optional property shortcut, in a readable one-column, touch-friendly arrangement. Desktop uses spacious compact content, never an analytics-first dashboard.
6. Preview of a draft remains **authenticated and private** while Pending. Only show a **working real public link** once D-029 + D-033 activation requirements are actually met.

## State examples (behavioral guidance, not approved UI copy)

| Real state | What to convey | Candidate single primary action | Guardrail |
|---|---|---|---|
| Pending agency | Approval pending; draft editing still possible | Continue customization | Never show public URL or claim approval |
| Approved, site not ready | Agency approved but required site essentials incomplete | Complete website essentials | No broken or preemptive public link; retry trigger OPEN |
| Live (approved + ready) | Website live | Open actual live website | Post-live edit/re-publish semantics OPEN |
| Blocked / deactivated | Restricted state clearly distinguished from Live | **UNDECIDED** until restriction policy approved | Do not assume editing, review/reapply or publication is allowed |

These are examples for later detail approval; not new publishing or status transition rules. **Contextual action labels, exact CTA selection for every state and Blocked/Deactivated behavior remain OPEN.**

## Acceptance criteria for later UI specification

- An owner can recognize **actual status** before scanning other dashboard features.
- There is **one visually dominant next action** appropriate to the user's current state.
- The four D-045 tasks remain independently accessible and are not approval prerequisites.
- Optional Add Property remains secondary and zero-property agencies can operate normally.
- Mobile/desktop preserve ordering and accessibility; don't require hover or drag gestures.
- Never show invented links, false `Live` claims, dummy statistics, analytics, or unapproved Inquiries/CRM modules.

## Not approved / still open

Exact final English labels, route strings, precise spacing or breakpoints, palette for admin UI, completion computation and persistence, empty/error/status copy, toast/notification behavior, when checklist is dismissed, full screen-by-screen details, Inquiries/CRM scope, post-live site editing/re-publishing, blocked/deactivated rules, and remaining public-site design tokens.

## Referenced decisions

D-028 lean pilot; D-020 immediate Pending; D-029 automatic initial activation **only after** manual Super Admin approval and site readiness; D-033 minimal website essentials; D-044 Task-First Dashboard; D-045 nonblocking four-step checklist; D-046 grouped navigation with Website subviews.

**Historical proposal:** `docs/AGENCY-ADMIN-OVERVIEW-D047-PROPOSAL.md` (A/B/C alternatives, now RESOLVED). **Next proposal (D-048):** `docs/MY-WEBSITE-HUB-D048-PROPOSAL.md`. No app coding authorized.
