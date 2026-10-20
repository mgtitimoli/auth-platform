import {defineConfig, devices} from "@playwright/test";

import {environmentVariables} from "./e2e/utils/environment-variables";

const isCi = process.env["CI"] === "true";

const playwrightConfig = defineConfig({
  forbidOnly: isCi,
  projects: [{name: "chromium", use: {...devices["Desktop Chrome"]}}],
  reporter: isCi ? [["github"], ["html", {open: "never"}]] : "list",
  retries: isCi ? 1 : 0,
  testDir: "e2e",
  use: {
    baseURL: environmentVariables.AUTH_BACKOFFICE_URL,
    trace: "retain-on-failure"
  }
});

export default playwrightConfig;
