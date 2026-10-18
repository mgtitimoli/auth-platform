import tsEslintConfig from "@mgtitimoli/eslint-config/typescript.js";

const eslintConfig = [
  ...tsEslintConfig,
  {ignores: ["dist"]},
  {
    rules: {
      "@typescript-eslint/naming-convention": "off",
      complexity: "off",
      "max-statements": "off"
    }
  }
];

export default eslintConfig;
