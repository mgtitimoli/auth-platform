import tsEslintConfig from "@mgtitimoli/eslint-config/typescript.js";

const eslintConfig = [
  ...tsEslintConfig,
  // auth-api-schema.ts is generated (update-auth-api-schema)
  {ignores: ["dist", "src/auth-api-schema.ts"]},
  {
    rules: {
      "@typescript-eslint/naming-convention": "off",
      complexity: "off",
      "max-statements": "off"
    }
  }
];

export default eslintConfig;
