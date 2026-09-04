BEGIN;

ALTER TABLE platform_workspace_invites
  ADD COLUMN IF NOT EXISTS token_hash TEXT;

-- Pending email-only invitations from older builds are revoked because a
-- workspace claim must now prove possession of a one-time invitation token.
UPDATE platform_workspace_invites
SET revoked_at=NOW()
WHERE accepted_at IS NULL AND revoked_at IS NULL AND token_hash IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS platform_workspace_invites_pending_token_uidx
  ON platform_workspace_invites(token_hash)
  WHERE accepted_at IS NULL AND revoked_at IS NULL AND token_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS platform_user_invites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  business_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  FOREIGN KEY (tenant_id, business_id) REFERENCES businesses(tenant_id, id)
);

CREATE UNIQUE INDEX IF NOT EXISTS platform_user_invites_pending_email_uidx
  ON platform_user_invites(LOWER(email))
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS platform_user_invites_tenant_idx
  ON platform_user_invites(tenant_id, created_at DESC);

COMMIT;
