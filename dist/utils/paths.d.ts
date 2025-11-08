export type InstallationScope = 'global' | 'local';
export interface ClaudePaths {
    global: string;
    local: string;
    config: string;
}
/**
 * Get platform name for display purposes
 */
export declare function getPlatformName(): string;
/**
 * Normalize path for cross-platform compatibility
 * Ensures consistent path separators
 */
export declare function normalizePath(path: string): string;
/**
 * Get platform-specific Claude Code directory paths
 * Claude Code uses ~/.claude/ for user scope and .claude/ for project scope
 */
export declare function getClaudePaths(): ClaudePaths;
/**
 * Get installation directory based on scope
 */
export declare function getInstallDir(scope: InstallationScope): string;
/**
 * Detect installation scope (local if .claude exists, otherwise global)
 */
export declare function detectScope(): InstallationScope;
/**
 * Get content type directory within installation directory
 * Uses cross-platform path joining
 * Claude Code structure: ~/.claude/{type}s/ or .claude/{type}s/
 */
export declare function getContentTypeDir(baseDir: string, contentType: string): string;
/**
 * Get Claude Code settings.json path for a given scope
 */
export declare function getSettingsPath(scope: InstallationScope): string;
/**
 * Get npm global bin directory for PATH configuration
 */
export declare function getNpmGlobalBin(): string;
/**
 * Ensure directory exists
 */
export declare function ensureDir(dir: string): Promise<void>;
//# sourceMappingURL=paths.d.ts.map