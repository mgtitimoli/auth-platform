# @mgtitimoli/auth-api

REST API for users and sessions, built with [Hono](https://hono.dev) and
[Kysely](https://kysely.dev) on PostgreSQL.

## Requirements

- [Docker](https://www.docker.com) with Compose, for the local and test databases
- `psql` (the PostgreSQL client), only for `database cli`

## Running

```sh
yarn auth-api:run env use local
yarn auth-api:run database start
yarn auth-api:run database migrate-all
yarn auth-api:run database seed 00001-seed-admin-users
yarn watch
```

To run the API in Docker instead of `yarn watch` (the image of
[Dockerfile.auth-api](../../Dockerfile.auth-api)), run
`yarn auth-api:run container start` after the seed, and `container stop` to stop
it.

Sign in with the seeded admin:

| Email | Password |
|---|---|
| `admin@example.com` | `Admin123!` |

The API listens on `http://localhost:3001`:

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /openapi` | OpenAPI document |
| `GET /swagger` | Swagger UI |
| `POST /auth/sign-up` | Creates a user and signs them in (sets the session cookie) |
| `POST /auth/sign-in` | Signs a user in (sets the session cookie) |
| `POST /auth/sign-out` | Terminates the session and removes the cookie |
| `GET /users/me` | The signed-in user |
| `POST /users` | Creates a user with the given password (it hasn't signed in yet) |
| `PATCH /users/:userId` | Updates the given fields of a user (`email`, `firstName`, `lastName`, `status`). An inactive user's names can't be updated, users can't deactivate themselves, and deactivating a user terminates their sessions |
| `DELETE /users/:userId` | Deletes a user, with their credential and sessions (users can't delete themselves) |
| `GET /users?limit=&offset=` | A page of users, ordered by creation (`limit` defaults to 6, at most 100; `offset` defaults to 0), with the total |

Every endpoint except health, OpenAPI, Swagger, sign-up and sign-in needs the
session cookie (401 otherwise). In Swagger, sign in with "Try it out": the
browser keeps the cookie and sends it with the next requests. With curl, use a
cookie jar:

```sh
curl -c cookies.txt -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  http://localhost:3001/auth/sign-in
curl -b cookies.txt http://localhost:3001/users/me
```

Logs are also written to `logs/auth-api.log` when running locally.

## Database

Each environment that runs in Docker has its own compose file, with a
PostgreSQL 16 database (database, user and password: `auth`, shared through
[docker-compose.postgres.yml](./docker-compose.postgres.yml)) and the API's
container:

| Environment | Compose file | Database port | Database storage |
|---|---|---|---|
| `local` | [docker-compose.local.yml](./docker-compose.local.yml) | 5432 | a Docker volume: survives `database stop`, `database clear` deletes it |
| `test` | [docker-compose.test.yml](./docker-compose.test.yml) | 5433 | in memory: cleared every time it stops |

Scripts never take an environment: they act on the current one, the one `.env`
points to (`env use`). To run a single command in another environment, without
changing `.env`, use `env run`:

```sh
yarn auth-api:run env use local
yarn auth-api:run database start
yarn auth-api:run database migrate-all
yarn auth-api:run env run --environment test yarn database cli -c "select count(*) from users"
```

### Design

- Passwords live in their own table (`user_credentials`): no query on `users`
  can return a password hash, and only the user-credential repository reads it.
  Hashes use scrypt with a random salt.
- Session ids are random 192-bit tokens, stored as they are: anyone who can read
  the `sessions` table could use active sessions until they're terminated.
- Sign-up and sign-in send the session id only in an `HttpOnly` cookie, never in
  the body, so the page's JavaScript can't read it. Every other request must
  include that cookie (browsers do it automatically).

### Seeds

Seeds live in [src/database/seeds](./src/database/seeds) and are run by name
(`database seed <seed>`). `00001-seed-admin-users` creates the
admins listed above, skipping the ones that already exist. Their passwords are
public, so never run it against a shared environment.

### Migrations

Migrations live in [src/database/migrations](./src/database/migrations) and are
applied manually (`database migrate-all`): the Docker image only runs the API.
To migrate a shared environment, create its gitignored `.env.<environment>`
with its credentials and run
`yarn auth-api:run env run --environment <environment> yarn database migrate-all`.

## Testing

```sh
yarn auth-api:run test
```

The tests run against the `test` database: `test` starts it (whatever `.env`
points to), and the tests migrate it and delete every row before each test.
They never mock the database.

## Environment variables

`.env` is a symlink to one of the `.env.*` files (`yarn auth-api:run env use <name>`).
`.env.local` and `.env.test` contain the local and test settings.

| Variable | Description |
|---|---|
| `AUTH_API_PORT` | Port the API listens on |
| `AUTH_BACKOFFICE_URL` | The backoffice's origin, the only one allowed to call the API from a browser (CORS) |
| `AUTH_DATABASE_URL` | PostgreSQL connection URL |
| `ENVIRONMENT_NAME` | `local`, `test`, `development` or `production` (`local` enables readable logs and the log file) |
| `LOG_LEVEL` | Log level (default `info`) |
| `LOGS_RETAINED` | `true` to append to the log file instead of overwriting it |
| `PASSWORD_HASH_COST` | Optional scrypt cost (N) for new password hashes. Defaults to OWASP's 2^17; `.env.test` lowers it to 1024 so tests hash fast |
| `SESSION_COOKIE_DOMAIN` | Optional domain of the session cookie (e.g. `example.com`), so subdomains share it |
| `SESSION_COOKIE_SECURE` | `true` to send the session cookie only over HTTPS |
| `TZ` | Must be `UTC` |

## Docker

From the repository root:

```sh
docker build -f Dockerfile.auth-api -t auth-api .
docker run -p 3001:3001 \
  -e AUTH_API_PORT=3001 \
  -e AUTH_DATABASE_URL=postgres://… \
  -e ENVIRONMENT_NAME=production \
  -e SESSION_COOKIE_SECURE=true \
  -e TZ=UTC \
  auth-api
```

`container start` builds and runs this same image in the current environment
(see [Database](#database)), with the database as `postgres:5432` inside the
compose network instead of the env file's `localhost` address.

## Scripts

| Script | Description |
|---|---|
| `watch` | Runs the API and restarts it on every change |
| `build` | Builds the API into `dist` |
| `start` | Runs the built API |
| `test` | Starts the test database and runs the tests |
| `lint` | Lints the workspace |
| `check-types:all` | Type-checks the workspace |
| `check-types:files` | Type-checks the given files |
| `container <command>` | Manages the API's container in the current environment (`container help`) |
| `database <command>` | Manages the current environment's database (`database help`) |
| `env <command>` | Manages the environments (`env help`) |
