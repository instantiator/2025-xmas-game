#!/bin/bash

set -e
set -o pipefail

echo "Generating schema for GameRepository..."
npx --yes typescript-json-schema tsconfig.schema.json GameRepository --out public/game-repository-schema.json --required
echo

echo "Generating schema for GameData..."
npx --yes typescript-json-schema tsconfig.schema.json GameData --out public/game-data-schema.json --required
echo
