import chalk from 'chalk';
import { SecureAPIClient } from './secure-api-client.js';
import { getInstalledPackages } from './registry.js';
import type { ContentItem } from '../core/api-client.js';

/**
 * Package Health Score System
 * Calculate quality metrics for packages
 */

export interface HealthScore {
  overall: number; // 0-100
  maintenance: number; // 0-100
  security: number; // 0-100
  popularity: number; // 0-100
  compatibility: number; // 0-100
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
export async function calculateHealthScore(
  packageData: ContentItem,
  apiClient: SecureAPIClient
): Promise<HealthScore> {
  const scores = {
    maintenance: 0,
    security: 100, // Start at 100, deduct for issues
    popularity: 0,
    compatibility: 100, // Start at 100, deduct for issues
  };

  const details: HealthScore['details'] = {};

  // Maintenance Score (0-100)
  if (packageData.version) {
    // Check if recently updated
    const daysSinceUpdate = packageData.version ? 0 : 30; // Placeholder
    if (daysSinceUpdate < 30) {
      scores.maintenance = 100;
      details.updateFrequency = 'Active';
    } else if (daysSinceUpdate < 90) {
      scores.maintenance = 75;
      details.updateFrequency = 'Moderate';
    } else if (daysSinceUpdate < 180) {
      scores.maintenance = 50;
      details.updateFrequency = 'Slow';
    } else {
      scores.maintenance = 25;
      details.updateFrequency = 'Inactive';
    }
  } else {
    scores.maintenance = 50; // Unknown
  }

  // Popularity Score (0-100)
  const downloads = packageData.downloads || 0;
  const upvotes = packageData.upvotes || 0;
  
  if (downloads > 1000) {
    scores.popularity = 100;
  } else if (downloads > 500) {
    scores.popularity = 75;
  } else if (downloads > 100) {
    scores.popularity = 50;
  } else if (downloads > 10) {
    scores.popularity = 25;
  } else {
    scores.popularity = 10;
  }

  // Boost with upvotes
  if (upvotes > 50) {
    scores.popularity = Math.min(100, scores.popularity + 20);
  } else if (upvotes > 20) {
    scores.popularity = Math.min(100, scores.popularity + 10);
  }

  details.downloadCount = downloads;
  details.upvoteCount = upvotes;

  // Security Score (0-100)
  // Check if package has security issues (placeholder)
  details.hasSecurityIssues = false; // Would check against security database
  if (details.hasSecurityIssues) {
    scores.security = 50;
  }

  // Compatibility Score (0-100)
  // Check compatibility with Claude Code versions
  details.compatibilityScore = 100; // Would check compatibility matrix

  // Calculate overall score (weighted average)
  const overall =
    scores.maintenance * 0.3 +
    scores.security * 0.3 +
    scores.popularity * 0.25 +
    scores.compatibility * 0.15;

  return {
    overall: Math.round(overall),
    maintenance: Math.round(scores.maintenance),
    security: Math.round(scores.security),
    popularity: Math.round(scores.popularity),
    compatibility: Math.round(scores.compatibility),
    details,
  };
}

/**
 * Get health score badge emoji
 */
export function getHealthBadge(score: number): string {
  if (score >= 90) return '🟢';
  if (score >= 75) return '🟡';
  if (score >= 50) return '🟠';
  return '🔴';
}

/**
 * Display health score
 */
export function displayHealthScore(score: HealthScore): void {
  const badge = getHealthBadge(score.overall);
  
  console.log(chalk.bold(`\n${badge} Package Health Score: ${score.overall}/100\n`));
  
  console.log(`  Maintenance: ${chalk.cyan(score.maintenance)}/100 ${getHealthBadge(score.maintenance)}`);
  if (score.details.updateFrequency) {
    console.log(chalk.gray(`    Update frequency: ${score.details.updateFrequency}`));
  }
  
  console.log(`  Security:     ${chalk.cyan(score.security)}/100 ${getHealthBadge(score.security)}`);
  if (score.details.hasSecurityIssues) {
    console.log(chalk.red(`    ⚠ Security issues detected`));
  }
  
  console.log(`  Popularity:   ${chalk.cyan(score.popularity)}/100 ${getHealthBadge(score.popularity)}`);
  if (score.details.downloadCount !== undefined) {
    console.log(chalk.gray(`    Downloads: ${score.details.downloadCount.toLocaleString()}`));
  }
  if (score.details.upvoteCount !== undefined) {
    console.log(chalk.gray(`    Upvotes: ${score.details.upvoteCount.toLocaleString()}`));
  }
  
  console.log(`  Compatibility: ${chalk.cyan(score.compatibility)}/100 ${getHealthBadge(score.compatibility)}`);
  console.log();
}

/**
 * Get smart recommendations based on installed packages
 */
export async function getSmartRecommendations(
  apiClient: SecureAPIClient,
  limit: number = 5
): Promise<ContentItem[]> {
  // Get installed packages
  const installed = await getInstalledPackages();
  
  if (installed.length === 0) {
    // No installed packages, return popular packages
    const response = await apiClient.client.get('/functions/v1/search', {
      params: {
        q: '',
        limit: limit,
        sort: 'popular',
      },
    });
    return response.data.items || [];
  }

  // Analyze installed packages to find patterns
  const types = installed.map((p) => p.type);
  const categories = new Set<string>();
  
  // Get recommendations based on installed types
  const recommendations: ContentItem[] = [];
  
  for (const type of types) {
    try {
      const response = await apiClient.client.get('/functions/v1/search', {
        params: {
          type,
          limit: Math.ceil(limit / types.length),
          sort: 'popular',
        },
      });
      
      if (response.data.items) {
        recommendations.push(...response.data.items);
      }
    } catch (error) {
      // Continue if one type fails
    }
  }

  // Filter out already installed
  const installedIds = new Set(installed.map((p) => `${p.name}-${p.type}`));
  const filtered = recommendations.filter(
    (item) => !installedIds.has(`${item.slug}-${item.type}`)
  );

  // Sort by popularity and return top N
  return filtered
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, limit);
}
