# SmartERP Neon production runbook

SmartERP now uses Neon for the complete live data and identity path: PostgreSQL
for ERP records, Neon Auth for owner/web accounts, and Neon-backed revocable
sessions for employee access-code login. Firebase Data Connect and Firebase
Authentication are not imported by either deployed client. The Firebase source
configuration remains only long enough to repeat or audit the historical import.

## 1. Runtime architecture

- Next.js is the only trusted database boundary. It validates Neon sessions,
  resolves `users.auth_user_id`, enforces RBAC, and overwrites tenant, business,
  and actor identifiers supplied by clients.
- Web authentication is proxied through `/api/auth/*` and uses HttpOnly cookies.
- Flutter owner login uses a revocable Neon Auth bearer session stored with
  platform secure storage.
- Flutter employee access-code login issues an opaque `erp_session_*` token;
  Neon stores only its SHA-256 digest in `app_auth_sessions`.
- Existing ERP profile IDs are unchanged, preserving task, sale, document,
  notification, and audit relationships.
- Private objects remain in the configured S3-compatible bucket.

## 2. Required local and deployment variables

Add these to `frontend/.env` and to the production service. Do not add quotes
unless the value itself requires them.

```text
NEON_AUTH_BASE_URL=https://ep-muddy-bread-a2pkfys3.neonauth.eu-central-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=YOUR_THIRD_INDEPENDENT_RANDOM_SECRET
DATABASE_URL=YOUR_POOLED_NEON_CONNECTION_STRING
EXPECTED_DATABASE_HOST=YOUR_POOLED_NEON_HOSTNAME
NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN
ALLOWED_ORIGINS=https://YOUR_DOMAIN
```

Generate the cookie secret from any terminal; the working directory does not
matter:

```bash
openssl rand -base64 32
```

The value must be at least 32 characters, must differ from `CRON_SECRET` and
`RATE_LIMIT_SECRET`, and must remain unchanged between deployments. It signs
the server-side session cache cookie; changing it signs every web user out.

Complete the other runtime values listed in `frontend/.env.example`, then run:

```bash
cd frontend
npm run env:check
```

Firebase Admin and `SOURCE_FIREBASE_DATACONNECT_*` variables are source-only;
do not add them to the deployed service after the migration rollback window.

## 3. Configure Neon Auth in the console

In Neon Console, select the `production` branch, open **Auth → Configuration**,
and complete these items before migrating users:

1. Keep Email & Password enabled.
2. Add `https://YOUR_DOMAIN` to Trusted origins. Keep localhost allowed only
   where local development is required.
3. Configure the production email provider and verify password-reset delivery.
   Neon's shared mail service is suitable for development, not production.
4. Configure Google OAuth before leaving “Continue with Google” enabled in the
   web login page. Its callback must return to the production application.
5. Treat the console's unrestricted-signup beta warning as a launch decision.
   Application data remains inaccessible until a signed-in identity has a
   linked ERP profile, but public signup can still create an Auth-only user.

## 4. Database migration and verification

The configured Neon branch has applied migrations `001` through `012`.
Migration `009` adds the nullable identity link and employee session table.
Migration `010` adds 21 `NOT VALID` tenant/business foreign keys: new invalid
writes are rejected, while imported legacy issues can remain reviewable until
an explicitly approved reconciliation or reset. The current verifier has no
orphans. The
additive migration `011` adds HR history, attendance, leave, payroll, chart of
accounts, immutable journals, fiscal periods, bank reconciliation, receivables
and payables. Migration `012` adds AI-purpose governance, scoped conversation
history and retention indexes. The runner is idempotent and can be checked again:

```bash
cd frontend
npm run db:migrate:neon
npm run db:verify:neon
npm run db:verify:modules
```

For an explicitly approved factory data reset, first run the guarded preview:

```bash
cd frontend
npm run db:reset:neon
```

The reset preserves all schemas, constraints and `system_migrations`. It clears
only public SmartERP application rows and does not delete object-storage files
or Neon Auth's managed configuration. Execution requires the one-time
`RESET_NEON_DATA_CONFIRMATION=RESET_ALL_SMARTERP_DATA` environment value.

Object storage has a separate guarded preview because stored files are outside
PostgreSQL:

```bash
npm run storage:reset
```

Execution requires the one-time
`RESET_OBJECT_STORAGE_CONFIRMATION=RESET_ALL_SMARTERP_OBJECTS` value and removes
current objects, stored versions and delete markers when the provider exposes
version listing.

The verifier prints no credentials. After the confirmed 3 September 2026
factory reset, all public SmartERP application tables are empty and every orphan
count is zero. Treat any future non-zero orphan result as a failed cutover gate.
`db:verify:modules` makes only rollback-scoped test writes and proves journal
balance and immutability guards without retaining test rows.

Before any real payroll or statutory reporting:

1. Enter verified company-specific payroll rates and brackets in **Payroll →
   Settings**. The defaults are deliberately `DRAFT`, and posting stays locked.
2. Have a qualified local accountant review the configuration, then let the
   Business Owner explicitly mark it `CONFIRMED`.
