#!/bin/bash

UPDATE_TYPE=$1
CURR_VERSION=$(./scripts/current-version-check.sh)

VERSION_DIFF="0.0.1"

case "$UPDATE_TYPE" in
"major")
  VERSION_DIFF="1.0"
  ;;
"minor")
  VERSION_DIFF="0.1"
  ;;
"patch")
  VERSION_DIFF="0.0.1"
  ;;
esac

NEXT_VERSION=$(awk -v versionDiff=$VERSION_DIFF -F. -f ./scripts/bump.awk OFS=. <<<"$CURR_VERSION")

echo $NEXT_VERSION
