#!/usr/bin/env bash
# @file build-packages.sh
# @brief Builds the packages the other workspaces depend on.
# @description
#   Builds them in dependency order: each package consumes the dist of the
#   ones before it.
set -euo pipefail

readonly ORDERED_PACKAGE_NAMES=(
  "utils"
  "auth-domain"
  "auth-api-tools"
)

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: build-packages.sh [-h | --help]

Builds the packages the other workspaces depend on, in dependency order.

  -h, --help   Prints this help
EOF
}

main() {
  local package_name

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

  for package_name in "${ORDERED_PACKAGE_NAMES[@]}"
  do
    printf 'Building package: %s\n' "$package_name"

    yarn workspace "@mgtitimoli/$package_name" build
  done
}

main "$@"
