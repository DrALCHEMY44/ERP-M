# Vercel deployment

Create a Vercel project with repository root `frontend`, Node.js 24, `npm ci`,
and `npm run build`. Copy variable names from `frontend/.env.example`; never
upload or commit the local `.env` file. `NEXT_PUBLIC_APP_URL` is public. Neon
database credentials, the Neon Auth cookie secret, storage credentials,
OpenRouter key, rate-limit secret, and cron secret are private.

Set `NEON_AUTH_BASE_URL` to the branch-specific Auth endpoint and keep
`NEON_AUTH_COOKIE_SECRET` stable across deployments. In Neon Auth, add the
deployed HTTPS origin as a trusted origin and configure production email and
Google OAuth if that login option remains enabled.

Run `npm run env:check`, deploy, then request `/api/health`. A `200` response
must report `configuration`, `neonAuth`, `neon`, and `objectStorage` ready. A
`503` exposes only component status.

The cron in `frontend/vercel.json` invokes `/api/internal/reconcile-outbox` daily
with schedule `0 3 * * *` (03:00 UTC), using `Authorization: Bearer <CRON_SECRET>`.
This schedule supports personal testing on Vercel Hobby, which allows only daily
cron jobs and does not guarantee minute-precise execution. Background recovery
may therefore wait until the next day's run. AI maintenance remains daily.
For a commercial deployment on an appropriate paid plan, restore reconciliation
to `*/10 * * * *` for more frequent recovery. See
[Vercel cron limits](https://vercel.com/docs/cron-jobs/usage-and-pricing).
Calls without the exact minimum-32-character secret return `401`.

The complete sequence and rollback gates are in `DEPLOYMENT.md`.
