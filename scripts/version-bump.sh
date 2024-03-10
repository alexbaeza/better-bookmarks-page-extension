#!/bin/bash

UPDATE_TYPE=$1

CURR_VERSION=$(./scripts/current-version-check.sh)
NEXT_VERSION=$(./scripts/release-version-check.sh $UPDATE_TYPE)

echo "Updating version from $CURR_VERSION -> $NEXT_VERSION"
VERSION_STRING='"version": '
sed -i '' "s/\($VERSION_STRING\).*/\1\"$NEXT_VERSION\",/" ./package.json
