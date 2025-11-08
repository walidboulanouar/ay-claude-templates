import chalk from 'chalk';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { getClaudePaths } from '../utils/paths.js';
/**
 * Get registry file path
 * Uses cross-platform path joining
 */
function getRegistryPath(scope) {
    const paths = getClaudePaths();
    const baseDir = scope === 'global' ? paths.global : paths.local;
    return join(baseDir, 'registry.json');
}
/**
 * Load registry
 */
export async function loadRegistry(scope) {
    const registryPath = getRegistryPath(scope);
    if (!existsSync(registryPath)) {
        return {
            packages: [],
            version: '1.0.0',
        };
    }
    try {
        const content = await readFile(registryPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.warn(chalk.yellow('Failed to load registry, creating new one'));
        return {
            packages: [],
            version: '1.0.0',
        };
    }
}
/**
 * Save registry
 */
export async function saveRegistry(registry, scope) {
    const registryPath = getRegistryPath(scope);
    const { ensureDir } = await import('../utils/paths.js');
    const { dirname } = await import('path');
    await ensureDir(dirname(registryPath));
    await writeFile(registryPath, JSON.stringify(registry, null, 2));
}
/**
 * Add package to registry
 */
export async function addToRegistry(pkg, scope) {
    const registry = await loadRegistry(scope);
    // Remove existing entry if present
    registry.packages = registry.packages.filter((p) => !(p.name === pkg.name && p.type === pkg.type && p.scope === scope));
    // Add new entry
    registry.packages.push(pkg);
    await saveRegistry(registry, scope);
}
/**
 * Remove package from registry
 */
export async function removeFromRegistry(name, type, scope) {
    const registry = await loadRegistry(scope);
    registry.packages = registry.packages.filter((p) => !(p.name === name && p.type === type && p.scope === scope));
    await saveRegistry(registry, scope);
}
/**
 * Get installed packages
 */
export async function getInstalledPackages(scope, type) {
    const scopes = scope ? [scope] : ['global', 'local'];
    const allPackages = [];
    for (const s of scopes) {
        const registry = await loadRegistry(s);
        let packages = registry.packages.filter((p) => p.scope === s);
        if (type) {
            packages = packages.filter((p) => p.type === type);
        }
        allPackages.push(...packages);
    }
    return allPackages;
}
//# sourceMappingURL=registry.js.map