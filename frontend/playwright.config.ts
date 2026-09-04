import { defineConfig, devices } from "@playwright/test"

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim()
const localBaseUrl = "http://127.0.0.1:9010"

if (externalBaseUrl) {
  const url = new URL(externalBaseUrl)
  if (url.protocol !== "https:" && !["127.0.0.1", "localhost"].includes(url.hostname)) {
    throw new Error("PLAYWRIGHT_BASE_URL must use HTTPS outside local development")
  }
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: externalBaseUrl || localBaseUrl,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "off",
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "npm run dev:e2e",
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "true"
          ? { channel: "chrome" as const }
          : {}),
      },
    },
  ],
})
