> **HISTORICAL / RESOLVED v4.1:** Owner explicitly approved **D-052 Option A** (Saved Draft Only + applied theme). **Do not implement** options B or C; see canonical `docs/WEBSITE-EDITOR-PREVIEW-D052-CONFIRMED.md`. All below is archived decision-making context, not current requirements.

# D-052 — PROPOSED ONLY: Guided Website Editor Preview & Saved-Draft Synchronization

**Decision:** D-052 | **Status:** NOT APPROVED | **Bundle:** v4.0 | **Date:** 2026-10-19 | **Milestone:** M00 Planning | **Mode:** PLANNING ONLY — NO APP CODE

## Approved prerequisites — not part of the vote

- D-050: current Website Editor section persists only through explicit manual **Save Changes**; no ordinary autosave or global Save All.
- D-051: leaving a dirty current section requires a **Save / Discard / Stay** choice. A successful Save is required to proceed via Save, Discard leaves previously saved state intact and proceeds, Stay preserves working inputs and remains in editor.
- D-049: a candidate **Theme Selection preview** is a separate noncommitting comparison until explicit Apply/Save. Do not merge theme preview with content draft preview.
- D-029/D-033: Pending drafts/previews are tenant-private; first public activation needs manual Super Admin approval + minimal readiness; no initial Publish/Submit. Post-live editing and update deployment remains OPEN.

## Single decision: what does "Preview Website" render?

### Option A — Preview only the persisted saved draft (RECOMMENDED)

The Preview action displays the most recent **successfully saved** content for all sections and the currently **applied** theme. To see a change in Preview, agent first saves that section. D-051's guard asks Save/Discard/Stay if there is unsaved editor content. No hidden save and no rendering of non-persisted form inputs; label/status clarifies it's a private draft preview rather than proof of public publication. Strength: simplest reliable model for an initial 2–3 agency pilot.

### Option B — Temporary working preview of unsaved edits

Preview may render the currently unsaved section's working inputs **without committing them**. Requires explicitly defined transition so D-051 Save/Discard/Stay is not bypassed and user knows Preview is temporary. Returning to editor, refresh/navigation and other sections' edits need special handling. More complex; potential confusion between viewed and stored state.

### Option C — User-selectable Saved vs Working comparison

Preview offers distinct **Saved Draft** and **Working Changes** modes (with explicit unsaved indicators). Editor dirty-navigation protection stays intact, so switching preview modes cannot silently persist or discard unsaved inputs. Highest complexity and testing burden for MVP.

## Unresolved regardless of option

- Detailed preview entry/fallback, authorization, link/URL patterns and draft token expiry.
- Whether preview includes current dirty data versus only saved section data (choose above), plus latency/cache refresh/synchronization and multi-tab conflicts.
- Exact status/messaging, failure/retry, button labels, desktop/mobile preview toggles and breakpoints.
- Preview must not imply a real public Live URL for a Pending or not-ready agency.
- **Already-Live** site content/theme changes: staging, public refresh timing and owner/admin publish permissions remain a separate future approval; D-052 should not silently set those mechanics.
- Property/CRM pilot scope, semantic tokens and accessible UX QA remain open.

**Suggested owner response:** `EstateOS D-052 ke liye Option A/B/C approve karta hoon. D-052 CONFIRMED mark karke planning documents aur Claude/Cursor/Codex handover update karo, v4.1 ZIP banao. Exact preview messaging/routes, sync/failure, post-live publishing, breakpoints aur CRM scope pending rakho. Phir next Agency Website UX decision discuss karo.`
