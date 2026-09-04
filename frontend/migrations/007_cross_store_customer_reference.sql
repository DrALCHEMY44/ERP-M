BEGIN;

-- Remove the legacy cross-store constraint before the final Data Connect to
-- Neon consolidation. Migration 008 makes both customers and sales Neon-local.
ALTER TABLE sales
  DROP CONSTRAINT IF EXISTS sales_tenant_id_business_id_customer_id_fkey;

CREATE INDEX IF NOT EXISTS sales_customer_history_idx
  ON sales (tenant_id, business_id, customer_id, created_at DESC)
  WHERE customer_id IS NOT NULL;

COMMIT;
