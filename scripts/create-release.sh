#!/bin/bash

# Usage:
#   ./scripts/create-release.sh            # build both (default)
#   ./scripts/create-release.sh chrome     # build only Chrome package
#   ./scripts/create-release.sh firefox    # build only Firefox package

TARGET=${1:-all}
CURR_VERSION=$(jq -r '.version' package.json)
BUILD_DIR="packages/app/build"
MANIFEST_FILE="${BUILD_DIR}/manifest.json"

echo "🚀 Starting release process..."
echo ""
echo "📦 Building app"
pnpm build || exit 1

echo ""
echo "📋 Preparing release artifacts"

mkdir -p release
echo "   Version: $CURR_VERSION"
echo "   Output directory: release/"
echo ""

package_firefox() {
  echo "🦊 Creating Firefox release"
  cp "scripts/manifest-firefox.json" "$MANIFEST_FILE"

  echo "   Setting version to $CURR_VERSION"
  jq --arg version "$CURR_VERSION" '.version = $version' "$MANIFEST_FILE" > "${MANIFEST_FILE}.tmp" && mv "${MANIFEST_FILE}.tmp" "$MANIFEST_FILE"

  echo "   Packaging extension..."
  (cd "$BUILD_DIR" && zip -r "../../../release/extension-firefox-${CURR_VERSION}.zip" ./* -x 'manifest-*' 'release/*' > /dev/null)
  
  ZIP_SIZE=$(du -h "release/extension-firefox-${CURR_VERSION}.zip" | cut -f1)
  echo "   ✓ Created: release/extension-firefox-${CURR_VERSION}.zip ($ZIP_SIZE)"
}

package_chrome() {
  echo "🌐 Creating Chrome release"
  cp "scripts/manifest-chrome.json" "$MANIFEST_FILE"

  echo "   Setting version to $CURR_VERSION"
  jq --arg version "$CURR_VERSION" '.version = $version' "$MANIFEST_FILE" > "${MANIFEST_FILE}.tmp" && mv "${MANIFEST_FILE}.tmp" "$MANIFEST_FILE"

  echo "   Packaging extension..."
  (cd "$BUILD_DIR" && zip -r "../../../release/extension-chrome-${CURR_VERSION}.zip" ./* -x 'manifest-*' 'release/*' > /dev/null)
  
  ZIP_SIZE=$(du -h "release/extension-chrome-${CURR_VERSION}.zip" | cut -f1)
  echo "   ✓ Created: release/extension-chrome-${CURR_VERSION}.zip ($ZIP_SIZE)"
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
