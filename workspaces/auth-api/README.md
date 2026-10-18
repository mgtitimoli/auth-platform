# @mgtitimoli/auth-api

REST API for users and sessions, built with [Hono](https://hono.dev).

## Requirements

- [Docker](https://www.docker.com) with Compose, for the local database
- `psql` (the PostgreSQL client), only for `database:cli`

## Running

```sh
yarn auth-api:run env:use local
yarn auth-api:run database:start
yarn watch
```

The API listens on `http://localhost:3001`:

- `GET /health`: health check
- `GET /openapi`: OpenAPI document
- `GET /swagger`: Swagger UI

Logs are also written to `logs/auth-api.log` when running locally.

## Database

The local database is a PostgreSQL 16 container defined in
[docker-compose.yml](./docker-compose.yml), listening on port 5432 (database,
user and password: `auth`). Its data lives in a Docker volume, so it survives
`database:stop`; `database:clear` removes it.

## Environment variables

`.env` is a symlink to one of the `.env.*` files (`yarn auth-api:run env:use <name>`).
`.env.local` contains the local settings.

| Variable | Description |
|---|---|
| `AUTH_API_PORT` | Port the API listens on |
| `AUTH_DATABASE_URL` | PostgreSQL connection URL |
| `ENVIRONMENT_NAME` | `local`, `development` or `production` (`local` enables readable logs and the log file) |
| `LOG_LEVEL` | Log level (default `info`) |
| `LOGS_RETAINED` | `true` to append to the log file instead of overwriting it |
| `TZ` | Must be `UTC` |

## Docker

From the repository root:

```sh
docker build -f Dockerfile.auth-api -t auth-api .
docker run -p 3001:3001 -e AUTH_API_PORT=3001 -e ENVIRONMENT_NAME=production -e TZ=UTC auth-api
```

## Scripts

| Script | Description |
|---|---|
| `watch` | Runs the API and restarts it on every change |
| `build` | Builds the API into `dist` |
| `start` | Runs the built API |
| `lint` | Lints the workspace |
| `check-types:all` | Type-checks the workspace |
| `check-types:files` | Type-checks the given files |
| `database:start` | Starts the local database |
| `database:stop` | Stops the local database (its data is kept) |
| `database:clear` | Stops the local database and deletes its data |
| `database:status` | Shows whether the local database is running |
| `database:logs` | Follows the local database logs |
| `database:cli` | Opens `psql` on the database of `.env` (extra arguments are passed to `psql`) |
| `env:list` | Lists the available `.env.*` files |
| `env:use` | Points `.env` to the given `.env.*` file |
| `env:which` | Shows which `.env.*` file `.env` points to |
