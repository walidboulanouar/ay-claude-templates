# Claude Skills CLI - Developer Documentation

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Content Types](#content-types)
3. [Command Reference](#command-reference)
4. [Developer Guide](#developer-guide)
5. [Troubleshooting](#troubleshooting)
6. [API Reference](#api-reference)
7. [Security](#security)

---

## 🏗️ Architecture Overview

### CLI Structure

```
cli/
├── src/
│   ├── commands/          # CLI command implementations
│   ├── core/              # Core functionality
│   │   ├── auth.ts        # Authentication system
│   │   ├── secure-api-client.ts  # Secure HTTP client
│   │   ├── package-verifier.ts   # Security verification
│   │   ├── audit-logger.ts       # Audit logging
│   │   ├── installer.ts          # Package installation
│   │   └── registry.ts           # Package registry
│   ├── utils/             # Utility functions
│   └── index.ts           # Main entry point
```

### Content Type Support

The CLI supports **all 7 content types**:

1. **Skills** 📦 - Claude extensions with SKILL.md
2. **Agents** 🤖 - Pre-configured AI assistants
3. **Commands** ⚡ - Custom slash commands
4. **Hooks** 🪝 - Event-driven scripts
5. **Plugins** 🧩 - Extension bundles
6. **MCPs** 🔌 - Model Context Protocol servers
7. **Settings** ⚙️ - Configuration presets

---

## 📦 Content Types

### Skills
**Format:** ZIP with SKILL.md + optional folders  
**Installation:** Extracts to `~/.claude/skills/` or `./.claude/skills/`  
**Usage:**
```bash
claude-skills install playwright-automation-skill
claude-skills info playwright-automation-skill
```

### Agents
**Format:** ZIP with AGENT.md + config files  
**Installation:** Extracts to `~/.claude/agents/` or `./.claude/agents/`  
**Usage:**
```bash
claude-skills install code-review-agent --type agent
claude-skills browse --type agent
```

### Commands
**Format:** Single executable script or package  
**Installation:** Copies to `~/.claude/commands/` or `./.claude/commands/`  
**Usage:**
```bash
claude-skills install git-commit-command --type command
claude-skills info git-commit-command --type command
```

### Hooks
**Format:** JavaScript/TypeScript hook scripts  
**Installation:** Extracts to `~/.claude/hooks/` or `./.claude/hooks/`  
**Usage:**
```bash
claude-skills install pre-commit-hook --type hook
```

### Plugins
**Format:** ZIP with plugin.js + manifest  
**Installation:** Extracts to `~/.claude/plugins/` or `./.claude/plugins/`  
**Usage:**
```bash
claude-skills install dev-tools-plugin --type plugin
```

### MCPs
**Format:** MCP server configuration  
**Installation:** Stores config in `~/.claude/mcps/` or `./.claude/mcps/`  
**Usage:**
```bash
claude-skills install github-mcp --type mcp
```

### Settings
**Format:** JSON configuration  
**Installation:** Stores in `~/.claude/settings/` or `./.claude/settings/`  
**Usage:**
```bash
claude-skills install performance-settings --type settings
```

---

## 📖 Command Reference

### Authentication

#### `login`
Authenticate with Claude Skills Platform using OAuth device flow.

```bash
claude-skills login
```

**Process:**
1. CLI requests device code
2. User visits verification URL
3. User enters code
4. Token stored securely in system keychain

#### `logout`
Remove stored authentication credentials.

```bash
claude-skills logout
```

#### `whoami`
Show current authentication status.

```bash
claude-skills whoami
```

---

### Discovery

#### `search`
Search across all content types.

```bash
claude-skills search "automation"
claude-skills search "testing" --type skill
claude-skills search "data" --category "Data Analysis"
claude-skills search "api" --format json
```

**Options:**
- `-t, --type <type>` - Filter by content type
- `-c, --category <category>` - Filter by category
- `--limit <number>` - Limit results (default: 20)
- `--format <format>` - Output format: table, list, json

#### `browse`
Browse all available content.

```bash
claude-skills browse
claude-skills browse --type agent
claude-skills browse --category "Development Tools"
claude-skills browse --sort popular --limit 50
```

**Options:**
- `-t, --type <type>` - Filter by content type
- `-c, --category <category>` - Filter by category
- `--sort <sort>` - Sort: popular, recent, upvotes, downloads
- `--limit <number>` - Limit results (default: 20)

#### `info`
Get detailed information about any package.

```bash
claude-skills info playwright-automation-skill
claude-skills info code-review-agent --type agent
```

**Shows:**
- Package details
- Version history
- Installation instructions
- Usage examples (for commands)
- Compatibility (for plugins)
- Documentation links

---

### Installation

#### `install`
Install packages of any type.

```bash
claude-skills install playwright-automation-skill
claude-skills install code-review-agent --type agent
claude-skills install my-skill --version 1.2.0
claude-skills install skill-1 skill-2 --local
```

**Options:**
- `-g, --global` - Install globally in `~/.claude`
- `-l, --local` - Install locally in `./.claude`
- `-t, --type <type>` - Specify content type
- `--version <version>` - Install specific version

**Process:**
1. Search for package
2. Get download URL
3. Download package
4. Verify package integrity
5. Extract and install
6. Add to registry

#### `list`
List installed packages.

```bash
claude-skills list
claude-skills list --type skill
claude-skills list --local
claude-skills list --global
```

#### `update`
Update installed packages.

```bash
claude-skills update playwright-automation-skill
claude-skills update --all
claude-skills update --local --all
```

#### `uninstall`
Remove installed packages.

```bash
claude-skills uninstall playwright-automation-skill
claude-skills uninstall skill-name --local
```

---

### Utilities

#### `init`
Initialize CLI in current directory or globally.

```bash
claude-skills init              # Local (./.claude)
claude-skills init --local      # Local
claude-skills init --global     # Global (~/.claude)
```

#### `help`
Show help for commands.

```bash
claude-skills help
claude-skills help install
claude-skills help search
```

#### `troubleshoot`
Run diagnostics and troubleshooting guide.

```bash
claude-skills troubleshoot
```

**Checks:**
- Authentication status
- Installation directories
- Installed packages
- Environment configuration
- Common issues

#### `stats`
Show CLI and platform statistics.

```bash
claude-skills stats
```

---

## 👨‍💻 Developer Guide

### Adding a New Command

1. Create command file in `src/commands/`:

```typescript
// src/commands/mycommand.ts
import chalk from 'chalk';
import { SecureAPIClient } from '../core/secure-api-client.js';

export async function myCommand(options: { flag?: string }) {
  const apiUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
  const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
  const apiClient = new SecureAPIClient(apiUrl, clientId);

  try {
    // Your command logic
    console.log(chalk.green('Command executed successfully'));
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}
```

2. Register in `src/index.ts`:

```typescript
import { myCommand } from './commands/mycommand.js';

program
  .command('mycommand')
  .description('My command description')
  .option('-f, --flag <value>', 'Flag description')
  .action(myCommand);
```

### Working with Content Types

All content types are handled uniformly:

```typescript
import type { ContentType } from '../utils/content-info.js';

const contentType: ContentType = 'skill'; // or 'agent', 'command', etc.

// Search
const results = await apiClient.client.get('/functions/v1/search', {
  params: { q: 'query', type: contentType },
});

// Install
await installPackage(zipPath, packageName, {
  scope: 'local',
  contentType,
  version: '1.0.0',
});
```

### Error Handling

Always provide helpful error messages:

```typescript
try {
  // Operation
} catch (error) {
  console.error(chalk.red(`\n✗ Operation failed: ${error.message}\n`));
  
  // Provide suggestions
  console.log(chalk.yellow('💡 Suggestions:'));
  console.log(chalk.gray('  • Check authentication: claude-skills whoami'));
  console.log(chalk.gray('  • Try troubleshooting: claude-skills troubleshoot'));
  
  process.exit(1);
}
```

### Logging

Use audit logger for important operations:

```typescript
import { AuditLogger } from '../core/audit-logger.js';
import { getClaudePaths } from '../utils/paths.js';

const paths = getClaudePaths();
const auditLogger = new AuditLogger(paths.global);

await auditLogger.logInstall(packageId, contentType, true, undefined, {
  version: '1.0.0',
  scope: 'local',
});
```

---

## 🔧 Troubleshooting

### Common Issues

#### "Not authenticated"
**Solution:** Run `claude-skills login`

#### "Package not found"
**Solutions:**
- Try searching first: `claude-skills search "<name>"`
- Specify type: `claude-skills install <name> --type skill`
- Check spelling

#### "Rate limit exceeded"
**Solutions:**
- Wait a few minutes
- Check usage: `claude-skills stats`
- Contact support if persistent

#### "Package verification failed"
**Solutions:**
- Package may be corrupted - try downloading again
- Check package integrity hash
- Report issue if problem persists

#### "Installation directory not found"
**Solution:** Run `claude-skills init`

### Debug Mode

Set environment variable for verbose logging:

```bash
export DEBUG=claude-skills:*
claude-skills install package-name
```

### Getting Help

1. **CLI Help:**
   ```bash
   claude-skills help
   claude-skills help <command>
   ```

2. **Troubleshooting:**
   ```bash
   claude-skills troubleshoot
   ```

3. **Documentation:**
   - Online: https://claude-skills.com/docs/cli
   - GitHub: https://github.com/claude-skills/cli

4. **Support:**
   - Email: support@claude-skills.com
   - GitHub Issues: https://github.com/claude-skills/cli/issues

---

## 🔌 API Reference

### Search API

```typescript
GET /functions/v1/search?q=<query>&type=<type>&category=<category>&limit=<limit>

Response: {
  items: ContentItem[],
  total: number,
  page: number,
  limit: number
}
```

### Content API

```typescript
GET /api/v1/content/<type>/<id>

Response: DetailedContentInfo
```

### Download API

```typescript
POST /functions/v1/download-<type>
Body: { id: string, version?: string }

Response: {
  url: string,
  version: string,
  size: number,
  integrityHash: string
}
```

---

## 🔒 Security

### Authentication Flow

1. User runs `claude-skills login`
2. CLI requests device code
3. User visits verification URL
4. User enters code
5. Platform generates CLI token
6. Token stored in system keychain
7. Token used for all requests

### Package Verification

All packages are verified before installation:

1. **Hash Verification:** SHA-256 integrity check
2. **Structure Validation:** Package format verification
3. **Security Scanning:** Malicious content detection
4. **File Size Limits:** Prevent abuse

### Rate Limiting

- **Search:** 100 requests/hour
- **Download:** 50 requests/hour
- **Install:** 20 requests/hour

### Audit Logging

All operations are logged:
- Authentication events
- Download operations
- Installation operations
- Errors and failures

---

## 📝 Best Practices

### For Users

1. **Keep CLI Updated:**
   ```bash
   npm update -g @claude-skills/cli
   ```

2. **Use Specific Types:**
   ```bash
   claude-skills install package --type skill
   ```

3. **Check Before Install:**
   ```bash
   claude-skills info package-name
   ```

4. **Use Local Installation for Projects:**
   ```bash
   claude-skills install package --local
   ```

### For Developers

1. **Always Handle Errors:**
   - Provide helpful error messages
   - Include suggestions
   - Log errors for debugging

2. **Validate Inputs:**
   - Check package names
   - Validate content types
   - Verify file paths

3. **Use Secure API Client:**
   - Always use `SecureAPIClient`
   - Never bypass authentication
   - Respect rate limits

4. **Log Important Operations:**
   - Use audit logger
   - Include user context
   - Track errors

---

## 🚀 Contributing

### Development Setup

```bash
# Clone repository
git clone https://github.com/claude-skills/cli.git
cd cli

# Install dependencies
npm install

# Build
npm run build

# Test locally
npm link
claude-skills --version
```

### Running Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write JSDoc comments

---

*This documentation is continuously updated. Check https://claude-skills.com/docs/cli for the latest version.*
