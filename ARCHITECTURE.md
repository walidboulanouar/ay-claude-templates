# Claude Skills CLI - Architecture & Design Decisions

## 🏗️ Architecture Overview

### Design Philosophy

The CLI is designed with these principles:

1. **Universal First**: Works seamlessly with all 7 content types
2. **Developer Experience**: Rich output, scripting support, helpful errors
3. **Security First**: Multiple security layers, verification, audit logging
4. **User-Friendly**: Beautiful output, interactive prompts, clear help
5. **Well-Documented**: Comprehensive docs for users and developers

---

## 📁 Project Structure

```
cli/
├── src/
│   ├── commands/              # CLI command implementations
│   │   ├── auth.ts            # Authentication (login/logout/whoami)
│   │   ├── install.ts         # Package installation
│   │   ├── list.ts            # List installed packages
│   │   ├── search.ts          # Search marketplace
│   │   ├── browse.ts          # Browse content
│   │   ├── info.ts            # Package information
│   │   ├── update.ts          # Update packages
│   │   ├── uninstall.ts       # Remove packages
│   │   ├── init.ts            # Initialize CLI
│   │   ├── help.ts            # Help system
│   │   ├── troubleshoot.ts    # Diagnostics
│   │   └── stats.ts           # Statistics
│   │
│   ├── core/                  # Core functionality
│   │   ├── auth.ts            # Authentication system
│   │   ├── secure-api-client.ts  # Secure HTTP client
│   │   ├── package-verifier.ts   # Security verification
│   │   ├── audit-logger.ts       # Audit logging
│   │   ├── installer.ts          # Package installation
│   │   └── registry.ts           # Package registry
│   │
│   ├── utils/                 # Utility functions
│   │   ├── paths.ts           # Path management
│   │   ├── content-info.ts    # Content information utilities
│   │   └── update-notifier.ts # Update notifications
│   │
│   └── index.ts               # Main entry point
│
├── docs/                      # Documentation (if needed)
├── tests/                     # Tests (if needed)
├── package.json
├── tsconfig.json
├── README.md
├── DEVELOPER_DOCUMENTATION.md
├── FEATURES.md
├── SECURITY_PLAN.md
└── SECURITY_IMPLEMENTATION.md
```

---

## 🔄 Data Flow

### Installation Flow

```
User: claude-skills install package-name
  ↓
1. Check authentication (get token from keychain)
  ↓
2. Search for package (API call)
  ↓
3. Select package (if multiple matches)
  ↓
4. Get download URL (API call)
  ↓
5. Download package (secure download)
  ↓
6. Verify package integrity (hash + structure + security)
  ↓
7. Extract to installation directory
  ↓
8. Add to registry
  ↓
9. Log operation (audit log)
  ↓
Success: Package installed
```

### Search Flow

```
User: claude-skills search "query"
  ↓
1. Check authentication
  ↓
2. Build search query with filters
  ↓
3. Call search API
  ↓
4. Format results (table/list/json)
  ↓
5. Display results
```

### Authentication Flow

```
User: claude-skills login
  ↓
1. Request device code (API call)
  ↓
2. Display verification URL and code
  ↓
3. Open browser (optional)
  ↓
4. Poll for token (API calls)
  ↓
5. Store token in keychain
  ↓
6. Fetch user info
  ↓
Success: Authenticated
```

---

## 🎨 Design Decisions

### 1. Universal Content Type Support

**Decision:** Single command interface for all 7 types

**Rationale:**
- Consistent user experience
- Easier to learn and use
- Less code duplication
- Type-specific features when needed

**Implementation:**
- Type parameter optional (auto-detection)
- Type-specific info shown when relevant
- Unified search across all types

### 2. Global vs Local Installation

**Decision:** Support both global and local installation

**Rationale:**
- Global: System-wide tools
- Local: Project-specific dependencies
- Matches npm/other package managers
- Flexible for different use cases

**Implementation:**
- `--global` flag for global
- `--local` flag for local
- Default: auto-detect (local if .claude exists)

### 3. Multiple Output Formats

**Decision:** Support table, list, and JSON formats

**Rationale:**
- Table: Best for human reading
- List: Compact, readable
- JSON: Scriptable, parseable

**Implementation:**
- `--format` option
- Default: list (most readable)
- JSON for scripting

### 4. Secure by Default

**Decision:** Security built into every operation

**Rationale:**
- Protect users from malicious packages
- Prevent unauthorized operations
- Maintain platform integrity
- Build trust

**Implementation:**
- Authentication required
- Package verification
- Rate limiting
- Audit logging

### 5. Developer-Friendly

**Decision:** Rich output and scripting support

**Rationale:**
- Developers are primary users
- Scripting enables automation
- Rich output improves UX
- JSON enables integration

**Implementation:**
- Beautiful tables
- JSON output option
- Progress indicators
- Helpful error messages

---

## 🔐 Security Architecture

### Authentication Layers

1. **OAuth Device Flow**
   - No browser redirect needed
   - Secure token exchange
   - Device fingerprinting

2. **Token Storage**
   - System keychain (keytar)
   - Encrypted at rest
   - Never in logs

3. **Request Security**
   - HMAC-SHA256 signing
   - Timestamp included
   - Prevents replay attacks

### Package Security

1. **Hash Verification**
   - SHA-256 integrity check
   - Prevents tampering
   - Ensures authenticity

2. **Structure Validation**
   - Required files check
   - Directory structure
   - File permissions

3. **Security Scanning**
   - Malicious pattern detection
   - Suspicious file detection
   - File size limits

### Rate Limiting

1. **Client-Side**
   - Prevents excessive requests
   - User-friendly errors
   - Automatic backoff

