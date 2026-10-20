#!/usr/bin/env bash
# @file test-auth-api.sh
# @brief Runs auth-api's tests against its test database.
# @description
#   Loads auth-api's test environment, starts its database, and runs auth-api's
#   tests (which migrate it and empty it before each test).
set -euo pipefail

readonly AUTH_API_ENV_FILE="workspaces/auth-api/.env.test"

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: test-auth-api.sh [-h | --help]

Runs auth-api's tests against its test database, stopping it afterwards. Needs
Docker, and port 5433 free.

  -h, --help   Prints this help
EOF
}

# @description Stops the test database, so its port is free and the next run
#   starts with an empty database.
# @noargs
stop_test_database() {
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

  yarn build-packages

  trap stop_test_database EXIT

  yarn service postgres start
  yarn auth-api:run test
}

main "$@"
