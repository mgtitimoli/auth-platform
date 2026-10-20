#!/usr/bin/env bash
# @file test-e2e.sh
# @brief Runs the backoffice's e2e tests against auth-api's test environment.
# @description
#   Loads auth-api's test environment, starts its database and API container,
#   and runs the backoffice's e2e tests against them.
set -euo pipefail

readonly AUTH_API_ENV_FILE="workspaces/auth-api/.env.test"

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: test-e2e.sh [-h | --help]

Runs the backoffice's e2e tests against auth-api's test environment (its
database and API container), stopping it afterwards, so every run starts with
an empty database. Needs Docker, and ports 3000, 8080 and 5433 free.

  -h, --help   Prints this help
EOF
}

# @description Stops the API container and the test database: its port is free
#   for yarn dev again, and the next run starts with an empty database.
# @noargs
stop_test_environment() {
  yarn service auth-api stop
  yarn service postgres stop
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

  export NEXT_PUBLIC_AUTH_API_URL="http://localhost:$AUTH_API_PORT"

  yarn build-packages

  trap stop_test_environment EXIT

  yarn service postgres start
  yarn auth-api:run database:migrate-all
  yarn service auth-api start
  yarn auth-backoffice:run test-e2e
}

main "$@"
