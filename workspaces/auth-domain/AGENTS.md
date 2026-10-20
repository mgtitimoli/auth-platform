# Auth Domain Workspace

Domain schemas, types, utilities and errors shared by `auth-api` and the
backoffice.

## Platform

The code runs in Node.js and in the browser: never use Node.js-only APIs
(`node:*` modules, `Buffer`, `process`). The tsconfig has no Node.js types, so
type checking catches them.

## Layout

- `domain-schema.ts` holds **all** zod schemas and their inferred types, and
  nothing else. Schemas exposed by the API have `.meta({ref})`, so they appear
  in the OpenAPI document.
- Each enum has its own module (`user-status.ts`): the const object
  (`userStatuses`), `allUserStatuses`, the schema and the type.
- Utilities for a type live in a module named after it (`session.ts`,
  `opaque-token.ts`), importing the type from `domain-schema.ts`. They are
  imported as `import * as withSession from "@mgtitimoli/auth-domain/session"`.
- Each domain error has its own module (`duplicate-email-error.ts`) and extends
  `CustomError` from `@mgtitimoli/utils/error`.

## Testing

Tests live next to the code they test (`session.ts` → `session.test.ts`) and
run with `yarn auth-domain:run test`.

## Building

Other workspaces consume `dist`: after a change, rebuild with
`yarn auth-domain:run build` (`yarn dev` at the root does it automatically).
