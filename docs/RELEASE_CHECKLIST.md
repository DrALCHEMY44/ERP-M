# SmartERP release checklist

Use this checklist after continuous integration is green. Items that change
production accounts or accounting data deliberately require a human decision.

## Code release

- [ ] Review the complete working-tree diff and separate unrelated changes.
- [ ] Confirm `.env`, signing keys, Auth exports and test reports are untracked.
- [ ] Require the `Continuous integration` workflow on the release branch.
- [ ] Merge a reviewed release commit and create a version tag.

## Neon and identity

- [ ] Confirm the factory-reset database still reports zero application rows
  and the private bucket reports zero objects before creating the first
  production workspace.
- [ ] Re-run `npm run db:migrate:neon`, `npm run db:verify:neon` and
  `npm run db:verify:modules` from `frontend/`.
- [ ] Configure the production trusted origin, email provider and Google OAuth
  in Neon Auth.
- [ ] Register the first production Business Owner and verify its Neon Auth
  identity is linked to exactly one tenant-scoped ERP profile.
- [ ] Run the legacy-user migration only if old profiles are deliberately
  imported again; never run it against the empty fresh-start database.
- [ ] Keep Firebase Auth and the old Data Connect source available for the
  agreed rollback window; do not write new ERP data there.

## Infrastructure and finance

- [ ] Copy server variables to the deployment service without exposing them to
  either client bundle.
- [ ] Configure the private S3-compatible bucket and verify upload, download and
  deletion through the authenticated API.
- [ ] Configure Neon and object-storage backups and complete a restore test.
- [ ] Have an accountant confirm payroll rules, opening balances and the
  company-specific SYSCOHADA mapping before enabling real postings.
- [ ] Configure monitoring ownership, alerts, incident response, privacy and AI
  retention policies.

## Deployment verification

- [ ] Deploy without moving DNS and require `/api/health` to return `ready`.
- [ ] Configure GitHub's `production` environment secrets
  `SMOKE_OWNER_EMAIL` and `SMOKE_OWNER_PASSWORD` for a dedicated test company.
- [ ] Run `Production read-only smoke test` against the deployment URL.
- [ ] Manually verify mutation workflows in that test company: inventory, sale,
  expense, employee access, tasks, documents, HR, payroll and accounting.
- [ ] Verify the daily outbox and AI-retention cron executions.
- [ ] Cut over DNS only after the smoke checks pass.

## Mobile release

- [ ] Keep CI limited to Flutter analysis and host-based tests; it intentionally
  does not invoke Gradle or an Android emulator.
- [ ] Choose the final Android application ID before store publication.
- [ ] Create and securely back up an upload keystore outside the repository.
- [ ] Create `mobile/android/key.properties` from the committed example.
- [ ] Build a signed bundle with the HTTPS production `API_BASE_URL`.
- [ ] Test the bundle through an internal Play Store track before rollout.
