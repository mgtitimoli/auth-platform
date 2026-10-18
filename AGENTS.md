# Agent instructions

## Conventions

You must follow [docs/TYPESCRIPT_CONVENTIONS.md](docs/TYPESCRIPT_CONVENTIONS.md),
with these project rules on top:

- Error classes extending `CustomError` are the only classes allowed.
- Hono middleware factories are named with nouns (`sessionMiddleware(options)`),
  like Hono's own (`cors()`, `logger()`).
- Return types are inferred, except for route handlers (`Promise<Response>`
  derived from the route definition), `create…From` mappers, exported functions
  of `auth-utils`, and recursive functions.
- Database tables are named in the plural.
- Repository and service functions take a single params object that includes
  `database`.
- Routes only call services; services without logic re-export the repository
  function.
- No SQL joins: each repository function queries a single table.
- Repositories never return database rows: each table has a domain type and a
  `create…From` mapper.
- Never use `selectAll()` / `returningAll()`: select the columns explicitly
  using the column-name modules.

## Repository layout

- `workspaces/*`: one workspace per package.
- Generic utilities live in `auth-utils` (each folder is a future standalone
  package); app-specific utilities live in each app's `src/utils`.
- API layers: routers → services → repositories → database.

## Commands

- Lint: `yarn run-all lint`
- Type checking: `yarn run-all check-types:all`

Both succeed silently: check the exit code.

## Commits

Commit messages follow Conventional Commits with a sentence-case subject
(enforced by commitlint).

## Secrets

Never print secrets (passwords, tokens, session ids, credentials) in output or
logs.
