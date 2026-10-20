# Auth Platform

A back-office user management system: a REST API for users and sessions, and a
web application to sign up, sign in and manage users.

## Contents

- [Installation](#installation)
  - [Requirements](#requirements)
  - [Setup](#setup)
- [Demo](#demo)
- [Overview](#overview)
  - [Monorepo organization](#monorepo-organization)
  - [Architecture](#architecture)
  - [Conventions](#conventions)
- [Environments](#environments)
- [Services](#services)
- [Development](#development)
- [Testing](#testing)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Future improvements](#future-improvements)

## Installation

### Requirements

- [Node.js](https://nodejs.org) 22.22.1 or later (the repository pins 24.22.0 in
  `.tool-versions` for [asdf](https://asdf-vm.com) users; asdf is optional)
- [Yarn](https://yarnpkg.com): any installed version works
- [Docker](https://www.docker.com) with Compose, for the local database (see each
  workspace's README for its own requirements)

### Setup

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

## Demo

```sh
yarn demo
```

It needs only Docker: it builds and runs the whole project from its images
(PostgreSQL, the API on `http://localhost:8080` and the backoffice on
`http://localhost:3000`), migrating the database and seeding the admin first.
Open `http://localhost:3000` and sign in as `admin@example.com` / `Admin123!`,
or sign up. Every run starts from a fresh database: what you create is gone the
next time you run it (stop it with Ctrl+C).

The admin is seeded as the initial administrator for the planned roles and
permissions (see [Future improvements](#future-improvements)); today every user
can manage users.

## Overview

### Monorepo organization

The workspaces are either **apps**, which run, or **packages**, which apps
consume through their built `dist` (`yarn build-packages` builds them; `yarn dev`
rebuilds them on every change). Each workspace's README (follow its link)
explains it in detail:

| Workspace | Kind | Summary | Depends on |
|---|---|---|---|
| [auth-api](./workspaces/auth-api) | app | REST API for users and sessions | auth-domain, utils |
| [auth-backoffice](./workspaces/auth-backoffice) | app | Back office to sign up, sign in and manage users | auth-api-tools, auth-domain, utils |
| [auth-api-tools](./workspaces/auth-api-tools) | package | Typed client for auth-api (OpenAPI types, fetch client, React Query hooks) | utils |
| [auth-domain](./workspaces/auth-domain) | package | Domain schemas, types and errors | utils |
| [utils](./workspaces/utils) | package | Generic utilities | |
| [eslint-config](./workspaces/eslint-config) | package | ESLint and Prettier configuration | |

Every workspace also uses eslint-config, as a development dependency.

utils and eslint-config aren't specific to this project: they're meant to be
extracted into their own repositories, and live here for convenience.

- **auth-domain** is the contract both sides share: the zod schemas that
  validate the API's requests also validate the backoffice's forms, and its
  errors are the ones the API maps to status codes.
- **auth-api-tools** is generated from the API's OpenAPI document, so the
  backoffice calls the API with typed requests and responses.
- **utils** holds generic utilities (no knowledge of users or sessions); what
  only one workspace needs lives in that workspace's `src/utils` (`src/client/utils`
  in the backoffice).
- **The root** holds what combines workspaces: the images
  (`Dockerfile.<app>`), the compose files of the environments
  (`docker-compose.<environment>.yml`) and the scripts that run them together
  (`demo`, `service`, `test-auth-api`, `test-e2e`), in the environment chosen
  with auth-api's `env use`. Workspaces never start each other.

### Architecture

- **auth-api** ([Hono](https://hono.dev), [Kysely](https://kysely.dev),
  PostgreSQL) follows an onion architecture with the domain at its core:
  routers → services → repositories → database. Routes
  validate with the domain's schemas and only call services; each repository
  function queries one table and returns domain types, never rows.
- **auth-backoffice** ([Next.js](https://nextjs.org) with client components,
  [Base UI](https://base-ui.com), [vanilla-extract](https://vanilla-extract.style),
  [TanStack Query](https://tanstack.com/query) and
  [TanStack Table](https://tanstack.com/table)) talks to the API from the
  browser through auth-api-tools.
- **Sessions** are opaque random ids sent only in an `HttpOnly` cookie, so the
  page's JavaScript never sees them; they last until they're terminated
  (sign-out, deactivation, deletion).
- **Passwords** live in their own table (`user_credentials`), hashed with
  scrypt: no query on `users` can return a password hash.
- **Session ids are stored as they are** (an accepted trade-off): anyone who can
  read the `sessions` table could use active sessions. Hashing them at rest is a
  future improvement.

Each workspace's README covers its own design in detail (for example,
[auth-api's](./workspaces/auth-api#design)).

### Conventions

The code is **functional** and **data-oriented** (the full rules are in the
[TypeScript conventions](./docs/TYPESCRIPT_CONVENTIONS.md)):

- **Functional:** pure functions, no mutation and no classes (only error
  classes, since `instanceof` is how errors are told apart). Side effects stay
  at the edges (routes, repositories, React components).
- **Data-oriented:** data is plain, immutable values described by types, and
  the functions that operate on a type live in the module named after it
  (`user.ts` for `User`), taking it as their first parameter. Modules are
  imported as a namespace, so calls read as what they act on:

  ```ts
  import * as withUser from "@mgtitimoli/auth-domain/user";

  const isActive = withUser.isActive(user);
  ```

- **Types first:** types are inferred wherever TypeScript can (from zod
  schemas, Kysely queries and the OpenAPI document), so there's a single source
  for each shape.

The project also has [AGENTS.md](./AGENTS.md) files (one at the root, one per
workspace) for agentic coding tools such as Claude Code or Codex: they give an
agent the project-specific rules, the layout and the commands to lint, type
check and test, so it follows the conventions without rediscovering them. They
read just as well as a quick reference for people.

## Environments

An **environment** is a set of settings (auth-api's `.env.<environment>`) and,
when it runs in Docker, a compose file at the root
(`docker-compose.<environment>.yml`) with its **services**:

| Environment | Services | Used by |
|---|---|---|
| `local` | `postgres` (port 5432, keeps its data) | `yarn dev`, which runs the API and the backoffice on your machine |
| `test` | `postgres` (port 5433, in memory) and `auth-api` (the API's image, port 8080) | `yarn test-auth-api` and `yarn test-e2e` |
| `demo` | `postgres`, `auth-api`, `auth-backoffice` and a one-off migrate-and-seed service | `yarn demo` |

Commands never choose an environment: they act on the current one, which you
pick once with auth-api's `env` script:

```sh
yarn auth-api:run env list        # demo, local, test
yarn auth-api:run env use local   # makes local the current environment
yarn auth-api:run env which       # local
```

To run a single command in another environment without changing the current
one, use `env run`:

```sh
yarn auth-api:run env run --environment test yarn database:migrate-all
yarn auth-api:run env run --environment test yarn run --top-level service list
```

(`--top-level` runs a root script, such as `service`, from auth-api.)

## Services

A **service** is one container of an environment, as its compose file defines
it: a database (`postgres`), the API's image (`auth-api`), and so on. Each
environment has only the services it needs (see the table in
[Environments](#environments)), and `yarn service` manages the current
environment's ones: starting and stopping them, checking whether they're
running, following their logs and deleting their data:

```sh
yarn service list                 # postgres
yarn service postgres start       # starts it and waits until it's ready
yarn service postgres status      # running
yarn service postgres logs        # follows its logs
yarn service postgres stop        # stops it (local keeps its data)
yarn service postgres clear       # stops it and deletes its data
```

## Development

```sh
yarn auth-api:run env use local
yarn service postgres start
yarn auth-api:run database:migrate-all
yarn auth-api:run database:seed 00001-seed-admin-users
yarn dev
```

Then sign in as `admin@example.com` / `Admin123!` (see
[auth-api](./workspaces/auth-api)). The local database keeps its data between
runs; `yarn service postgres stop` stops it.

`yarn dev` builds the packages, then runs the API on `http://localhost:8080`
and the backoffice on `http://localhost:3000`, rebuilding and restarting
everything on every change (see
[auth-api](./workspaces/auth-api) and [auth-backoffice](./workspaces/auth-backoffice)).

## Testing

| What | How | Command |
|---|---|---|
| auth-api | [Vitest](https://vitest.dev) against a real PostgreSQL (no mocks), through its HTTP routes | `yarn test-auth-api` |
| auth-domain, utils | Vitest unit tests | `yarn auth-domain:run test`, `yarn utils:run test` |
| auth-api-tools | No tests of its own: its types are generated from the API's OpenAPI document, and the backoffice's end-to-end tests exercise its client | |
| eslint-config | No tests: it's configuration, exercised by every workspace's `lint` | |
| auth-backoffice | [Playwright](https://playwright.dev) end-to-end tests against the production build and auth-api's test environment | `yarn test-e2e` |

`test-auth-api` and `test-e2e` need Docker: they start the containers they need
and stop them afterwards, so every run starts with an empty database. The
end-to-end tests need Playwright's Chromium once
(`yarn auth-backoffice:run prepare-e2e`) and ports 3000, 8080 and 5433
free (stop `yarn dev` first). CI runs all of them, plus lint and type checking,
on every pull request and push to `main`.

## Scripts

| Script | Description |
|---|---|
| `dev` | Builds the packages, then runs the API and the backoffice in development mode, rebuilding the packages and restarting the servers on every change |
| `demo` | Runs the whole project from its images in the `demo` environment, with a fresh database (see [Demo](#demo)) |
| `service <service> <action>` | Manages a service of the current environment (`start`, `stop`, `status`, `logs`, `clear`); `service list` prints them |
| `build-all` | Builds every workspace |
| `build-packages` | Builds the packages other workspaces depend on |
| `run-all` | Runs the given script in every workspace (for example `yarn run-all lint`) |
| `run-all-parallel` | Same as `run-all`, in parallel |
| `<workspace>:run` | Runs the given script in a workspace (for example `yarn auth-api:run build`) |
| `setup` | Installs the git hooks |
| `test-auth-api` | Runs auth-api's tests against its test database (see [auth-api](./workspaces/auth-api)) |
| `test-e2e` | Runs the backoffice's end-to-end tests against auth-api's test environment (see [auth-backoffice](./workspaces/auth-backoffice)) |

Type checking (`yarn run-all check-types:all`) needs the packages built first
(`yarn build-packages`), because workspaces consume each other's `dist`.

## Contributing

Install the git hooks once after cloning:

```sh
yarn setup
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
with a sentence-case subject (for example, `feat: Add sign-in page`), plus a
short body explaining what changes and why. The
`commit-msg` hook checks them with [commitlint](https://commitlint.js.org), and the
`pre-commit` hook lints the staged files with
[lint-staged](https://github.com/lint-staged/lint-staged).

## Future improvements

- **Roles and permissions:** today every user can manage users; the seeded
  admin becomes the initial administrator.
- **Session expiry:** sessions last until they're terminated.
- **Hashing session ids at rest**, so reading the `sessions` table doesn't
  expose usable sessions.
- **Rate limiting** on sign-in and sign-up.
- **Constant-time sign-in for unknown emails:** an unknown email is rejected
  before any password hashing, so the response time reveals whether an email is
  registered (sign-up's "already exists" response reveals it anyway).
- **Token authentication for non-browser clients:** sessions are only read
  from the `HttpOnly` cookie. Mobile apps or CLIs would need the session id in
  an `Authorization: Bearer` header instead.
- **Password policy:** screening against a blocklist of breached passwords, and
  [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)'s policy
  (at least 15 characters, no character-class rules).
- **Changing one's own password:** today an administrator sets it.
- **User settings stored in the API** (the theme), so they follow the user
  across devices instead of staying in the browser.
- **User avatars:** an image in the domain, uploaded and shown in the account
  menu (today it shows the user's initials).
- **Deployment** (for example, to AWS ECS with RDS).
