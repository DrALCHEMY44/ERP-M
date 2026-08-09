import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto"
import { promisify } from "util"

const scrypt = promisify(scryptCallback)
const KEY_LENGTH = 64

export async function hashSecret(secret: string) {
  const salt = randomBytes(16)
  const key = await scrypt(secret, salt, KEY_LENGTH) as Buffer
  return `scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`
}

export async function verifySecret(secret: string, encoded: string) {
  const [algorithm, saltValue, keyValue] = encoded.split(":")
  if (algorithm !== "scrypt" || !saltValue || !keyValue) return false
  const expected = Buffer.from(keyValue, "base64url")
  if (expected.length !== KEY_LENGTH) return false
  const actual = await scrypt(secret, Buffer.from(saltValue, "base64url"), expected.length) as Buffer
  return timingSafeEqual(actual, expected)
}
