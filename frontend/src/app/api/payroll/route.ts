import { NextResponse } from "next/server"
import { z } from "zod"

import { requirePermission } from "@/lib/server/authorization"
import { authorizeRequest } from "@/lib/server/auth"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"
import {
  approvePayrollRun,
  generatePayrollRun,
  getPayrollWorkspace,
  payPayrollRun,
  postPayrollRun,
  updatePayrollSettings,
  voidDraftPayrollRun,
} from "@/lib/server/payroll"

export const runtime = "nodejs"
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const adjustment = z.object({ label: z.string().min(1).max(120), amount: z.number().nonnegative().max(1_000_000_000_000) })
const settings = z.object({
  action: z.literal("updateSettings"), currency: z.string().min(3).max(8), payFrequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
  professionalExpenseRate: z.number().min(0).max(100), annualTaxAllowance: z.number().nonnegative(),
  localSurtaxRate: z.number().min(0).max(100), employeeSocialRate: z.number().min(0).max(100),
  employerSocialRate: z.number().min(0).max(100), socialMonthlyCeiling: z.number().nonnegative(),
  monthlyTaxExemptThreshold: z.number().nonnegative(),
  taxBrackets: z.array(z.object({ upTo: z.number().positive().nullable(), rate: z.number().min(0).max(100) })).min(1).max(20),
  complianceStatus: z.enum(["DRAFT", "CONFIRMED"]), complianceNote: z.string().max(2000).nullable().optional(),
})
const generate = z.object({
  action: z.literal("generate"), periodStart: date, periodEnd: date, payDate: date,
  adjustments: z.record(z.object({ earnings: z.array(adjustment).optional(), deductions: z.array(adjustment).optional() })).optional(),
})
const runAction = z.object({ action: z.enum(["approve", "post", "void"]), runId: z.string().min(1).max(200) })
const pay = z.object({ action: z.literal("pay"), runId: z.string().min(1).max(200), method: z.enum(["CASH", "BANK"]), bankAccountId: z.string().max(200).nullable().optional() })
const actionSchema = z.union([settings, generate, runAction, pay])

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "Payroll request failed"
  const status = message.startsWith("Forbidden") ? 403 : message.toLowerCase().includes("session") ? 401 : 400
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "payroll:read")
    return NextResponse.json(await getPayrollWorkspace(profile.tenantId, profile.businessId))
  } catch (error) {
    return failure(error)
  }
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requireTrustedMutationOrigin(request)
    const input = actionSchema.parse(await request.json())
    const scope = { tenantId: profile.tenantId, businessId: profile.businessId, actorId: profile.uid }
    let result
    if (input.action === "updateSettings") {
      requirePermission(profile, "payroll:write")
      if (input.complianceStatus === "CONFIRMED") requirePermission(profile, "payroll:approve")
      result = await updatePayrollSettings(scope, input)
    } else if (input.action === "generate") {
      requirePermission(profile, "payroll:write")
      result = await generatePayrollRun({ ...scope, ...input })
    } else if (input.action === "approve") {
      requirePermission(profile, "payroll:approve")
      result = await approvePayrollRun(scope, input.runId)
    } else if (input.action === "post") {
      requirePermission(profile, "payroll:approve")
      requirePermission(profile, "accounting:write")
      result = await postPayrollRun(scope, input.runId)
    } else if (input.action === "pay") {
      requirePermission(profile, "payroll:approve")
      requirePermission(profile, "accounting:write")
      result = await payPayrollRun(scope, input.runId, input.method, input.bankAccountId)
    } else {
      requirePermission(profile, "payroll:write")
      result = await voidDraftPayrollRun(scope, input.runId)
    }
    return NextResponse.json(result)
  } catch (error) {
    return failure(error)
  }
}
