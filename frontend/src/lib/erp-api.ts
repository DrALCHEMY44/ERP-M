export async function erpApi<T>(path: string, options?: { method?: "GET" | "POST"; body?: unknown }): Promise<T> {
  const response = await fetch(path, {
    method: options?.method || "GET",
    credentials: "include",
    headers: options?.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options?.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`)
  return payload as T
}

export function broadcastErpChange() {
  window.localStorage.setItem("smarterp:last-change", new Date().toISOString())
  window.dispatchEvent(new Event("smarterp:data-changed"))
}
