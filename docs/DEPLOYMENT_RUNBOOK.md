# Controlled deployment runbook

> Historical Firebase/Data Connect runbook. Do not execute these steps for the
> current release; follow the repository-root `DEPLOYMENT.md` instead.

## Preconditions

- New project ID matching `smarterp-ai-defence-demo-<suffix>`; never select `studio-8058744913-5a601`.
- Firebase billing and Data Connect resources approved, Java 21 active, and separate Neon demo branch backed up.
- Private object bucket exists and is not publicly readable.
- `EXPECTED_FIREBASE_PROJECT_ID`, `EXPECTED_DATABASE_HOST` and `DEMO_MODE_CONFIRMATION=SEED_SMARTERP_DEFENCE_DEMO` match the reviewed targets.

## Order

1. `npx -y firebase-tools@latest login --reauth`
2. `npx -y firebase-tools@latest dataconnect:compile --project <NEW_DEMO_PROJECT_ID> --config backend/firebase.json`
3. `npx -y firebase-tools@latest deploy --only dataconnect --project <NEW_DEMO_PROJECT_ID> --config backend/firebase.json`
5. `npx -y firebase-tools@latest dataconnect:sdk:generate --project <NEW_DEMO_PROJECT_ID> --config backend/firebase.json`
6. Back up the Neon demo branch; review host and migration diff.
7. `npm --prefix frontend run db:migrate:neon`
8. `npm --prefix frontend run db:backfill:neon`
9. `npm --prefix frontend run security:backfill-access-codes`
10. Verify zero plaintext access codes.
11. `npx -y firebase-tools@latest deploy --only firestore --project <NEW_DEMO_PROJECT_ID> --config backend/firebase.json`
12. Configure Vercel variables, deploy `frontend/`, and verify `/api/health`.
13. Add the Vercel hostname to Firebase Auth; configure OAuth redirects if enabled.
14. Run `npm --prefix frontend run demo:seed` only after reviewing all guards.
15. Build Flutter with `--dart-define=API_BASE_URL=https://<DEPLOYED_DOMAIN>`.
16. Execute and record all acceptance tests in `ONLINE_DEPLOYMENT_EVIDENCE.md`.

Every cloud/database command above requires the single final approval checkpoint. Stop immediately on target mismatch, migration warning, or backup failure.

## New Firebase project manual setup

1. Create a new project named `smarterp-ai-defence-demo-<unique-suffix>` and record its exact ID. Do not import or select the development project.
2. Upgrade only this demo project to the billing plan required by Data Connect, after reviewing the spending controls.
3. Choose the Data Connect/Cloud SQL region (current repository default: `us-east4`) and colocate related resources where supported.
4. Register a Web app; retain its six public web configuration values.
5. Register Android package `com.kali.erpm.erp_mobile` and fetch its configuration with `npx -y firebase-tools@latest apps:sdkconfig ANDROID <APP_ID> --project <NEW_DEMO_PROJECT_ID>` into `mobile/android/app/google-services.json` through a secure, uncommitted setup step.
6. Enable Email/Password authentication. Enable OAuth providers only if they will be demonstrated.
7. Create the Data Connect service/database/connector, then replace the repository's development resource identifiers on a deployment branch and regenerate SDKs.
8. Create Standard Firestore only for the migration profile boundary; deploy the reviewed default-deny rules after Java 21 verification. Firebase Storage is not used.
9. Create the three demo Authentication users securely; retain UIDs/emails for seeding, but never store passwords in the repository.
10. Create Firebase Admin credentials for Vercel using the approved least-privilege mechanism and store values only in Vercel encrypted variables.
11. After Vercel deployment, add its hostname to Authentication authorized domains and configure exact OAuth redirect URLs if OAuth is enabled.

Java requirement: Firebase CLI 15 requires Java 21+ for emulator/rules verification. On Debian/Kali the system-level command is `sudo apt-get install openjdk-21-jdk`; it must not be run without approval. A user-local Temurin/OpenJDK 21 archive may instead be unpacked under a user-controlled tools directory and selected only for verification with `JAVA_HOME=<path> PATH=<path>/bin:$PATH`.