3. Initialize the chart in **Accounting**, enter verified opening balances, and
   map the simplified internal accounts to the current SYSCOHADA chart and
   statutory presentation. The application statements are management reports
   until that mapping and review are complete.
4. Create fiscal periods only after opening balances are agreed. Closing a
   period is irreversible from the application and blocks subsequent entries.

Verify in the Neon SQL editor:

```sql
SELECT COUNT(*) AS profiles,
       COUNT(auth_user_id) AS linked_profiles
FROM public.users;

SELECT COUNT(*) AS auth_users FROM neon_auth."user";

SELECT lower(email), COUNT(*)
FROM public.users
GROUP BY lower(email)
HAVING COUNT(*) > 1;
```

Resolve every duplicate email before automated account creation. One Auth
identity cannot be safely linked to multiple tenant profiles.

## 5. Establish the first production owner

The current Neon database and Neon Auth tenant contain no users after the
confirmed factory reset. Configure trusted origins and production email first,
then register the first Business Owner through `/register`. Verify that the new
Neon Auth identity is linked to exactly one new `public.users` profile and that
the tenant and business identifiers are populated.

The legacy-user migration is not required for this fresh start. Use it only if
you deliberately re-import profiles from the retained Firebase rollback source.
In that case, first run the read-only preview:

```bash
cd frontend
npm run auth:migrate:neon
```

After the email provider and trusted origin are verified, temporarily set:

```text
NEON_AUTH_USER_MIGRATION_CONFIRMATION=MIGRATE_EXISTING_USERS_TO_NEON_AUTH
```

Then run the same command again. It creates each missing Neon Auth account with
an unguessable temporary password, requests a reset email, and links the
returned Neon Auth UUID to the existing ERP profile. It refuses duplicate
emails and sends any pre-existing Auth email to manual review rather than
silently claiming it.

Review the result list and require every intended owner/web account to show
`linked-reset-sent`. Remove the confirmation variable afterward. Do not delete
Firebase Auth users until users have tested Neon sign-in and the rollback window
has closed.

Employee access-code accounts do not need this activation step; their next
mobile login creates a Neon-backed session automatically.

## 6. Verify and deploy the web/API service

```bash
cd frontend
npm ci
npm run env:check
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Deploy using `frontend/vercel.json` or the selected Next.js host. Then require:

```bash
curl -fsS https://YOUR_DOMAIN/api/health
```

The response must be `ready` with `configuration`, `neonAuth`, `neon`, and
`objectStorage` all true. Verify unauthenticated `/api/profile` and `/api/sales`
return 401. In a dedicated smoke-test tenant, verify new registration, email and
Google login, password reset, logout, owner mobile login, employee access-code
login/logout, inventory, sale, expense, customer, task, document, report,
notification, admin, and AI workflows.
Also verify HR attendance/leave/history, a draft payroll calculation, the
owner approval/post/pay sequence, journal reversal, trial balance equality,
management balance sheet equality, receivable/payable settlement, and bank
statement reconciliation. Use a dedicated smoke-test company, not live books.
The repository's `Continuous integration` workflow runs these local gates for
each pull request. After deployment, run the manually triggered
`Production read-only smoke test` workflow with a dedicated Business Owner test
account; it reads every core module without mutating company records.

The AI service uses `openrouter/free` plus a current explicit free-model
fallback list. `OPENROUTER_MODELS` can prepend comma-separated model IDs without
changing source code. Keep `OPENROUTER_DATA_COLLECTION=deny`. Enable
`OPENROUTER_REQUIRE_ZDR=true` only after the OpenRouter account privacy settings
and every selected endpoint have been verified for ZDR; otherwise OpenRouter
will reject requests that have no compatible endpoint. Free models are suitable
for development and low-volume validation, but do not provide a production SLA.

Vercel calls `/api/internal/ai-maintenance` daily using `CRON_SECRET`. Confirm
that the cron succeeds after deployment; it enforces `AI_RETENTION_DAYS` for AI
query history and removes expired AI rate-limit windows. Dashboard narratives
are cached per user for `AI_INSIGHT_CACHE_MINUTES` and fall back to deterministic
Neon-derived metrics when every external model is unavailable.

## 7. Build the Android release

Firebase Android configuration is no longer required. Keep the upload keystore
outside the repository, copy `mobile/android/key.properties.example` to
`mobile/android/key.properties`, and enter the private values.

```bash
cd mobile
flutter pub get
flutter analyze
flutter test
flutter build appbundle --release \
  --dart-define=API_BASE_URL=https://YOUR_DOMAIN
```

The build fails closed if signing is absent or the release API URL is not HTTPS.
Test the signed bundle on an internal track before public rollout.

## 8. Rollback and decommission gates

- Keep the previous deployment, Firebase Auth users, and the source Data Connect
  service available during the agreed rollback window.
- Do not write new ERP data to the old service after the final Neon cutover.
- Do not delete rows to reverse migrations; restore a verified Neon backup.
- Revoke the Firebase source service account and remove all source-only secrets
  after sign-off, then archive Data Connect/Cloud SQL to stop its cost.
- Retain tested backups, monitoring ownership, incident response, privacy and
  retention policies before processing production customer data.
