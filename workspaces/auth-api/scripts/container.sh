#!/usr/bin/env bash
# @file container.sh
# @brief Manages the auth-api container of the loaded environment.
# @description
#   The environment is loaded by environment.sh run.
set -euo pipefail

source "$(dirname "$0")/compose.sh"

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: container.sh <command>

Manages the auth-api container of the loaded environment.

  start   Builds the image and starts the container (and its database),
          waiting until it's healthy
  stop    Stops the container
  help    Prints this help
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

main() {
  local command="${1:-}"

  cd "$(dirname "$0")/.."

  case "$command" in
    start)
      : "${ENVIRONMENT_NAME:?no environment loaded (run it through environment.sh run)}"

      run_compose up --build --detach --wait auth-api
      ;;
    stop)
      : "${ENVIRONMENT_NAME:?no environment loaded (run it through environment.sh run)}"

      run_compose stop auth-api
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
