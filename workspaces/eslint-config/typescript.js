import importPlugin from "eslint-plugin-import";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";

import baseEslintConfig, {baseStylisticPaddingLineGroups} from "./base.js";

const typescriptEslintConfig = tseslint.config(baseEslintConfig, {
  extends: [
    importPlugin.flatConfigs.typescript,
    tseslint.configs.recommendedTypeChecked
  ],
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parserOptions: {
      projectService: true
    }
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": ["error", {"ts-expect-error": false}],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-exports": "error",
    // TODO: Check why this doesn't work and remove the one from import plugin once solved
    // "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {format: ["camelCase"], selector: "default"},
      {
        format: ["camelCase", "PascalCase"],
        selector: "import"
      },
      {
        format: ["camelCase", "PascalCase"],
        selector: ["objectLiteralMethod"]
      },
      {
        format: ["camelCase", "PascalCase"],
        leadingUnderscore: "allow",
        selector: "parameter"
      },
      {format: ["PascalCase"], selector: "typeLike"},
      {format: ["PascalCase"], prefix: ["T"], selector: "typeParameter"},
      {
        format: ["camelCase", "PascalCase"],
        selector: "variable",
        types: ["function"]
      }
    ],
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-type-assertion": "warn",
    "@typescript-eslint/prefer-find": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/switch-exhaustiveness-check": [
      "error",
      {requireDefaultForNonUnion: true}
    ],
    // TODO: Remove this one once we have solved the one from @typescript-eslint that doesn't work
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "perfectionist/sort-intersection-types": [
      "error",
      {groups: ["named", "unknown"]}
    ],
    "perfectionist/sort-object-types": "error",
    "perfectionist/sort-union-types": "error",
    "stylistic/padding-line-between-statements": [
      "error",
      ...baseStylisticPaddingLineGroups,
      {blankLine: "always", next: "*", prev: "type"}
    ]
  },
  settings: {
    "import/resolver": {
      typescript: true
    }
  }
});

export default typescriptEslintConfig;
