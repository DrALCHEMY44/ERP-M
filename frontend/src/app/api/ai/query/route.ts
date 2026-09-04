/** Secure, tenant-scoped SmartERP AI query endpoint. */

import { NextRequest, NextResponse } from "next/server"

import { fetchTenantContext } from "@/ai/ai-context"
import { buildSystemMessage } from "@/ai/system-prompt"
import { adminDatabase, authorizeRequest } from "@/lib/server/auth"
import { hasPermission } from "@/lib/server/authorization"
import {
  findCachedDashboardInsight,
  loadRecentAiConversation,
} from "@/lib/server/ai-governance"
import { buildDeterministicDashboardInsight } from "@/lib/server/ai-insights"
import { QueryRequestSchema } from "@/lib/server/ai-request"
import {
  externalReference,
  sanitizeConversationText,
} from "@/lib/server/ai-safety"
import { searchDocuments } from "@/lib/server/document-intelligence"
import { freeCompletion } from "@/lib/server/openrouter"
import { consumeRateLimit } from "@/lib/server/rate-limit"
import { requireFeatureEntitlement } from "@/lib/server/saas-entitlements"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const responseHeaders = { "Cache-Control": "no-store" }

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400, headers: responseHeaders },
    )
  }

  const validation = QueryRequestSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        details: validation.error.flatten().fieldErrors,
      },
      { status: 400, headers: responseHeaders },
    )
  }

  let authorized
  try {
    authorized = await authorizeRequest(request)
  } catch (error) {
    console.warn(
      "[AI Query] Authentication rejected:",
      error instanceof Error ? error.message : error,
    )
    return NextResponse.json(
      { error: "Your session is missing or expired. Please sign in again." },
      { status: 401, headers: responseHeaders },
    )
  }

  if (!hasPermission(authorized, "ai:use")) {
    return NextResponse.json(
      { error: "AI access is not available for your role." },
      { status: 403, headers: responseHeaders },
    )
  }

  try {
    await requireFeatureEntitlement(authorized, "ai")
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message.replace(/^Forbidden:\s*/, "") : "AI plan limit reached." },
      { status: 403, headers: responseHeaders },
    )
  }

  const { queryText, purpose } = validation.data
  const { tenantId, businessId, uid: userId, role } = authorized

  if (purpose === "dashboard") {
    try {
      const cached = await findCachedDashboardInsight({
        tenantId,
        businessId,
        userId,
        cacheMinutes: Number(process.env.AI_INSIGHT_CACHE_MINUTES || 15),
      })
      if (cached) {
        return NextResponse.json(
          {
            response: cached,
            metadata: {
              model: "cached-insight",
              role,
              purpose,
              cached: true,
              processingTimeMs: Date.now() - startedAt,
              contextModules: [],
            },
          },
          { headers: responseHeaders },
        )
      }
    } catch (error) {
      console.warn("[AI Query] Dashboard cache unavailable", error)
    }
  }

  if (
    !(await consumeRateLimit({
      request,
      bucket: `ai:${authorized.uid}`,
      limit: purpose === "dashboard" ? 6 : 20,
      windowSeconds: 60,
    }))
  ) {
    return NextResponse.json(
      { error: "AI request limit reached. Try again shortly." },
      { status: 429, headers: responseHeaders },
    )
  }

  let tenantContext
  try {
    tenantContext = await fetchTenantContext(tenantId, businessId, role, userId)

    if (hasPermission(authorized, "documents:read")) {
      try {
        const evidence = await searchDocuments({
          tenantId,
          businessId,
          query: queryText,
          limit: 6,
        })
        tenantContext.documentEvidence = evidence.map((item: any) => ({
          citation: `[DOC:${externalReference("REF", businessId, item.document_id)}#${Number(item.chunk_index)}]`,
          title: sanitizeConversationText(String(item.title || "Document"), 240),
          classification: sanitizeConversationText(
            String(item.classification || "Document"),
            120,
          ),
          content: sanitizeConversationText(String(item.content || ""), 1_500),
          relevance: Number(item.score || 0),
        }))
      } catch (error) {
        tenantContext.meta.unavailableModules.push("documentEvidence")
        console.warn("[AI Query] Document evidence unavailable", error)
      }
    }
  } catch (error) {
    console.error("[AI Query] Failed to build tenant context", error)
    return NextResponse.json(
      { error: "Failed to retrieve business data. Please try again later." },
      { status: 500, headers: responseHeaders },
    )
  }

  const systemMessage = `${buildSystemMessage(tenantContext)}

DOCUMENT CITATION RULES:
Use retrieved document evidence only when relevant. Cite every document-based factual claim using its exact [DOC:REF#chunk] label. Never invent a citation. If no evidence supports the answer, state that clearly.`

  let history: Array<{ role: "user" | "assistant"; content: string }> = []
  if (purpose === "assistant") {
    try {
      history = await loadRecentAiConversation({
        tenantId,
        businessId,
        userId,
        limit: 4,
      })
    } catch (error) {
      console.warn("[AI Query] Conversation history unavailable", error)
    }
  }

  let responseText = ""
  let model = ""
  try {
    const completion = await freeCompletion({
      messages: [
        { role: "system", content: systemMessage },
        ...history,
        {
          role: "user",
          content: sanitizeConversationText(queryText, 2_000),
        },
      ],
      temperature: 0.2,
      maxTokens: 1_500,
      totalTimeoutMs: 40_000,
    })
    responseText = completion.content
    model = completion.model
  } catch (error) {
    console.error("[AI Query] OpenRouter fallback pipeline exhausted", error)
    if (purpose !== "dashboard") {
      return NextResponse.json(
        {
          error:
            "AI completion service is currently unavailable. Please try again in a few minutes.",
        },
        { status: 502, headers: responseHeaders },
      )
    }
    responseText = buildDeterministicDashboardInsight(tenantContext)
    model = "local-deterministic"
  }

  try {
    await adminDatabase().executeMutation<
      { aiQuery_insert: { id: string } },
      Record<string, unknown>
    >("CreateAiQuery", {
      tenantId,
      businessId,
      userId,
      purpose,
      queryText: sanitizeConversationText(queryText, 2_000),
      response: sanitizeConversationText(responseText, 6_000),
    })
  } catch (error) {
    console.error("[AI Query] Failed to persist governed query history", error)
  }

  return NextResponse.json(
    {
      response: responseText,
      metadata: {
        model,
        role,
        purpose,
        cached: false,
        processingTimeMs: Date.now() - startedAt,
        contextModules: Object.keys(tenantContext).filter(
          (key) => key !== "meta",
        ),
      },
    },
    { headers: responseHeaders },
  )
}
