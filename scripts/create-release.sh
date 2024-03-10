#!/bin/bash

RELEASE_TYPE=$1

echo "Bumping version"
./scripts/version-bump.sh $RELEASE_TYPE

echo "Building app"
yarn build

echo "Updating manifests with correct version"
VERSION_STRING='"version": '
CURR_VERSION=$(./scripts/current-version-check.sh)

cd build || exit

echo "Creating Firefox release"
mv manifest-firefox.json manifest.json

echo "Setting Firefox version"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" manifest.json
else
  sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" manifest.json
fi

echo "Bundling Firefox release"
zip -r ./release/extension-firefox-$CURR_VERSION.zip ./* -x 'manifest-*' -x 'release/*'

echo "Creating Chrome release"
mv manifest-chrome.json manifest.json
echo "Setting Chrome version"
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" manifest.json
else
  sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" manifest.json
fi

echo "Bundling Chrome release"
zip -r ./release/extension-chrome-$CURR_VERSION.zip ./* -x 'manifest-*' -x 'release/*'

echo "Completed successfully"
