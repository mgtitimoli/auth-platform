# Utils Workspace

Generic utilities shared by the workspaces of this repository.

## Packages

Each `src/<name>` folder is a future standalone published package:

- It is generically named and contains no auth-platform concepts (users,
  sessions, auth).
- It never imports from other workspaces.
- It uses another folder only as it would use another package (through its
  public modules).
- Framework libraries (Hono, pino, zod, …) are optional peer dependencies.

## Code

- Imports within the workspace use the `@/` alias; `tsc-alias` rewrites them in
  the emitted `.d.ts` files.
- Hono middleware factories are named with nouns (`sessionMiddleware(options)`),
  like Hono's own (`cors()`, `logger()`).

## READMEs

Every folder has a `README.md`:

- top-level types, classes (errors) and functions go under `## Types`,
  `## Classes` and `## Functions`, each as `### name` → `#### Description` →
  `#### Example`;
- noun modules (data-oriented modules imported as `withX`) are listed under
  `## Modules` as links to their files only (`- [http-method](./http-method.ts)`).

The workspace `README.md` links to every folder.

## Testing

Tests live next to the code they test (`get-hash.ts` → `get-hash.test.ts`),
import from `"vitest"` explicitly, and run with `yarn utils:run test`. They are
excluded from `dist` (`.swcrc` and `tsconfig.build.json`).

## Building

Other workspaces consume `dist`: after a change, rebuild with `yarn utils:run build`
(`yarn watch` at the root does it automatically).
