# Claude Skills CLI - Complete Feature Documentation

## 🎯 Overview

The Claude Skills CLI is a comprehensive command-line tool for discovering, installing, and managing all types of Claude extensions across the platform. It supports **all 7 content types** with a unified, developer-friendly interface.

---

## 📦 Supported Content Types

### 1. Skills 📦
Claude extensions with SKILL.md files that extend Claude's capabilities.

**Characteristics:**
- ZIP package with SKILL.md
- Optional folders: scripts/, references/, assets/, examples/
- Version-controlled releases
- Comprehensive documentation

**CLI Commands:**
```bash
# Search skills
claude-skills search "automation" --type skill

# Install skill
claude-skills install playwright-automation-skill

# Get skill info
claude-skills info playwright-automation-skill

# Browse skills
claude-skills browse --type skill
```

### 2. Agents 🤖
Pre-configured AI assistants with specialized instructions and resources.

**Characteristics:**
- ZIP package with AGENT.md
- Configuration files
- Pre-configured prompts
- Specialized workflows

**CLI Commands:**
```bash
# Search agents
claude-skills search "code review" --type agent

# Install agent
claude-skills install code-review-agent --type agent

# Get agent info
claude-skills info code-review-agent --type agent
```

### 3. Commands ⚡
Custom slash commands and CLI shortcuts for quick Claude interactions.

**Characteristics:**
- Single executable script or package
- Command syntax definition
- Usage examples
- Quick execution

**CLI Commands:**
```bash
# Search commands
claude-skills search "git" --type command

# Install command
claude-skills install git-commit-command --type command

# View command syntax
claude-skills info git-commit-command --type command
```

### 4. Hooks 🪝
Event-driven scripts that execute on Claude Code events.

**Characteristics:**
- JavaScript/TypeScript scripts
- Event type specification (on-edit, on-commit, etc.)
- Minimal dependencies
- Event-driven execution

**CLI Commands:**
```bash
# Search hooks
claude-skills search "pre-commit" --type hook

# Install hook
claude-skills install pre-commit-hook --type hook
```

### 5. Plugins 🧩
Complete extension packages bundling multiple components.

**Characteristics:**
- ZIP package with plugin.js + manifest
- Multiple component support
- Compatibility information
- Comprehensive documentation

**CLI Commands:**
```bash
# Search plugins
claude-skills search "dev tools" --type plugin

# Install plugin
claude-skills install dev-tools-plugin --type plugin

# Check compatibility
claude-skills info dev-tools-plugin --type plugin
```

### 6. MCPs 🔌
Model Context Protocol server integrations.

**Characteristics:**
- MCP server URL
- Installation instructions
- Usage documentation
- Compatibility notes

**CLI Commands:**
```bash
# Search MCPs
claude-skills search "github" --type mcp

# Install MCP
claude-skills install github-mcp --type mcp

# View MCP details
claude-skills info github-mcp --type mcp
```

### 7. Settings ⚙️
Pre-configured Claude settings and configurations.

**Characteristics:**
- JSON configuration
- Use case descriptions
- Compatibility notes
- Quick application

**CLI Commands:**
```bash
# Search settings
claude-skills search "performance" --type settings

# Install settings preset
claude-skills install performance-settings --type settings
```

---

## 🔍 Discovery Features

### Unified Search

Search across all content types with powerful filtering:

```bash
# Basic search
claude-skills search "automation"

# Filter by type
claude-skills search "testing" --type skill

# Filter by category
claude-skills search "data" --category "Data Analysis"

# Multiple filters
claude-skills search "api" --type plugin --category "Development Tools"

# JSON output for scripting
claude-skills search "automation" --format json
```

### Browse Content

Browse all available content with sorting options:

```bash
# Browse all
claude-skills browse

# Browse by type
claude-skills browse --type agent

# Browse by category
claude-skills browse --category "Productivity"

# Sort options
claude-skills browse --sort popular    # Most popular
claude-skills browse --sort recent     # Recently added
claude-skills browse --sort upvotes    # Most upvoted
claude-skills browse --sort downloads  # Most downloaded
```

### Detailed Information

Get comprehensive information about any package:

```bash
# Get info (auto-detects type)
claude-skills info package-name

# Specify type
claude-skills info package-name --type skill

# Shows:
# - Package details
# - Version history
# - Installation instructions
# - Usage examples (commands)
# - Compatibility (plugins)
# - Documentation links
```

---

## 📥 Installation Features

### Global vs Local Installation

**Global Installation** (`~/.claude`):
- Available system-wide
- Shared across projects
- Good for frequently used packages

```bash
claude-skills install package-name --global
```

**Local Installation** (`./.claude`):
- Project-specific
- Version controlled
- Good for project dependencies

```bash
claude-skills install package-name --local
```

### Version Management

