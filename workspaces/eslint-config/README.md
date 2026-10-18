# @mgtitimoli/eslint-config

ESLint (flat config) and Prettier configuration shared by the workspaces of this
repository.

## Configs

- [`base.js`](./base.js): general rules plus the
  [import](https://www.npmjs.com/package/eslint-plugin-import),
  [perfectionist](https://www.npmjs.com/package/eslint-plugin-perfectionist),
  [prefer-arrow-functions](https://www.npmjs.com/package/eslint-plugin-prefer-arrow-functions),
  [prettier](https://www.npmjs.com/package/eslint-plugin-prettier),
  [stylistic](https://www.npmjs.com/package/@stylistic/eslint-plugin) and
  [unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports)
  plugins.
- [`typescript.js`](./typescript.js): `base.js` plus
  [typescript-eslint](https://www.npmjs.com/package/typescript-eslint) with
  type-aware rules.
- [`react.js`](./react.js): [React](https://www.npmjs.com/package/eslint-plugin-react)
  and [React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) rules.
- [`next.js`](./next.js): `react.js` plus the
  [Next.js](https://www.npmjs.com/package/@next/eslint-plugin-next) Core Web
  Vitals rules.
- [`prettier.config.js`](./prettier.config.js): the Prettier options, applied
  through ESLint.

## Usage

Create an `eslint.config.js` in the workspace and export the config it needs:

```js
// JavaScript only
export {default} from "@mgtitimoli/eslint-config/base.js";
```

```js
// TypeScript
export {default} from "@mgtitimoli/eslint-config/typescript.js";
```

```js
// TypeScript + Next.js
import nextEslintConfig from "@mgtitimoli/eslint-config/next.js";
import typescriptEslintConfig from "@mgtitimoli/eslint-config/typescript.js";

const eslintConfig = [...typescriptEslintConfig, ...nextEslintConfig];

export default eslintConfig;
```

The configs require ESLint 9: ESLint 10 is not supported yet by
`eslint-plugin-import` and `eslint-plugin-react`.

## Scripts

| Script | Description |
|---|---|
| `lint` | Lints the workspace's own configuration files |
