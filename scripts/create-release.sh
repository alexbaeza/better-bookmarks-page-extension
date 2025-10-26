#!/bin/bash

# Usage:
#   ./scripts/create-release.sh            # build both (default)
#   ./scripts/create-release.sh chrome     # build only Chrome package
#   ./scripts/create-release.sh firefox    # build only Firefox package

TARGET=${1:-all}

echo "🚀 Starting release process..."
echo ""
echo "📦 Building app"
pnpm build || exit 1

echo ""
echo "📋 Preparing release artifacts"
VERSION_STRING='"version": '
CURR_VERSION=$(./scripts/current-version-check.sh)
mkdir -p release
echo "   Version: $CURR_VERSION"
echo "   Output directory: release/"
echo ""

package_firefox() {
  echo "🦊 Creating Firefox release"
  cp packages/app/build/manifest-firefox.json packages/app/build/manifest.json

  echo "   Setting version to $CURR_VERSION"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\"/" packages/app/build/manifest.json
  else
    sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\"/" packages/app/build/manifest.json
  fi

  echo "   Packaging extension..."
  (cd packages/app/build && zip -r ../../../release/extension-firefox-"$CURR_VERSION".zip ./* -x 'manifest-*' 'release/*' > /dev/null)
  
  ZIP_SIZE=$(du -h release/extension-firefox-"$CURR_VERSION".zip | cut -f1)
  echo "   ✓ Created: release/extension-firefox-$CURR_VERSION.zip ($ZIP_SIZE)"
}

package_chrome() {
  echo "🌐 Creating Chrome release"
  cp packages/app/build/manifest-chrome.json packages/app/build/manifest.json

  echo "   Setting version to $CURR_VERSION"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\"/" packages/app/build/manifest.json
  else
    sed -i -e "s/\($VERSION_STRING\).*/\1\"$CURR_VERSION\"/" packages/app/build/manifest.json
  fi

  echo "   Packaging extension..."
  (cd packages/app/build && zip -r ../../../release/extension-chrome-"$CURR_VERSION".zip ./* -x 'manifest-*' 'release/*' > /dev/null)
  
  ZIP_SIZE=$(du -h release/extension-chrome-"$CURR_VERSION".zip | cut -f1)
  echo "   ✓ Created: release/extension-chrome-$CURR_VERSION.zip ($ZIP_SIZE)"
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

echo ""
echo "✅ Release completed successfully!"
echo ""
echo "📦 Built packages:"
ls -lh release/*.zip 2>/dev/null | awk '{print "   - " $9 " (" $5 ")"}'
