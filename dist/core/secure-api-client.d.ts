import { AxiosInstance } from 'axios';
import { CLIAuthentication } from './auth.js';
/**
 * Secure API client with authentication, rate limiting, and request signing
 */
export declare class SecureAPIClient {
    private axiosInstance;
    private auth;
    private rateLimiter;
    private apiUrl;
    constructor(apiUrl: string, clientId: string);
    /**
     * Sign request with HMAC-SHA256
     */
    private signRequest;
    /**
     * Get endpoint name for rate limiting
     */
    private getEndpointName;
    /**
     * Get axios instance
     */
    get client(): AxiosInstance;
    /**
     * Get auth instance
     */
    get authentication(): CLIAuthentication;
}
//# sourceMappingURL=secure-api-client.d.ts.map