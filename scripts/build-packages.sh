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
)

main() {
  local package_name

  for package_name in "${ORDERED_PACKAGE_NAMES[@]}"
  do
    printf 'Building package: %s\n' "$package_name"

    yarn workspace "@mgtitimoli/$package_name" build
  done
}

main "$@"
