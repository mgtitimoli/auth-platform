# Auth API Workspace

REST API for users and sessions.

## Stack

- **Framework**: Hono with @hono/node-server
- **Validation**: Zod schemas
- **Documentation**: OpenAPI via hono-openapi
- **Logging**: pino via hono-pino

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

## Testing the API

The local server is started by the user (`yarn watch` at the root).

**No trailing slashes.** Hono does not match routes with a trailing slash:
`GET /health/` returns 404, `GET /health` works.

**Unauthenticated endpoints:** `/health`, `/openapi` and `/swagger`. Use
`/health` to check if the server is running and `/openapi` to inspect schemas.

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

### `src/utils/`

API-specific utilities: environment name and variables.
