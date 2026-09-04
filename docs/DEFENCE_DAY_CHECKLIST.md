# Defence-day checklist

> Historical Firebase/Data Connect checklist. Do not use it for the current
> release; follow `IMPLEMENTATION_STATUS.md` and `DEPLOYMENT.md`.

- Public web URL: pending verified Vercel deployment
- Health URL: `https://<domain>/api/health`
- Firebase project ID: pending new `smarterp-ai-defence-demo-<suffix>` project
- Neon demo branch/database: pending
- Flutter APK: pending verified release build
- Demo credentials: create Firebase users securely; put only UIDs/emails in seed environment variables and distribute passwords out-of-band
- Verify backups, health, reconciliation, audit records and the private S3-compatible bucket before arrival

## Demonstration sequence

Login as Company A owner; show dashboard; create a product; record a sale and show stock reduction; add an expense; assign a task; complete it on Android; upload/search a safe document; ask for a role-aware advisory summary; show the audit/outbox status; then prove Company B data is inaccessible.

## Operations

- Manual reconciliation: authenticated server operator invokes `POST /api/internal/reconcile-outbox` with the private bearer secret.
- Vercel logs: project → Deployments → selected deployment → Runtime Logs.
- Firebase logs: Firebase/Google Cloud console → Logging for the dedicated project.
- Neon queries: demo project → Monitoring/Operations; do not paste connection strings.
- OpenRouter outage: state that AI is advisory, demonstrate controlled error handling, and continue the transactional ERP flow.
- Unstable internet: use screenshots plus a dated screen recording of login, sale/stock, task/mobile, document, AI, audit and isolation tests; do not present localhost as the online deployment.
