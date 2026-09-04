import { randomUUID } from "crypto"
import type { Pool, PoolClient } from "@neondatabase/serverless"

import { db, pooledDb, withTransientDatabaseRetry } from "./neon"

type BarcodeUnitRow = {
  id: string
  product_id: string
  unit_name: string
  abbreviation: string
  conversion_factor: number | string
  barcode: string
  unit_selling_price: number | string | null
  name: string
  category: string | null
  quantity: number | string
  base_unit: string
  cost_price: number | string | null
  selling_price: number | string
  low_stock_level: number | string | null
  status: string
}

function barcodeResult(row: BarcodeUnitRow) {
  const factor = Number(row.conversion_factor)
  const baseSellingPrice = Number(row.selling_price)
  return {
    product: {
      id: row.product_id,
      name: row.name,
      category: row.category ?? "General",
      quantity: Number(row.quantity),
      baseUnit: row.base_unit,
      costPrice: row.cost_price == null ? null : Number(row.cost_price),
      sellingPrice: baseSellingPrice,
      lowStockLevel: row.low_stock_level == null ? null : Number(row.low_stock_level),
      status: row.status,
    },
    unit: {
      id: row.id,
      productId: row.product_id,
      unitName: row.unit_name,
      abbreviation: row.abbreviation,
      conversionFactor: factor,
      barcode: row.barcode,
      sellingPrice: row.unit_selling_price == null ? baseSellingPrice * factor : Number(row.unit_selling_price),
    },
  }
}

export async function findProductByBarcode(tenantId: string, businessId: string, barcode: string) {
  return withTransientDatabaseRetry(async () => {
    const rows = await db().query(
      `SELECT pu.id,pu.product_id,pu.unit_name,pu.abbreviation,pu.conversion_factor,
        pu.barcode,pu.selling_price AS unit_selling_price,p.name,p.category,p.quantity,
        p.base_unit,p.cost_price,p.selling_price,p.low_stock_level,p.status
      FROM product_units pu
      JOIN products p ON p.tenant_id=pu.tenant_id AND p.business_id=pu.business_id AND p.id=pu.product_id
      WHERE pu.tenant_id=$1 AND pu.business_id=$2 AND pu.barcode=$3
      LIMIT 1`,
      [tenantId, businessId, barcode],
    ) as unknown as BarcodeUnitRow[]
    return rows[0] ? barcodeResult(rows[0]) : null
  })
}

export type ReceiveBarcodeStockInput = {
  tenantId: string
  businessId: string
  actorId: string
  barcode: string
  packageQuantity: number
}

export async function receiveBarcodeStock(input: ReceiveBarcodeStockInput) {
  return receiveBarcodeStockWithPool(input, pooledDb())
}

export async function receiveBarcodeStockWithPool(
  input: ReceiveBarcodeStockInput,
  pool: Pick<Pool, "connect">,
) {
  if (!Number.isInteger(input.packageQuantity) || input.packageQuantity <= 0 || input.packageQuantity > 100_000) {
    throw new Error("Received quantity must be a positive whole number")
  }
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const lookup = await lockedBarcodeLookup(client, input)
    if (!lookup) throw new Error("This barcode is not registered for this business")
    if (lookup.status !== "active") throw new Error("This product is inactive")

    const factor = Number(lookup.conversion_factor)
    const baseQuantityAdded = input.packageQuantity * factor
    const resultingQuantity = Number(lookup.quantity) + baseQuantityAdded
    if (!Number.isSafeInteger(baseQuantityAdded) || resultingQuantity > 2_147_483_647) {
      throw new Error("Received quantity is too large")
    }

    await client.query(
      "UPDATE products SET quantity=$1,version=version+1,updated_at=NOW() WHERE tenant_id=$2 AND business_id=$3 AND id=$4",
      [resultingQuantity, input.tenantId, input.businessId, lookup.product_id],
    )
    const movementId = randomUUID()
    await client.query(
      "INSERT INTO inventory_movements(id,tenant_id,business_id,product_id,movement_type,quantity_delta,resulting_quantity,reason,recorded_by) VALUES($1,$2,$3,$4,'RECEIPT',$5,$6,$7,$8)",
      [movementId, input.tenantId, input.businessId, lookup.product_id, baseQuantityAdded, resultingQuantity, `Barcode receipt: ${input.packageQuantity} ${lookup.unit_name} × ${factor} ${lookup.base_unit}`, input.actorId],
    )
    await client.query(
      "INSERT INTO activity_logs(id,tenant_id,business_id,user_id,user_name,action_type,module,description,record_id,timestamp) VALUES($1,$2,$3,$4,$4,'RECEIVE_STOCK','Inventory',$5,$6,NOW())",
      [randomUUID(), input.tenantId, input.businessId, input.actorId, `Received ${input.packageQuantity} ${lookup.unit_name} of ${lookup.name} by barcode`, lookup.product_id],
    )
    await client.query(
      "INSERT INTO integration_outbox(id,event_type,aggregate_id,tenant_id,business_id,payload) VALUES($1,'INVENTORY_RECEIVED',$2,$3,$4,$5::jsonb)",
      [randomUUID(), lookup.product_id, input.tenantId, input.businessId, JSON.stringify({ productId: lookup.product_id, movementId, baseQuantityAdded, resultingQuantity })],
    )
    await client.query("COMMIT")
    return {
      ...barcodeResult({ ...lookup, quantity: resultingQuantity }),
      packageQuantity: input.packageQuantity,
      baseQuantityAdded,
      resultingQuantity,
    }
  } catch (error) {
    try { await client.query("ROLLBACK") } catch {}
    throw error
  } finally {
    client.release()
  }
}

async function lockedBarcodeLookup(client: PoolClient, input: ReceiveBarcodeStockInput) {
  const result = await client.query<BarcodeUnitRow>(
    `SELECT pu.id,pu.product_id,pu.unit_name,pu.abbreviation,pu.conversion_factor,
      pu.barcode,pu.selling_price AS unit_selling_price,p.name,p.category,p.quantity,
      p.base_unit,p.cost_price,p.selling_price,p.low_stock_level,p.status
    FROM product_units pu
    JOIN products p ON p.tenant_id=pu.tenant_id AND p.business_id=pu.business_id AND p.id=pu.product_id
    WHERE pu.tenant_id=$1 AND pu.business_id=$2 AND pu.barcode=$3
    LIMIT 1 FOR UPDATE OF p`,
    [input.tenantId, input.businessId, input.barcode],
  )
  return result.rows[0]
}
