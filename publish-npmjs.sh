#!/bin/bash

# Publish to npmjs.org script
# This script helps publish the CLI to the public npm registry

set -e

echo "🚀 AY Claude CLI - npmjs.org Publication Helper"
echo "================================================"
echo ""

# Check if we're in the CLI directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Please run this script from the cli/ directory"
    exit 1
fi

# Check if npm is logged in to npmjs.org
if ! npm whoami --registry=https://registry.npmjs.org/ &> /dev/null; then
    echo "⚠️  You're not logged in to npmjs.org"
    echo "   Run: npm login --registry=https://registry.npmjs.org/"
    exit 1
fi

echo "✅ npm account: $(npm whoami --registry=https://registry.npmjs.org/)"
echo ""

# Check package name
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo "📦 Package name: $PACKAGE_NAME"
echo ""

# Check if package name is available (for new packages)
if npm view "$PACKAGE_NAME" &> /dev/null; then
    echo "ℹ️  Package already exists on npmjs.org"
    echo "   This will publish a new version"
else
    echo "✅ Package name is available"
fi

# Build
echo ""
echo "🔨 Building package..."
npm run build
echo "✅ Build complete"

# Dry run
echo ""
echo "📦 Checking what will be published..."
npm pack --dry-run | head -20
echo ""

# Confirm
read -p "Ready to publish to npmjs.org? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publication cancelled"
    exit 0
fi

# Publish
echo ""
echo "🚀 Publishing to npmjs.org..."
npm publish --registry=https://registry.npmjs.org/

echo ""
echo "✅ Published successfully!"
echo ""
echo "📦 Package: $PACKAGE_NAME"
echo "🔗 npm: https://www.npmjs.com/package/$PACKAGE_NAME"
echo ""
echo "🧪 Test installation:"
echo "   npm install -g $PACKAGE_NAME"
echo "   ay-claude --version"
echo ""
