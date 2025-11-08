import chalk from 'chalk';
import Table from 'cli-table3';
/**
 * Compare multiple packages
 */
export async function comparePackages(packageIds, apiClient) {
    const packages = [];
    // Fetch all packages
    for (const id of packageIds) {
        try {
            // This would fetch from API
            // For now, placeholder
            const response = await apiClient.client.get('/functions/v1/search', {
                params: { q: id, limit: 1 },
            });
            if (response.data.items && response.data.items.length > 0) {
                packages.push(response.data.items[0]);
            }
        }
        catch (error) {
            console.warn(chalk.yellow(`Failed to fetch package: ${id}`));
        }
    }
    if (packages.length === 0) {
        throw new Error('No packages found for comparison');
    }
    // Find differences
    const differences = [];
    const fields = ['name', 'description', 'downloads', 'upvotes', 'category', 'tags', 'version'];
    for (const field of fields) {
        const values = {};
        let hasDifference = false;
        let firstValue = null;
        for (const pkg of packages) {
            const value = pkg[field];
            values[pkg.slug] = value;
            if (firstValue === null) {
                firstValue = value;
            }
            else if (JSON.stringify(value) !== JSON.stringify(firstValue)) {
                hasDifference = true;
            }
        }
        if (hasDifference) {
            differences.push({ field, values });
        }
    }
    // Generate recommendation
    let recommendation;
    if (packages.length > 0) {
        // Recommend package with highest downloads and upvotes
        const sorted = [...packages].sort((a, b) => {
            const scoreA = (a.downloads || 0) + (a.upvotes || 0) * 2;
            const scoreB = (b.downloads || 0) + (b.upvotes || 0) * 2;
            return scoreB - scoreA;
        });
        recommendation = {
            package: sorted[0],
            reason: `Highest popularity score (${sorted[0].downloads || 0} downloads, ${sorted[0].upvotes || 0} upvotes)`,
        };
    }
    return {
        packages,
        differences,
        recommendation,
    };
}
/**
 * Display comparison table
 */
export function displayComparison(result) {
    console.log(chalk.bold('\n📊 Package Comparison\n'));
    if (result.packages.length === 0) {
        console.log(chalk.yellow('No packages to compare'));
        return;
    }
    // Create comparison table
    const table = new Table({
        head: ['Field', ...result.packages.map((p) => p.name)],
        colWidths: [20, ...result.packages.map(() => 30)],
    });
    // Add rows for differences
    for (const diff of result.differences) {
        const row = [chalk.cyan(diff.field)];
        for (const pkg of result.packages) {
            const value = diff.values[pkg.slug];
            const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value || '-');
            row.push(displayValue);
        }
        table.push(row);
    }
    console.log(table.toString());
    // Show recommendation
    if (result.recommendation) {
        console.log(chalk.bold('\n💡 Recommendation\n'));
        console.log(chalk.green(`  ${result.recommendation.package.name}`) +
            chalk.gray(` - ${result.recommendation.reason}`));
    }
    console.log();
}
//# sourceMappingURL=package-comparison.js.map