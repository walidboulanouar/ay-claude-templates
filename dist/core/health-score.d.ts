import { SecureAPIClient } from './secure-api-client.js';
import type { ContentItem } from '../core/api-client.js';
/**
 * Package Health Score System
 * Calculate quality metrics for packages
 */
export interface HealthScore {
    overall: number;
    maintenance: number;
    security: number;
    popularity: number;
    compatibility: number;
    details: {
        lastUpdated?: string;
        updateFrequency?: string;
        downloadCount?: number;
        upvoteCount?: number;
        reviewCount?: number;
        averageRating?: number;
        hasSecurityIssues?: boolean;
        compatibilityScore?: number;
    };
}
/**
 * Calculate health score for a package
 */
export declare function calculateHealthScore(packageData: ContentItem, apiClient: SecureAPIClient): Promise<HealthScore>;
/**
 * Get health score badge emoji
 */
export declare function getHealthBadge(score: number): string;
/**
 * Display health score
 */
export declare function displayHealthScore(score: HealthScore): void;
/**
 * Get smart recommendations based on installed packages
 */
export declare function getSmartRecommendations(apiClient: SecureAPIClient, limit?: number): Promise<ContentItem[]>;
//# sourceMappingURL=health-score.d.ts.map