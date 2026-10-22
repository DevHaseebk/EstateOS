# EstateOS — Phase 6b Pilot Fixes Contract (APPROVED)

**Status:** APPROVED by the owner in chat on 2026-10-22, as written, including the confirmations in section 5 (D-115). Drafted by Claude Code the same day.
**Source:** the Codex review of Phases 0–6a (shared by the owner in chat on 2026-10-22), checked against the code by Claude, plus two defects Claude found in its own work.
**Changes approved contracts:** Phase 3d (public image caching), Phase 5a (which properties a revision contains) and Phase 1 (login limits). Everything else is a correction to wording or screens that already exist.
**Decisions:** D-047, D-053, D-078, D-083, D-090, D-098, D-102, D-105, D-110, D-115, D-118.

## 0. Scope in one line

Fix what is wrong or misleading before a pilot: public images must stop being served soon after a site is blocked or a photo is removed; owner and Super Admin screens must state the real status; a revision must not publish data the page does not show; one account must not be guessable from many IP addresses. **No new features.**

## 1. Owner answers this contract is based on (approved 2026-10-22)

| # | Question | Recommended answer |
|---|---|---|
| 1 | How long may browsers and a CDN keep a public image? | **5 minutes** (`public, max-age=300`), instead of one year. After a Block, Deactivate or photo removal, an image can stay in a cache for at most 5 minutes. When the R2/CDN driver arrives (deploy phase), longer caching can come back with a purge on Block and Publish. |
| 2 | Which properties go into a published revision? | **Only what the page shows:** when the Properties section is shown, the newest `displayCount` (3 or 6) eligible properties; when it is hidden, none. Only their photos become public. Today up to 200 eligible properties and all their photos are frozen and served even when hidden. |
| 3 | Add an account-wide login limit? | **Yes:** at most **30 failed sign-ins per account in 15 minutes**, counted across all IP addresses, then `429` for that account until the window ends. The existing per-IP and per-email-and-IP limits stay. The trade-off (someone could slow down one account for 15 minutes) is accepted for the pilot; support can still issue a reset code. |
| 4 | Owner Overview main button? | One action that matches the real state, first match wins: **Deactivated** → "View agency details"; **Changes requested** → "Complete your agency details"; **no public number chosen** → "Choose a public number"; **website essentials missing** → "Finish your website"; **Live with unpublished changes** → "Review and publish updates"; **Live** → "Open your website"; otherwise → "Preview your website". |
| 5 | Which wording changes? | The texts in section 3, so every screen states the current behaviour. |
| 6 | How is an invited owner shown to the Super Admin? | The **Account status** panel says "Owner has not activated the account yet" while the owner is `INVITED`, separate from the restriction state. Block and Deactivate stay available. |
| 7 | Editor section list? | Two labelled groups: **Essentials** (Header, Hero, Contact) and **Optional sections** (the five optional sections with their Shown/Hidden badge). The behaviour does not change. |

## 2. Data and API changes

- `sendVariant(..., 'public')` sends `Cache-Control: public, max-age=300`; the frontend image proxy keeps the backend header and its own fallback becomes the same value. Owner and Super Admin images stay `private, max-age=3600`.
- `buildSnapshot` stores `properties` as in §1 Q2; `snapshotMediaIds` then only includes those properties' photos. Existing revisions are not changed; the next Publish or First Live uses the new rule. The fingerprint for "unpublished changes" follows automatically.
- Owner and Super Admin sign-in add a third limiter key per account (§1 Q3). The response stays the generic `429 RATE_LIMITED` (no hint that the account exists).
- The upload error lists all five purposes ("Hero, logo, property, About or team photo").
- No new routes, no schema migrations.

## 3. Screens and wording

**Agency Admin**
- Overview: the main button from §1 Q4.
- Review card, **Approved**: "Your agency is approved." plus the real website state ("Your website is live." / "Your website goes live as soon as the essentials are finished.").
- Review card, **Changes requested**: replace "Editing tools are coming soon…" with "Update your agency details or website, then resubmit for review."
- Editor intro: "Choose a section, make changes and save it." plus, before Live, "Saved changes stay private until your website goes live."; once Live, the existing note about **Publish updates** is the only line.
- Editor section list: grouped as in §1 Q7.

**Super Admin**
- Approve dialog: if the website is ready, "The website is ready, so it goes live as soon as you approve."; otherwise "The website goes live automatically once the owner finishes the website essentials."
- Restore dialog: "The owner gets normal access again. If the agency is approved and its website is ready, the website becomes public again."
- Account status panel: §1 Q6.

**Docs:** `docs/AI/CURRENT-STATE.md` moves the pre-Phase-1 "Next gate" text under "History".

## 4. Acceptance tests (D-093)

**API integration:**
1. A public image response has `Cache-Control: public, max-age=300`; owner and Super Admin images stay private.
2. A Live site with 8 eligible properties and `displayCount` 6 → the revision has the newest 6 and only their photos are public; with the Properties section hidden → no properties, and their photos return 404 after Publish.
3. 30 failed sign-ins for one account from 30 different IP addresses → the 31st, from a new IP address with the right password, gets 429; another account is not affected; a new window allows sign-in again.
4. The upload error names all five purposes.
5. The Super Admin detail for an invited owner still returns `owner.accountState: INVITED` (screen test below).

**Screens:** server-render or component checks for the Overview action in each state, the Approved and Changes-requested review cards, and the two dialogs.

**Gates:**
- typecheck, lint and build, plus `npm test -w backend` (existing assertions on the old one-year cache and on revisions holding all eligible properties are updated);
- an HTTPS check: image cache header, a hidden Properties section after Publish;
- a **browser click-through** in the in-app browser of the logged-in Super Admin screens (directory, Create agency, agency page) and the owner Overview, which no one has checked visually so far.

## 5. Owner confirmations (approved 2026-10-22)

The owner confirmed:

- Public images may be cached for at most 5 minutes until the CDN phase.
- A published revision holds only the properties the page shows.
- 30 failed sign-ins per account per 15 minutes, across IP addresses, then a temporary 429.
