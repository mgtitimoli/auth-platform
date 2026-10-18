import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const reactBooleanPropPrefixes = [
  "allow",
  "are",
  "can",
  "close",
  "has",
  "have",
  "hide",
  "is",
  "keep",
  "no",
  "open",
  "prevent",
  "should",
  "show",
  "view",
  "with",
  "without"
];

/**
 * @type {import("eslint").Linter.Config[]}
 */
const reactEslintConfig = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],

  reactHooksPlugin.configs.flat.recommended,

  {
    rules: {
      "react/boolean-prop-naming": [
        "error",
        {rule: `^(${reactBooleanPropPrefixes.join("|")})[A-Z]([A-Za-z0-9]?)+`}
      ],
      "react/display-name": "off",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "react/jsx-max-depth": ["error", {max: 4}],
      "react/jsx-no-useless-fragment": ["error", {allowExpressions: true}],
      "react/jsx-sort-props": ["error", {ignoreCase: true}],
      "react/prop-types": "off"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];

export default reactEslintConfig;
