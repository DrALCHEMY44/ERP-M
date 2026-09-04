import { NextResponse } from "next/server"
import { z } from "zod"
import { requirePermission } from "@/lib/server/authorization"
import { adminDatabase, authorizeRequest } from "@/lib/server/auth"
import { db } from "@/lib/server/neon"
import { recordSale } from "@/lib/server/sales"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"

export const runtime = "nodejs"
const schema = z.object({
  idempotencyKey: z.string().min(16).max(200),
  customerId: z.string().min(1).max(200).optional(),
  paymentMethod: z.enum(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CREDIT"]),
  items: z.array(z.object({
    productId: z.string().min(1).max(200),
    unitId: z.string().min(1).max(200).optional(),
    quantity: z.number().int().positive().max(100000),
  })).min(1).max(100),
})

const paymentMethods = {
  CASH: "Cash",
  MOBILE_MONEY: "Mobile Money",
  BANK_TRANSFER: "Bank Transfer",
  CREDIT: "Credit",
  UNKNOWN: "Unknown",
} as const

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "sales:read")
    const sql = db()
    const rows = await sql`SELECT s.id,s.tenant_id,s.business_id,s.customer_id,s.payment_method,
      s.total_amount,s.recorded_by,s.created_at,sl.product_id,sl.quantity,sl.unit_price,
      sl.unit_id,sl.unit_name,sl.conversion_factor,p.name AS product_name
      FROM sales s
      LEFT JOIN sale_lines sl ON sl.sale_id=s.id AND sl.tenant_id=s.tenant_id AND sl.business_id=s.business_id
      LEFT JOIN products p ON p.id=sl.product_id AND p.tenant_id=sl.tenant_id AND p.business_id=sl.business_id
      WHERE s.tenant_id=${profile.tenantId} AND s.business_id=${profile.businessId}
      ORDER BY s.created_at DESC`
    const grouped = new Map<string, Record<string, unknown> & { productsSold: Array<Record<string, unknown>> }>()
    for (const row of rows) {
      const id = String(row.id)
      let sale = grouped.get(id)
      if (!sale) {
        sale = {
          id,
          tenantId: row.tenant_id,
          businessId: row.business_id,
          customerId: row.customer_id,
          paymentMethod: paymentMethods[row.payment_method as keyof typeof paymentMethods] || "Cash",
          totalAmount: Number(row.total_amount),
          recordedBy: row.recorded_by,
          saleDate: row.created_at,
          createdAt: row.created_at,
          productsSold: [],
        }
        grouped.set(id, sale)
      }
      if (row.product_id) {
        sale.productsSold.push({
          productId: row.product_id,
          productName: row.product_name,
          quantity: Number(row.quantity),
          priceAtSale: Number(row.unit_price),
          unitId: row.unit_id,
          unitName: row.unit_name,
          conversionFactor: Number(row.conversion_factor),
        })
      }
    }
    return NextResponse.json({ sales: [...grouped.values()] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load sales"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requireTrustedMutationOrigin(request)
    requirePermission(profile, "sales:write")
    const input = schema.parse(await request.json())
    if (input.customerId) {
      const customer = await adminDatabase().executeQuery<
        { customer: { id: string } | null },
        { id: string; tenantId: string; businessId: string }
      >("getCustomerForCompany", {
        id: input.customerId,
        tenantId: profile.tenantId,
        businessId: profile.businessId,
      })
      if (!customer.data.customer) {
        return NextResponse.json({ error: "Customer was not found in this company" }, { status: 400 })
      }
    }
    const result = await recordSale({ ...input, tenantId: profile.tenantId, businessId: profile.businessId, actorId: profile.uid })
    return NextResponse.json(result, { status: result.duplicate ? 200 : 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sale failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : message.includes("Insufficient") ? 409 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
