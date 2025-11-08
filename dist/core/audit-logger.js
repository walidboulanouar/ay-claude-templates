import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
/**
 * Audit logging for security monitoring
 */
export class AuditLogger {
    logFile;
    constructor(logDir) {
        this.logFile = join(logDir, 'audit.log');
    }
    /**
     * Log an operation
     */
    async log(entry) {
        try {
            const logLine = JSON.stringify({
                ...entry,
                timestamp: new Date().toISOString(),
            }) + '\n';
            // Append to log file
            await writeFile(this.logFile, logLine, { flag: 'a' });
        }
        catch (error) {
            // Don't throw - logging failures shouldn't break the CLI
            console.error(chalk.yellow('Warning: Failed to write audit log'));
        }
    }
    /**
     * Log authentication event
     */
    async logAuth(operation, success, error) {
        await this.log({
            timestamp: new Date().toISOString(),
            operation: `auth.${operation}`,
            success,
            error,
        });
    }
    /**
     * Log download event
     */
    async logDownload(packageId, packageType, success, error, metadata) {
        await this.log({
            timestamp: new Date().toISOString(),
            operation: 'download',
            packageId,
            packageType,
            success,
            error,
            metadata,
        });
    }
    /**
     * Log install event
     */
    async logInstall(packageId, packageType, success, error, metadata) {
        await this.log({
            timestamp: new Date().toISOString(),
            operation: 'install',
            packageId,
            packageType,
            success,
            error,
            metadata,
        });
    }
    /**
     * Read recent audit logs
     */
    async readRecent(limit = 100) {
        if (!existsSync(this.logFile)) {
            return [];
        }
        try {
            const content = await readFile(this.logFile, 'utf-8');
            const lines = content.trim().split('\n').filter(line => line.trim());
            const entries = lines
                .slice(-limit)
                .map(line => JSON.parse(line))
                .reverse(); // Most recent first
            return entries;
        }
        catch (error) {
            return [];
        }
    }
}
//# sourceMappingURL=audit-logger.js.map