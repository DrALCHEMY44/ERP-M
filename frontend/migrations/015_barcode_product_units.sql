BEGIN;

-- Inventory is stored in a product's smallest/base unit. Barcodes may identify
-- that unit or a larger package (for example, one carton containing 24 bottles).
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS base_unit TEXT NOT NULL DEFAULT 'piece';

UPDATE products
SET base_unit = 'piece'
WHERE btrim(base_unit) = '';

CREATE TABLE IF NOT EXISTS product_units (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  unit_name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  conversion_factor INTEGER NOT NULL CHECK (conversion_factor > 0),
  barcode TEXT,
  selling_price NUMERIC(19,2),
  is_base BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (selling_price IS NULL OR selling_price >= 0),
  CHECK (barcode IS NULL OR btrim(barcode) <> ''),
  CONSTRAINT product_units_company_scope_fkey FOREIGN KEY (tenant_id, business_id)
    REFERENCES businesses(tenant_id, id),
  CONSTRAINT product_units_product_scope_fkey FOREIGN KEY (tenant_id, business_id, product_id)
    REFERENCES products(tenant_id, business_id, id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS product_units_scope_uidx
  ON product_units(tenant_id, business_id, product_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS product_units_name_uidx
  ON product_units(tenant_id, business_id, product_id, lower(unit_name));
CREATE UNIQUE INDEX IF NOT EXISTS product_units_barcode_uidx
  ON product_units(tenant_id, business_id, barcode)
  WHERE barcode IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS product_units_one_base_uidx
  ON product_units(tenant_id, business_id, product_id)
  WHERE is_base;

INSERT INTO product_units(
  id, tenant_id, business_id, product_id, unit_name, abbreviation,
  conversion_factor, is_base
)
SELECT p.id || ':base', p.tenant_id, p.business_id, p.id, p.base_unit,
  left(p.base_unit, 12), 1, TRUE
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_units pu
  WHERE pu.tenant_id=p.tenant_id AND pu.business_id=p.business_id
    AND pu.product_id=p.id AND pu.is_base
);

ALTER TABLE sale_lines
  ADD COLUMN IF NOT EXISTS unit_id TEXT,
  ADD COLUMN IF NOT EXISTS unit_name TEXT,
  ADD COLUMN IF NOT EXISTS conversion_factor INTEGER NOT NULL DEFAULT 1;

UPDATE sale_lines sl
SET unit_id=pu.id,
    unit_name=pu.unit_name
FROM product_units pu
WHERE pu.tenant_id=sl.tenant_id
  AND pu.business_id=sl.business_id
  AND pu.product_id=sl.product_id
  AND pu.is_base
  AND (sl.unit_id IS NULL OR sl.unit_name IS NULL);

ALTER TABLE sale_lines
  ALTER COLUMN unit_id SET NOT NULL,
  ALTER COLUMN unit_name SET NOT NULL;

ALTER TABLE sale_lines DROP CONSTRAINT IF EXISTS sale_lines_sale_id_product_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS sale_lines_sale_product_unit_uidx
  ON sale_lines(tenant_id, business_id, sale_id, product_id, unit_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='sale_lines_product_unit_scope_fkey'
      AND conrelid='sale_lines'::regclass
  ) THEN
    ALTER TABLE sale_lines
      ADD CONSTRAINT sale_lines_product_unit_scope_fkey
      FOREIGN KEY (tenant_id, business_id, product_id, unit_id)
      REFERENCES product_units(tenant_id, business_id, product_id, id);
  END IF;
END
$$;

COMMIT;
