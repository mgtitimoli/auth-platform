#!/usr/bin/env bash
# @file compose.sh
# @brief docker compose on the loaded environment's compose file.
# @description
#   Sourced by the scripts that manage containers (never run on its own). Each
#   environment that runs in Docker has a docker-compose.<environment>.yml.

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
