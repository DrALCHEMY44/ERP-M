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
  if (encoded.startsWith("scrypt$")) {
    const [algorithm, nValue, rValue, pValue, saltValue, keyValue] = encoded.split("$")
    if (algorithm !== "scrypt" || !saltValue || !keyValue) return false
    const expected = Buffer.from(keyValue, "base64url")
    const N = Number(nValue)
    const r = Number(rValue)
    const p = Number(pValue)
    if (expected.length !== KEY_LENGTH || !Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false
    const actual = await new Promise<Buffer>((resolve, reject) => {
      scryptCallback(secret, Buffer.from(saltValue, "base64url"), expected.length, { N, r, p, maxmem: 128 * 1024 * 1024 }, (error, key) => {
        if (error) reject(error)
        else resolve(key)
      })
    })
    return timingSafeEqual(actual, expected)
  }
  const [algorithm, saltValue, keyValue] = encoded.split(":")
  if (algorithm !== "scrypt" || !saltValue || !keyValue) return false
  const expected = Buffer.from(keyValue, "base64url")
  if (expected.length !== KEY_LENGTH) return false
  const actual = await scrypt(secret, Buffer.from(saltValue, "base64url"), expected.length) as Buffer
  return timingSafeEqual(actual, expected)
}
