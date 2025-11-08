export interface AuditLogEntry {
    timestamp: string;
    operation: string;
    userId?: string;
    deviceId?: string;
    packageId?: string;
    packageType?: string;
    success: boolean;
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Audit logging for security monitoring
 */
export declare class AuditLogger {
    private logFile;
    constructor(logDir: string);
    /**
     * Log an operation
     */
    log(entry: AuditLogEntry): Promise<void>;
    /**
     * Log authentication event
     */
    logAuth(operation: 'login' | 'logout' | 'token_refresh', success: boolean, error?: string): Promise<void>;
    /**
     * Log download event
     */
    logDownload(packageId: string, packageType: string, success: boolean, error?: string, metadata?: Record<string, any>): Promise<void>;
    /**
     * Log install event
     */
    logInstall(packageId: string, packageType: string, success: boolean, error?: string, metadata?: Record<string, any>): Promise<void>;
    /**
     * Read recent audit logs
     */
    readRecent(limit?: number): Promise<AuditLogEntry[]>;
}
//# sourceMappingURL=audit-logger.d.ts.map