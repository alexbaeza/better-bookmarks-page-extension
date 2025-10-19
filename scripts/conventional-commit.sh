#!/bin/bash

# Conventional Commit Helper Script
# This script helps create properly formatted conventional commits

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Conventional Commit Helper${NC}"
echo "=================================="

# Get commit type
echo -e "\n${YELLOW}Select commit type:${NC}"
echo "1) feat     - A new feature"
echo "2) fix      - A bug fix"
echo "3) docs     - Documentation only changes"
echo "4) style    - Changes that do not affect the meaning of the code"
echo "5) refactor - A code change that neither fixes a bug nor adds a feature"
echo "6) perf     - A code change that improves performance"
echo "7) test     - Adding missing tests or correcting existing tests"
echo "8) build    - Changes that affect the build system or external dependencies"
echo "9) ci       - Changes to our CI configuration files and scripts"
echo "10) chore   - Other changes that don't modify src or test files"
echo "11) revert  - Reverts a previous commit"

read -p "Enter choice (1-11): " choice

case $choice in
    1) TYPE="feat" ;;
    2) TYPE="fix" ;;
    3) TYPE="docs" ;;
    4) TYPE="style" ;;
    5) TYPE="refactor" ;;
    6) TYPE="perf" ;;
    7) TYPE="test" ;;
    8) TYPE="build" ;;
    9) TYPE="ci" ;;
    10) TYPE="chore" ;;
    11) TYPE="revert" ;;
    *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
esac

# Get scope (optional)
echo -e "\n${YELLOW}Enter scope (optional, e.g., settings, bookmarks, ui):${NC}"
read -p "Scope: " SCOPE

# Get description
echo -e "\n${YELLOW}Enter commit description:${NC}"
read -p "Description: " DESCRIPTION

# Get body (optional)
echo -e "\n${YELLOW}Enter detailed description (optional):${NC}"
read -p "Body: " BODY

# Get footer (optional)
echo -e "\n${YELLOW}Enter footer (optional, e.g., Closes #123):${NC}"
read -p "Footer: " FOOTER

# Build commit message
COMMIT_MSG="$TYPE"

if [ ! -z "$SCOPE" ]; then
    COMMIT_MSG="$COMMIT_MSG($SCOPE)"
fi

COMMIT_MSG="$COMMIT_MSG: $DESCRIPTION"

if [ ! -z "$BODY" ]; then
    COMMIT_MSG="$COMMIT_MSG

$BODY"
fi

if [ ! -z "$FOOTER" ]; then
    COMMIT_MSG="$COMMIT_MSG

$FOOTER"
fi

# Display the commit message
echo -e "\n${GREEN}Generated commit message:${NC}"
echo "================================"
echo "$COMMIT_MSG"
echo "================================"

# Ask for confirmation
read -p "Do you want to commit with this message? (y/n): " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    # Validate with commitlint
    echo -e "\n${BLUE}Validating commit message...${NC}"
    if echo "$COMMIT_MSG" | npx commitlint; then
        echo -e "${GREEN}✅ Commit message is valid!${NC}"
        echo -e "\n${YELLOW}To commit your changes, run:${NC}"
        echo "git add ."
        echo "git commit -m \"$COMMIT_MSG\""
    else
        echo -e "${RED}❌ Commit message validation failed!${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Commit cancelled.${NC}"
fi
