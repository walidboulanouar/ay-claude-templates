/**
 * Health command - Show package health scores
 */
export declare function healthCommand(packageName: string | undefined, options?: {
    all?: boolean;
}): Promise<void>;
/**
 * Compare command - Compare similar packages
 */
export declare function compareCommand(packageNames: string[]): Promise<void>;
/**
 * Recommendations command - Get smart package recommendations
 */
export declare function recommendationsCommand(options: {
    limit?: number;
}): Promise<void>;
/**
 * Updates command - Check for package updates
 */
export declare function updatesCommand(options: {
    install?: boolean;
}): Promise<void>;
//# sourceMappingURL=advanced-features.d.ts.map