#!/usr/bin/env bash
# @file services.sh
# @brief Manages the services of the loaded environment.
# @description
#   Each environment that runs in Docker has a docker-compose.<environment>.yml
#   at the root. The environment is loaded by auth-api's env run, which the
#   services npm script goes through.
set -euo pipefail

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: services.sh <command> [--service <service>]...

Manages the services of the loaded environment: all of them, or the ones
given with --service (list prints them).

  start    Starts them (building their images) and waits until they're ready
  stop     Stops them
  status   Prints each one's state
  logs     Follows their logs
  clear    Stops them and deletes their data
  list     Prints the environment's services
  help     Prints this help
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

# @description Fails unless an environment is loaded.
# @noargs
# @exitcode 1 If none is.
ensure_environment_is_loaded() {
  : "${ENVIRONMENT_NAME:?no environment loaded (run it through the auth-api env run script)}"
}

# @description Runs docker compose on the compose file of the loaded environment.
# @arg $@ string docker compose arguments.
# @exitcode 1 If the environment has no compose file.
run_compose() {
  local compose_file="docker-compose.$ENVIRONMENT_NAME.yml"

  if [[ ! -f "$compose_file" ]]
  then
    printf 'Error: the %s environment has no compose file\n' "$ENVIRONMENT_NAME" >&2

    exit 1
  fi

  docker compose -f "$compose_file" "$@"
}

# @description Fails unless the loaded environment has the service.
# @arg $1 string Service.
# @exitcode 1 If it doesn't.
# @stderr The error message and the usage.
ensure_service_exists() {
  local service="$1"

  if ! run_compose config --services | grep --quiet --line-regexp -- "$service"
  then
    fail_with_usage "the $ENVIRONMENT_NAME environment has no service: $service"
  fi
}

# @description Prints each service's state.
# @arg $@ string Services (all of them when none is given).
# @stdout One line per service: its name and state, or down.
print_statuses() {
  local services=("$@")
  local service
  local state

  if (( ${#services[@]} == 0 ))
  then
    mapfile -t services < <(run_compose config --services)
  fi

  for service in "${services[@]}"
  do
    state="$(run_compose ps --all --format '{{.State}}' "$service")"

    printf '%-18s %s\n' "$service" "${state:-down}"
  done
}

# @description Runs a command on the given services, or on all of them.
# @arg $1 string Command (start, stop, status, logs or clear).
# @arg $@ string Services (all of them when none is given).
run_command() {
  local command="$1"

  shift

  case "$command" in
    start)
      run_compose up --build --detach --wait "$@"
      ;;
    stop)
      run_compose stop "$@"
      ;;
    status)
      print_statuses "$@"
      ;;
    logs)
      run_compose logs --follow "$@"
      ;;
    clear)
      run_compose down --volumes "$@"
      ;;
  esac
}

main() {
  local command="${1:-}"
  local service
  local services=()

  cd "$(dirname "$0")/.."

  case "$command" in
    help)
      print_usage

      return
      ;;
    list)
      ensure_environment_is_loaded

      run_compose config --services

      return
      ;;
    start | stop | status | logs | clear)
      shift
      ;;
    "")
      fail_with_usage "a command is required"
      ;;
    *)
      fail_with_usage "unknown command: $command"
      ;;
  esac

  while (( $# > 0 ))
  do
    case "$1" in
      --service)
        if (( $# < 2 ))
        then
          fail_with_usage "--service requires a service"
        fi

        services+=("$2")

        shift 2
        ;;
      *)
        fail_with_usage "unknown option: $1"
        ;;
    esac
  done

  ensure_environment_is_loaded

  for service in "${services[@]}"
  do
    ensure_service_exists "$service"
  done

  run_command "$command" "${services[@]}"
}

main "$@"
