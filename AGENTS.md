# Agent instructions

This is a monorepo with the following workspaces:

- `auth-api`: REST API for users and sessions (see
  [its AGENTS.md](./workspaces/auth-api/AGENTS.md))
- `auth-api-tools`: typed client for `auth-api`, used by the backoffice (see
  [its AGENTS.md](./workspaces/auth-api-tools/AGENTS.md))
- `auth-backoffice`: back office to sign up, sign in and manage users (see
  [its AGENTS.md](./workspaces/auth-backoffice/AGENTS.md))
- `auth-domain`: domain schemas, types and errors shared by `auth-api` and the
  backoffice (see [its AGENTS.md](./workspaces/auth-domain/AGENTS.md))
- `eslint-config`: ESLint and Prettier configuration
- `utils`: generic utilities (see [its AGENTS.md](./workspaces/utils/AGENTS.md))

Generic utilities live in `utils`; workspace-specific utilities live in each
workspace's `src/utils` (`src/client/utils` in `auth-backoffice`).

## Conventions

You must follow [docs/TYPESCRIPT_CONVENTIONS.md](./docs/TYPESCRIPT_CONVENTIONS.md),
with these project rules on top:

- Error classes extending `CustomError` are the only classes allowed.
- Return types are inferred, except for recursive functions (workspaces add
  their own exceptions).
- Re-exports (barrels and services without logic) use `export *` /
  `export type *`, never `export {symbol} from`.

## Linting

To lint a workspace and fix all auto-fixable issues, run
`yarn <workspace>:run lint --fix` (for example, `yarn auth-api:run lint --fix`).

To lint all workspaces, run `yarn run-all lint --fix`.

## Type checking

To check the types of a workspace, run `yarn <workspace>:run check-types:all`
(for example, `yarn auth-api:run check-types:all`).

To check the types of all workspaces, run `yarn run-all check-types:all`.

Workspaces consume each other's `dist`, so build the packages first
(`yarn build-packages`) if they changed.

**Note:** these commands produce **no output on success**: check the exit code
(`echo $?`) to confirm success.

## Testing

To run the tests of a workspace, run `yarn <workspace>:run test`; for all
workspaces, `yarn run-all test`. auth-api's tests need Docker (they start their
own database).

The backoffice's end-to-end tests run from the root with `yarn test:e2e`, which
starts auth-api's test environment (Docker) first: the root is the only place
that combines workspaces, and workspaces never start each other.

## Commits

Commit messages follow Conventional Commits with a sentence-case subject
(enforced by commitlint).

## Secrets

Never print secrets (passwords, tokens, session ids, credentials) in output or
logs.
