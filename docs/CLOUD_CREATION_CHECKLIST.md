# Defence cloud-creation checklist

> Historical Firebase/Data Connect checklist. Do not use it for the current
> release; follow `IMPLEMENTATION_STATUS.md` and `DEPLOYMENT.md`.

No step in this checklist is authorized until the final go/no-go checkpoint is approved. Never target `studio-8058744913-5a601`.

## Resources

- [ ] Create a dedicated Firebase project and record the exact `<NEW_DEMO_PROJECT_ID>`; configure budgets/alerts before enabling billable Data Connect resources.
- [ ] Register the Firebase Web app and record only its public client identifiers.
- [ ] Register Firebase Android package `com.kali.erpm.erp_mobile`.
- [ ] Create the Data Connect service, Cloud SQL database and `example` connector in the reviewed region; validate the repository schema as a clean initial deployment without `--force`.
- [ ] Create an isolated Neon demo branch/database from a restorable parent or take a provider backup; record its hostname separately from credentials.
- [ ] Create one private, versioned S3-compatible bucket with public access blocked and narrowly scoped credentials. Firebase Storage is not required.
- [ ] Create a Vercel project rooted at `frontend/`, with the verified Node runtime and encrypted production/preview variables separated.
- [ ] Create an OpenRouter key restricted by budget, allowed origin/application where supported, and models needed for the demonstration.

## Enter configuration directly—never in chat

| Material | Direct entry location |
|---|---|
| Production Firebase public Web configuration and `NEXT_PUBLIC_APP_URL` | Vercel project **Settings → Environment Variables**, scoped to the intended environment |
| Firebase Admin/Google Cloud server credentials | Prefer Google Cloud workload identity or the Vercel-supported credential integration. If credential fields are required, enter them only in Vercel encrypted environment variables and the approved local uncommitted environment file; never commit a service-account JSON file |
| Neon URL, S3 endpoint/bucket/access credentials, OpenRouter key, rate-limit credentials, `CRON_SECRET`, expected-target guards | Vercel project **Settings → Environment Variables** for deployment; `frontend/.env` for local verification only |
| Local public and private web variables | `frontend/.env`, which is ignored by Git; copy names—not values—from `frontend/.env.example` |
| Android Firebase configuration | Download directly to `mobile/android/app/google-services.json`; it is ignored by Git |
| FlutterFire generated configuration, if used | Generate locally as `mobile/lib/firebase_options.dart`; it is ignored by Git |
| iOS Firebase configuration, if later required | `mobile/ios/Runner/GoogleService-Info.plist`; it is ignored by Git |
| Demo user passwords | Enter in Firebase Authentication administration or the controlled invitation/reset flow; never store in repository files or chat |

Before any Neon migration, display only the redacted hostname, prove it is the new demo branch, confirm the backup/restorable parent, run the exact-host guard, print the migration plan, and obtain explicit confirmation.
