#!/usr/bin/env bash
# @file database.sh
# @brief Manages the database of the loaded environment.
# @description
#   The environment is loaded by environment.sh run.
set -euo pipefail

readonly KYSELY_CONFIG="src/database/kysely.config.ts"

source "$(dirname "$0")/compose.sh"

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: database.sh <command> [arguments]

Acts on the database of the loaded environment.

  start                            Starts the database and waits until it's ready
  stop                             Stops the database (local keeps its data)
  status                           Prints whether the database is running
  logs                             Follows the database's logs
  clear                            Stops the database and deletes its data
  cli [psql arguments]             Opens psql
  migrate [kysely arguments]       Applies the next pending migration
  migrate-all [kysely arguments]   Applies every pending migration
  rollback [kysely arguments]      Reverts the last applied migration
  list-migrations                  Lists the migrations and whether they're applied
  seed <seed> [kysely arguments]   Runs the given seed
  help                             Prints this help
EOF
}

# @description Prints an error and the usage, and exits.
# @arg $1 string Error message.
# @exitcode 1 Always.
# @stderr The error message and the usage.
fail_with_usage() {
  printf 'Error: %s\n' "$1" >&2

  print_usage >&2

  exit 1
}

# @description Runs a container command on the environment's database.
# @arg $1 string Command (start, stop, status, logs or clear).
run_container_command() {
  local command="$1"

  case "$command" in
    start)
      run_compose up --detach --wait postgres
      ;;
    stop)
      run_compose stop postgres
      ;;
    status)
      if ! run_compose ps --format '{{.State}}' postgres | grep --color=never running
      then
        printf 'down\n'

        exit 1
      fi
      ;;
    logs)
      run_compose logs --follow postgres
      ;;
    clear)
      run_compose rm --force --stop --volumes postgres

      # The compose project is auth-api-<environment>; environments that keep
      # their data (local) do it in this volume
      docker volume rm --force "auth-api-${ENVIRONMENT_NAME}_postgres_data" > /dev/null
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

# @description Runs a database command on AUTH_DATABASE_URL.
# @arg $1 string Command (cli, migrate, migrate-all, rollback, list-migrations or seed).
# @arg $2 string Seed name (seed only).
# @arg $@ string Extra arguments for psql or kysely-ctl.
# @exitcode 1 If seed is given no seed name.
run_database_command() {
  local command="$1"
  local seed_name=""

  shift

  if [[ "$command" == "seed" ]]
  then
    seed_name="${1:-}"

    if [[ -z "$seed_name" || "$seed_name" == -* ]]
    then
      fail_with_usage "seed requires a seed name"
    fi

    shift
  fi

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
      : "${ENVIRONMENT_NAME:?no environment loaded (run it through environment.sh run)}"

      run_container_command "$@"
      ;;
    cli | migrate | migrate-all | rollback | list-migrations | seed)
      : "${AUTH_DATABASE_URL:?no environment loaded (run it through environment.sh run)}"

      run_database_command "$@"
      ;;
    help)
      print_usage
      ;;
    *)
      fail_with_usage "unknown command: ${command:-<none>}"
      ;;
  esac
}

main "$@"