```bash
# Install latest version
claude-skills install package-name

# Install specific version
claude-skills install package-name --version 1.2.0

# Update to latest
claude-skills update package-name

# Update all packages
claude-skills update --all
```

### Batch Operations

```bash
# Install multiple packages
claude-skills install package-1 package-2 package-3

# Install with dependencies (future)
claude-skills install package-name --with-deps
```

---

## 🛠️ Developer Experience Features

### Auto-Detection

The CLI automatically detects content types when possible:

```bash
# Type detection from package name
claude-skills install playwright-automation-skill  # Detects as skill

# Manual type specification
claude-skills install package-name --type agent
```

### Interactive Prompts

When multiple matches found, CLI prompts for selection:

```bash
$ claude-skills install automation
? Multiple packages found. Select one:
  > playwright-automation-skill (skill) - Browser automation
    selenium-automation-agent (agent) - Selenium automation
    auto-test-command (command) - Automated testing
```

### Rich Output Formats

```bash
# Table format (default)
claude-skills search "automation" --format table

# List format
claude-skills search "automation" --format list

# JSON format (for scripting)
claude-skills search "automation" --format json | jq '.items[0]'
```

### Progress Indicators

All operations show progress:

```
⬇️  Downloading package (2.4 MB)...
🔍 Validating package...
📂 Extracting to ~/.claude/skills/playwright-automation/
✓ Installation complete
```

---

## 📊 Statistics & Analytics

### Platform Statistics

```bash
claude-skills stats
```

**Shows:**
- Installed packages count
- Packages by type
- Platform statistics
- Available content counts

### Usage Tracking

All operations are logged for:
- Security monitoring
- Usage analytics
- Troubleshooting
- Performance optimization

---

## 🔒 Security Features

### Authentication

```bash
# Login (OAuth device flow)
claude-skills login

# Check auth status
claude-skills whoami

# Logout
claude-skills logout
```

### Package Verification

All packages are verified before installation:
- ✅ SHA-256 hash verification
- ✅ Structure validation
- ✅ Malicious content scanning
- ✅ File size limits

### Rate Limiting

Automatic rate limiting prevents abuse:
- Search: 100 requests/hour
- Download: 50 requests/hour
- Install: 20 requests/hour

---

## 🆘 Help & Support

### Built-in Help

```bash
# General help
claude-skills help

# Command-specific help
claude-skills help install
claude-skills help search
claude-skills help info
```

### Troubleshooting

```bash
# Run diagnostics
claude-skills troubleshoot

# Checks:
# - Authentication status
# - Installation directories
# - Installed packages
# - Environment configuration
# - Common issues
```

### Documentation

- **CLI Docs:** `claude-skills help`
- **Online Docs:** https://claude-skills.com/docs/cli
- **Developer Docs:** `cli/DEVELOPER_DOCUMENTATION.md`
- **GitHub:** https://github.com/claude-skills/cli

---

## 💡 Tips & Best Practices

### Discovery

1. **Use Search First:**
   ```bash
   claude-skills search "your query"
   ```

2. **Browse by Category:**
   ```bash
   claude-skills browse --category "Development Tools"
   ```

3. **Check Details Before Install:**
   ```bash
   claude-skills info package-name
   ```

### Installation

1. **Use Local for Projects:**
   ```bash
   claude-skills install package --local
   ```

2. **Specify Type When Needed:**
   ```bash
   claude-skills install package --type agent
   ```

3. **Keep Packages Updated:**
   ```bash
   claude-skills update --all
   ```

### Development

1. **Use JSON Output for Scripting:**
   ```bash
   claude-skills search "query" --format json | jq '.items[]'
   ```

2. **Check Stats Regularly:**
   ```bash
   claude-skills stats
   ```

3. **Run Troubleshoot When Issues:**
   ```bash
   claude-skills troubleshoot
   ```

---

## 🚀 Advanced Usage

### Scripting Examples

```bash
# Install all skills matching a query
claude-skills search "automation" --type skill --format json | \
  jq -r '.items[].slug' | \
  xargs -I {} claude-skills install {}

# List all installed packages as JSON
claude-skills list --format json

# Find packages by author
claude-skills search "author-name" --format json | \
  jq '.items[] | select(.author.name == "author-name")'
```

### Environment Variables

```bash
# API Configuration
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export CLAUDE_SKILLS_CLIENT_ID="claude-skills-cli"

# Debug Mode
export DEBUG=claude-skills:*

# Custom Installation Path
export CLAUDE_SKILLS_GLOBAL_PATH="~/.custom-claude"
```

---

## 📈 Roadmap

### Planned Features

- [ ] Dependency management
- [ ] Package bundles
- [ ] Cloud sync
- [ ] Offline mode
- [ ] Package signing
- [ ] Version pinning
- [ ] Rollback functionality
- [ ] Package comparison
- [ ] Export/import configurations

---

*For the latest features and updates, visit https://claude-skills.com/docs/cli*
