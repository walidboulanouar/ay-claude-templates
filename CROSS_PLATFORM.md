# Cross-Platform Compatibility Guide

The Claude Skills CLI is designed to work seamlessly on **Windows**, **Linux**, and **macOS**. This document outlines platform-specific considerations and ensures consistent behavior across all operating systems.

## ✅ Supported Platforms

- **Windows** 10/11 (x64, ARM64)
- **Linux** (all distributions with Node.js 18+)
- **macOS** 10.15+ (Intel and Apple Silicon)

## 📁 Platform-Specific Paths

### macOS
```
Global:  ~/Library/Application Support/Claude/marketplace/
Config:  ~/Library/Application Support/Claude/claude_desktop_config.json
Local:   ./.claude/ (in project directory)
```

### Windows
```
Global:  %APPDATA%\Claude\marketplace\
         (usually C:\Users\<user>\AppData\Roaming\Claude\marketplace\)
Config:  %APPDATA%\Claude\claude_desktop_config.json
Local:   .\.claude\ (in project directory)
```

### Linux
```
Global:  ~/.config/Claude/marketplace/
         (or $XDG_CONFIG_HOME/Claude/marketplace/ if set)
Config:  ~/.config/Claude/claude_desktop_config.json
Local:   ./.claude/ (in project directory)
```

## 🔐 Authentication & Security

### Secure Token Storage

The CLI uses `keytar` for secure credential storage, which leverages:

- **Windows**: Windows Credential Store (Windows Credential Manager)
- **macOS**: macOS Keychain
- **Linux**: libsecret (GNOME Keyring, KWallet, etc.)

**Requirements:**
- Windows: No additional setup needed
- macOS: No additional setup needed
- Linux: Install `libsecret` development package:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install libsecret-1-dev
  
  # Fedora/RHEL
  sudo dnf install libsecret-devel
  
  # Arch Linux
  sudo pacman -S libsecret
  ```

### Device Identification

Device IDs are generated using platform-specific identifiers:

- **Windows**: `hostname + username + USERPROFILE`
- **Linux/macOS**: `hostname + username + uid`

This ensures unique device identification across platforms.

## 🛠️ Path Handling

All file paths are handled using Node.js's `path` module, which automatically:

- Uses correct path separators (`\` on Windows, `/` on Unix)
- Handles absolute and relative paths correctly
- Normalizes paths for consistency
- Respects platform-specific path length limits

### Path Normalization

The CLI includes a `normalizePath()` utility that:

1. Replaces mixed separators (`/` and `\`) with platform-specific ones
2. Normalizes relative paths (`.`, `..`)
3. Ensures consistent path representation

## 📦 Package Installation

### ZIP Extraction

The CLI uses `JSZip` for cross-platform ZIP extraction:

- Handles ZIP files created on any platform
- Preserves file permissions (where supported)
- Supports Unicode filenames
- Works with both ZIP64 and standard ZIP formats

### File Permissions

- **Windows**: File permissions are preserved where possible
- **Unix**: Executable permissions are preserved for scripts
- **macOS**: Extended attributes are preserved

## 🌐 Environment Variables

The CLI respects platform-specific environment variables:

### Windows
- `%APPDATA%` - Used for global installation path
- `%USERPROFILE%` - Used for device identification
- `%LOCALAPPDATA%` - Alternative for local data

### Linux
- `$XDG_CONFIG_HOME` - Config directory (defaults to `~/.config`)
- `$HOME` - User home directory
- `$USER` - Username

### macOS
- `$HOME` - User home directory
- `$USER` - Username

## 🔧 Platform-Specific Features

### Windows

**Command Prompt & PowerShell:**
- Full support for both shells
- Unicode support for international characters
- Long path support (if enabled in Windows)

**Path Length Limits:**
- Default: 260 characters
- Extended: Up to 32,767 characters (if enabled)

**Line Endings:**
- ZIP files preserve original line endings
- Text files use platform-appropriate endings

### Linux

**Desktop Environments:**
- GNOME: Uses libsecret (GNOME Keyring)
- KDE: Uses libsecret (KWallet backend)
- Other: Falls back to file-based storage if libsecret unavailable

**File Permissions:**
- Executable scripts maintain permissions
- Directory permissions are preserved

**Case Sensitivity:**
- File systems may be case-sensitive
- Package names are case-insensitive in CLI

### macOS

**Keychain Integration:**
- Uses macOS Keychain for secure storage
- Requires user permission on first use
- Works with both Intel and Apple Silicon

**File System:**
- Case-insensitive by default (APFS)
- Preserves extended attributes
- Supports Unicode filenames

## 🐛 Troubleshooting

### Common Issues

#### Windows: "Path too long" error
**Solution:** Enable long path support:
```powershell
# Run as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

#### Linux: "libsecret not found"
**Solution:** Install libsecret development package (see Authentication section above)

#### macOS: Keychain access denied
**Solution:** Grant access in System Preferences > Security & Privacy > Keychain Access

### Platform Detection

Check your platform:
```bash
claude-skills troubleshoot
```

This will show:
- Platform name and version
- Path locations
- Authentication status
- Environment variables

## 📝 Testing Cross-Platform

The CLI is tested on:

- **Windows**: Windows 10/11 (x64, ARM64)
- **Linux**: Ubuntu, Fedora, Arch Linux, Debian
- **macOS**: macOS 10.15+ (Intel and Apple Silicon)

### CI/CD Testing

- GitHub Actions: Windows, Ubuntu, macOS runners
- Automated tests for path handling
- Platform-specific test suites

## 🔍 Platform-Specific Commands

All CLI commands work identically across platforms:

```bash
# These work the same on Windows, Linux, and macOS
claude-skills search "automation"
claude-skills install package-name
claude-skills list
claude-skills info package-name
```

### Command Differences

**None!** All commands behave identically across platforms.

## 📚 Additional Resources

- [Node.js Path Module](https://nodejs.org/api/path.html)
- [keytar Documentation](https://github.com/atom/node-keytar)
- [JSZip Documentation](https://stuk.github.io/jszip/)

## ✅ Verification Checklist

Before reporting platform-specific issues, verify:

- [ ] Node.js version 18+ installed
- [ ] Platform-specific dependencies installed (libsecret on Linux)
- [ ] Sufficient permissions for installation directories
- [ ] Environment variables set correctly
- [ ] No antivirus/firewall blocking CLI operations

## 🆘 Getting Help

If you encounter platform-specific issues:

1. Run `claude-skills troubleshoot` for diagnostics
2. Check platform-specific sections above
3. Review error messages for platform hints
4. Open an issue with platform information

---

**Last Updated:** 2024-11-03  
**CLI Version:** 1.0.0
