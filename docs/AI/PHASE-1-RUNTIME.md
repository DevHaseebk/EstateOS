# Phase 1 authentication runtime (implementation notes)

This file describes the Phase 1 foundation only. It does not approve review actions, public routing, or publishing.

## Required local services

- Use Node.js satisfying the root `engines` range. The machine's default Node v22.0.0 is below that range; a supported runtime is required for reliable install, lint, typecheck and builds.
- Use a MongoDB replica set, including locally, because signup, bootstrap and reset use transactions. Authentication fails closed while MongoDB is unavailable; `GET /api/health` remains available.
- Run the four root npm workspaces on ports 4000, 4001, 4002 and 4003. Backend defaults to loopback `127.0.0.1:4003`.
- Map `admin.estateos.test` and `control.estateos.test` to loopback. Put a trusted local HTTPS reverse proxy on port 443 that forwards those two hostnames to ports 4001 and 4002. The proxy must preserve the original `Host` and `Origin`. Trust its local certificate. Do not use two `localhost` ports as cookie boundaries.
- Set the same 32+ character `INTERNAL_API_KEY` in backend, admin and super-admin; set a separate 32+ character `CSRF_SIGNING_KEY` in backend. Use secret injection and keep values out of Git. Set exact `OWNER_ORIGIN` and `SUPER_ADMIN_ORIGIN` in the matching applications.

## Production boundary

Deploy the three Next.js applications separately, with separate HTTPS management hosts and public tenant hosts. Only the two management facades may reach `/api/v1` on the protected backend service, using its internal credential. If the backend cannot use loopback, set `BIND_HOST` to a private interface behind a network rule; do not expose the backend directly to the internet. The backend checks role and tenant on every request.

Set `TRUSTED_CLIENT_IP_HEADER` on each management facade only when the ingress **overwrites** that header and discards any client-supplied value. Production auth returns 503 until this is configured, because rate limiting needs a trustworthy IP. Management cookies use `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, no `Domain`. Public tenant hosts must route only to the public frontend and never receive a management response setting a cookie.

## Privileged operation

`npm run bootstrap:super-admin -w backend` is a one-time controlled operation. Provide `BOOTSTRAP_OPERATOR`, `BOOTSTRAP_NAME`, `BOOTSTRAP_EMAIL`, and `BOOTSTRAP_PASSWORD` through a protected operator environment. Do not put the password in a command line, checked-in file, or shared shell history. The command requires no existing Super Admin, writes a unique bootstrap marker and audit event in one transaction, and prints no credential.

Support recovery uses `npm run recovery:issue -w backend`. The operator must verify identity using a pre-existing trusted relationship and callback, record the method, and set `RECOVERY_ATTESTED=YES`. A distinct `RECOVERY_SECOND_APPROVER` is required for Super Admin recovery. Deliver the printed one-use code only through the verified channel; do not paste it into tickets or logs. It expires in 15 minutes. The user enters it on their management host and chooses a new password; existing sessions are revoked. If identity cannot be established, do not issue a code. This recovery procedure is operational and must be rehearsed before real pilot accounts are used.

Admin-created agency owner invitations are outside Phase 1. No admin-created owner may be given a shared or disclosed permanent password.

## Smoke and verification

Use synthetic accounts in an isolated MongoDB replica set. Run `npm run typecheck`, `npm run lint`, `npm run build` at the root and `npm run test -w backend` for the Phase 1 suite. Check `GET http://127.0.0.1:4003/api/health` separately. Before use with real accounts, verify the actual HTTPS proxy, ingress header overwrite, private backend reachability, cookie behavior in both browsers, and the support recovery procedure in staging.
