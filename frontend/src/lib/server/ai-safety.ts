import { createHash } from "crypto"

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const CAMEROON_PHONE_PATTERN = /(?:\+?237[\s().-]*)?[26]\d{2}(?:[\s().-]?\d{2}){3}\b/g
const API_CREDENTIAL_PATTERN = /\b(?:sk-or-v1-|sk-|AIza)[A-Za-z0-9_-]{16,}\b/g

export function redactForExternalModel(value: string) {
  return value
    .replace(EMAIL_PATTERN, "[REDACTED_EMAIL]")
    .replace(CAMEROON_PHONE_PATTERN, "[REDACTED_PHONE]")
    .replace(API_CREDENTIAL_PATTERN, "[REDACTED_CREDENTIAL]")
}

export function externalReference(prefix: string, scope: string, id: unknown) {
  const digest = createHash("sha256")
    .update(`${scope}:${String(id)}`)
    .digest("hex")
    .slice(0, 8)
    .toUpperCase()
  return `${prefix}-${digest}`
}

export function sanitizeConversationText(value: string, maxLength = 4_000) {
  return redactForExternalModel(value).replace(/\0/g, "").trim().slice(0, maxLength)
}
