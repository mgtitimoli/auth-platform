import path from "node:path";

import {createVanillaExtractPlugin} from "@vanilla-extract/next-plugin";
import type {NextConfig} from "next";

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: {mode: "auto"}
});

const nextConfig: NextConfig = {
  output: "standalone",
  // The monorepo root, so the standalone output includes the hoisted
  // node_modules and the workspaces this one depends on
  outputFileTracingRoot: path.join(import.meta.dirname, "../..")
};

export default withVanillaExtract(nextConfig);
