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

## Theme

Styles use [vanilla-extract](https://vanilla-extract.style). The light and dark
themes are CSS variables (`applicationThemeVars`, in
[application-theme.css.ts](./src/client/components/application/application-theme.css.ts)),
and the dark one applies when the operating system prefers it.

## Testing

```sh
yarn auth-backoffice:run test:e2e:install   # once: downloads Playwright's Chromium
yarn auth-backoffice:run test:e2e
```

`test:e2e` builds the backoffice and runs the [Playwright](https://playwright.dev)
tests in [e2e](./e2e) against it.

## Docker

From the repository root:

```sh
docker build -f Dockerfile.auth-backoffice -t auth-backoffice .
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
| `test:e2e` | Builds the backoffice and runs the e2e tests |
| `test:e2e:install` | Installs the Playwright browser (Chromium) |
| `lint` | Lints the workspace |
| `check-types:all` | Generates Next's types (`next typegen`) and type-checks the workspace |
| `check-types:files` | Same, for the given files |
