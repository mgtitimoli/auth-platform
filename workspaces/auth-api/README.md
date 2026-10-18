# @mgtitimoli/auth-api

REST API for users and sessions, built with [Hono](https://hono.dev).

## Running

```sh
yarn auth-api:run env:use local
yarn watch
```

The API listens on `http://localhost:3001`:

- `GET /health`: health check
- `GET /openapi`: OpenAPI document
- `GET /swagger`: Swagger UI

Logs are also written to `logs/auth-api.log` when running locally.

## Environment variables

`.env` is a symlink to one of the `.env.*` files (`yarn auth-api:run env:use <name>`).
`.env.local` contains the local settings.

| Variable | Description |
|---|---|
| `AUTH_API_PORT` | Port the API listens on |
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
| `env:list` | Lists the available `.env.*` files |
| `env:use` | Points `.env` to the given `.env.*` file |
| `env:which` | Shows which `.env.*` file `.env` points to |
