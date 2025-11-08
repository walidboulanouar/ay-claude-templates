import type { InstallationScope } from '../utils/paths.js';
export interface InstallOptions {
    scope: InstallationScope;
    contentType: string;
    version?: string;
}
/**
 * Extract ZIP file to destination directory
 */
export declare function extractZip(zipPath: string, destDir: string): Promise<void>;
/**
 * Install content package
 */
export declare function installPackage(zipPath: string, packageName: string, options: InstallOptions): Promise<string>;
/**
 * Validate package structure
 */
export declare function validatePackage(packageDir: string, contentType: string): Promise<boolean>;
//# sourceMappingURL=installer.d.ts.map