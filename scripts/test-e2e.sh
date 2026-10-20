#!/usr/bin/env bash
# @file test-e2e.sh
# @brief Runs the backoffice's e2e tests against auth-api's test environment.
# @description
#   Loads auth-api's test environment, starts its services (the migrated
#   database, the API and the backoffice) and runs the backoffice's e2e tests
#   against them.
set -euo pipefail

readonly AUTH_API_ENV_FILE="workspaces/auth-api/.env.test"

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: test-e2e.sh [-h | --help]

Runs the backoffice's e2e tests against the test environment's services (the
migrated database, the API and the backoffice), stopping them afterwards, so
every run starts with an empty database. Needs Docker, and ports 3000, 8080
and 5433 free.

  -h, --help   Prints this help
EOF
}

# @description Stops the test environment's services: their ports are free for
#   yarn dev again, and the next run starts with an empty database.
# @noargs
stop_test_environment() {
  yarn services stop
}

main() {
  case "${1:-}" in
    -h | --help)
      print_usage

      return
      ;;
    "")
      ;;
    *)
      printf 'Error: unknown option: %s\n' "$1" >&2

      print_usage >&2

      exit 1
      ;;
  esac

  cd "$(dirname "$0")/.."

  set -a

  source "$AUTH_API_ENV_FILE"

  set +a

  trap stop_test_environment EXIT

  yarn services start
  yarn auth-backoffice:run test-e2e
}

main "$@"
