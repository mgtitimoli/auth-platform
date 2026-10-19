# Auth Platform

A back-office user management system: a REST API for users and sessions, and a
web application to sign up, sign in and manage users.

## Requirements

- [Node.js](https://nodejs.org) 22.22.1 or later (the repository pins 24.22.0 in
  `.tool-versions` for [asdf](https://asdf-vm.com) users; asdf is optional)
- [Yarn](https://yarnpkg.com): any installed version works
- [Docker](https://www.docker.com) with Compose, for the local database (see each
  workspace's README for its own requirements)

## Installation

The repository includes its own Yarn release (3.8.2, in `.yarn/releases`), so any
`yarn` on your machine delegates to it. Corepack is not required, which matters
because Node.js 25 and later no longer bundle it.

If you don't have `yarn` yet, install it globally (or run `corepack enable` on
Node.js 22 or 24):

```sh
npm install --global yarn
```

Then install the dependencies:

```sh
yarn install
```

## Workspaces

- [auth-api](./workspaces/auth-api): REST API for users and sessions
- [auth-api-tools](./workspaces/auth-api-tools): typed client for auth-api (OpenAPI types, fetch client, React Query hooks)
- [auth-backoffice](./workspaces/auth-backoffice): back office to sign up, sign in and manage users
- [auth-domain](./workspaces/auth-domain): domain schemas, types and errors
- [eslint-config](./workspaces/eslint-config): ESLint and Prettier configuration
- [utils](./workspaces/utils): generic utilities

## Development

```sh
yarn auth-api:run env use local
yarn auth-api:run database start
yarn auth-api:run database migrate-all
yarn auth-api:run database seed 00001-seed-admin-users
yarn watch
```

Then sign in as `admin@example.com` / `Admin123!` (see
[auth-api](./workspaces/auth-api)).

`yarn watch` builds the packages, then runs the API on `http://localhost:8080`
and the backoffice on `http://localhost:3000`, rebuilding and restarting
everything on every change (see
[auth-api](./workspaces/auth-api) and [auth-backoffice](./workspaces/auth-backoffice)).

## Scripts

| Script | Description |
|---|---|
| `watch` | Builds the packages, then runs every workspace in watch mode |
| `build-all` | Builds every workspace |
| `build-packages` | Builds the packages other workspaces depend on |
| `run-all` | Runs the given script in every workspace (for example `yarn run-all lint`) |
| `run-all-parallel` | Same as `run-all`, in parallel |
| `<workspace>:run` | Runs the given script in a workspace (for example `yarn auth-api:run build`) |
| `setup` | Installs the git hooks |

The backoffice's end-to-end tests run separately (`yarn auth-backoffice:run test:e2e`,
see [auth-backoffice](./workspaces/auth-backoffice)).

Type checking (`yarn run-all check-types:all`) and tests (`yarn run-all test`)
need the packages built first (`yarn build-packages`), because workspaces
consume each other's `dist`. auth-api's tests start their own database (see
[auth-api](./workspaces/auth-api)).

## Future improvements

- **Constant-time sign-in for unknown emails:** an unknown email is rejected
  before any password hashing, so the response time reveals whether an email is
  registered (sign-up's "already exists" response reveals it anyway).
- **Token authentication for non-browser clients:** sessions are only read
  from the `HttpOnly` cookie. Mobile apps or CLIs would need the session id in
  an `Authorization: Bearer` header instead.

## Contributing

Install the git hooks once after cloning:

```sh
yarn setup
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
with a sentence-case subject (for example, `feat: Add sign-in page`). The
`commit-msg` hook checks them with [commitlint](https://commitlint.js.org), and the
`pre-commit` hook lints the staged files with
[lint-staged](https://github.com/lint-staged/lint-staged).

The code follows the [TypeScript conventions](./docs/TYPESCRIPT_CONVENTIONS.md);
[AGENTS.md](./AGENTS.md) lists the project-specific rules.
