#!/bin/bash

RELEASE_TYPE=$1

echo "Bumping version"
./scripts/version-bump.sh "$RELEASE_TYPE"

echo "Building app"
yarn build

echo "Updating manifests with correct version"
VERSION_STRING='"version": '
CURR_VERSION=$(./scripts/current-version-check.sh)
mkdir release

echo "Creating Firefox release"
mv build/manifest-firefox.json build/manifest.json

echo "Setting Firefox version"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" build/manifest.json
else
  sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" build/manifest.json
fi

echo "Bundling Firefox release"
cd build && zip -r ./release/extension-firefox-"$CURR_VERSION".zip ./* -x 'manifest-*' 'release/*' && cd ..

echo "Creating Chrome release"
mv build/manifest-chrome.json build/manifest.json

echo "Setting Chrome version"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" build/manifest.json
else
  sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" build/manifest.json
fi

echo "Bundling Chrome release"
cd build && zip -r ./release/extension-chrome-"$CURR_VERSION".zip ./* -x 'manifest-*' 'release/*' && cd ..

echo "Completed successfully"
