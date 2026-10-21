> **HISTORICAL / RESOLVED (2026-10-19, v4.6):** D-057 owner CONFIRMED **Option A**. This document preserves the old A/B/C alternatives, but is **not** implementation authority. Read `docs/PROPERTY-FORM-D057-CONFIRMED.md`. D-058 field requiredness is NEW PROPOSED ONLY (`docs/PROPERTY-MINIMUM-FIELDS-D058-PROPOSAL.md`). No app code.

# D-057 — PROPOSED ONLY: Add/Edit Property Form Structure

**Status at v4.5:** OPEN / UNAPPROVED (HISTORICAL; RESOLVED IN v4.6) | **Date:** 2026-10-19 | **Bundle:** v4.5 | **Scope:** Agent-facing Add/Edit Property UX layout only | **NO CODE**

## Owner decision required

Agency Admin Properties list is now **D-056 confirmed responsive cards** on desktop/mobile. When an owner clicks **Add Property** or opens a card to edit, how should the actual property form be organized? **Only form-layout and group navigation** should be approved in D-057. Do **not** finalize schema or publication.

### Option A — Single-page Essentials + Expandable Details and Photos (RECOMMENDED)

- One uncomplicated scrollable Add/Edit Property page.
- First show a small **Basic Information** area with candidate title, sale/rent, location and price-type inputs (all example fields; **not** approved required fields).
- Secondary **Property Details** and **Photos** groups below; expandable/collapsible when useful. A clear form-wide save action could be proposed, but **actual Save semantics remain OPEN** (D-050 website section Save does not automatically apply to property records).
- Mobile stacks groups naturally; desktop uses a readable limited-width form. Avoid wizard completion requirements and premature hard-coded mandatory photo rules.
- Advantage: little navigation, simplest for occasional listing creation; a little longer vertical scroll as form grows.

### Option B — Small Guided Step-by-step Flow

- Steps such as Basics → Details → Photos → Review, with Back and progress indication.
- Advantage: single task per step for newcomers; cost: more navigation, step persistence/validation and potential completion friction.
- No assumption that Photos step is required or that finishing the wizard automatically publishes anything.

### Option C — Tabbed Form

- Tabs such as Basics / Details / Photos; agents jump directly to any group and complete tasks in any order.
- Advantage: organized editing for many inputs; cost: tab state, hidden errors and less obvious mobile navigation.

**Recommendation:** A for a 2–3 agency pilot, a low-training experience and one shared design system. Preserve nontechnical agent focus; only one new design decision at a time.

## Candidate screen outline (UNAPPROVED)

| Region | Candidate information or interaction | Approval state |
|---|---|---|
| Page header | Add Property or Edit Property, Back to Properties | Copy/routes pending |
| Basics | Title, sale/rent, category/type, price, neighborhood | Fields/enums/requiredness pending |
| More Details | Size/unit, beds, baths, floor, description, optional highlights | Fields/rules pending |
| Photos | Cover, gallery, upload/remove/order | Limits/requiredness/security pending |
| Save area | Proposed Save / Cancel with real validation/error feedback | Save/dirty navigation/publication semantics pending |

Public website linkage is an **independent later decision**. On an already-Live site, no automatic public addition/change/deletion should be inferred from form Save.

## After D-057

Decide exact minimal field schema and requiredness, then photo UX/limits, record status/delete/archive handling and the public listing publication rule. Only then can concrete persistence and technical model be specified. See `docs/PROPERTY-FORM-FIELDS-v4.5-DISCUSSION.md` for discussion-only detail. **No implementation is authorized.**
