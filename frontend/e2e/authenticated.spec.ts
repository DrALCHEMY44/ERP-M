import { expect, test } from "@playwright/test"

const email = process.env.SMOKE_OWNER_EMAIL?.trim()
const password = process.env.SMOKE_OWNER_PASSWORD

test.describe("authenticated production smoke", () => {
  test.describe.configure({ mode: "serial", retries: 0 })
  test.skip(!email || !password, "Dedicated smoke owner credentials are required")

  test("owner can authenticate and read every core workspace", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Work Email").fill(email!)
    await page.getByLabel("Password", { exact: true }).fill(password!)
    await page.getByRole("button", { name: "Continue" }).click()
    await page.waitForURL(/\/dashboard(?:\?|$)/, { timeout: 30_000 })

    const profileResponse = await page.request.get("/api/profile")
    expect(profileResponse.status()).toBe(200)
    const profile = await profileResponse.json()
    expect(profile.user?.tenantId).toBeTruthy()
    expect(profile.user?.businessId).toBeTruthy()
    expect(profile.user?.role).toBe("Business Owner")

    for (const endpoint of ["/api/reports/summary", "/api/hr", "/api/payroll", "/api/accounting"]) {
      const response = await page.request.get(endpoint)
      expect(response.status(), `${endpoint} should be readable by the smoke owner`).toBe(200)
    }

    const operations = [
      "listProductsByBusiness",
      "listTransactionsByBusiness",
      "listCustomersByBusiness",
      "listSuppliersByBusiness",
      "listEmployeesByBusiness",
      "listTasksByBusiness",
      "listDocumentsByBusiness",
    ]
    const operationStatuses = await page.evaluate(async (names) => Promise.all(names.map(async (operation) => {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, variables: {} }),
      })
      return { operation, status: response.status }
    })), operations)

    for (const result of operationStatuses) {
      expect(result.status, `${result.operation} should be tenant-scoped and readable`).toBe(200)
    }

    if (process.env.SMOKE_TEST_AI === "true") {
      const response = await page.evaluate(() => fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryText: "Give one concise operational observation.", purpose: "assistant" }),
      }).then((value) => value.status))
      expect(response).toBe(200)
    }
  })
})
