BEGIN;

-- Complete the normalized Neon schema so every former Firebase SQL Connect
-- entity can be served directly from the trusted Next.js API boundary.
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS entity_type TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS tax_id TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT;

CREATE TABLE IF NOT EXISTS business_settings (
  business_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'FCFA',
  timezone TEXT NOT NULL DEFAULT 'Africa/Douala',
  fiscal_year_start TEXT NOT NULL DEFAULT '01-01',
  tax_rate NUMERIC(7,4) NOT NULL DEFAULT 0 CHECK (tax_rate >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 10 CHECK (low_stock_threshold >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS contact TEXT,
  ADD COLUMN IF NOT EXISTS attendance DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS salary_payment_status TEXT;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE suppliers
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS products_supplied TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE documents ADD COLUMN IF NOT EXISTS description TEXT;

-- Source Data Connect sale aggregates did not record a payment method. Keep
-- that absence explicit instead of presenting migrated history as cash sales.
ALTER TABLE sales DROP CONSTRAINT IF EXISTS sales_payment_method_check;
ALTER TABLE sales ADD CONSTRAINT sales_payment_method_check
  CHECK (payment_method IN ('CASH','MOBILE_MONEY','BANK_TRANSFER','CREDIT','UNKNOWN'));

-- Plaintext access codes are not part of the Neon target model.
ALTER TABLE users DROP COLUMN IF EXISTS access_code;
ALTER TABLE employees DROP COLUMN IF EXISTS code;

CREATE INDEX IF NOT EXISTS business_settings_tenant_idx
  ON business_settings (tenant_id, business_id);
CREATE INDEX IF NOT EXISTS businesses_name_idx ON businesses (lower(name));
CREATE INDEX IF NOT EXISTS employees_company_email_idx
  ON employees (tenant_id, business_id, lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS customers_company_name_idx
  ON customers (tenant_id, business_id, lower(customer_name));
CREATE INDEX IF NOT EXISTS suppliers_company_name_idx
  ON suppliers (tenant_id, business_id, lower(supplier_name));

-- Customers and sales now live in the same database. Restore the scoped
-- relationship without scanning pre-cutover rows; the final importer validates
-- it after customers have been transferred.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sales_customer_scope_fkey'
  ) THEN
    ALTER TABLE sales
      ADD CONSTRAINT sales_customer_scope_fkey
      FOREIGN KEY (tenant_id, business_id, customer_id)
      REFERENCES customers (tenant_id, business_id, id)
      ON DELETE RESTRICT NOT VALID;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS system_migrations (
  id TEXT PRIMARY KEY,
  source_project TEXT NOT NULL,
  source_service TEXT NOT NULL,
  record_counts JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
