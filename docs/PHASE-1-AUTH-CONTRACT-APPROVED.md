# EstateOS — Phase 1 Auth & Tenant Foundation Contract (APPROVED, as-built)

**Status:** APPROVED by the owner in chat on 2026-10-21 ("contract k lea approved h sb").
**Provenance:** The original Prompt #01 contract text was not saved in the repository. This document was written by Claude Code from the **implemented and verified** Phase 1 code, so it describes exactly what was built. It satisfies D-115 for Phase 1 only.
**Decisions implemented:** D-028, D-072, D-074, D-076, D-081, D-088, D-089, D-093, D-095, D-096, D-097, D-098, D-111, D-115.

If code and this document ever disagree, treat it as a defect and raise it with the owner. Do not silently change either one.

## 1. Scope

**In scope:** owner self-signup creating a Pending agency; Agency Owner and Super Admin login, logout and current session; revocable server sessions; same-origin BFF per management app; CSRF and Origin checks; login throttling; server-derived tenant scope; one-time Super Admin CLI bootstrap; support-assisted password reset (CLI issues a code, user completes it on their portal); minimal auth screens.

**Out of scope:** Super Admin review actions (Approve, Request Changes, Reject), Block/Deactivate, Pending agency list, admin-created owner invitations (D-118), email delivery, public tenant routing, website editor, properties, media, CRM, billing.

## 2. Hosts, transport and cookies (D-074, D-081, D-088)

| Part | Local | Notes |
|---|---|---|
| Agency Admin (`admin/`) | `https://admin.estateos.test` → port 4001 | Owner portal |
| Super Admin (`super-admin/`) | `https://control.estateos.test` → port 4002 | Super Admin portal |
| Backend (`backend/`) | `http://127.0.0.1:4003` (`BIND_HOST`) | Not exposed to browsers or the internet |
| Public site (`frontend/`) | port 4000 | Never receives management cookies |

- The browser talks only to its own app at `/api/v1/*`. The app's route handler (BFF) forwards an **allow-listed** set of routes to the backend with `x-internal-api-key`, a fixed `x-portal` (`OWNER` or `SUPER_ADMIN`), `x-client-ip`, and the session token taken from the cookie.
- The backend rejects every `/api/v1` request without the correct `INTERNAL_API_KEY` (403) and every request whose portal does not match the route (403).
- Session cookies: `__Host-estateos_owner` / `__Host-estateos_super`, `HttpOnly; Secure; SameSite=Lax; Path=/`, no `Domain`. Pre-auth CSRF nonce cookies: `__Host-estateos_preauth_owner` / `__Host-estateos_preauth_super`, 20 minutes.
- The raw session token is never returned to browser JavaScript. The BFF strips the backend's `internal` field from responses.
- Localhost ports are not cookie boundaries. Local development needs HTTPS hostnames through a reverse proxy; see `docs/AI/PHASE-1-RUNTIME.md`.

## 3. CSRF and Origin (D-088)

