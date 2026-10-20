#!/usr/bin/env bash
# @file service.sh
# @brief Manages the services of the loaded environment.
# @description
#   Each environment that runs in Docker has a docker-compose.<environment>.yml
#   at the root. The environment is loaded by auth-api's env run, which the
#   service npm script goes through.
set -euo pipefail

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: service.sh <service> <action> | list | help

Manages a service of the loaded environment (list prints them).

  <service> start    Starts it (building its image if it has one) and waits
                     until it's healthy
  <service> stop     Stops it (the services it depends on keep running)
  <service> status   Prints whether it's running
  <service> logs     Follows its logs
  <service> clear    Stops it and deletes its data
  list               Prints the environment's services
  help               Prints this help
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

# @description Prints whether a service's container is running.
# @arg $1 string Service.
# @exitcode 1 If it isn't running.
# @stdout running, or down.
print_status() {
  local service="$1"

  if ! run_compose ps --format '{{.State}}' "$service" | grep --color=never running
  then
    printf 'down\n'

    exit 1
  fi
}

# @description Runs an action on a service's container.
# @arg $1 string Service.
# @arg $2 string Action (start, stop, status, logs or clear).
run_service_action() {
  local service="$1"
  local action="$2"

  case "$action" in
    start)
      run_compose up --build --detach --wait "$service"
      ;;
    stop)
      run_compose stop "$service"
      ;;
    status)
      print_status "$service"
      ;;
    logs)
      run_compose logs --follow "$service"
      ;;
    clear)
      run_compose down --volumes "$service"
      ;;
    *)
      fail_with_usage "unknown action: ${action:-<none>}"
      ;;
  esac
}

main() {
  local service="${1:-}"
  local action="${2:-}"

  cd "$(dirname "$0")/.."

  case "$service" in
    help)
      print_usage
      ;;
    "")
      fail_with_usage "a service is required"
      ;;
    list)
      ensure_environment_is_loaded

      run_compose config --services
      ;;
    *)
      ensure_environment_is_loaded
      ensure_service_exists "$service"
      run_service_action "$service" "$action"
      ;;
  esac
}

main "$@"
