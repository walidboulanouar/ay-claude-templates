import type { InstallationScope } from '../utils/paths.js';
/**
 * Package Bundles System
 * Install multiple related packages together
 */
export interface PackageBundle {
    id: string;
    name: string;
    description: string;
    packages: Array<{
        name: string;
        type: string;
        version?: string;
    }>;
    category: string;
    tags: string[];
    author?: string;
}
/**
 * Predefined bundles (can be loaded from API later)
 */
export declare const PREDEFINED_BUNDLES: PackageBundle[];
/**
 * Install a bundle
 */
export declare function installBundle(bundleId: string, scope: InstallationScope, installFn: (name: string, type: string, opts: any) => Promise<void>): Promise<void>;
/**
 * List available bundles
 */
export declare function listBundles(): PackageBundle[];
/**
 * Get bundle by ID
 */
export declare function getBundle(bundleId: string): PackageBundle | undefined;
//# sourceMappingURL=bundles.d.ts.map