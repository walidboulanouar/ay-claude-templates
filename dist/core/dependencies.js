import { readFile } from 'fs/promises';
import { join } from 'path';
/**
 * Read package manifest from installed package
 */
export async function readPackageManifest(packageDir) {
    const manifestPath = join(packageDir, 'package.json');
    const { existsSync } = await import('fs');
    if (!existsSync(manifestPath)) {
        // Try alternative locations
        const altPaths = [
            join(packageDir, 'manifest.json'),
            join(packageDir, '.claude-install.json'),
        ];
        for (const altPath of altPaths) {
            if (existsSync(altPath)) {
                try {
                    const content = await readFile(altPath, 'utf-8');
                    return JSON.parse(content);
                }
                catch {
                    continue;
                }
            }
        }
        return null;
    }
    try {
        const content = await readFile(manifestPath, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
/**
 * Resolve package dependencies
 */
export async function resolveDependencies(manifest, installedPackages) {
    const allDeps = [
        ...(manifest.dependencies || []),
        ...(manifest.peerDependencies || []),
    ];
    // Filter out already installed dependencies
    const missingDeps = allDeps.filter((dep) => {
        return !installedPackages.some((installed) => installed.name === dep.name &&
            installed.type === dep.type &&
            (!dep.version || installed.version === dep.version));
    });
    return missingDeps;
}
//# sourceMappingURL=dependencies.js.map