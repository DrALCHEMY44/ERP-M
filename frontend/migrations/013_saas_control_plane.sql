BEGIN;

-- Platform access state is deliberately separate from ERP employee status.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'Active',
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_account_status_check') THEN
    ALTER TABLE users ADD CONSTRAINT users_account_status_check
      CHECK (account_status IN ('Active', 'Suspended'));
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS saas_plans (
  code TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  monthly_price_fcfa INTEGER NOT NULL CHECK (monthly_price_fcfa >= 0),
  annual_price_fcfa INTEGER NOT NULL CHECK (annual_price_fcfa >= 0),
  max_users INTEGER CHECK (max_users IS NULL OR max_users > 0),
  max_businesses INTEGER CHECK (max_businesses IS NULL OR max_businesses > 0),
  max_documents INTEGER CHECK (max_documents IS NULL OR max_documents > 0),
  monthly_ai_requests INTEGER CHECK (monthly_ai_requests IS NULL OR monthly_ai_requests > 0),
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO saas_plans(
  code, display_name, monthly_price_fcfa, annual_price_fcfa,
  max_users, max_businesses, max_documents, monthly_ai_requests, features
) VALUES
  ('Basic', 'Basic', 0, 0, 5, 1, 100, 100,
    '{"analytics":false,"prioritySupport":false,"auditExport":false}'::jsonb),
  ('Premium', 'Premium', 25000, 250000, 50, 5, 5000, 5000,
    '{"analytics":true,"prioritySupport":true,"auditExport":true}'::jsonb),
  ('Enterprise', 'Enterprise', 75000, 750000, NULL, NULL, NULL, NULL,
    '{"analytics":true,"prioritySupport":true,"auditExport":true}'::jsonb)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS saas_subscriptions (
  tenant_id TEXT PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL REFERENCES saas_plans(code),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('trialing', 'active', 'past_due', 'paused', 'canceled')),
  billing_interval TEXT NOT NULL DEFAULT 'monthly'
    CHECK (billing_interval IN ('monthly', 'annual')),
  currency TEXT NOT NULL DEFAULT 'XAF',
  amount_fcfa INTEGER NOT NULL DEFAULT 0 CHECK (amount_fcfa >= 0),
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW()),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', NOW()) + INTERVAL '1 month',
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  provider TEXT NOT NULL DEFAULT 'manual',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO saas_subscriptions(tenant_id, plan_code, amount_fcfa, status)
SELECT t.id, COALESCE(p.code, 'Basic'), COALESCE(p.monthly_price_fcfa, 0),
  CASE WHEN t.status = 'Suspended' THEN 'paused' ELSE 'active' END
FROM tenants t
LEFT JOIN saas_plans p ON p.code = COALESCE(t.subscription_tier, 'Basic')
ON CONFLICT (tenant_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS saas_invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  currency TEXT NOT NULL DEFAULT 'XAF',
  amount_due_fcfa INTEGER NOT NULL CHECK (amount_due_fcfa >= 0),
  amount_paid_fcfa INTEGER NOT NULL DEFAULT 0 CHECK (amount_paid_fcfa >= 0),
  description TEXT,
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  provider_invoice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS saas_invoices_tenant_created_idx
  ON saas_invoices(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS saas_invoices_status_due_idx
  ON saas_invoices(status, due_at);

CREATE TABLE IF NOT EXISTS saas_payments (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id TEXT REFERENCES saas_invoices(id) ON DELETE SET NULL,
  amount_fcfa INTEGER NOT NULL CHECK (amount_fcfa > 0),
  currency TEXT NOT NULL DEFAULT 'XAF',
  method TEXT NOT NULL DEFAULT 'manual',
  provider_payment_id TEXT,
  recorded_by TEXT NOT NULL,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS saas_payments_paid_idx ON saas_payments(paid_at DESC);

CREATE TABLE IF NOT EXISTS platform_audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS platform_audit_logs_created_idx
  ON platform_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS platform_audit_logs_target_idx
  ON platform_audit_logs(target_type, target_id, created_at DESC);

CREATE TABLE IF NOT EXISTS platform_tenant_notes (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_by TEXT NOT NULL,
  created_by_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS platform_tenant_notes_tenant_idx
  ON platform_tenant_notes(tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS platform_support_cases (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subject TEXT NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 200),
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_by TEXT NOT NULL,
  assigned_to TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS platform_support_cases_status_idx
  ON platform_support_cases(status, priority, updated_at DESC);

CREATE TABLE IF NOT EXISTS platform_workspace_invites (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS platform_workspace_invites_pending_email_uidx
  ON platform_workspace_invites(LOWER(email))
  WHERE accepted_at IS NULL AND revoked_at IS NULL;

COMMIT;
