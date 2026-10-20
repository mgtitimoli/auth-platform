# Typescript Conventions

## General

1. Use kebab-case for file names (e.g., `calculation-source-type.ts`, `deal-field-set-definition.ts`)
2. Structure files in this order: imports → types → implementation → exports
3. Use a single export and export type statement per module
4. Do not use default exports, always use named exports
5. Sort entries alphabetically (object entries, type properties, import/export specifiers)
6. Use arrow functions exclusively, do not use `function` declarations
7. Do not nest if conditions, use early returns instead
8. Prefer `undefined` over `null`. Use `null` only when there is no other option
9. Do not add comments to explain what the code does, use descriptive names instead. Only add comments when they explain *why* something non-obvious is done
10. Do not nest ternary expressions (use `if/else if` instead)
11. Use conditional object spreading to build objects with optional properties instead of imperative assignment:

```ts
const result = {
  name,
  ...(value ? {value} : {}),
};
```

12. Use `export *` in barrel files (`index.ts`) instead of named re-exports
13. Use path aliases (e.g., `@/utils/number`) instead of relative paths (e.g., `../../utils/number`) for imports within the same workspace
14. Only use template literals when interpolations are in the middle of a single-line string. Use concatenation when interpolations are at the beginning or end, or when the expression spans multiple lines. Never call functions or constructors inside an interpolation: assign the result to a variable first
15. Prefer to specify the most important context at the end of error messages
16. Defer variable declarations and computations until after early returns that don't depend on them
17. Name functions with verbs that describe their action. Use `get` for value computations and `is`/`are`/`has` for boolean predicates
18. Name variables to reflect what they hold:
    - When the type is not primitive, match or use the type name (use plurals for arrays)
    - When extracting a property from an object, name as `<objectName><PropertyName>`

## Typing

1. Use `type` instead of `interface`
2. Do not mix types and values in the import/export statements, use import type and export type for types
3. Do not use return type annotations unless TS cannot infer the return type
4. Do not use enums, use the following pattern instead

**status.ts** (the module name is singular)

```ts
// these are exported so each value can be consumed
type Status = (typeof statuses)[keyof typeof statuses];

const statuses = {
  draft: "draft",
  published: "published",
  archived: "archived",
} as const;

export {statuses};
export type {Status};
```

5. When comparing against enum-like const objects, reference the object property instead of its raw value
6. Do not declare types inline (anonymous types)
7. Do not use non-null assertions (`!`), use proper narrowing instead
8. Use `unknown` instead of `void` for callback return types when the return value is irrelevant
9. Use `?:` for object properties and trailing parameters that may be absent, instead of `| undefined` (which stays for non-trailing parameters, return types and type utilities)
9. Prefix generic type parameters with `T` followed by a descriptive PascalCase name (e.g., `TItem`, `TObject`, `TKey`)

## Functional Programming

1. Do not mutate data unless there is no other option (`let` reassignment is not mutation)
2. Do not use classes
3. Use pure functions as much as possible
4. Use array functions instead of for loops when possible
5. Use reduce unless you have to declare a custom result type just for this (ask the user)

## Data-Oriented Programming

1. Name each module after its main type in singular form (e.g., `calculation.ts` for `Calculation`)
2. The module contains the main type, any supporting types needed to construct it, and functions that operate on it
3. Functions receive the main type as their first parameter
4. Supporting types that represent standalone concepts should live in their own modules
5. Import these modules using `import * as with<Type>` to namespace all functions under the type. This avoids collisions with variables commonly named after the type and provides a semantic calling convention:

```ts
import * as withCalculation from "./calculation";

import type {Calculation} from "./calculation";

const processCalculation = (calculation: Calculation) => {
  const formatted = withCalculation.format(calculation, 100);
  // ...
};
```

6. Values (nouns, e.g. constants) a module exports are qualified with the type's name (`calculationPrecision`, not `precision`), since they are used unqualified once imported. Import them by name only when no function is imported from the same module; otherwise import the module with `import * as with<Type>` and destructure them from it:

```ts
// Only values: import them by name
import {calculationPrecision} from "./calculation";

// Values and functions: namespace import, then destructure the values
import * as withCalculation from "./calculation";

const {calculationPrecision} = withCalculation;

const formatted = withCalculation.format(calculation, calculationPrecision);
```

7. When a module grows large, split it into a folder with the same name. This is transparent to consumers since imports resolve identically whether the target is a file or a folder with an `index.ts`:
  - One file per function
  - A `types.ts` file for all type definitions (only types, no values)
  - An `index.ts` that re-exports everything

```
calculation/
├── index.ts
├── types.ts
├── sort.ts
└── format.ts
```
