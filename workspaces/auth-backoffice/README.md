# @mgtitimoli/auth-backoffice

Back office to sign up, sign in and manage users, built with
[Next.js](https://nextjs.org) (App Router).

## Running

```sh
yarn watch
```

From the repository root, `yarn watch` runs the backoffice on
`http://localhost:3000` together with the API (see the root README). To run
only the backoffice:

```sh
yarn auth-backoffice:run dev
```

## Pages

| Path | Page |
|---|---|
| `/sign-in` | Sign-in form: signs the user in and goes to `/users` |
| `/sign-up` | Sign-up form: creates the user, signs them in and goes to `/users` |
| `/users` | Greets the signed-in user (`Hello <first name>`) |

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_AUTH_API_URL` | The API's URL. Inlined at build time, so each environment's build needs its own; [.env.local](./.env.local) has the local one |

## Theme

Styles use [vanilla-extract](https://vanilla-extract.style). The light and dark
themes are CSS variables (`applicationThemeVars`, in
[application-theme.css.ts](./src/client/components/application/application-theme.css.ts)),
and the dark one applies when the operating system prefers it.

## Testing

```sh
yarn auth-backoffice:run test:e2e:install   # once: downloads Playwright's Chromium
yarn test:e2e                               # from the repository root
```

The root `test:e2e` starts auth-api's test environment (its database and API
container, so it needs Docker and ports 3000, 8080 and 5433 free: stop
`yarn watch` first), then runs this workspace's `test:e2e`, which builds the
backoffice and runs the [Playwright](https://playwright.dev) tests in
[e2e](./e2e) against it.

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
| `test:e2e` | Builds the backoffice and runs the e2e tests (against an API already running; see Testing) |
| `test:e2e:install` | Installs the Playwright browser (Chromium) |
| `lint` | Lints the workspace |
| `check-types:all` | Generates Next's types (`next typegen`) and type-checks the workspace |
| `check-types:files` | Same, for the given files |
