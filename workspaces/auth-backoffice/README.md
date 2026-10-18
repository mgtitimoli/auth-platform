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
| `build` | Builds the backoffice (standalone output) |
| `start` | Runs the built backoffice |
| `lint` | Lints the workspace |
| `check-types:all` | Generates Next's types (`next typegen`) and type-checks the workspace |
| `check-types:files` | Same, for the given files |
