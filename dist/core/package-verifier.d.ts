export interface PackageVerification {
    valid: boolean;
    hash?: string;
    expectedHash?: string;
    errors: string[];
}
/**
 * Verify package integrity and security
 */
export declare class PackageVerifier {
    /**
     * Verify package hash
     */
    static verifyHash(filePath: string, expectedHash: string): Promise<boolean>;
    /**
     * Validate package structure
     */
    static validateStructure(packageDir: string, contentType: string): Promise<PackageVerification>;
    /**
     * Scan for malicious content
     */
    static scanForMaliciousContent(packageDir: string): Promise<PackageVerification>;
    /**
     * Complete package verification
     */
    static verifyPackage(filePath: string, packageDir: string, contentType: string, expectedHash?: string): Promise<PackageVerification>;
}
//# sourceMappingURL=package-verifier.d.ts.map