import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { companyVariables, hasPermission, requirePermission, trustedActorVariables } from "../src/lib/server/authorization"
import { POST as dataPost } from "../src/app/api/data/route"

const owner = { uid: "owner", email: "owner@example.test", tenantId: "tenant-a", businessId: "business-a", role: "Business Owner", fullName: "Owner" }

test("anonymous sensitive API requests are rejected", async () => {
  const response = await dataPost(new Request("http://localhost/api/data", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ operation: "listProductsByBusiness", variables: {} }),
  }))
  assert.equal(response.status, 401)
})

test("trusted company scope overwrites forged tenant and business identifiers", () => {
  assert.deepEqual(companyVariables(owner, { tenantId: "tenant-b", businessId: "business-b", id: "record" }), {
    tenantId: "tenant-a", businessId: "business-a", id: "record",
  })
})

test("trusted actor variables remove client actor identifiers", () => {
  const result = trustedActorVariables(owner, { createdBy: "attacker", userId: "attacker", userName: "Admin", value: 1 })
  assert.equal(result.createdBy, undefined)
  assert.equal(result.userId, undefined)
  assert.equal(result.userName, undefined)
  assert.equal(result.value, 1)
})

test("Staff and Viewer cannot perform owner administration", () => {
  for (const role of ["Staff", "Viewer"]) {
    assert.equal(hasPermission({ role }, "company:manage"), false)
    assert.equal(hasPermission({ role }, "users:manage"), false)
    assert.throws(() => requirePermission({ role }, "users:manage"), /Forbidden/)
  }
})

test("sensitive Data Connect operations are server-only and audit logs are append-only", async () => {
  const [queries, mutations] = await Promise.all([
    readFile(new URL("../../backend/dataconnect/example/queries.gql", import.meta.url), "utf8"),
    readFile(new URL("../../backend/dataconnect/example/mutations.gql", import.meta.url), "utf8"),
  ])
  assert.doesNotMatch(`${queries}\n${mutations}`, /@auth\(level:\s*(PUBLIC|USER)\)/)
  assert.doesNotMatch(mutations, /mutation\s+(UpdateActivityLog|DeleteActivityLog)\b/)
  assert.match(mutations, /mutation\s+CreateActivityLog[\s\S]*@auth\(level:\s*NO_ACCESS\)/)
})

test("legacy bypass route is permanently disabled", async () => {
  const source = await readFile(new URL("../src/app/api/auth/login/route.ts", import.meta.url), "utf8")
  assert.match(source, /status:\s*410/)
  assert.doesNotMatch(source, /password123|JWT_SECRET|createUserWithEmailAndPassword/)
})
