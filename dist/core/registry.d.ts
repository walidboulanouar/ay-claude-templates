/**
 * Local registry for installed packages
 */
export interface InstalledPackage {
    name: string;
    type: string;
    version: string;
    installedAt: string;
    path: string;
    scope: 'global' | 'local';
}
export interface Registry {
    packages: InstalledPackage[];
    version: string;
}
/**
 * Load registry
 */
export declare function loadRegistry(scope: 'global' | 'local'): Promise<Registry>;
/**
 * Save registry
 */
export declare function saveRegistry(registry: Registry, scope: 'global' | 'local'): Promise<void>;
/**
 * Add package to registry
 */
export declare function addToRegistry(pkg: InstalledPackage, scope: 'global' | 'local'): Promise<void>;
/**
 * Remove package from registry
 */
export declare function removeFromRegistry(name: string, type: string, scope: 'global' | 'local'): Promise<void>;
/**
 * Get installed packages
 */
export declare function getInstalledPackages(scope?: 'global' | 'local', type?: string): Promise<InstalledPackage[]>;
//# sourceMappingURL=registry.d.ts.map