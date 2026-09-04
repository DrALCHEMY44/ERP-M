export function requireTrustedMutationOrigin(request: Request) {
  if (request.headers.get("authorization")?.startsWith("Bearer ")) return
  const supplied = request.headers.get("origin")
    || (() => {
      const referer = request.headers.get("referer")
      if (!referer) return null
      try { return new URL(referer).origin } catch { return null }
    })()
  if (!supplied) throw new Error("Forbidden: missing request origin")
  const configured = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  const requestOrigin = new URL(request.url).origin
  const developmentOrigins = process.env.NODE_ENV === "production" ? [] : [requestOrigin]
  if (![...configured, ...developmentOrigins].includes(supplied)) {
    throw new Error("Forbidden: untrusted request origin")
  }
}
