# 🚀 NPM Publication Guide

## 📋 Pre-Publication Checklist

### ✅ Package Configuration

- [x] Package name: `@claude-skills/cli`
- [x] Version: `1.0.0`
- [x] License: MIT
- [x] Repository URL configured
- [x] Author information added
- [x] Keywords added
- [x] Files list configured
- [x] `.npmignore` created
- [x] `LICENSE` file added

### ✅ Code Quality

- [x] TypeScript compiles without errors
- [x] All features tested
- [x] Documentation complete
- [x] README.md updated
- [x] No sensitive data in code

### ✅ Build

- [x] `npm run build` succeeds
- [x] `dist/` folder contains all files
- [x] Executable permissions set
- [x] Postinstall script included

---

## 🔧 Step-by-Step Publication Process

### Step 1: Create GitHub Repository

```bash
# Create a new repository on GitHub
# Repository name: claude-skills-cli
# Description: Official CLI for Claude Skills Platform
# Visibility: Public
# Initialize: Don't add README, .gitignore, or license (we have them)
```

### Step 2: Initialize Git Repository (if not already done)

```bash
cd cli
git init
git add .
git commit -m "Initial commit: Claude Skills CLI v1.0.0"
```

### Step 3: Connect to GitHub

```bash
# Add remote (replace with your actual GitHub username/org)
git remote add origin https://github.com/YOUR_USERNAME/claude-skills-cli.git
# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/claude-skills-cli.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Create GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag: `v1.0.0`
4. Title: `v1.0.0 - Initial Release`
5. Description: Use release notes template below
6. Publish release

### Step 5: NPM Account Setup

```bash
# Create npm account (if you don't have one)
# Visit: https://www.npmjs.com/signup

# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### Step 6: Verify Package

```bash
# Check what will be published
npm pack --dry-run

# Verify package.json
npm publish --dry-run
```

### Step 7: Publish to npm

```bash
# Make sure you're in the cli directory
cd cli

# Build the package
npm run build

# Publish (this will run prepublishOnly script automatically)
npm publish --access public

# Note: For scoped packages (@claude-skills/cli), you need --access public
```

### Step 8: Verify Publication

```bash
# Check npm registry
npm view @claude-skills/cli

# Test installation
npm install -g @claude-skills/cli
claude-skills --version
```

---

## 📝 GitHub Release Notes Template

```markdown
# Claude Skills CLI v1.0.0

## 🎉 Initial Release

The official CLI tool for the Claude Skills Platform - a marketplace for Claude AI extensions.

## ✨ Features

### 🔐 Authentication & Security
- OAuth Device Flow authentication
- Secure token storage (system keychain)
- Request signing (HMAC-SHA256)
- Package verification (5-stage pipeline)
- Audit logging

### 📦 Package Management
- Install Skills, Agents, Commands, Hooks, Plugins, MCPs, and Settings
- Global and local installation support
- Package dependencies auto-installation
- Version management with rollback
- Package bundles (curated collections)

### 🔍 Discovery
- Unified search across all content types
- Smart recommendations
- Package health scores
- Package comparison
- Search history

### ⭐ Organization
- Favorites and collections
- Team workspaces
- Package templates

### 🛠️ Developer Experience
- Beautiful CLI output
- Comprehensive help system
- Troubleshooting diagnostics
- Cross-platform support (Windows, Linux, macOS)

## 📦 Installation

\`\`\`bash
npm install -g @claude-skills/cli
\`\`\`

## 🚀 Quick Start

\`\`\`bash
# Authenticate
claude-skills login

# Search for packages
claude-skills search "automation"

# Install a package
claude-skills install package-name

# List installed packages
claude-skills list
\`\`\`

## 📚 Documentation

- [Full Documentation](https://github.com/claude-skills/cli#readme)
- [GitHub Repository](https://github.com/claude-skills/cli)

## 🎯 Requirements

- Node.js >= 18.0.0
- Claude Code installed (for integration)

## 🙏 Thank You

Thank you for using Claude Skills CLI! If you encounter any issues, please report them on [GitHub Issues](https://github.com/claude-skills/cli/issues).
```

---

## 🔐 NPM Organization Setup (Optional)

If you want to publish under an organization:

1. Create npm organization: https://www.npmjs.com/org/create
2. Add team members
3. Publish with: `npm publish --access public`

---

## 📊 Post-Publication

### Update Documentation

- [ ] Update README with npm installation instructions
- [ ] Add badges (npm version, downloads, etc.)
- [ ] Update website/docs with npm link

### Marketing

- [ ] Announce on Twitter/X
- [ ] Post on Reddit (r/claude, r/programming)
- [ ] Share in relevant Discord communities
- [ ] Write blog post

### Monitoring

- [ ] Monitor npm downloads
- [ ] Track GitHub stars
- [ ] Monitor issues and feedback
- [ ] Plan next version

---

## 🎯 Quick Commands Reference

```bash
# Build
npm run build

# Test locally
npm link
claude-skills --help

# Publish
npm publish --access public

# Update version
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# Unpublish (if needed, within 72 hours)
npm unpublish @claude-skills/cli@1.0.0
```

---

## ⚠️ Important Notes

1. **Scoped Packages**: `@claude-skills/cli` requires `--access public` flag
2. **Version**: Use semantic versioning (major.minor.patch)
3. **GitHub**: Repository must be public for npm best practices
4. **License**: MIT license is standard for open source
5. **Testing**: Test installation before publishing

---

## ✅ Ready to Publish!

Follow the steps above to publish your CLI to npm. Good luck! 🚀
