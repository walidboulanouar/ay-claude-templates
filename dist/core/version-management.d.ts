/**
 * Version Management System
 * Enhanced version management with rollback and changelog support
 */
export interface VersionInfo {
    version: string;
    installedAt: string;
    changelog?: string;
    breakingChanges?: boolean;
    canRollback: boolean;
}
export interface PackageVersionHistory {
    packageId: string;
    packageName: string;
    packageType: string;
    versions: VersionInfo[];
    currentVersion: string;
}
/**
 * Load version history
 */
export declare function loadVersionHistory(scope: 'global' | 'local'): Promise<PackageVersionHistory[]>;
/**
 * Save version history
 */
export declare function saveVersionHistory(history: PackageVersionHistory[], scope: 'global' | 'local'): Promise<void>;
/**
 * Record package version installation
 */
export declare function recordVersionInstallation(packageId: string, packageName: string, packageType: string, version: string, scope: 'global' | 'local', changelog?: string): Promise<void>;
/**
 * Get available versions for rollback
 */
export declare function getRollbackVersions(packageName: string, packageType: string, scope: 'global' | 'local'): Promise<VersionInfo[]>;
/**
 * Check for package updates
 */
export declare function checkForUpdates(scope?: 'global' | 'local'): Promise<Array<{
    package: {
        name: string;
        type: string;
        currentVersion: string;
    };
    latestVersion: string;
    updateAvailable: boolean;
    changelog?: string;
}>>;
/**
 * Compare versions
 */
export declare function compareVersions(v1: string, v2: string): number;
/**
 * Check if version is valid
 */
export declare function isValidVersion(version: string): boolean;
//# sourceMappingURL=version-management.d.ts.map