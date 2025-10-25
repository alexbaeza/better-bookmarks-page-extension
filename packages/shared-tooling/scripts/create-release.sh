#!/bin/bash

# Usage:
#   ./scripts/create-release.sh            # build both (default)
#   ./scripts/create-release.sh chrome     # build only Chrome package
#   ./scripts/create-release.sh firefox    # build only Firefox package

TARGET=${1:-all}

echo "Building app"
pnpm --filter @better-bookmarks/app build || exit 1

echo "Preparing release artifacts"
VERSION_STRING='"version": '
CURR_VERSION=$(./packages/shared-tooling/scripts/current-version-check.sh)
mkdir -p packages/app/release

package_firefox() {
  echo "Creating Firefox release"
  cp packages/app/build/manifest-firefox.json packages/app/build/manifest.json

  echo "Setting Firefox version to $CURR_VERSION"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" packages/app/build/manifest.json
  else
    sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" packages/app/build/manifest.json
  fi

  echo "Bundling Firefox release"
  (cd packages/app/build && zip -r ../release/extension-firefox-"$CURR_VERSION".zip ./* -x 'manifest-*' 'release/*')
}

package_chrome() {
  echo "Creating Chrome release"
  cp packages/app/build/manifest-chrome.json packages/app/build/manifest.json

  echo "Setting Chrome version to $CURR_VERSION"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" packages/app/build/manifest.json
  else
    sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" packages/app/build/manifest.json
  fi

  echo "Bundling Chrome release"
  (cd packages/app/build && zip -r ../release/extension-chrome-"$CURR_VERSION".zip ./* -x 'manifest-*' 'release/*')
}

case "$TARGET" in
  firefox)
    package_firefox
    ;;
  chrome)
    package_chrome
    ;;
  *)
    package_firefox
    package_chrome
    ;;
esac

echo "Completed successfully"
