# Auth Platform

A back-office user management system: a REST API for users and sessions, and a
web application to sign up, sign in and manage users.

## Requirements

- [Node.js](https://nodejs.org) 22.22.1 or later (the repository pins 24.22.0 in
  `.tool-versions` for [asdf](https://asdf-vm.com) users; asdf is optional)
- [Yarn](https://yarnpkg.com): any installed version works

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

| Workspace | Description |
|---|---|
| [`eslint-config`](workspaces/eslint-config) | ESLint and Prettier configuration shared by the other workspaces |

## Linting

Lint every workspace (Prettier runs through ESLint):

```sh
yarn run-all lint
```

To lint a single workspace, use its `<workspace>:run` script, for example
`yarn eslint-config:run lint`.

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

The code follows the [TypeScript conventions](docs/TYPESCRIPT_CONVENTIONS.md);
[AGENTS.md](AGENTS.md) lists the project-specific rules.

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) validates every pull request and
every push to `main`: it installs the dependencies, then type-checks and lints
every workspace.
