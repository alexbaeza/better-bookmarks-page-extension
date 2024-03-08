#!/bin/bash

UPDATE_TYPE=$1
VERSION_STRING='"version": '
CURR_VERSION=$(awk -F \" '/"version": ".+"/ { print $4; exit; }' package.json)

VERSION_DIFF="0.0.1"

case "$UPDATE_TYPE" in
"major")
  echo "Updating Major Version"
  VERSION_DIFF="1.0"
  ;;
"minor")
  echo "Updating Minor Version"
  VERSION_DIFF="0.1"
  ;;
"patch")
  echo "Updating Patch Version"
  VERSION_DIFF="0.0.1"
  ;;
esac

NEXT_VERSION=$(awk -v versionDiff=$VERSION_DIFF -F. -f ./scripts/bump.awk OFS=. <<<"$CURR_VERSION")
echo "Bumping version from $CURR_VERSION -> $NEXT_VERSION"
sed -i '' "s/\($VERSION_STRING\).*/\1\"$NEXT_VERSION\",/" package.json
