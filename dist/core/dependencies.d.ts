/**
 * Package Dependencies System
 * Auto-detect and install dependencies for packages
 */
export interface PackageDependency {
    name: string;
    type: string;
    version?: string;
    optional?: boolean;
}
export interface PackageManifest {
    name: string;
    type: string;
    version: string;
    dependencies?: PackageDependency[];
    peerDependencies?: PackageDependency[];
    optionalDependencies?: PackageDependency[];
}
/**
 * Read package manifest from installed package
 */
export declare function readPackageManifest(packageDir: string): Promise<PackageManifest | null>;
/**
 * Resolve package dependencies
 */
export declare function resolveDependencies(manifest: PackageManifest, installedPackages: Array<{
    name: string;
    type: string;
    version: string;
}>): Promise<PackageDependency[]>;
//# sourceMappingURL=dependencies.d.ts.map