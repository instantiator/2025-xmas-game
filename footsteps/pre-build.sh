#!/bin/bash

set -e
set -o pipefail

echo "Generating license-report.json..."
npx --yes license-report --json > src/assets/license-report.json
echo

echo "Generating schema for GameRepository..."
npx --yes typescript-json-schema tsconfig.schema.json GameRepository --out src/assets/game-repository-schema.json --required
echo

echo "Generating schema for GameData..."
npx --yes typescript-json-schema tsconfig.schema.json GameData --out src/assets/game-data-schema.json --required
echo

echo "Pre-build steps completed."
echo
