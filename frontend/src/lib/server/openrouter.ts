const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"
const EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings"

export const FREE_MODEL_PIPELINE = [
  "openrouter/free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "z-ai/glm-5.2:free",
  "minimax/minimax-m3:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "poolside/laguna-s-2.1:free",
] as const

const MODEL_ID = /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._:-]*$/i

export function getOpenRouterModelPipeline(source = process.env.OPENROUTER_MODELS) {
  const configured = (source || "")
    .split(",")
    .map((model) => model.trim())
    .filter((model) => MODEL_ID.test(model))
  return [...new Set([...configured, ...FREE_MODEL_PIPELINE])].slice(0, 16)
}

function providerPreferences() {
  return {
    allow_fallbacks: true,
    data_collection: process.env.OPENROUTER_DATA_COLLECTION === "allow" ? "allow" : "deny",
    ...(process.env.OPENROUTER_REQUIRE_ZDR === "true" ? { zdr: true } : {}),
  }
}

function headers() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured")
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002",
    "X-Title": "SmartERP Document Intelligence",
  }
}

export async function freeCompletion(input: {
  messages: unknown[]
  plugins?: unknown[]
  maxTokens?: number
  temperature?: number
  totalTimeoutMs?: number
}) {
  let lastError: Error | null = null
  const deadline = Date.now() + Math.min(Math.max(input.totalTimeoutMs ?? 50_000, 5_000), 55_000)
  for (const model of getOpenRouterModelPipeline()) {
    const remainingTime = deadline - Date.now()
    if (remainingTime < 1_000) break
    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          model,
          messages: input.messages,
          plugins: input.plugins,
          provider: providerPreferences(),
          temperature: input.temperature ?? 0,
          max_tokens: input.maxTokens ?? 4000,
        }),
        signal: AbortSignal.timeout(Math.min(12_000, remainingTime)),
      })
      if (!response.ok) {
        lastError = new Error(`${model} returned ${response.status}`)
        continue
      }
      const body = await response.json()
      const content = body?.choices?.[0]?.message?.content
      if (typeof content === "string" && content.trim()) {
        return { content: content.trim(), model: body.model || model }
      }
      lastError = new Error(`${model} returned no content`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }
  throw lastError || new Error("All free OpenRouter models failed")
}

export async function createEmbeddings(inputs: string[]): Promise<number[][] | null> {
  if (!inputs.length) return []
  const model = process.env.OPENROUTER_EMBEDDING_MODEL
  if (!model) return inputs.map(localEmbedding)
  try {
    const response = await fetch(EMBEDDINGS_URL, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        model,
        input: inputs,
        dimensions: 384,
        input_type: "search_document",
        provider: providerPreferences(),
      }),
      signal: AbortSignal.timeout(20_000),
    })
    if (!response.ok) return null
    const body = await response.json()
    const vectors = body?.data?.sort((a: any, b: any) => a.index - b.index).map((item: any) => item.embedding)
    return Array.isArray(vectors) && vectors.length === inputs.length ? vectors : null
  } catch {
    return null
  }
}

function localEmbedding(input: string) {
  const vector = new Array<number>(384).fill(0)
  const tokens = input.toLocaleLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || []
  for (const token of tokens) {
    let hash = 2166136261
    for (let index = 0; index < token.length; index++) {
      hash ^= token.charCodeAt(index)
      hash = Math.imul(hash, 16777619)
    }
    vector[Math.abs(hash) % vector.length] += 1
  }
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1
  return vector.map(value => value / norm)
}

export async function createQueryEmbedding(input: string): Promise<number[] | null> {
  const vectors = await createEmbeddings([input])
  return vectors?.[0] ?? null
}
