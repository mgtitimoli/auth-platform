#!/usr/bin/env bash

set -euo pipefail

orderedPackageNames=(
  "utils"
)

for packageName in "${orderedPackageNames[@]}"
do
  echo "Building package: ${packageName}"

  yarn workspace "@mgtitimoli/${packageName}" build
done
