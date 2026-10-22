# EstateOS — Deployment Runbook (Phase 7a draft)

**Status:** written in Phase 7a (`docs/PHASE-7A-DEPLOY-READINESS-CONTRACT-APPROVED.md`). Provider-specific steps are marked **[7b]** and stay blank until the owner chooses hosting, domain, storage and backup accounts (`docs/PHASE-7-STAGING-DEPLOYMENT-CONTRACT-PROPOSED.md` §6). This is not a launch approval.

## 1. What runs where

| App | Workspace | Needs | Reachable by |
|---|---|---|---|
| API | `backend/` | MongoDB, the media bucket | the three Next.js apps only (never the internet) |
| Agency Admin | `admin/` | the API | owners, on the admin HTTPS host |
| Super Admin | `super-admin/` | the API | EstateOS operators, on the control HTTPS host |
| Public sites | `frontend/` | the API (public key only) | everyone, on `<slug>.<PUBLIC_SITE_DOMAIN>` |

Every setting is listed, with comments, in each workspace's `.env.example`. Secrets come from the host's secret store and never from Git.

| Secret | Set on | Rotation |
|---|---|---|
| `INTERNAL_API_KEY` | backend, admin, super-admin | Change all three together, then restart them; requests in flight fail once. |
| `PUBLIC_API_KEY` | backend, frontend | Change both together; public pages fail until both restart. |
| `CSRF_SIGNING_KEY` | backend | Forms that are open in a browser during the change must be submitted again. Sessions stay valid. |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | backend | Create the new key at the provider, deploy it, then revoke the old one. |
| `MONGODB_URI` (password) | backend | Add the new database user first, deploy, then remove the old user. |
| `BACKUP_ENCRYPTION_KEY` | backup job and restore operator only | Never rotate silently: old backups need the old key. Record which key opens which backups. **[7b]** custody. |

## 2. Release

1. Pick a Git commit on `master` whose CI run is green (typecheck, lint, build, backend tests).
2. Build that commit for all four apps. **[7b]** the build and deploy commands of the chosen host.
3. Deploy the **API first**, then the three Next.js apps.
4. Run the smoke checks (§3). Any failure → roll back (§4).
5. Record: commit, time, operator, smoke results.

`NODE_ENV=production` makes the API refuse to start when a setting is missing or still a development value. The log names the setting and never shows its value. Fix the setting; do not work around the check.

## 3. Smoke checks (synthetic data only)

- `GET /api/ready` on the API returns **200** `{"status":"ready"}` (the database and the bucket both answer). `/api/health` only proves the process is up.
- The admin host and the control host show their sign-in pages over valid HTTPS.
- A synthetic test agency's public site opens on its subdomain; an unknown subdomain shows the not-found page.
- A public image returns `Cache-Control: public, max-age=300`.
- Sign-in on both portals with synthetic accounts; sign out again.
- Exactly one API instance logs that it runs the background jobs; every other instance has `RUN_BACKGROUND_JOBS=false`.

## 4. Rollback

- **Application:** redeploy the previous green commit (API first). Published revisions, the Live pointers and the audit history are data, so a code rollback keeps them.
- **Database changes** must work with both the old and the new code during the release window. A database restore is **not** a rollback: it discards everything written since the backup and needs the owner's explicit decision.

## 5. Backups (D-112)

- `npm run backup -w backend` with `MONGODB_URI`, the bucket settings and `BACKUP_ENCRYPTION_KEY` set. It writes `backups/estateos-YYYYMMDD-HHMMSS.bak` to the bucket and prints the collection counts.
- The file is gzip + AES-256-GCM encrypted. The header holds only the format, the time and the collection counts.
- **[7b]** a daily schedule, retention (for example 30 days), who holds the key, and an alert when the backup fails.
- Media files are not in the database backup; their durability depends on the storage provider. **[7b]** decide on bucket versioning or replication.

## 6. Restore drill (do it before the pilot, then regularly)

1. Create an **empty** database (never the live one), for example `estateos-restore-drill`.
2. Run `npm run restore -w backend` with `BACKUP_ENCRYPTION_KEY`, `RESTORE_TARGET_URI` set to that empty database, and either `RESTORE_KEY=backups/…` or `RESTORE_FILE=…`. It refuses the source database, a non-empty target, a wrong key and a changed file, all before writing anything.
3. Compare the printed counts with the backup's counts. Start an API against the drill database with synthetic settings and check `/api/ready`.
4. Record the date, the backup used, the time taken and the result. Delete the drill database afterwards.

## 7. Known limits

- Public images stay in browser caches for up to 5 minutes after a Block, Deactivate or photo removal. Longer caching needs a CDN purge design first (a separate approval).
- Invitation links are delivered personally by the Super Admin; there is no email provider yet.
- D-117 (privacy notice, requests) must be finished before real users join the pilot.
