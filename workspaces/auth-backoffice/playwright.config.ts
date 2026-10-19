import {defineConfig, devices} from "@playwright/test";

const baseUrl = "http://localhost:3000";

const isCi = process.env["CI"] === "true";

const playwrightConfig = defineConfig({
  forbidOnly: isCi,
  projects: [{name: "chromium", use: {...devices["Desktop Chrome"]}}],
  reporter: isCi ? [["github"], ["html", {open: "never"}]] : "list",
  retries: isCi ? 1 : 0,
  testDir: "e2e",
  use: {
    baseURL: baseUrl,
    trace: "retain-on-failure"
  },
  webServer: {
    command: "yarn start",
    reuseExistingServer: !isCi,
    url: baseUrl
  }
});

export default playwrightConfig;
