BEGIN;

ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS target_user_uid TEXT,
  ADD COLUMN IF NOT EXISTS target_roles TEXT[];

CREATE INDEX IF NOT EXISTS announcements_target_user_idx
  ON announcements(tenant_id, business_id, target_user_uid, created_at DESC);

COMMIT;
