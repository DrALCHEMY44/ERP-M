const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"
const EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings"

export const FREE_MODEL_PIPELINE = [
  "openrouter/free",
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "deepseek/deepseek-r1-0528:free",
  "qwen/qwen3-coder:free",
  "meta-llama/llama-3.3-70b-instruct:free",
] as const

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
}) {
  let lastError: Error | null = null
  for (const model of FREE_MODEL_PIPELINE) {
    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          model,
          messages: input.messages,
          plugins: input.plugins,
          temperature: input.temperature ?? 0,
          max_tokens: input.maxTokens ?? 4000,
        }),
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
      body: JSON.stringify({ model, input: inputs, dimensions: 384, input_type: "search_document" }),
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
