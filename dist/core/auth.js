import axios from 'axios';
import chalk from 'chalk';
import { createHash } from 'crypto';
import { hostname, userInfo } from 'os';
import { platform } from 'process';
import keytar from 'keytar';
import open from 'open';
import ora from 'ora';
const SERVICE_NAME = 'claude-skills-cli';
const ACCOUNT_NAME = 'claude-skills-token';
/**
 * Secure token storage using system keychain
 */
export class SecureTokenStorage {
    /**
     * Store token securely in system keychain
     */
    static async storeToken(token) {
        try {
            const tokenData = JSON.stringify({
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                expiresAt: token.expiresAt.toISOString(),
                scopes: token.scopes,
                userId: token.userId,
                deviceId: token.deviceId,
            });
            await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, tokenData);
        }
        catch (error) {
            throw new Error(`Failed to store token: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Retrieve token from system keychain
     */
    static async getToken() {
        try {
            const tokenData = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
            if (!tokenData)
                return null;
            const parsed = JSON.parse(tokenData);
            return {
                ...parsed,
                expiresAt: new Date(parsed.expiresAt),
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Delete stored token
     */
    static async deleteToken() {
        try {
            await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
        }
        catch (error) {
            // Ignore errors if token doesn't exist
        }
    }
    /**
     * Check if token is valid and not expired
     */
    static async isTokenValid() {
        const token = await this.getToken();
        if (!token)
            return false;
        // Check if token is expired (with 5 minute buffer)
        const buffer = 5 * 60 * 1000; // 5 minutes
        return token.expiresAt.getTime() > Date.now() + buffer;
    }
}
/**
 * OAuth Device Flow for CLI authentication
 * More secure than browser redirect for CLI tools
 */
export class CLIAuthentication {
    config;
    deviceId;
    constructor(config) {
        this.config = config;
        this.deviceId = this.getOrCreateDeviceId();
    }
    /**
     * Get or create unique device ID
     * Cross-platform device identification
     */
    getOrCreateDeviceId() {
        // Generate based on machine identifiers (cross-platform)
        // Use platform-specific identifiers
        let machineId;
        if (platform === 'win32') {
            // Windows: Use hostname + username + user profile path
            const userProfile = process.env.USERPROFILE || process.env.HOME || '';
            machineId = `${hostname()}-${userInfo().username}-${userProfile}`;
        }
        else {
            // Unix-like: Use hostname + username + uid
            const uid = userInfo().uid || '';
            machineId = `${hostname()}-${userInfo().username}-${uid}`;
        }
        return createHash('sha256').update(machineId).digest('hex').substring(0, 16);
    }
    /**
     * Initiate OAuth device flow
     */
    async login() {
        const spinner = ora('Initiating authentication...').start();
        try {
            // Step 1: Request device code
            spinner.text = 'Requesting device code...';
            const deviceCodeResponse = await axios.post(`${this.config.apiUrl}${this.config.deviceCodeEndpoint}`, {
                client_id: this.config.clientId,
                scope: 'read:content read:download',
                device_id: this.deviceId,
            });
            const { device_code, user_code, verification_uri, expires_in, interval } = deviceCodeResponse.data;
            spinner.succeed();
            // Step 2: Display user code and open browser
            console.log(chalk.blue('\n🔐 Authentication Required\n'));
            console.log(chalk.white('Please visit:'), chalk.cyan(verification_uri));
            console.log(chalk.white('Enter code:'), chalk.bold.yellow(user_code));
            console.log();
            // Open browser automatically
            try {
                await open(verification_uri);
            }
            catch (error) {
                // Browser open failed, user can manually visit
            }
            // Step 3: Poll for token
            const pollingSpinner = ora('Waiting for authorization...').start();
            const startTime = Date.now();
            const timeout = expires_in * 1000; // Convert to milliseconds
            while (Date.now() - startTime < timeout) {
                await new Promise(resolve => setTimeout(resolve, interval * 1000));
                try {
                    const tokenResponse = await axios.post(`${this.config.apiUrl}${this.config.tokenEndpoint}`, {
                        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                        device_code,
                        client_id: this.config.clientId,
                    });
                    const { access_token, refresh_token, expires_in: tokenExpiresIn, scope } = tokenResponse.data;
                    // Calculate expiration time
                    const expiresAt = new Date(Date.now() + tokenExpiresIn * 1000);
                    const token = {
                        accessToken: access_token,
                        refreshToken: refresh_token,
                        expiresAt,
                        scopes: scope.split(' '),
                        userId: '', // Will be fetched from token
                        deviceId: this.deviceId,
                    };
                    // Fetch user info
                    const userInfo = await this.fetchUserInfo(access_token);
                    token.userId = userInfo.id;
                    // Store token securely
                    await SecureTokenStorage.storeToken(token);
                    pollingSpinner.succeed(chalk.green('Authentication successful!'));
                    return token;
                }
                catch (error) {
                    if (axios.isAxiosError(error)) {
                        const errorCode = error.response?.data?.error;
                        if (errorCode === 'authorization_pending') {
                            // Still waiting, continue polling
                            continue;
                        }
                        else if (errorCode === 'slow_down') {
                            // Increase polling interval
                            await new Promise(resolve => setTimeout(resolve, interval * 2000));
                            continue;
                        }
                        else if (errorCode === 'expired_token') {
                            pollingSpinner.fail('Authorization expired. Please try again.');
                            throw new Error('Authorization expired');
                        }
                        else if (errorCode === 'access_denied') {
                            pollingSpinner.fail('Authorization denied.');
                            throw new Error('Authorization denied');
                        }
                    }
                    // Other errors, continue polling
                    continue;
                }
            }
            pollingSpinner.fail('Authorization timeout. Please try again.');
            throw new Error('Authorization timeout');
        }
        catch (error) {
            spinner.fail('Authentication failed');
            throw error;
        }
    }
    /**
     * Fetch user info from token
     */
    async fetchUserInfo(accessToken) {
        const response = await axios.get(`${this.config.apiUrl}/api/v1/user/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
    /**
     * Refresh access token
     */
    async refreshToken(refreshToken) {
        try {
            const response = await axios.post(`${this.config.apiUrl}${this.config.tokenEndpoint}`, {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: this.config.clientId,
            });
            const { access_token, refresh_token: newRefreshToken, expires_in, scope } = response.data;
            const expiresAt = new Date(Date.now() + expires_in * 1000);
            const token = {
                accessToken: access_token,
                refreshToken: newRefreshToken,
                expiresAt,
                scopes: scope.split(' '),
                userId: '', // Will be updated
                deviceId: this.deviceId,
            };
            // Fetch user info
            const userInfo = await this.fetchUserInfo(access_token);
            token.userId = userInfo.id;
            await SecureTokenStorage.storeToken(token);
            return token;
        }
        catch (error) {
            throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Logout (delete stored token)
     */
    async logout() {
        await SecureTokenStorage.deleteToken();
        console.log(chalk.green('✓ Logged out successfully'));
    }
    /**
     * Get current authenticated token
     */
    async getAuthenticatedToken() {
        const token = await SecureTokenStorage.getToken();
        if (!token)
            return null;
        // Check if token needs refresh
        if (!await SecureTokenStorage.isTokenValid()) {
            if (token.refreshToken) {
                try {
                    return await this.refreshToken(token.refreshToken);
                }
                catch (error) {
                    // Refresh failed, user needs to login again
                    await SecureTokenStorage.deleteToken();
                    return null;
                }
            }
            else {
                // No refresh token, user needs to login again
                await SecureTokenStorage.deleteToken();
                return null;
            }
        }
        return token;
    }
}
//# sourceMappingURL=auth.js.map