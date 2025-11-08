# Release v1.0.0 - Initial Release

## 🎉 First Public Release

The **AY Claude CLI** is now available on npm! This is the initial stable release with full feature support for managing Claude Code extensions.

## ✨ What's New

### 🔐 Security & Authentication
- **OAuth Device Flow** authentication for secure CLI access
- **System keychain integration** (macOS Keychain, Windows Credential Store, Linux libsecret)
- **HMAC-SHA256 request signing** for API security
- **5-stage package verification pipeline** to ensure package integrity
- **Audit logging** for all CLI operations

### 📦 Package Management
- **Install** Skills, Agents, Commands, Hooks, Plugins, MCPs, and Settings
- **Global & Local** installation support (`~/.claude` or `./.claude`)
- **Automatic dependency resolution** and installation
- **Version management** with rollback support
- **Package bundles** for curated collections

### 🔍 Discovery & Search
- **Unified search** across all content types
- **Smart recommendations** based on installed packages
- **Package health scores** for quality assessment
- **Package comparison** tool
- **Search history** tracking

### ⭐ Organization Features
- **Favorites** system for saving packages
- **Collections** for organizing packages
- **Team workspaces** for shared configurations
- **Package templates** for quick scaffolding

### 🛠️ Developer Experience
- Beautiful CLI output with colors and tables
- Comprehensive help system (`ay-claude help`)
- Troubleshooting diagnostics (`ay-claude troubleshoot`)
- Cross-platform support (Windows, Linux, macOS)
- **Zero-config Claude Code integration**

## 🚀 Installation

```bash
npm install -g @ay-claude/cli
```

## 📚 Quick Start

```bash
# Authenticate
ay-claude login

# Search for packages
ay-claude search "automation"

# Install a package
ay-claude install package-name

# List installed packages
ay-claude list
```

## 🌍 Platform Support

- ✅ **macOS** 10.15+ (Intel and Apple Silicon)
- ✅ **Linux** (all distributions with Node.js 18+)
- ✅ **Windows** 10/11 (x64, ARM64)

## 📖 Documentation

- [Full Documentation](./docs/DEVELOPER_DOCUMENTATION.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Security Plan](./docs/SECURITY_PLAN.md)
- [Claude Code Integration](./docs/CLAUDE_CODE_INTEGRATION.md)
- [Cross-Platform Guide](./docs/CROSS_PLATFORM.md)

## 🔗 Links

- **npm Package**: [@ay-claude/cli](https://www.npmjs.com/package/@ay-claude/cli)
- **GitHub Repository**: [ay-claude-templates](https://github.com/walidboulanouar/ay-claude-templates)
- **Issues**: [Report a bug](https://github.com/walidboulanouar/ay-claude-templates/issues)

## 🙏 Acknowledgments

Built for the Claude community with ❤️

---

**Full Changelog**: See [GitHub Commits](https://github.com/walidboulanouar/ay-claude-templates/commits/main)

