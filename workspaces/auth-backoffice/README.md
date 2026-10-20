# @mgtitimoli/auth-backoffice

Back office to sign up, sign in and manage users, built with
[Next.js](https://nextjs.org) (App Router).

## Contents

- [Running](#running)
- [Pages](#pages)
- [Layout](#layout)
- [Environment variables](#environment-variables)
- [Theme](#theme)
- [Testing](#testing)
  - [Iterating on the tests](#iterating-on-the-tests)
- [Docker](#docker)
- [Scripts](#scripts)

## Running

```sh
yarn dev
```

From the repository root, `yarn dev` runs the backoffice on
`http://localhost:3000` together with the API (see the root README). To run
only the backoffice:

```sh
yarn auth-backoffice:run dev
```

## Pages

| Path | Page |
|---|---|
| `/` | Redirects: to `/users` with a session, to `/sign-up` without one |
| `/sign-in` | Sign-in form: signs the user in and goes to `/users` |
| `/sign-up` | Sign-up form: creates the user, signs them in and goes to `/users` |
| `/users` | The users page: every user, 6 per page, creating, editing and deleting users |

Private pages share a navbar with an account menu (the avatar): who's signed
in and Log out.

[src/proxy.ts](./src/proxy.ts) guards the pages by the session cookie: without
it, private pages go to `/sign-in`; with it, the sign-in and sign-up pages go to
`/users`. When the API rejects the session (it ended), the user is taken to
`/sign-in`.

## Layout

`src/app` only holds Next's routing: each page re-exports a screen. `src/client`
holds everything that runs in the browser: screens, components and utilities
(every component is a client component). Server logic, such as route handlers
under `app/api`, would go in a sibling `src/server`, re-exported from `app` the
same way pages re-export screens.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_AUTH_API_URL` | The API's URL. Inlined at build time, so each environment's build needs its own: [.env.local](./.env.local) has the local one for `next dev` and `next build`, and the compose files build the image with the loaded environment's (`http://localhost:` + `AUTH_API_PORT`) |

## Theme

Styles use [vanilla-extract](https://vanilla-extract.style). The light and dark
themes are CSS variables (`applicationThemeVars`, in
[application-theme.css.ts](./src/client/components/application/application-theme.css.ts)),
selected by `<html>`'s `data-theme` attribute, and following the operating
system when there's none.

Signed-in users choose Light, Dark or System in the account menu.
[@wrksz/themes](https://github.com/jakubwarkusz/themes) keeps the choice in
`localStorage` (in sync across tabs) and applies it before the first paint.
When the session ends (logging out, or the API rejecting it), the theme goes
back to System, so the next user starts from the operating system's theme.

## Testing

```sh
yarn auth-backoffice:run prepare-e2e   # once: downloads Playwright's Chromium
yarn test-e2e                          # from the repository root
```

The root `test-e2e` starts the test environment's services in Docker (the
migrated database, the API and this backoffice's image), then runs this
workspace's `test-e2e`, the [Playwright](https://playwright.dev) tests in
[e2e](./e2e), against them, so they test the image that ships. It stops them
afterwards, so every run starts with an empty database. It needs ports 3000,
8080 and 5433 free (stop `yarn dev` first).

The tests read the API's and the backoffice's addresses from the loaded
environment (`AUTH_API_PORT`, `AUTH_BACKOFFICE_URL`), so they always run
through auth-api's `env run`.

### Iterating on the tests

Rebuilding the image on every change is slow, so while writing or fixing tests,
run the backoffice with reloading against the test environment's API instead:

```sh
yarn auth-api:run env use test
yarn services start --service auth-api   # the migrated database and the API
yarn auth-backoffice:run dev             # this backoffice, reloading on changes
yarn auth-api:run env run yarn run --top-level auth-backoffice:run test-e2e
```

Rerun the last command as often as needed. The tests run against `next dev`
here, not the production build, so finish with a full `yarn test-e2e`; then
`yarn services stop` and `yarn auth-api:run env use local`.

## Docker

From the repository root:

```sh
docker build -f Dockerfile.auth-backoffice \
  --build-arg NEXT_PUBLIC_AUTH_API_URL=https://… \
  -t auth-backoffice .
docker run -p 3000:3000 auth-backoffice
```

The image runs Next's standalone output (`output: "standalone"`): the server
and only the files it needs, without installing `node_modules`.

## Scripts

| Script | Description |
|---|---|
| `dev` | Runs the backoffice in development mode |
| `build` | Builds the backoffice (the standalone output, with its static assets) |
| `start` | Runs the built backoffice (the standalone server, as in Docker) |
| `test-e2e` | Runs the e2e tests against the backoffice and API of the loaded environment (see Testing) |
| `prepare-e2e` | Installs the Playwright browser (Chromium) |
| `lint` | Lints the workspace |
| `check-types:all` | Generates Next's types (`next typegen`) and type-checks the workspace |
| `check-types:files` | Same, for the given files |
