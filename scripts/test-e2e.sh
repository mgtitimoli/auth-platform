#!/usr/bin/env bash
# @file test-e2e.sh
# @brief Runs the backoffice's e2e tests against auth-api's test environment.
# @description
#   The only place that combines the workspaces: it loads auth-api's test
#   environment, starts its database and API container, and runs the
#   backoffice's e2e tests against them.
set -euo pipefail

readonly AUTH_API_ENV_FILE="workspaces/auth-api/.env.test"

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: test-e2e.sh [-h | --help]

Runs the backoffice's e2e tests against auth-api's test environment (its
database and API container). Needs Docker, and ports 3000, 8080 and 5433 free.

  -h, --help   Prints this help
EOF
}

# @description Stops the API container, freeing its port for yarn watch.
# @noargs
stop_api_container() {
  yarn auth-api:run container stop
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
  yarn auth-api:run database start
  yarn auth-api:run database migrate-all

  trap stop_api_container EXIT

  yarn auth-api:run container start
  yarn auth-backoffice:run test:e2e
}

main "$@"