2. **Server-Side**
   - Database-enforced limits
   - Per-user and per-IP
   - Prevents abuse

---

## 📊 Error Handling Strategy

### Error Categories

1. **Authentication Errors**
   - Not authenticated → Suggest login
   - Token expired → Auto-refresh or suggest login
   - Invalid token → Suggest logout and login

2. **Package Errors**
   - Not found → Suggest search
   - Verification failed → Show errors, suggest retry
   - Download failed → Suggest retry

3. **Network Errors**
   - Connection failed → Check internet
   - Timeout → Suggest retry
   - Rate limit → Show wait time

4. **File System Errors**
   - Permission denied → Check permissions
   - Disk full → Free space
   - Path invalid → Check path

### Error Message Format

```typescript
console.error(chalk.red(`\n✗ Operation failed: ${error.message}\n`));
console.log(chalk.yellow('💡 Suggestions:'));
console.log(chalk.gray('  • Suggestion 1'));
console.log(chalk.gray('  • Suggestion 2'));
```

---

## 🧪 Testing Strategy

### Unit Tests
- Command functions
- Utility functions
- Security functions
- Error handling

### Integration Tests
- Authentication flow
- Installation flow
- Search flow
- API interactions

### Security Tests
- Token storage
- Package verification
- Rate limiting
- Input validation

### End-to-End Tests
- Complete workflows
- Error scenarios
- Edge cases
- User journeys

---

## 📝 Documentation Strategy

### User Documentation
- Quick start guide
- Command reference
- Examples
- Troubleshooting

### Developer Documentation
- Architecture overview
- API reference
- Extension guide
- Contributing guide

### Security Documentation
- Security plan
- Implementation details
- Threat model
- Incident response

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **Caching**
   - Token caching
   - Search result caching
   - Package metadata caching

2. **Lazy Loading**
   - Load data on demand
   - Don't fetch unnecessary data
   - Optimize API calls

3. **Parallel Operations**
   - Batch API calls
   - Parallel downloads
   - Concurrent verification

4. **Resource Management**
   - Clean up temp files
   - Limit memory usage
   - Efficient file operations

---

## 🔄 Update Strategy

### CLI Updates

1. **Update Notifications**
   - Check on startup
   - Show update available
   - Link to update instructions

2. **Update Process**
   - npm update -g
   - Version checking
   - Changelog display

### Package Updates

1. **Check for Updates**
   - Compare versions
   - Show outdated packages
   - Update individually or all

2. **Update Process**
   - Download new version
   - Verify integrity
   - Replace old version
   - Update registry

---

## 📈 Monitoring & Analytics

### Metrics to Track

1. **Usage Metrics**
   - Commands executed
   - Packages installed
   - Search queries
   - Errors encountered

2. **Performance Metrics**
   - Command execution time
   - API response time
   - Download speed
   - Verification time

3. **Security Metrics**
   - Authentication success rate
   - Package verification rate
   - Rate limit hits
   - Security incidents

### Logging Strategy

1. **Audit Logs**
   - All operations logged
   - User context included
   - Timestamps
   - Success/failure

2. **Error Logs**
   - Error details
   - Stack traces (dev mode)
   - User context
   - Suggestions

3. **Performance Logs**
   - Operation timing
   - API call timing
   - Resource usage
   - Bottlenecks

---

## 🎯 Future Enhancements

### Planned Features

1. **Dependency Management**
   - Track dependencies
   - Auto-install dependencies
   - Dependency resolution

2. **Package Bundles**
   - Install multiple packages
   - Create custom bundles
   - Share bundles

3. **Cloud Sync**
   - Sync across devices
   - Backup configurations
   - Restore on new machine

4. **Offline Mode**
   - Cache package listings
   - Offline installs
   - Sync when online

5. **Package Signing**
   - Cryptographic signatures
   - Verified publishers
   - Trust levels

---

## 📚 Key Files Explained

### `src/index.ts`
Main entry point. Sets up Commander.js, registers all commands, handles errors.

### `src/core/auth.ts`
Authentication system. Handles OAuth device flow, token storage, token refresh.

### `src/core/secure-api-client.ts`
Secure HTTP client. Adds authentication, request signing, rate limiting, error handling.

### `src/core/package-verifier.ts`
Package verification. Hash checking, structure validation, security scanning.

### `src/core/installer.ts`
Package installation. ZIP extraction, directory management, registry updates.

### `src/utils/content-info.ts`
Content information utilities. Fetches detailed info, formats display.

### `src/commands/*.ts`
Command implementations. Each command is self-contained with error handling.

---

## 🔍 Debugging Guide

### Enable Debug Mode

```bash
export DEBUG=claude-skills:*
claude-skills install package-name
```

### Check Authentication

```bash
claude-skills whoami
```

### Run Diagnostics

```bash
claude-skills troubleshoot
```

### View Audit Logs

```bash
cat ~/.claude/audit.log
```

### Check Registry

```bash
cat ~/.claude/registry.json
```

---

## 💡 Best Practices

### For CLI Development

1. **Always Validate Input**
   - Check package names
   - Validate content types
   - Verify file paths

2. **Provide Helpful Errors**
   - Clear error messages
   - Actionable suggestions
   - Context information

3. **Use Secure API Client**
   - Never bypass authentication
   - Always use secure client
   - Respect rate limits

4. **Log Important Operations**
   - Use audit logger
   - Include user context
   - Track errors

5. **Test Thoroughly**
   - Test all commands
   - Test error cases
   - Test edge cases

---

*This architecture ensures the CLI is maintainable, secure, and user-friendly.*
