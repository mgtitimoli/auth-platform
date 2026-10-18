import {defineConfig} from "vitest/config";

const vitestConfig = defineConfig({
  resolve: {tsconfigPaths: true},
  test: {
    env: {TZ: "UTC"}
  }
});

export default vitestConfig;
