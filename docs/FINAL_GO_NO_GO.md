# External deployment go/no-go

> Historical checkpoint from 11 August 2026. It is superseded by
> `IMPLEMENTATION_STATUS.md` and the Neon-only `DEPLOYMENT.md` runbook.

Assessment date: 2026-08-11. Decision: **NO-GO** until dedicated cloud targets exist and are reviewed. No cloud resource, deployment, secret, seed, database migration or release APK was created during local verification.

| Gate | Result |
|---|---|
| Java 21 | PASS — workspace-local Eclipse Temurin 21.0.12+8 at `.tools/jdk21`; system Java unchanged |
| Firebase rules | PASS for parse/startup — Firebase CLI 15.26.0 loaded `backend/firestore.rules` in the Standard Firestore emulator and exited 0; behavioral allow/deny fixtures remain unresolved |
| Flutter doctor | PASS for Android — Flutter 3.44.4 stable/Dart 3.12.2, Android SDK 36 and Java 21 pass; optional Linux-desktop toolchain is absent |
| Flutter analyzer | 37 unresolved non-errors — 23 unused-code warnings and 14 deprecated-API infos |
| Flutter test | PASS — 1 passed, 0 failed |
| Frontend | PASS — 5 test suites, typecheck and production build; ESLint has 0 errors and 80 documented warnings |
| Dependencies | REVIEWED — 3 high and 6 moderate; risk and reachability are in `DEPENDENCY_RISK.md`; breaking Next.js 16 upgrade not applied |
| Document authority | CONFIRMED — private S3-compatible object storage only; Firebase Storage rules/config/deployment removed |
| Firebase target | **UNSET:** must become the exact new `<NEW_DEMO_PROJECT_ID>`; `studio-8058744913-5a601` remains prohibited and untouched |
| Neon target | Current local hostname: `ep-floral-moon-ay75t4gf-pooler.c-5.us-east-2.aws.neon.tech`, database `neondb` (credentials omitted). It is **not proven to be the new demo branch**, so migration is prohibited |
| Vercel target | **UNSET:** no local Vercel project link exists |

## Rollback readiness

- Vercel: promote the previous deployment and disable the reconciliation cron.
- Neon: stop writes and restore/promote the confirmed pre-migration branch or backup; branch restoration is preferred to a down migration.
- Data Connect: deploy only backward-compatible changes and never use `--force`; recreate only empty new-demo resources if initial provisioning fails.
- Firestore: redeploy the previous rules revision using the same explicit new-demo project ID.
- S3-compatible storage: use bucket versioning/provider restore; never make the bucket public.
- Preserve audit and outbox evidence, then repeat health, auth, tenant-isolation, atomic-sale, file privacy and reconciliation checks.

## Commands awaiting later approval

After the exact Firebase project is created and reviewed:

```bash
npx -y firebase-tools@latest deploy \
  --only dataconnect \
  --project <NEW_DEMO_PROJECT_ID> \
  --config backend/firebase.json

npx -y firebase-tools@latest deploy \
  --only firestore \
  --project <NEW_DEMO_PROJECT_ID> \
  --config backend/firebase.json
```

`storage` is intentionally absent because Firebase Storage is not an active dependency. Before Data Connect deployment, run compile against the same explicit new target without `--force`.

No Neon migration command is ready for approval. First create/select the isolated demo branch, display its redacted hostname, prove its restorable parent/backup, set and run the exact-host guard, and show the migration plan. Only then request explicit migration confirmation.

The release APK command remains withheld until a verified HTTPS Vercel URL exists and is supplied as `API_BASE_URL`.
