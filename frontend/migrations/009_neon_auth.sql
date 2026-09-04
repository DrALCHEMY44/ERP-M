BEGIN;

-- Keep the ERP profile identifier stable: it is referenced by tasks, sales,
-- documents, audit records and notifications. Neon Auth owns a separate UUID,
-- which is linked here after a new signup or a verified legacy activation.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_user_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS users_auth_user_id_unique
  ON users (auth_user_id)
  WHERE auth_user_id IS NOT NULL;

-- Employee access-code sessions are first-party, revocable sessions stored in
-- Neon. Only a SHA-256 digest is persisted; the bearer token is shown once.
CREATE TABLE IF NOT EXISTS app_auth_sessions (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS app_auth_sessions_active_token_idx
  ON app_auth_sessions (token_hash, expires_at)
  WHERE revoked_at IS NULL;

COMMIT;
