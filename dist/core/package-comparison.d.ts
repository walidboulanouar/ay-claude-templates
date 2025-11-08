import { SecureAPIClient } from './secure-api-client.js';
import type { ContentItem } from './api-client.js';
/**
 * Package Comparison System
 * Compare similar packages side-by-side
 */
export interface ComparisonResult {
    packages: ContentItem[];
    differences: Array<{
        field: string;
        values: Record<string, any>;
    }>;
    recommendation?: {
        package: ContentItem;
        reason: string;
    };
}
/**
 * Compare multiple packages
 */
export declare function comparePackages(packageIds: string[], apiClient: SecureAPIClient): Promise<ComparisonResult>;
/**
 * Display comparison table
 */
export declare function displayComparison(result: ComparisonResult): void;
//# sourceMappingURL=package-comparison.d.ts.map