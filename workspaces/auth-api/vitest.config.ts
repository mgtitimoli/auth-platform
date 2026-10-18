import {readFileSync} from "node:fs";
import {parseEnv} from "node:util";

import {defineConfig} from "vitest/config";

const testEnv = parseEnv(readFileSync(".env.test", "utf8"));

// Every test file uses the same test database, so they run one at a time
const vitestConfig = defineConfig({
  resolve: {tsconfigPaths: true},
  test: {
    env: testEnv,
    fileParallelism: false,
    globalSetup: ["vitest.global-setup.ts"],
    include: ["src/**/*.test.ts"],
    setupFiles: ["vitest.setup.ts"]
  }
});

export default vitestConfig;
