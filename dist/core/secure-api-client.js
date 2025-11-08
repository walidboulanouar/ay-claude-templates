import axios from 'axios';
import { createHmac } from 'crypto';
import { CLIAuthentication, SecureTokenStorage } from './auth.js';
/**
 * Rate limiter for client-side throttling
 */
class RateLimiter {
    requests = new Map();
    limits = new Map();
    constructor() {
        // Define rate limits
        this.limits.set('search', { max: 100, window: 60 * 60 * 1000 }); // 100 per hour
        this.limits.set('download', { max: 50, window: 60 * 60 * 1000 }); // 50 per hour
        this.limits.set('install', { max: 20, window: 60 * 60 * 1000 }); // 20 per hour
    }
    /**
     * Check if request is allowed
     */
    canMakeRequest(endpoint) {
        const limit = this.limits.get(endpoint);
        if (!limit)
            return true; // No limit defined
        const now = Date.now();
        const key = endpoint;
        const requests = this.requests.get(key) || [];
        // Remove old requests outside the window
        const validRequests = requests.filter(timestamp => now - timestamp < limit.window);
        // Check if limit exceeded
        if (validRequests.length >= limit.max) {
            return false;
        }
        // Add current request
        validRequests.push(now);
        this.requests.set(key, validRequests);
        return true;
    }
    /**
     * Get time until next request allowed
     */
    getTimeUntilNextRequest(endpoint) {
        const limit = this.limits.get(endpoint);
        if (!limit)
            return 0;
        const now = Date.now();
        const requests = this.requests.get(endpoint) || [];
        const validRequests = requests.filter(timestamp => now - timestamp < limit.window);
        if (validRequests.length === 0)
            return 0;
        const oldestRequest = validRequests[0];
        return limit.window - (now - oldestRequest);
    }
}
/**
 * Secure API client with authentication, rate limiting, and request signing
 */
export class SecureAPIClient {
    axiosInstance;
    auth;
    rateLimiter;
    apiUrl;
    constructor(apiUrl, clientId) {
        this.apiUrl = apiUrl;
        this.auth = new CLIAuthentication({
            apiUrl,
            clientId,
            deviceCodeEndpoint: '/api/v1/auth/device-code',
            tokenEndpoint: '/api/v1/auth/token',
        });
        this.rateLimiter = new RateLimiter();
        // Create axios instance with interceptors
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            timeout: 30000,
            headers: {
                'User-Agent': 'claude-skills-cli/1.0.0',
            },
        });
        // Request interceptor: Add auth and signing
        this.axiosInstance.interceptors.request.use(async (config) => {
            // Get authenticated token
            const token = await this.auth.getAuthenticatedToken();
            if (!token) {
                throw new Error('Not authenticated. Run "claude-skills login" first.');
            }
            // Add authorization header
            config.headers.Authorization = `Bearer ${token.accessToken}`;
            // Sign request (HMAC-SHA256)
            const signature = this.signRequest(config, token.accessToken);
            config.headers['X-Request-Signature'] = signature;
            config.headers['X-Request-Timestamp'] = Date.now().toString();
            // Rate limiting check
            const endpoint = this.getEndpointName(config.url || '');
            if (!this.rateLimiter.canMakeRequest(endpoint)) {
                const waitTime = this.rateLimiter.getTimeUntilNextRequest(endpoint);
                throw new Error(`Rate limit exceeded for ${endpoint}. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
            }
            return config;
        }, (error) => Promise.reject(error));
        // Response interceptor: Handle errors
        this.axiosInstance.interceptors.response.use((response) => response, async (error) => {
            if (axios.isAxiosError(error)) {
                // Handle 401 (unauthorized) - token expired
                if (error.response?.status === 401) {
                    // Try to refresh token
                    const token = await SecureTokenStorage.getToken();
                    if (token?.refreshToken) {
                        try {
                            await this.auth.refreshToken(token.refreshToken);
                            // Retry request
                            return this.axiosInstance.request(error.config);
                        }
                        catch (refreshError) {
                            throw new Error('Authentication expired. Please run "claude-skills login" again.');
                        }
                    }
                    else {
                        throw new Error('Authentication expired. Please run "claude-skills login" again.');
                    }
                }
                // Handle 429 (rate limit)
                if (error.response?.status === 429) {
                    const retryAfter = error.response.headers['retry-after'];
                    throw new Error(`Rate limit exceeded. Please wait ${retryAfter || 'a few'} seconds before retrying.`);
                }
            }
            return Promise.reject(error);
        });
    }
    /**
     * Sign request with HMAC-SHA256
     */
    signRequest(config, token) {
        const timestamp = Date.now().toString();
        const method = (config.method || 'get').toUpperCase();
        const path = config.url || '';
        const body = config.data ? JSON.stringify(config.data) : '';
        const message = `${method}${path}${timestamp}${body}`;
        const secret = token.substring(0, 32); // Use first 32 chars of token as secret
        const signature = createHmac('sha256', secret).update(message).digest('hex');
        return signature;
    }
    /**
     * Get endpoint name for rate limiting
     */
    getEndpointName(url) {
        if (url.includes('/search'))
            return 'search';
        if (url.includes('/download'))
            return 'download';
        if (url.includes('/install'))
            return 'install';
        return 'default';
    }
    /**
     * Get axios instance
     */
    get client() {
        return this.axiosInstance;
    }
    /**
     * Get auth instance
     */
    get authentication() {
        return this.auth;
    }
}
//# sourceMappingURL=secure-api-client.js.map