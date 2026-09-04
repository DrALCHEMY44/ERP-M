import { z } from "zod"

export const QueryRequestSchema = z.object({
  queryText: z.string().trim().min(1, "Query text is required").max(2000, "Query text must be under 2000 characters"),
  purpose: z.enum(["assistant", "dashboard"]).default("assistant"),
})

export function parseAiQueryRequest(value: unknown) {
  return QueryRequestSchema.parse(value)
}
