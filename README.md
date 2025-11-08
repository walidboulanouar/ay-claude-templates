# AY Claude CLI

[![npm version](https://img.shields.io/npm/v/@ay-claude/cli.svg)](https://www.npmjs.com/package/@ay-claude/cli)
[![npm downloads](https://img.shields.io/npm/dm/@ay-claude/cli.svg)](https://www.npmjs.com/package/@ay-claude/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Official CLI tool for AY Claude Platform - Discover, install, and manage Claude Skills, Agents, Commands, Hooks, Plugins, MCPs, and Settings

## 🚀 Installation

### From GitHub Packages (Recommended)

```bash
npm install -g @walidboulanouar/ay-claude-cli
```

**Note**: You'll need to authenticate with GitHub Packages first. See [GitHub Packages Setup](#github-packages-setup) below.

### From npm (Coming Soon)

```bash
npm install -g @ay-claude/cli
```

After installation, the CLI will be available as `ay-claude` or `ayc`:

```bash
ay-claude --version
# or
ayc --version
```

## 📦 GitHub Packages Setup

This package is published to GitHub Packages. To install or publish, you need to authenticate:

### 1. Create a Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "AY Claude CLI")
4. Select scopes:
   - ✅ `read:packages` (to install packages)
   - ✅ `write:packages` (to publish packages)
   - ✅ `repo` (if publishing from a private repo)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### 2. Authenticate with npm

**Option A: Using npm login (Recommended)**

```bash
npm login --scope=@walidboulanouar --auth-type=legacy --registry=https://npm.pkg.github.com

# When prompted:
# Username: walidboulanouar (your GitHub username)
# Password: YOUR_PERSONAL_ACCESS_TOKEN (paste your token)
# Email: your-email@example.com
```

**Option B: Using .npmrc file**

1. Create a `.npmrc` file in your home directory (`~/.npmrc`) or project directory:

```bash
# For user-wide authentication
echo "@walidboulanouar:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN" >> ~/.npmrc
```

2. Replace `YOUR_PERSONAL_ACCESS_TOKEN` with your actual token.

**⚠️ Important**: Never commit `.npmrc` files containing tokens to git! The `.npmrc` file is in `.gitignore`.

### 3. Install the Package

After authentication, install the CLI:

```bash
npm install -g @walidboulanouar/ay-claude-cli
```

### 4. Publishing (For Maintainers)

To publish updates:

```bash
cd cli
npm publish
```

The package will be published to GitHub Packages at:
`https://github.com/walidboulanouar/ay-claude-templates/packages`

For more information, see [GitHub Packages npm documentation](https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## ✨ Features

### 🔐 Secure & Authenticated
- OAuth Device Flow authentication
- Secure token storage (system keychain)
- Package verification (5-stage security pipeline)
- Request signing and audit logging

### 📦 Complete Package Management
- **Install** Skills, Agents, Commands, Hooks, Plugins, MCPs, and Settings
- **Global & Local** installation (`~/.claude` or `./.claude`)
- **Dependencies** auto-installation
- **Version Management** with rollback support
- **Package Bundles** - Install curated collections

### 🔍 Smart Discovery
- **Unified Search** across all content types
- **Smart Recommendations** based on installed packages
- **Package Health Scores** - Know package quality
- **Package Comparison** - Compare similar packages
- **Search History** - Remember your searches

### ⭐ Organization
- **Favorites** - Save favorite packages
- **Collections** - Organize packages
- **Team Workspaces** - Share configurations
- **Package Templates** - Quick start scaffolding

### 🛠️ Developer Experience
- Beautiful CLI output with colors and tables
- Comprehensive help system
- Troubleshooting diagnostics
- Cross-platform support (Windows, Linux, macOS)
- Claude Code integration (zero configuration)

## 🎯 Quick Start

### 1. Authenticate

```bash
ay-claude login
```

This will open your browser for authentication. Follow the instructions.

### 2. Search for Packages

```bash
# Search across all types
ay-claude search "automation"

# Filter by type
ay-claude search "react" --type skill

# Browse by category
ay-claude browse --category "development"
```

### 3. Install Packages

```bash
# Install a package
ay-claude install package-name

# Install with dependencies
ay-claude install package-name

# Install a bundle
ay-claude bundle install react-dev-stack

# Install globally
ay-claude install package-name --global

# Install locally (project-specific)
ay-claude install package-name --local
```

### 4. Manage Packages

```bash
# List installed packages
ay-claude list

# Check package health
ay-claude health package-name

# Compare packages
ay-claude compare package1 package2 package3

# Update packages
ay-claude updates --install

# Uninstall
ay-claude uninstall package-name
```

### 5. Organize

```bash
# Add to favorites
ay-claude favorite add package-name

# Create collection
ay-claude favorite create "My Tools"

# Get recommendations
ay-claude recommendations

# View search history
ay-claude search-history
```

## 📚 Commands

### Authentication
- `login` - Authenticate with AY Claude Platform
- `logout` - Log out and remove credentials
- `whoami` - Show authentication status

### Discovery
- `search [query]` - Search marketplace
- `browse` - Browse all content
- `info <package>` - Show package details
- `health [package]` - Show health scores
- `compare <packages...>` - Compare packages
- `recommendations` - Get smart recommendations

### Installation
- `install [packages...]` - Install packages
- `bundle <action> [bundleId]` - Install bundles
- `list` - List installed packages
- `update [packages...]` - Update packages
- `uninstall <package>` - Remove packages
- `updates` - Check for updates

### Organization
- `favorite <action> [packageId]` - Manage favorites
- `workspace <action> [workspaceId]` - Manage workspaces
- `template <action> [templateId]` - Create from templates
- `search-history` - View search history

### Utilities
- `init` - Initialize CLI
- `stats` - Show statistics
- `troubleshoot` - Run diagnostics
- `help [command]` - Show help

## 🎁 Package Bundles

Install curated collections of packages:

```bash
# List available bundles
ay-claude bundle list

# Install React development stack
ay-claude bundle install react-dev-stack

# Available bundles:
# - react-dev-stack (React + TypeScript + Formatting)
# - nodejs-backend (Node.js + API + Testing)
# - code-quality (Linting + Formatting + Testing)
# - git-workflow (Git automation tools)
```

## 📝 Package Templates

Create new packages quickly:

```bash
# List templates
ay-claude template list

# Create from template
ay-claude template create skill-basic
```

## 🔒 Security

The CLI implements multiple security layers:

- **OAuth Device Flow** - Secure authentication without browser redirect
- **Package Verification** - 5-stage security pipeline
- **Request Signing** - HMAC-SHA256 request signatures
- **Audit Logging** - Complete operation tracking
- **Rate Limiting** - Prevents abuse

## 🌍 Cross-Platform

Works seamlessly on:
- ✅ **macOS** (tested)
- ✅ **Linux** (tested)
- ✅ **Windows** (tested)

## 📖 Documentation

- [Full Documentation](./DEVELOPER_DOCUMENTATION.md)
- [Architecture](./ARCHITECTURE.md)
- [Security Plan](./SECURITY_PLAN.md)
- [Claude Code Integration](./CLAUDE_CODE_INTEGRATION.md)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the AY Claude Platform
- Integrates with Claude Code
- Inspired by npm, pip, and other great package managers

## 📞 Support

- **Documentation**: [GitHub Wiki](https://github.com/walidboulanouar/ay-claude-templates/wiki)
- **Issues**: [GitHub Issues](https://github.com/walidboulanouar/ay-claude-templates/issues)
- **Package**: [GitHub Packages](https://github.com/walidboulanouar/ay-claude-templates/packages)
- **Email**: support@ay-claude.com

---

**Made with ❤️ for the Claude community**
