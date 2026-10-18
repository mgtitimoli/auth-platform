import nextPlugin from "@next/eslint-plugin-next";

import reactEslintConfig from "./react.js";

/**
 * @type {import("eslint").Linter.Config[]}
 */
const nextEslintConfig = [
  ...reactEslintConfig,

  nextPlugin.configs["core-web-vitals"]
];

export default nextEslintConfig;
