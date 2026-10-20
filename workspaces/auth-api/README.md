# @mgtitimoli/auth-api

REST API for users and sessions, built with [Hono](https://hono.dev) and
[Kysely](https://kysely.dev) on PostgreSQL.

## Contents

- [Requirements](#requirements)
- [Running](#running)
- [API documentation](#api-documentation)
- [Database](#database)
  - [Design](#design)
  - [Seeds](#seeds)
  - [Migrations](#migrations)
- [Testing](#testing)
- [Environment variables](#environment-variables)
- [Docker](#docker)
- [Scripts](#scripts)

## Requirements

- [Docker](https://www.docker.com) with Compose, for the local and test databases
- `psql` (the PostgreSQL client), only for `database:cli`

## Running

From the repository root, the first time (it creates the local database's
tables and the admin):

```sh
yarn auth-api:run env use local
yarn services start --service postgres
yarn auth-api:run database:migrate-all
yarn auth-api:run database:seed 00001-seed-admin-users
```

Then, every time:

```sh
yarn auth-api:run env use local          # only if you switched to another environment
yarn services start --service postgres   # only if it isn't running
yarn dev
```

After pulling new migrations, apply them with
`yarn auth-api:run database:migrate-all`.

Sign in with the seeded admin, the initial administrator once roles and
permissions arrive (see the root README's future improvements); today every
user can manage users:

| Email | Password |
|---|---|
| `admin@example.com` | `Admin123!` |

The API listens on `http://localhost:8080`:

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
session cookie (401 otherwise). With curl, use a cookie jar:

```sh
curl -c cookies.txt -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  http://localhost:8080/auth/sign-in
curl -b cookies.txt http://localhost:8080/users/me
```

Logs are also written to `logs/auth-api.log` when running locally.

## API documentation

The API documents itself: each route declares its definition next to its
handler (summary, request body, responses and their status codes) with the
same auth-domain schemas it validates requests with, and
[hono-openapi](https://github.com/rhinobase/hono-openapi) builds the OpenAPI
document from them. The documentation can't drift from what the API accepts
and returns.

- `GET /openapi`: the OpenAPI document (JSON). It declares the session cookie
  as a security scheme, and the routes that need it.
- `GET /swagger`: [Swagger UI](https://swagger.io/tools/swagger-ui/) on that
  document. To call the protected routes, sign in with "Try it out": the
  browser keeps the cookie and sends it with the next requests.

[auth-api-tools](../auth-api-tools), the API's typed client, generates its
types from this document (`update-auth-api-schema`), so the calls of any app
using it, the backoffice first, are type-checked against the API.

## Database

Each environment has its own compose file at the repository root, with a
PostgreSQL 16 database (database, user and password: `auth`, defined in
[docker-compose.base.yml](../../docker-compose.base.yml)) next to the API's
and the backoffice's images. The root manages them (`yarn services`, see the
root README), in the environment selected here:

| Environment | Compose file | Database port | Database storage |
|---|---|---|---|
| `local` | [docker-compose.local.yml](../../docker-compose.local.yml) | 5432 | a Docker volume: survives `services stop`, `services clear --service postgres` deletes it |
| `test` | [docker-compose.test.yml](../../docker-compose.test.yml) | 5433 | in memory: cleared every time it stops |
| `demo` | [docker-compose.demo.yml](../../docker-compose.demo.yml) | not published | fresh on every `yarn demo` |

Scripts never take an environment: they act on the current one, the one `.env`
points to (`env use`). To run a single command in another environment, without
changing `.env`, use `env run`:

```sh
yarn auth-api:run env use local
yarn services start --service postgres
yarn auth-api:run database:migrate-all
yarn auth-api:run env run --environment test yarn database:cli -c "select count(*) from users"
```

### Design

- **Onion architecture:** the domain (auth-domain's types, schemas and errors)
  is the core, and each layer depends only on the ones inside it: repositories
  turn database rows into domain types, services implement the use cases on
  top of them, and routers expose those over HTTP. The database module
  (schema, migrations, seeds) knows nothing about the layers above it.
- Passwords live in their own table (`user_credentials`): no query on `users`
  can return a password hash, and only the user-credential repository reads it.
  Hashes use scrypt with a random salt.
- Session ids are random 192-bit tokens, stored as they are: anyone who can read
  the `sessions` table could use active sessions until they're terminated.
- Sign-up and sign-in send the session id only in an `HttpOnly` cookie, never in
  the body, so the page's JavaScript can't read it. Every other request must
  include that cookie (browsers do it automatically). A cookie that no longer
  matches an active session is removed by the 401 that rejects it, since only
  the API can remove an `HttpOnly` cookie.
- Sessions last until they're terminated (sign-out, deactivation, deletion):
  there's no expiry, so the cookie has no `Max-Age` either. A cookie lifetime
  without a matching server-side one would only hide the session, not end it.

### Seeds

Seeds live in [src/database/seeds](./src/database/seeds) and are run by name
(`database:seed <seed>`). Seeds are idempotent: running one again skips what
it already created, so it's safe to rerun. `00001-seed-admin-users` creates the
admins listed above, skipping the emails that already exist. Their passwords are
public, so never run it against a shared environment.

### Migrations

Migrations live in [src/database/migrations](./src/database/migrations) and are
applied manually (`database:migrate-all`): the production image only runs the
API. The test and demo environments migrate through their `auth-api-migrate`
service, which runs the image's build stage.
To migrate a shared environment, create its gitignored `.env.<environment>`
with its credentials and run
`yarn auth-api:run env run --environment <environment> yarn database:migrate-all`.

## Testing

From the repository root:

```sh
yarn test-auth-api
```

It starts the `test` database (whatever `.env` points to), runs this workspace's
`test` and stops the database. The tests migrate it and delete every row before
each test; they never mock the database. While iterating, start the test
database once (`yarn auth-api:run env use test`, then
`yarn services start --service postgres`) and run `yarn auth-api:run test`.

## Environment variables

`.env` is a symlink to one of the `.env.*` files (`yarn auth-api:run env use <name>`).
`.env.local`, `.env.test` and `.env.demo` contain each environment's settings.

| Variable | Description |
|---|---|
| `AUTH_API_PORT` | Port the API listens on |
| `AUTH_BACKOFFICE_URL` | The backoffice's origin, the only one allowed to call the API from a browser (CORS) |
| `AUTH_DATABASE_URL` | PostgreSQL connection URL |
| `ENVIRONMENT_NAME` | `local`, `test`, `demo`, `development` or `production` (`local` enables readable logs and the log file) |
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
docker run -p 8080:8080 \
  -e AUTH_API_PORT=8080 \
  -e AUTH_BACKOFFICE_URL=https://… \
  -e AUTH_DATABASE_URL=postgres://… \
  -e ENVIRONMENT_NAME=production \
  -e SESSION_COOKIE_SECURE=true \
  -e TZ=UTC \
  auth-api
```

The root's `services start` builds and runs this same image in every
environment (see [Database](#database)), with the database as `postgres:5432`
inside the compose network instead of the env file's `localhost` address.

## Scripts

| Script | Description |
|---|---|
| `dev` | Runs the API and restarts it on every change |
| `build` | Builds the API into `dist` |
| `start` | Runs the built API |
| `test` | Runs the tests (the test database must be running; `yarn test-auth-api` at the root starts it) |
| `lint` | Lints the workspace |
| `check-types:all` | Type-checks the workspace |
| `check-types:files` | Type-checks the given files |
| `database:cli` | Opens `psql` on the current environment's database |
| `database:list-migrations` | Lists the migrations and whether they're applied |
| `database:migrate` | Applies the next pending migration |
| `database:migrate-all` | Applies every pending migration |
| `database:rollback` | Reverts the last applied migration |
| `database:seed <seed>` | Runs the given seed |
| `env <command>` | Manages the environments (`env help`) |
