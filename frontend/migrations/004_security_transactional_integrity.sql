BEGIN;

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS access_code_hash TEXT;
ALTER TABLE users DROP COLUMN IF EXISTS access_code;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
UPDATE products SET sku = 'SKU-' || id WHERE sku IS NULL OR btrim(sku) = '';
ALTER TABLE products ALTER COLUMN sku SET NOT NULL;

ALTER TABLE products ALTER COLUMN cost_price TYPE NUMERIC(19,2) USING cost_price::numeric(19,2);
ALTER TABLE products ALTER COLUMN selling_price TYPE NUMERIC(19,2) USING selling_price::numeric(19,2);
ALTER TABLE transactions ALTER COLUMN amount TYPE NUMERIC(19,2) USING amount::numeric(19,2);
ALTER TABLE employees ALTER COLUMN salary TYPE NUMERIC(19,2) USING salary::numeric(19,2);
ALTER TABLE customers ALTER COLUMN total_spent TYPE NUMERIC(19,2) USING total_spent::numeric(19,2);

-- The normalized Neon tables are now authoritative only for inventory and the
-- financial ledger. Other Firebase domains retain an idempotent raw mirror;
-- do not let legacy trigger code overwrite locked operational rows.
DROP TRIGGER IF EXISTS erp_mirror_normalize ON erp_mirror_records;

CREATE UNIQUE INDEX IF NOT EXISTS businesses_tenant_code_uidx ON businesses(tenant_id, code);
CREATE UNIQUE INDEX IF NOT EXISTS users_company_email_uidx ON users(tenant_id, business_id, lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS products_company_sku_uidx ON products(tenant_id, business_id, sku);
CREATE UNIQUE INDEX IF NOT EXISTS businesses_scope_uidx ON businesses(tenant_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS users_scope_uidx ON users(tenant_id, business_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS products_scope_uidx ON products(tenant_id, business_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS customers_scope_uidx ON customers(tenant_id, business_id, id);

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_nonnegative_values;
ALTER TABLE products ADD CONSTRAINT products_nonnegative_values
  CHECK (quantity >= 0 AND selling_price >= 0 AND (cost_price IS NULL OR cost_price >= 0)
    AND (low_stock_level IS NULL OR low_stock_level >= 0)) NOT VALID;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_positive_amount;
ALTER TABLE transactions ADD CONSTRAINT transactions_positive_amount CHECK (amount > 0) NOT VALID;

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  customer_id TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH','MOBILE_MONEY','BANK_TRANSFER','CREDIT')),
  total_amount NUMERIC(19,2) NOT NULL CHECK (total_amount > 0),
  recorded_by TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, business_id, idempotency_key),
  UNIQUE(tenant_id, business_id, id),
  FOREIGN KEY(tenant_id, business_id, customer_id) REFERENCES customers(tenant_id, business_id, id) NOT VALID
);

CREATE TABLE IF NOT EXISTS sale_lines (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  sale_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(19,2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(19,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  FOREIGN KEY(tenant_id, business_id, sale_id) REFERENCES sales(tenant_id, business_id, id) ON DELETE CASCADE,
  FOREIGN KEY(tenant_id, business_id, product_id) REFERENCES products(tenant_id, business_id, id),
  UNIQUE(sale_id, product_id)
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sale_id TEXT,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('OPENING','RECEIPT','SALE','ADJUSTMENT','RETURN')),
  quantity_delta INTEGER NOT NULL CHECK (quantity_delta <> 0),
  resulting_quantity INTEGER NOT NULL CHECK (resulting_quantity >= 0),
  reason TEXT,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY(tenant_id, business_id, product_id) REFERENCES products(tenant_id, business_id, id),
  FOREIGN KEY(tenant_id, business_id, sale_id) REFERENCES sales(tenant_id, business_id, id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS integration_outbox (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','DELIVERED','FAILED')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS integration_outbox_pending_idx ON integration_outbox(status,next_attempt_at);

CREATE TABLE IF NOT EXISTS request_rate_limits (
  bucket TEXT NOT NULL,
  subject_hash TEXT NOT NULL,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count >= 0),
  PRIMARY KEY(bucket, subject_hash)
);

COMMIT;
