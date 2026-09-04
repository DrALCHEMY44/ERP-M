import { expect, test } from "@playwright/test"

test("public navigation exposes registration and login without leaking authority", async ({ page }) => {
  const response = await page.goto("/")
  expect(response?.status()).toBe(200)
  await expect(page.getByRole("heading", { name: /run your entire business/i })).toBeVisible()
  await expect(page.getByRole("link", { name: /sign in/i }).first()).toHaveAttribute("href", "/login")
  await expect(page.getByRole("link", { name: /create your workspace|get started/i }).first()).toHaveAttribute("href", "/register")

  await page.goto("/login")
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible()
  await expect(page.getByLabel("Work Email")).toHaveAttribute("type", "email")
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "password")
  await page.getByRole("button", { name: "Show password" }).click()
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text")
})

test("security headers are present on public pages", async ({ request }) => {
  const response = await request.get("/")
  expect(response.status()).toBe(200)
  expect(response.headers()["x-content-type-options"]).toBe("nosniff")
  expect(response.headers()["x-frame-options"]).toBe("DENY")
  expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'")
  expect(response.headers()["referrer-policy"]).toBeTruthy()
})

test("protected API modules reject unauthenticated callers", async ({ request }) => {
  const checks: Array<Promise<{ name: string; status: number }>> = [
    request.get("/api/profile").then((response) => ({ name: "profile", status: response.status() })),
    request.get("/api/sales").then((response) => ({ name: "sales", status: response.status() })),
    request.get("/api/hr").then((response) => ({ name: "hr", status: response.status() })),
    request.get("/api/payroll").then((response) => ({ name: "payroll", status: response.status() })),
    request.get("/api/accounting").then((response) => ({ name: "accounting", status: response.status() })),
    request.get("/api/reports/summary").then((response) => ({ name: "reports", status: response.status() })),
    request.post("/api/data", { data: { operation: "listProductsByBusiness", variables: {} } })
      .then((response) => ({ name: "data", status: response.status() })),
    request.post("/api/ai/query", { data: { queryText: "Summarize sales", purpose: "assistant" } })
      .then((response) => ({ name: "ai", status: response.status() })),
  ]

  for (const result of await Promise.all(checks)) {
    expect(result.status, `${result.name} must require authentication`).toBe(401)
  }
})

test("readiness endpoint exposes booleans, not configuration values", async ({ request }) => {
  const response = await request.get("/api/health")
  expect([200, 503]).toContain(response.status())
  const body = await response.json()
  expect(["ready", "not_ready"]).toContain(body.status)
  expect(Object.keys(body.checks).sort()).toEqual(["configuration", "neon", "neonAuth", "objectStorage"].sort())
  for (const value of Object.values(body.checks)) expect(typeof value).toBe("boolean")
  expect(JSON.stringify(body)).not.toMatch(/postgres(?:ql)?:\/\/|OPENROUTER|AWS_SECRET|COOKIE_SECRET/i)
})
