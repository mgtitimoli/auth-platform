import nextEslintConfig from "@mgtitimoli/eslint-config/next.js";
import typescriptEslintConfig from "@mgtitimoli/eslint-config/typescript.js";

const eslintConfig = [
  ...typescriptEslintConfig,
  ...nextEslintConfig,
  {ignores: [".next", "next-env.d.ts", "playwright-report", "test-results"]},
  {
    rules: {
      "@typescript-eslint/naming-convention": "off",
      complexity: "off",
      "max-statements": "off"
    }
  }
];

export default eslintConfig;
