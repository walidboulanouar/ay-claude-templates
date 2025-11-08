# Claude Code Integration Guide

## 🎯 Overview

The AY Claude CLI is **fully integrated with Claude Code**, using Claude Code's native configuration system and directory structure. This ensures seamless compatibility and automatic registration of installed content.

## 📁 Directory Structure

### Global Installation (User Scope)
```
~/.claude/
├── settings.json          # Claude Code user settings
├── skills/                # Installed skills
├── agents/                # Installed agents
├── commands/              # Installed commands
├── hooks/                 # Installed hooks
├── plugins/               # Installed plugins
├── mcps/                  # Installed MCP servers
├── settings/              # Installed settings presets
└── registry.json          # CLI registry
```

### Local Installation (Project Scope)
```
./.claude/
├── settings.json          # Claude Code project settings
├── skills/                # Project-specific skills
├── agents/                # Project-specific agents
├── commands/              # Project-specific commands
├── hooks/                 # Project-specific hooks
├── plugins/               # Project-specific plugins
├── mcps/                  # Project-specific MCP servers
├── settings/              # Project-specific settings presets
└── registry.json          # CLI registry
```

## 🔧 Integration Features

### 1. **Automatic Settings Registration**

When you install content, the CLI automatically:

- **Hooks**: Registers hooks in `settings.json` hooks section
- **Plugins**: Adds to `enabledPlugins` array
- **MCP Servers**: Adds to `enabledMcpjsonServers` array
- **Settings Presets**: Merges configuration into `settings.json`

### 2. **Settings Merging**

The CLI intelligently merges settings:

- **Arrays**: Combined (allow, ask, deny, plugins, etc.)
- **Objects**: Deep merged (permissions, env, hooks)
- **Values**: Overridden (model, statusLine)

### 3. **Path Resolution**

All paths use Claude Code's conventions:

- **Global**: `~/.claude/` (user scope)
- **Local**: `./.claude/` (project scope)
- **Variables**: `$CLAUDE_PROJECT_DIR` for project-relative paths

## 📦 Content Type Integration

### Skills
```bash
ay-claude install playwright-automation-skill
```

**Installed to**: `~/.claude/skills/playwright-automation/` or `./.claude/skills/playwright-automation/`

**Claude Code Integration**:
- If `mcp.json` exists, automatically added to `enabledMcpjsonServers`
- Skills are available in Claude Code sessions

### Agents
```bash
ay-claude install code-review-agent --type agent
```

**Installed to**: `~/.claude/agents/code-review-agent/` or `./.claude/agents/code-review-agent/`

**Claude Code Integration**:
- MCP servers automatically registered
- Available in Claude Code MCP server list

### Commands
```bash
ay-claude install git-commit-command --type command
```

**Installed to**: `~/.claude/commands/git-commit-command/` or `./.claude/commands/git-commit-command/`

**Claude Code Integration**:
- Scripts made executable automatically
- Available as slash commands in Claude Code

### Hooks
```bash
ay-claude install format-on-save-hook --type hook
```

**Installed to**: `~/.claude/hooks/format-on-save-hook/` or `./.claude/hooks/format-on-save-hook/`

**Claude Code Integration**:
- Automatically registered in `settings.json` hooks section
- Event handlers configured automatically

### Plugins
```bash
ay-claude install prettier-plugin --type plugin
```

**Installed to**: `~/.claude/plugins/prettier-plugin/` or `./.claude/plugins/prettier-plugin/`

**Claude Code Integration**:
- Added to `enabledPlugins` array in `settings.json`
- Plugin manifest validated

### Settings Presets
```bash
ay-claude install react-dev-settings --type settings
```

**Installed to**: `~/.claude/settings/react-dev-settings/` or `./.claude/settings/react-dev-settings/`

**Claude Code Integration**:
- Settings merged into `settings.json`
- Hooks and status line scripts installed
- Permissions and env configured

## 🚀 Global Installation & PATH

### Automatic PATH Configuration

When installed globally via npm:

