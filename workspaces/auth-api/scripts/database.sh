#!/usr/bin/env bash
# @file database.sh
# @brief Manages the auth-api databases.
# @description
#   Container commands (start, stop, status, logs, clear) act on the docker
#   compose database of the given environment (local or test).
#   Database commands (cli, migrate, migrate-all, rollback, list-migrations,
#   seed) act on the database of .env.<environment>, or of .env when no
#   environment is given (an argument starting with "-" is passed through
#   instead). seed takes the seed name before the environment.
set -euo pipefail

readonly COMPOSE_FILE="docker-compose.yml"
readonly KYSELY_CONFIG="src/database/kysely.config.ts"
readonly LOCAL_VOLUME="auth-api_postgres_data"

# @description Prints an error and exits.
# @arg $1 string Error message.
# @exitcode 1 Always.
# @stderr The error message.
fail() {
  printf 'Error: %s\n' "$1" >&2

  exit 1
}

# @description Runs docker compose on the auth-api compose file, with every
#   profile enabled.
# @arg $@ string docker compose arguments.
compose() {
  docker compose -f "$COMPOSE_FILE" --profile test "$@"
}

# @description Prints the compose service of the given environment.
# @arg $1 string Environment (local or test).
# @exitcode 1 If the environment is neither local nor test.
# @stdout The service name.
get_service_name() {
  case "${1:-}" in
    local)
      printf 'postgres\n'
      ;;
    test)
      printf 'postgres-test\n'
      ;;
    *)
      fail "the environment must be local or test"
      ;;
  esac
}

# @description Exports the variables of the env file of the given environment.
# @arg $1 string Environment (empty for .env).
# @exitcode 1 If the env file doesn't exist.
load_env_file() {
  local env_file=".env${1:+.$1}"

  if [[ ! -f "$env_file" ]]
  then
    fail "$env_file does not exist"
  fi

  set -a

  source "$env_file"

  set +a
}

# @description Runs a container command on the database of an environment.
# @arg $1 string Command (start, stop, status, logs or clear).
# @arg $2 string Environment (local or test).
run_container_command() {
  local command="$1"
  local service_name

  service_name="$(get_service_name "${2:-}")"

  case "$command" in
    start)
      compose up --detach --wait "$service_name"
      ;;
    stop)
      compose stop "$service_name"
      ;;
    status)
      if ! compose ps --format '{{.State}}' "$service_name" | grep --color=never running
      then
        printf 'down\n'

        exit 1
      fi
      ;;
    logs)
      compose logs --follow "$service_name"
      ;;
    clear)
      # The test database lives in a tmpfs, so removing its container clears it
      compose rm --force --stop --volumes "$service_name"

      if [[ "$service_name" == "postgres" ]]
      then
        docker volume rm --force "$LOCAL_VOLUME" > /dev/null
      fi
      ;;
  esac
}

# @description Runs a kysely-ctl migrate subcommand.
# @arg $1 string Subcommand (up, latest, down or list).
# @arg $@ string Extra kysely-ctl arguments.
run_kysely_migrate() {
  local subcommand="$1"

  shift

  kysely migrate "$subcommand" --config "$KYSELY_CONFIG" "$@"
}

# @description Runs a database command on the database of an environment.
# @arg $1 string Command (cli, migrate, migrate-all, rollback, list-migrations or seed).
# @arg $2 string Seed name (seed only).
# @arg $3 string Optional environment (uses .env when missing).
# @arg $@ string Extra arguments for psql or kysely-ctl.
# @exitcode 1 If seed is given no seed name.
run_database_command() {
  local command="$1"
  local environment=""
  local seed_name=""

  shift

  if [[ "$command" == "seed" ]]
  then
    seed_name="${1:-}"

    if [[ -z "$seed_name" || "$seed_name" == -* ]]
    then
      fail "seed requires a seed name"
    fi

    shift
  fi

  if (( $# > 0 )) && [[ "$1" != -* ]]
  then
    environment="$1"

    shift
  fi

  load_env_file "$environment"

  case "$command" in
    cli)
      psql "$AUTH_DATABASE_URL" "$@"
      ;;
    migrate)
      run_kysely_migrate up "$@"
      ;;
    migrate-all)
      run_kysely_migrate latest "$@"
      ;;
    rollback)
      run_kysely_migrate down "$@"
      ;;
    list-migrations)
      run_kysely_migrate list "$@"
      ;;
    seed)
      kysely seed run --specific "$seed_name" --config "$KYSELY_CONFIG" "$@"
      ;;
  esac
}

main() {
  local command="${1:-}"

  cd "$(dirname "$0")/.."

  case "$command" in
    start | stop | status | logs | clear)
      run_container_command "$@"
      ;;
    cli | migrate | migrate-all | rollback | list-migrations | seed)
      run_database_command "$@"
      ;;
    *)
      fail "unknown command: ${command:-<none>}"
      ;;
  esac
}

main "$@"
