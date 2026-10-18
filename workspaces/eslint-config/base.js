import js from "@eslint/js";
import stylisticPlugin from "@stylistic/eslint-plugin";
// eslint-disable-next-line import/no-unresolved
import {defaultImport} from "default-import";
import importPlugin from "eslint-plugin-import";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";

import prettierConfig from "./prettier.config.js";

const preferArrowFunctionsPlugin = defaultImport(preferArrowFunctions);

const baseStylisticPaddingLineGroups = [
  {blankLine: "always", next: "*", prev: "block-like"},
  {blankLine: "always", next: "*", prev: "const"},
  {blankLine: "never", next: "*", prev: "export"},
  {blankLine: "always", next: "*", prev: ["case", "default"]}
];

/**
 * @type {import("eslint").Linter.Config[]}
 */
const baseEslintConfig = [
  js.configs.recommended,

  importPlugin.flatConfigs.errors,

  prettierPluginRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    plugins: {
      perfectionist: perfectionistPlugin,
      "prefer-arrow-functions": preferArrowFunctionsPlugin,
      stylistic: stylisticPlugin,
      "unused-imports": unusedImportsPlugin
    },
    rules: {
      complexity: ["error", {max: 5}],
      curly: "error",
      eqeqeq: "error",
      "import/exports-last": "error",
      "import/first": "error",
      "import/group-exports": "error",
      "import/newline-after-import": "error",
      "import/no-anonymous-default-export": "error",
      "import/no-cycle": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": "error",
      "import/no-useless-path-segments": ["error", {noUselessIndex: true}],
      "import/order": [
        "error",
        {
          alphabetize: {order: "asc", orderImportKind: "desc"},
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          named: true,
          "newlines-between": "always",
          pathGroups: [
            // This is needed in case we overload styled-components theme in TS
            {group: "external", pattern: "styled-components"},
            {group: "internal", pattern: "@/**"}
          ]
        }
      ],
      "max-depth": ["error", {max: 2}],
      "max-lines": [
        "error",
        {max: 800, skipBlankLines: true, skipComments: true}
      ],
      "max-statements": "error",
      "no-fallthrough": ["error", {allowEmptyCase: true}],
      "no-implicit-coercion": ["error", {disallowTemplateShorthand: true}],
      "no-nested-ternary": "error",
      "no-unused-vars": ["error", {ignoreRestSiblings: true}],
      "object-shorthand": ["error", "properties"],
      "perfectionist/sort-exports": "error",
      "perfectionist/sort-objects": "error",
      "perfectionist/sort-switch-case": "error",
      "prefer-arrow-functions/prefer-arrow-functions": [
        "error",
        {
          returnStyle: "implicit",
          singleReturnOnly: false
        }
      ],
      "prettier/prettier": ["error", prettierConfig],
      "require-await": "error",
      "stylistic/padding-line-between-statements": [
        "error",
        ...baseStylisticPaddingLineGroups
      ],
      "unused-imports/no-unused-imports": "error"
    }
  }
];

export {baseEslintConfig as default, baseStylisticPaddingLineGroups};
