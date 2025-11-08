export interface CLIToken {
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
    scopes: string[];
    userId: string;
    deviceId: string;
}
export interface AuthConfig {
    apiUrl: string;
    clientId: string;
    deviceCodeEndpoint: string;
    tokenEndpoint: string;
}
/**
 * Secure token storage using system keychain
 */
export declare class SecureTokenStorage {
    /**
     * Store token securely in system keychain
     */
    static storeToken(token: CLIToken): Promise<void>;
    /**
     * Retrieve token from system keychain
     */
    static getToken(): Promise<CLIToken | null>;
    /**
     * Delete stored token
     */
    static deleteToken(): Promise<void>;
    /**
     * Check if token is valid and not expired
     */
    static isTokenValid(): Promise<boolean>;
}
/**
 * OAuth Device Flow for CLI authentication
 * More secure than browser redirect for CLI tools
 */
export declare class CLIAuthentication {
    private config;
    private deviceId;
    constructor(config: AuthConfig);
    /**
     * Get or create unique device ID
     * Cross-platform device identification
     */
    private getOrCreateDeviceId;
    /**
     * Initiate OAuth device flow
     */
    login(): Promise<CLIToken>;
    /**
     * Fetch user info from token
     */
    private fetchUserInfo;
    /**
     * Refresh access token
     */
    refreshToken(refreshToken: string): Promise<CLIToken>;
    /**
     * Logout (delete stored token)
     */
    logout(): Promise<void>;
    /**
     * Get current authenticated token
     */
    getAuthenticatedToken(): Promise<CLIToken | null>;
}
//# sourceMappingURL=auth.d.ts.map