- All state-changing requests need an exact `Origin` equal to the portal origin. `Sec-Fetch-Site: cross-site` is rejected. The BFF checks this before forwarding, and the backend checks again.
- `GET /api/v1/auth/csrf` returns a token:
  - not signed in: HMAC(`CSRF_SIGNING_KEY`, portal + nonce.expiry); the nonce goes into the HttpOnly pre-auth cookie;
  - signed in: HMAC(session's CSRF secret, session token digest).
- Clients send the token as `X-CSRF-Token`. Mutations other than DELETE must be `Content-Type: application/json`.

## 4. Sessions and throttling (D-098)

| Setting | Agency Owner | Super Admin |
|---|---|---|
| Idle expiry | 12 hours | 30 minutes |
| Absolute expiry | 7 days | 12 hours |
| Max active sessions (oldest revoked) | 3 | 1 |

- Sessions are stored server-side by SHA-256 digest of a 256-bit random token. Idle expiry is extended at most every 5 minutes. A session is invalid if it is revoked, expired, on the wrong portal, or the user's `credentialVersion` has changed.
- Logout revokes the current session. A password reset increments `credentialVersion` and revokes all of the user's sessions.

| Limit | Value |
|---|---|
| CSRF token requests | 30 per minute per IP |
| Signup | 5 per hour per IP |
| Login attempts per IP | 20 (owner) / 10 (Super Admin) per 15 minutes |
| Failed logins per email + IP | 5 per 15 minutes |
| Reset completion | 5 per hour per IP; 5 per code per 15 minutes |

Rate-limited responses are `429` with `Retry-After: 900`. In production the BFF refuses auth (503) unless `TRUSTED_CLIENT_IP_HEADER` is set to a header the ingress overwrites.

## 5. Data model (MongoDB replica set required for transactions)

| Collection | Fields |
|---|---|
| `Agency` | `name`, `mobileE164`, `whatsappE164`, `reviewStatus` (`PENDING` only in Phase 1), timestamps |
| `User` | `role` (`AGENCY_OWNER` \| `SUPER_ADMIN`), `agencyId` (owners only), `name`, `emailNormalized` (unique), `passwordHash` (argon2id), `credentialVersion`, `accountState` (`ACTIVE`), `resetTokenDigest`, `resetExpiresAt`, `bootstrapKey` (unique, sparse) |
| `AuthSession` | `tokenDigest` (unique), `userId`, `portal`, `credentialVersion`, `csrfSecret`, `lastSeenAt`, `idleExpiresAt`, `absoluteExpiresAt` (TTL index), `revokedAt` |
| `AuthRateLimit` | `key` (digest, unique), `count`, `expiresAt` (TTL index) |
| `AuthAudit` | `action`, `actor`, `targetUserId`, `method`, `secondApprover`, `createdAt` |

Review disposition is the only agency axis in Phase 1. Restriction, readiness and publication axes (D-102) come in later milestones.

## 6. Tenant rule (D-076, D-089)

- An owner's `agencyId` comes **only** from their authenticated `User` record (`ownerScope` in `backend/src/tenant.ts`). `tenantAgencyFilter` fails closed if a requested id differs from the scope.
- Any `agencyId` in the query, body or `x-agency-id` header is rejected with `422 VALIDATION_ERROR`. Another agency's id in the path returns `404 NOT_FOUND`.

## 7. Versioned REST API — `/api/v1` (D-115)

All responses: `{ "data": … }` on success; errors as `{ "error": { "code", "message", "details"?, "requestId" } }`. All `/api/v1` responses send `Cache-Control: no-store`.

| Method & path | Portal | Auth | CSRF + Origin | Request | Success |
|---|---|---|---|---|---|
| `GET /auth/csrf` | both | optional | — | — | `200 { csrfToken }` |
| `POST /owner/registrations` | OWNER | none | pre-auth | `ownerName, agencyName, mobile, whatsapp, email, password` | `201 { agency: { id, reviewStatus: "PENDING" }, owner: { id, name, email } }` |
| `POST /owner/sessions` | OWNER | none | pre-auth | `email, password` | `200 { user, agency }`, sets owner cookie |
| `GET /owner/session` | OWNER | owner session | — | — | `200 { user, agency }` |
| `DELETE /owner/session` | OWNER | owner session | session | — | `204`, clears cookie |
| `GET /owner/agencies/:agencyId` | OWNER | owner session | — | own 24-hex id | `200 { id, name, mobile, whatsapp, reviewStatus }` |
| `POST /super-admin/sessions` | SUPER_ADMIN | none | pre-auth | `email, password` | `200 { user }`, sets Super Admin cookie |
| `GET /super-admin/session` | SUPER_ADMIN | Super Admin session | — | — | `200 { user }` |
| `DELETE /super-admin/session` | SUPER_ADMIN | Super Admin session | session | — | `204`, clears cookie |
| `POST /auth/recovery/complete` | both | none | pre-auth | `resetCode, newPassword` | `204` |

Health (outside `/api/v1`): `GET /api/health` → `200 { status: "ok", database }`, works without MongoDB.

**Error codes:** `INVALID_JSON` 400 · `INVALID_RESET_CODE` 400 · `AUTH_REQUIRED` 401 · `INVALID_CREDENTIALS` 401 · `FORBIDDEN` 403 · `ORIGIN_REJECTED` 403 · `CSRF_REJECTED` 403 · `NOT_FOUND` 404 · `EMAIL_EXISTS` 409 · `UNSUPPORTED_MEDIA_TYPE` 415 · `VALIDATION_ERROR` 422 (with per-field `details`) · `RATE_LIMITED` 429 · `INTERNAL_ERROR` 500 · `AUTH_UNAVAILABLE` 503 (no database, missing keys or untrusted ingress).

## 8. Signup validation (D-028, D-097)

- Owner name 2–100 and agency name 2–120 characters, trimmed. Email trimmed, NFC-normalized, lowercased, max 254, unique.
- Mobile and WhatsApp: Pakistani `03XXXXXXXXX` or `92…` normalized to `+92…`; otherwise E.164 `+` with 8–15 digits.
- Password 12–128 characters, zxcvbn score ≥ 3, must not contain common weak words or the owner name, agency name or email.
- Valid signup creates the agency as **Pending** immediately. No email verification, KYC, documents or map. Signup does not sign the user in.

## 9. Privileged CLIs (D-095, D-096, D-111)

- `npm run bootstrap:super-admin -w backend` with `BOOTSTRAP_OPERATOR`, `BOOTSTRAP_NAME`, `BOOTSTRAP_EMAIL`, `BOOTSTRAP_PASSWORD` from a protected environment. It fails if any Super Admin exists, creates the user and an audit record in one transaction, and never prints the password.
- `npm run recovery:issue -w backend` with `RECOVERY_OPERATOR`, `RECOVERY_EMAIL`, `RECOVERY_VERIFICATION_METHOD`, `RECOVERY_ATTESTED=YES`, and a distinct `RECOVERY_SECOND_APPROVER` for Super Admin accounts. It prints a one-use code valid for 15 minutes for delivery over the verified channel, and writes an audit record.
- Logs never contain passwords, reset codes or session tokens.

## 10. Environment variables (values never committed)

- Backend: `PORT`, `BIND_HOST`, `MONGODB_URI`, `OWNER_ORIGIN`, `SUPER_ADMIN_ORIGIN`, `INTERNAL_API_KEY` (≥32 chars), `CSRF_SIGNING_KEY` (≥32 chars).
- Agency Admin / Super Admin: `OWNER_ORIGIN` / `SUPER_ADMIN_ORIGIN`, `BACKEND_INTERNAL_URL`, `INTERNAL_API_KEY` (same value as the backend), optional `TRUSTED_CLIENT_IP_HEADER`.

## 11. Acceptance tests (D-093) — verified 2026-10-21

`npm test -w backend` (12/12 pass on Node 24.14.0, mongodb-memory-server replica set): health without database; direct backend call rejected; Pending signup; missing CSRF and foreign Origin rejected; normalized duplicate email 409; cross-tenant read 404; agencyId via query, header or body 422; owner token on Super Admin route and the reverse 401; Super Admin logout revokes; owner logout needs CSRF and same Origin; absolute and idle expiry; reset revokes sessions and cannot be replayed; login throttling 429; bootstrap audited and refuses a second run; BFF cookie flags and cross-portal route rejection. Typecheck, lint and build pass for all four workspaces.

## 12. Known limits accepted for the pilot

- No per-account login cap across many IPs.
- Both BFFs share one `INTERNAL_API_KEY`.
- The CLIs run through `tsx` (a devDependency).
- Not yet tested in a real browser over the HTTPS proxy, or against a real MongoDB replica set.
