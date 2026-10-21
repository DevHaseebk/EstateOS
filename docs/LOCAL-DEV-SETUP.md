# EstateOS — Local development setup (Windows)

Goal: run Phase 1 sign-in in a real browser at `https://admin.estateos.localhost` (Agency Admin) and `https://control.estateos.localhost` (Super Admin). Plain `http://localhost:4001` does not work, because the management cookies are `__Host-…; Secure` and the backend only accepts these two HTTPS origins (D-081, D-088, `docs/PHASE-1-AUTH-CONTRACT-APPROVED.md`).

## Already done (2026-10-21)
- Node 24 via nvm (`nvm use 24`).
- MongoDB Atlas free cluster `estateos-dev` (project `EstateOS`), app user `estateos_app` with `readWriteAnyDatabase`, current IP allowed.
- Local secret files (gitignored): `backend/.env`, `admin/.env.local`, `super-admin/.env.local`.
- First Super Admin created. The dev password is in `backend/.env.superadmin-dev.local` (gitignored).

## One-time steps the owner does (system changes)

1. **Install Caddy** (the local HTTPS proxy), in a normal PowerShell:
   `winget install --id CaddyServer.Caddy -e`
   Close and reopen the terminal, then check: `caddy version`.
2. **No hosts file change needed.** Chrome and Edge resolve every `*.localhost` name to 127.0.0.1 by themselves. (The project first used `*.estateos.test`, which needed Administrator hosts edits; it was switched to `.localhost` on 2026-10-21.)
3. **Trust Caddy's local certificate** (Windows shows a security prompt; click Yes). Start the proxy once (see below), then in a second terminal run `caddy trust`. If it says access is denied, run it again in an Administrator PowerShell. Chrome and Edge use the Windows store; Firefox needs its own setting.

## Every time you develop
From `D:\project\estateos`, in three terminals:
1. `npm run dev:backend` — API on 127.0.0.1:4003 (check `http://127.0.0.1:4003/api/health` shows `"database":"connected"`).
2. `npm run dev:admin` and `npm run dev:super-admin` — or `npm run dev` for all four apps.
3. `npm run proxy` — Caddy on ports 443/80.

Then open `https://admin.estateos.localhost` (register an agency, sign in) and `https://control.estateos.localhost` (Super Admin sign-in).

## Notes
- The admin dev servers bind to `127.0.0.1` only, so the trusted `X-EstateOS-Client-IP` header can only come from Caddy, which overwrites it. Rate limiting therefore sees real client IPs.
- If your internet IP changes, re-add it in Atlas → Network Access.
- Command-line tools (curl, Node) may not resolve `*.localhost` subdomains on Windows; use `curl --resolve admin.estateos.localhost:443:127.0.0.1 …` for scripted checks. Browsers work directly.
- To remove later: run `caddy untrust`, then uninstall Caddy.
