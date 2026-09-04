import { db } from "./neon"
import { sanitizeConversationText } from "./ai-safety"

export type AiQueryPurpose = "assistant" | "dashboard"
export type AiConversationMessage = { role: "user" | "assistant"; content: string }

export async function loadRecentAiConversation(input: {
  tenantId: string
  businessId: string
  userId: string
  limit?: number
}): Promise<AiConversationMessage[]> {
  const limit = Math.min(Math.max(input.limit ?? 4, 1), 6)
  const rows = await db()`SELECT query_text,response FROM ai_queries
    WHERE tenant_id=${input.tenantId} AND business_id=${input.businessId}
      AND user_id=${input.userId} AND purpose='assistant' AND response IS NOT NULL
    ORDER BY timestamp DESC LIMIT ${limit}`

  return rows.reverse().flatMap((row) => {
    const query = sanitizeConversationText(String(row.query_text || ""), 2_000)
    const response = sanitizeConversationText(String(row.response || ""), 4_000)
    return [
      ...(query ? [{ role: "user" as const, content: query }] : []),
      ...(response ? [{ role: "assistant" as const, content: response }] : []),
    ]
  })
}

export async function findCachedDashboardInsight(input: {
  tenantId: string
  businessId: string
  userId: string
  cacheMinutes?: number
}) {
  const cacheMinutes = Math.min(Math.max(input.cacheMinutes ?? 15, 1), 1_440)
  const rows = await db()`SELECT response FROM ai_queries
    WHERE tenant_id=${input.tenantId} AND business_id=${input.businessId}
      AND user_id=${input.userId} AND purpose='dashboard' AND response IS NOT NULL
      AND timestamp >= NOW() - (${cacheMinutes} * INTERVAL '1 minute')
    ORDER BY timestamp DESC LIMIT 1`
  return rows[0]?.response ? String(rows[0].response) : null
}

export async function purgeExpiredAiData(retentionDays: number) {
  const days = Math.min(Math.max(Math.trunc(retentionDays), 1), 3_650)
  const sql = db()
  const queries = await sql`DELETE FROM ai_queries
    WHERE timestamp < NOW() - (${days} * INTERVAL '1 day') RETURNING id`
  const activity = await sql`DELETE FROM activity_logs
    WHERE action_type='AI_QUERY' AND timestamp < NOW() - (${days} * INTERVAL '1 day') RETURNING id`
  const limits = await sql`DELETE FROM request_rate_limits
    WHERE bucket LIKE 'ai:%' AND window_started_at < NOW() - INTERVAL '1 day' RETURNING bucket`
  return {
    deletedQueries: queries.length,
    deletedActivityLogs: activity.length,
    deletedRateLimitWindows: limits.length,
  }
}
