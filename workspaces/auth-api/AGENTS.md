# Auth API Workspace

REST API for users and sessions.

## Stack

- **Framework**: Hono with @hono/node-server
- **Validation**: Zod schemas
- **Documentation**: OpenAPI via hono-openapi
- **Database**: Kysely with PostgreSQL (`pg`)
- **Logging**: pino via hono-pino
- **Testing**: Vitest against a real PostgreSQL (no mocks)

## Architecture

Layered architecture: Routers → Services → Repositories → Database

- Repository and service functions take a single params object that includes
  `database`.
- Routes only call services; services without logic re-export the repository
  function's module (`export * from "@/repositories/user-repository/get-users";`).
- No SQL joins: each repository function queries a single table.
- Repositories never return database rows: each table has a domain type and a
  `create…From` mapper.
- Never use `selectAll()` / `returningAll()`: select the columns explicitly
  using the column-name modules.
- Database tables are named in the plural.
- Return types are inferred, except for route handlers (`Promise<Response>`
  derived from the route definition) and `create…From` mappers.

## Database

### Safety

Database scripts that talk to a database take an optional environment
(`yarn auth-api:run database:migrate-all test`) and use `.env.<environment>`;
without one they use `.env`. **Before running any of them without an
environment**, check where the `.env` symlink points:

```bash
yarn auth-api:run env:which
```

`local` and `test` are the docker-compose databases: safe to proceed. For any
other environment, ask the user before any destructive action (rollbacks,
deletes).

### Running queries

Use the `database:cli` script to open a `psql` session connected to the
database of the given environment (or of `.env`):

```bash
yarn auth-api:run database:cli local
```

When running non-interactive queries, pass `-X` to ignore `.psqlrc` and get
consistent output regardless of local display settings (for example,
`yarn auth-api:run database:cli local -X -Atc "select 1"`).

See [src/database/AGENTS.md](./src/database/AGENTS.md) for schema and
migration conventions.

## Testing

`yarn auth-api:run test` starts the test database (`database:start test`, port
5433), migrates it once (`vitest.global-setup.ts`) and deletes every row before
each test (`vitest.setup.ts`). Test files run one at a time, since they share
the database.

- Tests never mock the database: route tests call the router in-process with
  `router.request(...)` and check the database through Kysely.
- Parse response bodies with the domain schemas (`userSchema`,
  `failedResponseSchema`, …), so tests also check the documented shape.
- Run a single test with `yarn auth-api:run vitest run -t "<name>"`. Logs are
  silent in tests (`LOG_LEVEL=silent` in `.env.test`): set it to `error` to see
  the cause of a 500.

## Testing the API by hand

The local server is started by the user (`yarn watch` at the root).

**No trailing slashes.** Hono does not match routes with a trailing slash:
`GET /health/` returns 404, `GET /health` works.

**Unauthenticated endpoints:** `/health`, `/openapi`, `/swagger`,
`/auth/sign-up` and `/auth/sign-in` (`unauthenticatedRoutePaths` in
`router.ts`). Use `/health` to check if the server is running and `/openapi` to
inspect schemas.

**Every other endpoint needs the session cookie.** Sign in with the seeded admin
(see the README) using a curl cookie jar (`-c cookies.txt`, then
`-b cookies.txt`). Never print the cookie's value. In tests, sign up or sign in
through the router and send the `session=<id>` pair from `Set-Cookie` as the
`Cookie` header.

## Logs

When `ENVIRONMENT_NAME=local`, the API also writes its log stream to
`workspaces/auth-api/logs/auth-api.log`. The file is truncated on each start
unless `LOGS_RETAINED=true`. A 500 returns a generic body; the cause is in the
log file:

```bash
tail -f workspaces/auth-api/logs/auth-api.log
```

## Key Files

- `serve.ts`: server entry point
- `router.ts`: main router with middleware setup
- `hono-env.ts`: Hono environment type definitions
- `logger.ts`: pino logger configuration
- `handle-uncaught-exception.ts`: uncaught exception handler

## Directory Structure

### `src/database/`

Kysely setup, schema types, column-name modules and migrations. See
[src/database/AGENTS.md](./src/database/AGENTS.md).

### `src/repositories/`

Data access: one folder per table, one file per function, and an `export *`
barrel.

### `src/services/`

Business logic: one folder per service, one file per function, and an
`export *` barrel. Services compose repositories, and other services, in
transactions with `startTransactionIfNeeded`.

### `src/routers/`

HTTP routes. See [src/routers/AGENTS.md](./src/routers/AGENTS.md).

### `src/utils/`

API-specific utilities: environment name and variables, and the session cookie.
