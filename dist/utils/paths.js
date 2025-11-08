import { existsSync } from 'fs';
import { homedir } from 'os';
import { join, normalize, resolve, sep } from 'path';
import { platform } from 'process';
/**
 * Get platform name for display purposes
 */
export function getPlatformName() {
    switch (platform) {
        case 'darwin':
            return 'macOS';
        case 'win32':
            return 'Windows';
        case 'linux':
            return 'Linux';
        default:
            return platform;
    }
}
/**
 * Normalize path for cross-platform compatibility
 * Ensures consistent path separators
 */
export function normalizePath(path) {
    return normalize(path.replace(/[/\\]/g, sep));
}
/**
 * Get platform-specific Claude Code directory paths
 * Claude Code uses ~/.claude/ for user scope and .claude/ for project scope
 */
export function getClaudePaths() {
    const home = homedir();
    let globalPath;
    let configPath;
    // Claude Code uses ~/.claude/ for global/user scope (not Claude Desktop paths)
    // This is consistent across all platforms
    globalPath = join(home, '.claude');
    // Claude Code settings.json location
    configPath = join(home, '.claude', 'settings.json');
    // Normalize paths for cross-platform compatibility
    globalPath = normalizePath(globalPath);
    configPath = normalizePath(configPath);
    // Local path is always .claude in current directory (project scope)
    // Use resolve to get absolute path, normalize for consistency
    const localPath = normalizePath(resolve(process.cwd(), '.claude'));
    return {
        global: globalPath,
        local: localPath,
        config: configPath,
    };
}
/**
 * Get installation directory based on scope
 */
export function getInstallDir(scope) {
    const paths = getClaudePaths();
    return scope === 'global' ? paths.global : paths.local;
}
/**
 * Detect installation scope (local if .claude exists, otherwise global)
 */
export function detectScope() {
    const paths = getClaudePaths();
    return existsSync(paths.local) ? 'local' : 'global';
}
/**
 * Get content type directory within installation directory
 * Uses cross-platform path joining
 * Claude Code structure: ~/.claude/{type}s/ or .claude/{type}s/
 */
export function getContentTypeDir(baseDir, contentType) {
    const typeMap = {
        skill: 'skills',
        agent: 'agents',
        command: 'commands',
        hook: 'hooks',
        plugin: 'plugins',
        mcp: 'mcps',
        settings: 'settings',
    };
    const dirName = typeMap[contentType] || contentType + 's';
    return normalizePath(join(baseDir, dirName));
}
/**
 * Get Claude Code settings.json path for a given scope
 */
export function getSettingsPath(scope) {
    if (scope === 'global') {
        return getClaudePaths().config; // ~/.claude/settings.json
    }
    else {
        return normalizePath(resolve(process.cwd(), '.claude', 'settings.json'));
    }
}
/**
 * Get npm global bin directory for PATH configuration
 */
export function getNpmGlobalBin() {
    const { execSync } = require('child_process');
    try {
        // Get npm global prefix
        const prefix = execSync('npm config get prefix', { encoding: 'utf-8' }).trim();
        return normalizePath(join(prefix, platform === 'win32' ? '' : 'bin'));
    }
    catch (error) {
        // Fallback: try common locations
        const home = homedir();
        if (platform === 'win32') {
            return normalizePath(join(home, 'AppData', 'Roaming', 'npm'));
        }
        else {
            return normalizePath(join(home, '.npm-global', 'bin'));
        }
    }
}
/**
 * Ensure directory exists
 */
export async function ensureDir(dir) {
    const { mkdir } = await import('fs/promises');
    await mkdir(dir, { recursive: true });
}
//# sourceMappingURL=paths.js.map