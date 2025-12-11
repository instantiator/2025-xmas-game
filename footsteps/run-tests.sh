#!/bin/bash

set -e
set -o pipefail

./validate-repository.sh src/assets/game-repository.json

npx --yes vitest run