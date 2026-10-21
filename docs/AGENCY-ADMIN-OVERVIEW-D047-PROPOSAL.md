> **HISTORICAL / RESOLVED in v3.6:** Owner approved **D-047 Option A** (status-first Overview + one primary next action). This file retains alternative proposals for audit only. Canonical: `docs/AGENCY-ADMIN-OVERVIEW-D047-CONFIRMED.md`. NEXT **D-048 PROPOSED ONLY**: `docs/MY-WEBSITE-HUB-D048-PROPOSAL.md`.

# D-047 — PROPOSED: Agency Admin Overview Screen Hierarchy

**Status:** PROPOSED ONLY; no Option A/B/C approved | **Created:** 2026-10-19 | **Bundle:** v3.5 | **Mode:** PLANNING ONLY

## Already confirmed; do not ask again

D-044: Task-First Agency Admin, not analytics-first. D-045: four direct-access nonblocking setup tasks (Agency Details, Choose Theme, Customize Website, Preview Website). D-046: short grouped desktop/sidebar navigation and simple mobile menu; Website tools nest under My Website. D-029/D-033: site only live after manual Super Admin approval plus actual essential readiness. Zero properties acceptable.

## The narrowly scoped D-047 question

On **Overview**, what gets the top/primary visual priority? This is a **layout/content hierarchy decision** only; not permission to decide new fields, route paths, final UI copy, breakpoint pixels, completion tracking, CRM scope or automatic publish changes.

### A — Status-first + single obvious next action (RECOMMENDED)

1. Top concise agency & website status; never conflate `Pending Approval`, `Approved but Website Incomplete`, `Website Live`.
2. One high-visibility primary action based on current state (`Customize Website` / `Complete Essentials` / `Open Live Website` — sample copy only); private Preview readily available where useful.
3. Below, the D-045 compact four-item checklist with independent destinations. Keep `Add Property` as a clear **optional** secondary shortcut.
4. On narrow screens: status and primary CTA remain above checklist; all elements readable and touch-friendly.

**Benefits:** easy orientation for nontechnical agents, few competing actions, aligns best with D-044.

### B — Checklist-first setup-focused Overview

1. Four D-045 checklist tasks at top and styled most prominently; status shown just above or beside.
2. Primary action within the current task row, optional add-property shortcut below.
3. Once live, reduce checklist prominence (exact hide behavior not decided).

**Benefits:** strong first-run guidance. **Trade-off:** recurrent users may want site status/link before seeing onboarding.

### C — Equal-weight action cards

1. Overview shows large equally prominent cards for Website, Preview, Profile and Properties; status in header area.
2. Checklist appears below cards and stays nonblocking.
3. Mobile stacks cards.

**Benefits:** clear module shortcuts. **Trade-off:** may dilute the single next best action and make first login feel cluttered.

## Required invariants whichever owner selects

- Four nonblocking tasks remain and can be visited in any order.
- Website publication depends ONLY on D-029 + D-033 (plus role/status authorization), not checklist completion or adding a listing.
- Before live, show private preview only; never display an invented or broken public link.
- Super Admin approval does not become an agency-side Publish or Submit-for-Approval step.
- No analytics/stats or Inquiries/CRM capabilities silently added.
- Exact status text/labels, status-card graphic, layout dimensions, mobile breakpoints, onboarding completion state, screenshots and route strings remain OPEN.

## What the next owner approval should say

`EstateOS D-047 ke liye Option [A/B/C] approve karta hoon. Overview hierarchy CONFIRMED mark karo, relevant planning Markdown + AI handover update karke v3.6 ZIP banao. Exact labels, routes, breakpoints, CRM scope, progress persistence pending rakho. Phir My Website module ke detailed UX par discuss karo.`

No app code.