```bash
npm install -g @ay-claude/cli
```

The CLI automatically:

1. **Detects npm global bin directory**
2. **Checks if in PATH**
3. **Adds to shell config** (if needed):
   - **Zsh**: `~/.zshrc`
   - **Bash**: `~/.bashrc`
   - **Windows**: Instructions provided

### Manual PATH Setup

If automatic setup fails:

#### macOS/Linux
```bash
# Add to ~/.zshrc or ~/.bashrc
export PATH="$PATH:$(npm config get prefix)/bin"

# Reload shell
source ~/.zshrc  # or source ~/.bashrc
```

#### Windows
```powershell
# Add to PATH via System Properties
# Or use PowerShell:
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\<user>\AppData\Roaming\npm", "User")
```

### Verify Installation

```bash
# Check if CLI is in PATH
which ay-claude  # macOS/Linux
where ay-claude  # Windows

# Test CLI
ay-claude --version
ay-claude help
```

## 🔍 How Claude Code Uses Installed Content

### 1. **Settings.json Loading**

Claude Code loads settings in this order:

1. Enterprise policies (highest priority)
2. CLI flags
3. `.claude/settings.local.json` (project local)
4. `.claude/settings.json` (project shared)
5. `~/.claude/settings.json` (user global)

The CLI installs to the appropriate scope based on `--global` or `--local` flags.

### 2. **Hook Execution**

Hooks installed via CLI are automatically available:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/format-on-save/format.sh",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

### 3. **MCP Server Discovery**

MCP servers are discovered from:

- `~/.claude/mcps/` (global)
- `./.claude/mcps/` (project)
- Registered in `enabledMcpjsonServers`

### 4. **Plugin Loading**

Plugins are loaded from:

- `~/.claude/plugins/` (global)
- `./.claude/plugins/` (project)
- Enabled via `enabledPlugins` array

## 📝 Example Workflow

### 1. Install CLI Globally
```bash
npm install -g @ay-claude/cli
# PATH automatically configured
```

### 2. Authenticate
```bash
ay-claude login
```

### 3. Install Content
```bash
# Install a skill globally
ay-claude install playwright-automation-skill --global

# Install a hook locally
ay-claude install format-on-save-hook --local

# Install a settings preset
ay-claude install react-dev-settings --type settings
```

### 4. Use in Claude Code

Content is immediately available:

- **Skills**: Available in Claude Code sessions
- **Hooks**: Execute automatically on events
- **Plugins**: Loaded and active
- **Settings**: Merged into configuration

### 5. View Settings

```bash
# View merged settings
cat ~/.claude/settings.json

# Or use Claude Code's config UI
/config
```

## 🔧 Troubleshooting

### Content Not Appearing in Claude Code

1. **Check installation location**:
   ```bash
   ay-claude list
   ```

2. **Verify settings.json**:
   ```bash
   cat ~/.claude/settings.json  # Global
   cat ./.claude/settings.json  # Local
   ```

3. **Check registration**:
   - Hooks: Look in `hooks` section
   - Plugins: Check `enabledPlugins` array
   - MCP: Check `enabledMcpjsonServers` array

### PATH Issues

```bash
# Check if CLI is in PATH
echo $PATH | grep -i claude  # macOS/Linux
echo $env:PATH | Select-String claude  # Windows PowerShell

# Verify npm global bin
npm config get prefix

# Re-run post-install
npm run postinstall
```

### Settings Not Merging

1. **Check file permissions**: Ensure `settings.json` is writable
2. **Validate JSON**: Use `jq` or JSON validator
3. **Check scope**: Verify `--global` vs `--local` flag

## 📚 Related Documentation

- [Claude Code Settings](./docs/settings.md)
- [Claude Code Hooks](./docs/hooks.md)
- [CLI Documentation](./README.md)
- [Cross-Platform Guide](./CROSS_PLATFORM.md)

---

**Status**: ✅ Fully integrated with Claude Code  
**Last Updated**: 2024-11-03
