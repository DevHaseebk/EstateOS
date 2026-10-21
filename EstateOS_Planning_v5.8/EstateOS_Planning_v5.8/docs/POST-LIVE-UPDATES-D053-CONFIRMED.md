> **D-063 v5.2 scope extension (2026-10-21):** D-053 remains the same explicit `Publish Updates` action for ALREADY-LIVE websites, but D-063 now **CONFIRMS eligible saved individual-property changes share that existing action** alongside saved section/theme changes. This newer rule is canonical at `docs/PROPERTY-PUBLIC-PUBLISHING-D063-CONFIRMED.md`. Exact eligible properties/status/archive effects and publishing atomicity/rollback stay OPEN; D-029 automatic first go-live unchanged.

# D-053 — CONFIRMED: Saved Draft + Explicit Publish Updates on Already-Live Websites

**Decision:** D-053 | **Status:** CONFIRMED | **Owner approved:** Option A | **Date:** 2026-10-19 | **Bundle:** v4.2 | **Milestone:** M00 / Agency Website UX | **Mode:** PLANNING ONLY — NO APPLICATION CODE

## Scope: ONLY subsequent edits once a website is already Live

An agency owner editing an **already-Live** public site uses two deliberately separate states:

1. **Saved private draft:** `D-050` explicitly saves the current website section to the agency's draft; `D-049` explicitly applies a selected theme to saved draft configuration after noncommitting candidate preview. `D-051` protects unsaved edits on navigation, while `D-052` Private Preview displays **only saved draft sections plus the applied/saved draft theme**. These ordinary draft actions **do not modify the already-Live public version**.
2. **Explicit post-live Publish Updates:** An authorized agency owner deliberately triggers an action of the `Publish Updates` kind to update the already-Live public website using its saved draft. The literal button label is illustrative—not yet approved final English copy. This **is the only approved user-initiated route for subsequent draft-to-public publication**. Whether all changed sections/theme publish together, precise validations and readiness, permissions, success/partial/failure, atomicity, conflicts and retry/rollback are **OPEN**.
3. **Accurate status and separation:** Before a subsequent publishing action actually succeeds, the public site remains on its previously published version. Draft Preview stays private and can differ from the current public website. Never claim the Live URL is updated just because a section Save, theme Apply or Preview completed. Final draft/live status UI and publish feedback are unapproved.

## Non-negotiable invariant: D-029 INITIAL automatic activation

**D-053 must NEVER add an initial agency-owner `Publish`, `Publish Updates`, `Submit for Approval`, or other manual launch gate.** The **first** website activation is governed by D-029: Super Admin **manually approves the agency** AND the website satisfies the D-033 minimum readiness requirements; the initial site **automatically becomes Live** and only then receives a genuine public link. Agency owners may privately build/preview their Pending drafts. An Approved-but-unready site is not public; the precise readiness recheck/trigger after later edits is still OPEN. D-053 only starts **after** the site has already become Live for the first time.

## Compatibility with prior decisions

- D-028 lean 2–3 agency MVP; don't restore deferred identity/email/map/doc KYC approval gates.
- D-030/D-031/D-032 one public template with nine sections; optional properties; Header/Footer fixed, Hero/Contact CTA always visible; section toggles/Move Up/Down unchanged.
- D-033 minimum readiness remains selected template, real name, genuine Hero heading, phone **OR** WhatsApp, and owner-uploaded **OR legitimately licensed platform-default** Hero image. Logo, About, Services, Properties not mandatory; zero-property websites valid.
- D-045 checklist is nonblocking; D-046 grouped nav; D-047 Overview and D-048 My Website hub remain status-first; draft/private tools remain under My Website.
- D-049 theme candidate Preview is noncommitting, Apply persists the **draft** theme, not a public re-theme; D-050 section Save persists draft only; D-051 Save/Discard/Stay and D-052 saved-draft-only Preview apply unchanged.
- D-014/D-029 initial agency approval remains distinct from **subsequent owner-controlled content updates**; D-053 does **not** require additional Super Admin editorial review for every post-live update. Blocked/Deactivated permission rules are not yet approved.

## Conceptual owner journey (not screens/routes contract)

Already Live → Edit Hero → Save current section → choose/apply a different draft theme (optional) → privately Preview saved draft → `Publish Updates` **by deliberate owner action** → only after genuinely successful publication does the public website display the new version. If owner does not publish, current public version stays unchanged. Details for publication failure are OPEN; never imply success without confirmation.

## OPEN — explicitly not resolved by D-053

- What exactly `Publish Updates` publishes (entire saved draft vs selected portions), validation readiness/access, precise publishing permission and idempotency, revision isolation, conflicts, consistency/atomicity, partial failures, retries/rollback and audit/history.
- How draft-vs-Live/pending-changes state is shown (D-054 proposed), confirmation dialog, disabled/empty-state behavior, success/error messages, and reliable synchronization/public cache invalidation.
- Preview URLs/access/cache/refresh/cross-tab synchronization; blocked/deactivated behavior; Approved-but-unready initial readiness re-evaluation.
- Exact English labels, route paths, numerical responsive breakpoints, accessibility/remaining semantic colors and media limits.
- Property edit behavior as separate module; CRM/Inquiries inclusion in pilot; Super Admin UX and underlying engineering design.

## Acceptance guardrails for future planning

- It must remain possible to **save and privately review several changes** without altering currently Live pages.
- An ordinary current-section save, applied draft theme, or private Preview must **never silently publish**.
- An already-Live website can subsequently be intentionally updated by its authorized owner using explicit Publish Updates, subject to separately-approved validations and honest feedback.
- First go-live has **no owner Publish/Submit gate**, remains automatic after manual Super Admin agency approval + D-033 readiness.
- No application coding is authorized by this decision.

**Canonical:** this confirmed specification supersedes decision alternatives in `docs/POST-LIVE-UPDATES-D053-PROPOSAL.md`, retained solely as historical context.
