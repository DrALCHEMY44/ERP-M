import { z } from "zod"

export const QueryRequestSchema = z.object({
  queryText: z.string().min(1, "Query text is required").max(2000, "Query text must be under 2000 characters"),
})

export function parseAiQueryRequest(value: unknown) {
  return QueryRequestSchema.parse(value)
}
