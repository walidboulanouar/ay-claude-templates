# 🚀 Complete Publication Guide - GitHub + npm

## 📋 Overview

This guide walks you through publishing the Claude Skills CLI to both GitHub and npm.

---

## Part 1: GitHub Repository Setup

### Step 1: Create GitHub Repository

1. **Go to**: https://github.com/new
2. **Repository name**: `claude-skills-cli`
3. **Description**: `Official CLI tool for Claude Skills Platform - Discover, install, and manage Claude AI extensions`
4. **Visibility**: ✅ **Public** (required for npm)
5. **Initialize**: ❌ Don't add README, .gitignore, or license (we have them)
6. Click **"Create repository"**

### Step 2: Prepare CLI Directory

```bash
cd cli

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Claude Skills CLI v1.0.0

- Complete CLI with 25+ commands
- 10 revolutionary features
- Cross-platform support
- Secure authentication
- Claude Code integration"
```

### Step 3: Connect to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/claude-skills-cli.git

# Verify
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Update package.json URLs

Edit `cli/package.json` and replace `YOUR_USERNAME` with your actual GitHub username:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/claude-skills-cli.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/claude-skills-cli/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/claude-skills-cli#readme"
}
```

### Step 5: Create GitHub Release

1. Go to your repository → **"Releases"** → **"Create a new release"**
2. **Tag**: `v1.0.0`
3. **Release title**: `v1.0.0 - Initial Release`
4. **Description**: Copy from release notes below
5. Check **"Set as the latest release"**
6. Click **"Publish release"**

### Step 6: Add Repository Topics

On GitHub repository page:
1. Click gear icon ⚙️ next to "About"
2. Add topics:
   - `claude`
   - `claude-skills`
   - `cli`
   - `package-manager`
   - `typescript`
   - `nodejs`

---

## Part 2: npm Publication

### Step 1: Create npm Account

1. **Go to**: https://www.npmjs.com/signup
2. Create account
3. Verify email

### Step 2: Login to npm

```bash
npm login

# Enter:
# - Username
# - Password
# - Email
# - OTP (if enabled)

# Verify login
npm whoami
```

### Step 3: Verify Package

```bash
cd cli

# Check what will be published
npm pack --dry-run

# Verify package.json
npm publish --dry-run
```

### Step 4: Build Package

```bash
# Build (this runs automatically before publish)
npm run build

# Verify dist/ folder exists
ls -la dist/
```

### Step 5: Publish to npm

```bash
# Publish (scoped packages need --access public)
npm publish --access public
```

### Step 6: Verify Publication

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

- [Full Documentation](https://github.com/YOUR_USERNAME/claude-skills-cli#readme)
- [GitHub Repository](https://github.com/YOUR_USERNAME/claude-skills-cli)

## 🎯 Requirements

- Node.js >= 18.0.0
- Claude Code installed (for integration)

## 🙏 Thank You

Thank you for using Claude Skills CLI! If you encounter any issues, please report them on [GitHub Issues](https://github.com/YOUR_USERNAME/claude-skills-cli/issues).
```

---

## ✅ Publication Checklist

### GitHub
- [ ] Repository created (public)
- [ ] Code pushed to GitHub
- [ ] Initial release created (v1.0.0)
- [ ] Repository topics added
- [ ] package.json URLs updated

### npm
- [ ] npm account created
- [ ] Logged in to npm
- [ ] Package verified (`npm pack --dry-run`)
- [ ] Build successful
- [ ] Published to npm (`npm publish --access public`)
- [ ] Installation tested

### Post-Publication
- [ ] Update website/docs
- [ ] Announce on social media
- [ ] Monitor downloads
- [ ] Respond to issues

---

## 🎯 Quick Commands

```bash
# GitHub Setup
cd cli
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/claude-skills-cli.git
git push -u origin main

# npm Publication
npm login
npm publish --access public

# Verify
npm view @claude-skills/cli
npm install -g @claude-skills/cli
claude-skills --version
```

---

## 📊 Package Information

- **Package Name**: `@claude-skills/cli`
- **Version**: `1.0.0`
- **License**: MIT
- **Node.js**: >= 18.0.0
- **Repository**: GitHub (public)
- **npm**: https://www.npmjs.com/package/@claude-skills/cli

---

## 🎉 Success!

After completing these steps, your CLI will be:
- ✅ Available on GitHub
- ✅ Available on npm
- ✅ Installable globally: `npm install -g @claude-skills/cli`
- ✅ Ready for users!

**Good luck with your publication!** 🚀
