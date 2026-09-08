BEGIN;

CREATE TABLE IF NOT EXISTS sale_scanner_sessions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  scanner_user_id TEXT,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','COMPLETED','CANCELLED','EXPIRED')),
  expires_at TIMESTAMPTZ NOT NULL,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sale_scanner_sessions_business_scope_fkey FOREIGN KEY (tenant_id, business_id)
    REFERENCES businesses(tenant_id, id),
  CONSTRAINT sale_scanner_sessions_owner_scope_fkey FOREIGN KEY (tenant_id, business_id, owner_user_id)
    REFERENCES users(tenant_id, business_id, id),
  CONSTRAINT sale_scanner_sessions_scanner_scope_fkey FOREIGN KEY (tenant_id, business_id, scanner_user_id)
    REFERENCES users(tenant_id, business_id, id)
);

CREATE INDEX IF NOT EXISTS sale_scanner_sessions_owner_open_idx
  ON sale_scanner_sessions(tenant_id, business_id, owner_user_id, status, expires_at);

CREATE TABLE IF NOT EXISTS sale_scanner_session_items (
  session_id TEXT NOT NULL REFERENCES sale_scanner_sessions(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (session_id, product_id, unit_id),
  CONSTRAINT sale_scanner_items_product_unit_scope_fkey
    FOREIGN KEY (tenant_id, business_id, product_id, unit_id)
    REFERENCES product_units(tenant_id, business_id, product_id, id)
);

CREATE INDEX IF NOT EXISTS sale_scanner_session_items_scope_idx
  ON sale_scanner_session_items(tenant_id, business_id, session_id);

COMMIT;
