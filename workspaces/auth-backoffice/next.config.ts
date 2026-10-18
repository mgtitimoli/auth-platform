import path from "node:path";

import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The monorepo root, so the standalone output includes the hoisted
  // node_modules and the workspaces this one depends on
  outputFileTracingRoot: path.join(import.meta.dirname, "../..")
};

export default nextConfig;
