# Rollback plan

If the web release fails, promote the prior Vercel deployment and disable the cron while preserving outbox records. Revoke compromised secrets and Firebase sessions if authentication is involved.

For Neon, stop writes, preserve logs, restore the pre-migration demo branch/backup, and redeploy the previous application. Migration 004 has a reviewed down migration, but restoring the isolated branch is preferred when data has changed.

For Data Connect, deploy only backward-compatible schema changes. Never use `--force`; if the initial clean deployment fails, delete/recreate only the new demo resources after confirming they contain no user data. The existing development project is outside deployment scope.

Firestore rules rollback uses the previous version from source control. S3-compatible object rollback uses bucket versioning or the provider backup policy. Do not make the bucket public as an emergency workaround. Failed object writes are retried only after confirming no authoritative record points to a missing object.

Preserve audit/outbox evidence before rollback. After restoration, rerun health, login, tenant isolation, sale rollback, private-file and reconciliation checks.
