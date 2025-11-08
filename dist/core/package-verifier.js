import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';
/**
 * Verify package integrity and security
 */
export class PackageVerifier {
    /**
     * Verify package hash
     */
    static async verifyHash(filePath, expectedHash) {
        const spinner = ora('Verifying package integrity...').start();
        try {
            const fileBuffer = await readFile(filePath);
            const hash = createHash('sha256').update(fileBuffer).digest('hex');
            if (hash !== expectedHash.toLowerCase()) {
                spinner.fail('Package integrity check failed');
                console.error(chalk.red(`Expected: ${expectedHash}`));
                console.error(chalk.red(`Got:      ${hash}`));
                return false;
            }
            spinner.succeed('Package integrity verified');
            return true;
        }
        catch (error) {
            spinner.fail('Failed to verify package');
            throw error;
        }
    }
    /**
     * Validate package structure
     */
    static async validateStructure(packageDir, contentType) {
        const errors = [];
        const { existsSync, readdirSync, statSync } = await import('fs');
        const { join } = await import('path');
        // Check for required files based on content type
        const requiredFiles = {
            skill: ['SKILL.md'],
            agent: ['AGENT.md'],
            command: [], // Commands can be single files
            hook: [], // Hooks can be single files
            plugin: ['plugin.json', 'manifest.json'],
            mcp: ['mcp.json'],
            settings: ['settings.json'],
        };
        const required = requiredFiles[contentType] || [];
        for (const file of required) {
            const filePath = join(packageDir, file);
            if (!existsSync(filePath)) {
                errors.push(`Missing required file: ${file}`);
            }
        }
        // Check for suspicious files
        const suspiciousPatterns = [
            /\.exe$/i,
            /\.dll$/i,
            /\.so$/i,
            /\.dylib$/i,
            /\.bat$/i,
            /\.sh$/i,
            /\.ps1$/i,
        ];
        const checkDirectory = (dir) => {
            try {
                const entries = readdirSync(dir);
                for (const entry of entries) {
                    const fullPath = join(dir, entry);
                    const stat = statSync(fullPath);
                    if (stat.isDirectory()) {
                        checkDirectory(fullPath);
                    }
                    else {
                        // Check for suspicious file extensions
                        for (const pattern of suspiciousPatterns) {
                            if (pattern.test(entry)) {
                                errors.push(`Suspicious file detected: ${entry}`);
                            }
                        }
                        // Check file size (max 50MB)
                        if (stat.size > 50 * 1024 * 1024) {
                            errors.push(`File too large: ${entry} (${(stat.size / 1024 / 1024).toFixed(2)}MB)`);
                        }
                    }
                }
            }
            catch (error) {
                errors.push(`Error reading directory: ${dir}`);
            }
        };
        checkDirectory(packageDir);
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    /**
     * Scan for malicious content
     */
    static async scanForMaliciousContent(packageDir) {
        const errors = [];
        const { readFile } = await import('fs/promises');
        const { join } = await import('path');
        const { readdirSync, statSync } = await import('fs');
        const maliciousPatterns = [
            /eval\s*\(/i,
            /exec\s*\(/i,
            /system\s*\(/i,
            /shell_exec/i,
            /passthru/i,
            /proc_open/i,
            /popen/i,
            /curl_exec/i,
            /file_get_contents.*http/i,
            /base64_decode/i,
        ];
        const scanFile = async (filePath) => {
            try {
                const content = await readFile(filePath, 'utf-8');
                for (const pattern of maliciousPatterns) {
                    if (pattern.test(content)) {
                        errors.push(`Potentially malicious code detected in: ${filePath}`);
                    }
                }
            }
            catch (error) {
                // Skip binary files
            }
        };
        const scanDirectory = async (dir) => {
            try {
                const entries = readdirSync(dir);
                for (const entry of entries) {
                    const fullPath = join(dir, entry);
                    const stat = statSync(fullPath);
                    if (stat.isDirectory()) {
                        await scanDirectory(fullPath);
                    }
                    else if (stat.isFile()) {
                        // Only scan text files
                        const textExtensions = ['.js', '.ts', '.py', '.sh', '.md', '.json', '.txt'];
                        const ext = entry.substring(entry.lastIndexOf('.'));
                        if (textExtensions.includes(ext)) {
                            await scanFile(fullPath);
                        }
                    }
                }
            }
            catch (error) {
                // Skip errors
            }
        };
        await scanDirectory(packageDir);
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    /**
     * Complete package verification
     */
    static async verifyPackage(filePath, packageDir, contentType, expectedHash) {
        const errors = [];
        // Verify hash if provided
        if (expectedHash) {
            const hashValid = await this.verifyHash(filePath, expectedHash);
            if (!hashValid) {
                errors.push('Package hash verification failed');
                return { valid: false, hash: expectedHash, errors };
            }
        }
        // Extract to temp directory for verification if packageDir doesn't exist yet
        const { existsSync } = await import('fs');
        const { join } = await import('path');
        const { mkdtemp } = await import('fs/promises');
        const { tmpdir } = await import('os');
        let verifyDir = packageDir;
        if (!existsSync(packageDir)) {
            // Extract to temp directory for verification
            const { extractZip } = await import('./installer.js');
            verifyDir = await mkdtemp(join(tmpdir(), 'claude-verify-'));
            await extractZip(filePath, verifyDir);
        }
        try {
            // Validate structure
            const structureCheck = await this.validateStructure(verifyDir, contentType);
            errors.push(...structureCheck.errors);
            // Scan for malicious content
            const securityCheck = await this.scanForMaliciousContent(verifyDir);
            errors.push(...securityCheck.errors);
        }
        finally {
            // Cleanup temp directory if we created it
            if (verifyDir !== packageDir && existsSync(verifyDir)) {
                const { rm } = await import('fs/promises');
                await rm(verifyDir, { recursive: true, force: true });
            }
        }
        return {
            valid: errors.length === 0,
            hash: expectedHash,
            errors,
        };
    }
}
//# sourceMappingURL=package-verifier.js.map