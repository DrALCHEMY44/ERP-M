# Vercel deployment

Create a Vercel project with repository root directory `frontend`. Use Node.js 24 (or the platform-supported current LTS), `npm ci`, and `npm run build`. Copy variable names from `frontend/.env.example`; never copy `.env` into source control. Public values are limited to the documented Firebase web identifiers and `NEXT_PUBLIC_APP_URL`. All Admin, database, S3-compatible storage, OpenRouter, rate-limit and cron values are private.

After variables are configured, run `npm run env:check` in a credentialed deployment environment. Deploy, then request `/api/health`; a `200` means configuration, Firebase Admin initialization, Neon and object storage passed. A `503` exposes only boolean component status.

The cron in `frontend/vercel.json` invokes `/api/internal/reconcile-outbox` every ten minutes. Vercel must send `Authorization: Bearer <CRON_SECRET>`. Calls without the exact minimum-32-character secret return `401`.

After obtaining the hostname, add only its hostname (no scheme/path) to Firebase Authentication authorized domains and set `NEXT_PUBLIC_APP_URL` and `ALLOWED_ORIGINS` to its HTTPS origin.
