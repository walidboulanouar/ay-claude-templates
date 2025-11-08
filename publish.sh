#!/bin/bash

# NPM Publication Script for Claude Skills CLI
# This script helps you publish the CLI to npm

set -e

echo "🚀 Claude Skills CLI - NPM Publication Helper"
echo "=============================================="
echo ""

# Check if we're in the CLI directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Please run this script from the cli/ directory"
    exit 1
fi

# Check if npm is logged in
if ! npm whoami &> /dev/null; then
    echo "⚠️  You're not logged in to npm"
    echo "   Run: npm login"
    exit 1
fi

echo "✅ npm account: $(npm whoami)"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git not initialized"
    read -p "Initialize git repository? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git init
        git add .
        git commit -m "Initial commit: Claude Skills CLI v1.0.0"
        echo "✅ Git initialized"
    fi
fi

# Check if remote is set
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  Git remote not set"
    echo "   Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/claude-skills-cli.git"
    echo ""
    read -p "Add remote now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "GitHub username/organization: " github_user
        git remote add origin "https://github.com/${github_user}/claude-skills-cli.git"
        echo "✅ Remote added"
    fi
fi

# Update package.json with GitHub URLs if needed
GITHUB_USER=$(git remote get-url origin 2>/dev/null | sed -n 's/.*github.com[:/]\([^/]*\).*/\1/p' || echo "")
if [ -n "$GITHUB_USER" ]; then
    echo "📝 Updating package.json with GitHub URLs..."
    # This would require sed or jq - for now, manual update needed
    echo "   Please update package.json repository URLs manually"
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
read -p "Ready to publish? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publication cancelled"
    exit 0
fi

# Publish
echo ""
echo "🚀 Publishing to npm..."
npm publish --access public

echo ""
echo "✅ Published successfully!"
echo ""
echo "📦 Package: @claude-skills/cli"
echo "🔗 npm: https://www.npmjs.com/package/@claude-skills/cli"
echo ""
echo "🧪 Test installation:"
echo "   npm install -g @claude-skills/cli"
echo "   claude-skills --version"
echo ""
