#!/usr/bin/env bash
# @file environment.sh
# @brief Manages the auth-api environments (the .env.<name> files).
# @description
#   .env is a symlink to the developer's current environment (use). Other
#   scripts never choose an environment: they run through run, which gives them
#   the one asked for, the one already loaded, or .env's.
set -euo pipefail

# @description Prints how to use this script.
# @noargs
# @stdout The usage.
print_usage() {
  cat <<'EOF'
Usage: environment.sh <command> [arguments]

  list                                       Lists the environments
  use <name>                                 Makes .env point to .env.<name>
  which                                      Prints the environment .env points to
  run [--environment <name>] <command...>    Runs a command in .env.<name>, or
                                             else in the loaded environment, or
                                             else in .env's
  help                                       Prints this help
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

# @description Prints an error and exits.
# @arg $1 string Error message.
# @exitcode 1 Always.
# @stderr The error message.
fail() {
  printf 'Error: %s\n' "$1" >&2

  exit 1
}

# @description Fails unless the env file exists.
# @arg $1 string Env file.
# @exitcode 1 If it doesn't exist.
ensure_env_file_exists() {
  local env_file="$1"

  if [[ ! -f "$env_file" ]]
  then
    fail "$env_file does not exist"
  fi
}

# @description Exports the variables of an env file.
# @arg $1 string Env file.
# @exitcode 1 If it doesn't exist.
load_env_file() {
  local env_file="$1"

  ensure_env_file_exists "$env_file"

  set -a

  source "$env_file"

  set +a
}

# @description Prints the name of every environment.
# @noargs
# @stdout One name per line.
list_environments() {
  local env_file

  for env_file in .env.*
  do
    printf '%s\n' "${env_file#.env.}"
  done
}

# @description Makes .env point to the env file of the given environment.
# @arg $1 string Environment name.
# @exitcode 1 If the environment has no env file.
use_environment() {
  local environment_name="${1:-}"

  if [[ -z "$environment_name" ]]
  then
    fail_with_usage "use requires an environment name"
  fi

  ensure_env_file_exists ".env.$environment_name"

  ln -sfv ".env.$environment_name" .env
}

# @description Prints the name of the environment .env points to.
# @noargs
# @exitcode 1 If .env doesn't exist.
# @stdout The environment name.
print_current_environment() {
  local env_file

  if [[ ! -L .env ]]
  then
    fail ".env does not exist (see use)"
  fi

  env_file="$(readlink .env)"

  printf '%s\n' "${env_file#.env.}"
}

# @description Runs a command in an environment: the given one, or else the
#   loaded one, or else .env's.
# @option --environment <name> Runs it in .env.<name>.
# @arg $@ string The command.
# @exitcode 1 If there's no command or the env file doesn't exist.
run_in_environment() {
  if [[ "${1:-}" == "--environment" ]]
  then
    if [[ -z "${2:-}" ]]
    then
      fail_with_usage "--environment requires an environment name"
    fi

    load_env_file ".env.$2"

    shift 2
  elif [[ -z "${ENVIRONMENT_NAME:-}" ]]
  then
    load_env_file .env
  fi

  if (( $# == 0 ))
  then
    fail_with_usage "run requires a command"
  fi

  exec "$@"
}

main() {
  local command="${1:-}"

  cd "$(dirname "$0")/.."

  if (( $# > 0 ))
  then
    shift
  fi

  case "$command" in
    list)
      list_environments
      ;;
    use)
      use_environment "$@"
      ;;
    which)
      print_current_environment
      ;;
    run)
      run_in_environment "$@"
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
