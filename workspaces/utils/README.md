# @mgtitimoli/utils

Generic utilities shared by the workspaces of this repository. Each folder is
self-contained, so it can later be published as a standalone package.

## Utilities

- [error](./src/error)
- [fetch](./src/fetch)
- [formatting](./src/formatting)
- [hono](./src/hono)
- [http](./src/http)
- [kysely](./src/kysely)
- [logging](./src/logging)
- [object](./src/object)
- [password](./src/password)
- [react](./src/react)
- [tanstack-query](./src/tanstack-query)
- [tanstack-table](./src/tanstack-table)
- [validation](./src/validation)
- [zod](./src/zod)

## Usage

Import each utility through its subpath:

```ts
import {getEntries} from "@mgtitimoli/utils/object";
import * as withServer from "@mgtitimoli/utils/hono/server";
```

Framework libraries (Hono, Kysely, pino, zod) are optional peer dependencies: install the
ones used by the utilities you import.

## Scripts

| Script | Description |
|---|---|
| `build` | Builds the workspace into `dist` |
| `watch` | Rebuilds the workspace on every change |
| `clean` | Removes `dist` |
| `test` | Runs the tests |
| `lint` | Lints the workspace |
| `check-types:all` | Type-checks the workspace |
| `check-types:files` | Type-checks the given files |
