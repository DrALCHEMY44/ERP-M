import assert from "node:assert/strict"
import test from "node:test"

import { verifyRequestIdentity } from "../src/lib/server/auth"

test("Flutter bearer sessions are verified through Neon Auth", async () => {
  const identity = await verifyRequestIdentity(
    new Request("http://localhost:9002/api/bootstrap", {
      method: "POST",
      headers: {
        authorization: "Bearer mobile-owner-session",
        origin: "http://localhost:43127",
      },
    }),
    async (token) => {
      assert.equal(token, "mobile-owner-session")
      return {
        uid: "auth-user-1",
        email: "owner@example.test",
        emailVerified: true,
        provider: "neon",
      }
    },
  )
  assert.deepEqual(identity, {
    uid: "auth-user-1",
    email: "owner@example.test",
    emailVerified: true,
    provider: "neon",
  })
})

test("invalid Flutter bearer sessions are rejected", async () => {
  await assert.rejects(
    verifyRequestIdentity(
      new Request("http://localhost:9002/api/bootstrap", {
        headers: { authorization: "Bearer expired-session" },
      }),
      async () => null,
    ),
    /Missing Neon authentication session/,
  )
})
