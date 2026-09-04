BEGIN;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE products
  ADD CONSTRAINT products_status_check CHECK (status IN ('active', 'inactive'));

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS description TEXT;

COMMIT;
