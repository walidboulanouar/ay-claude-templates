import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getClaudePaths } from '../utils/paths.js';
import semver from 'semver';
/**
 * Get version history file path
 */
function getVersionHistoryPath(scope) {
    const paths = getClaudePaths();
    const baseDir = scope === 'global' ? paths.global : paths.local;
    return join(baseDir, 'version-history.json');
}
/**
 * Load version history
 */
export async function loadVersionHistory(scope) {
    const historyPath = getVersionHistoryPath(scope);
    if (!existsSync(historyPath)) {
        return [];
    }
    try {
        const content = await readFile(historyPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        return [];
    }
}
/**
 * Save version history
 */
export async function saveVersionHistory(history, scope) {
    const historyPath = getVersionHistoryPath(scope);
    const { ensureDir } = await import('../utils/paths.js');
    const { dirname } = await import('path');
    await ensureDir(dirname(historyPath));
    await writeFile(historyPath, JSON.stringify(history, null, 2));
}
/**
 * Record package version installation
 */
export async function recordVersionInstallation(packageId, packageName, packageType, version, scope, changelog) {
    const history = await loadVersionHistory(scope);
    let pkgHistory = history.find((h) => h.packageId === packageId && h.packageType === packageType);
    if (!pkgHistory) {
        pkgHistory = {
            packageId,
            packageName,
            packageType,
            versions: [],
            currentVersion: version,
        };
        history.push(pkgHistory);
    }
    // Check if version already recorded
    const existingVersion = pkgHistory.versions.find((v) => v.version === version);
    if (!existingVersion) {
        pkgHistory.versions.push({
            version,
            installedAt: new Date().toISOString(),
            changelog,
            breakingChanges: changelog?.toLowerCase().includes('breaking') || false,
            canRollback: pkgHistory.versions.length > 0,
        });
    }
    pkgHistory.currentVersion = version;
    await saveVersionHistory(history, scope);
}
/**
 * Get available versions for rollback
 */
export async function getRollbackVersions(packageName, packageType, scope) {
    const history = await loadVersionHistory(scope);
    const pkgHistory = history.find((h) => h.packageName === packageName && h.packageType === packageType);
    if (!pkgHistory) {
        return [];
    }
    // Return previous versions (excluding current)
    return pkgHistory.versions
        .filter((v) => v.version !== pkgHistory.currentVersion)
        .sort((a, b) => {
        // Sort by version (newest first)
        return semver.compare(b.version, a.version) || 0;
    });
}
/**
 * Check for package updates
 */
export async function checkForUpdates(scope) {
    const { getInstalledPackages } = await import('./registry.js');
    const installed = await getInstalledPackages(scope);
    const updates = [];
    // This would check against API for latest versions
    // For now, return empty array (would be implemented with API call)
    return updates;
}
/**
 * Compare versions
 */
export function compareVersions(v1, v2) {
    return semver.compare(v1, v2) || 0;
}
/**
 * Check if version is valid
 */
export function isValidVersion(version) {
    return semver.valid(version) !== null;
}
//# sourceMappingURL=version-management.js.map