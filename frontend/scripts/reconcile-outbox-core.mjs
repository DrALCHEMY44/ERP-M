export function isAuthorizedReconciliationRequest(request, secret) {
  if (!secret || secret.length < 32) return false
  const authorization = request.headers.get("authorization")
  return authorization === `Bearer ${secret}`
}
