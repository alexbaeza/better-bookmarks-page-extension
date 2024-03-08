#!/bin/bash

RELEASE_TYPE=$1

echo "Bumping version"
./scripts/version-bump.sh $RELEASE_TYPE

echo "Building app"
yarn build

echo "Updating manifests with correct version"
VERSION_STRING='"version": '
CURR_VERSION=$(awk -F \" '/"version": ".+"/ { print $4; exit; }' package.json)

echo "Creating Firefox release"
mv build/manifest-firefox.json build/manifest.json
echo "Setting Firefox version"
sed -i '' "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" build/manifest.json

echo "Bundling Firefox release"

pushd build || exit
zip -r ./release/extension-firefox-$CURR_VERSION.zip ./* -x 'manifest-*' -x 'release/*'
popd || exit

echo "Creating Chrome release"
mv build/manifest-chrome.json build/manifest.json
echo "Setting Chrome version"
sed -i '' "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\",/" build/manifest.json

echo "Bundling Chrome release"
pushd build || exit
zip -r ./release/extension-chrome-$CURR_VERSION.zip ./* -x 'manifest-*' -x 'release/*'
popd || exit

echo "Completed successfully"
