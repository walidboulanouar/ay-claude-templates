import chalk from 'chalk';
import { SecureAPIClient } from '../core/secure-api-client.js';
import Table from 'cli-table3';
import { recordSearch, getSearchSuggestions } from '../core/search-history.js';
export async function searchCommand(query, options) {
    if (!query) {
        console.error(chalk.red('Please provide a search query'));
        console.log(chalk.gray('Example: ay-claude search "automation"'));
        console.log(chalk.gray('         ay-claude search "testing" --type skill'));
        process.exit(1);
    }
    try {
        const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
        const clientId = process.env.AY_CLAUDE_CLIENT_ID || 'ay-claude-cli';
        const apiClient = new SecureAPIClient(apiUrl, clientId);
        const limit = parseInt(options.limit || '20', 10);
        const response = await apiClient.client.get('/functions/v1/search', {
            params: {
                q: query,
                type: options.type,
                category: options.category,
                limit,
            },
        });
        const results = response.data;
        // Record search in history
        await recordSearch(query, results.total, {
            type: options.type,
            category: options.category,
        });
        // Show suggestions if no results
        if (results.items.length === 0) {
            console.log(chalk.yellow(`\nNo results found for "${query}"\n`));
            // Show search suggestions
            const suggestions = await getSearchSuggestions(3);
            if (suggestions.length > 0) {
                console.log(chalk.gray('💡 Did you mean:'));
                suggestions.forEach((suggestion) => {
                    console.log(chalk.gray(`  • ${suggestion}`));
                });
                console.log();
            }
            else {
                console.log(chalk.gray('💡 Suggestions:'));
                console.log(chalk.gray('  • Try different keywords'));
                console.log(chalk.gray('  • Check spelling'));
                console.log(chalk.gray('  • Browse by category: ay-claude browse'));
            }
            return;
        }
        // Display results based on format
        if (options.format === 'json') {
            console.log(JSON.stringify(results, null, 2));
            return;
        }
        console.log(chalk.bold(`\n🔍 Found ${results.total} result${results.total !== 1 ? 's' : ''} for "${query}"\n`));
        if (options.format === 'table') {
            // Table format
            const table = new Table({
                head: [
                    chalk.cyan('Type'),
                    chalk.cyan('Name'),
                    chalk.cyan('Category'),
                    chalk.cyan('Downloads'),
                    chalk.cyan('Upvotes'),
                ],
                colWidths: [10, 30, 20, 12, 12],
            });
            results.items.forEach((item) => {
                const typeEmoji = {
                    skill: '📦',
                    agent: '🤖',
                    command: '⚡',
                    hook: '🪝',
                    plugin: '🧩',
                    mcp: '🔌',
                    settings: '⚙️',
                };
                const emoji = typeEmoji[item.type] || '📄';
                table.push([
                    `${emoji} ${item.type}`,
                    chalk.white(item.name),
                    item.category,
                    chalk.yellow(item.downloads.toLocaleString()),
                    chalk.yellow(item.upvotes.toLocaleString()),
                ]);
            });
            console.log(table.toString());
        }
        else {
            // List format (default)
            results.items.forEach((item, index) => {
                const typeEmoji = {
                    skill: '📦',
                    agent: '🤖',
                    command: '⚡',
                    hook: '🪝',
                    plugin: '🧩',
                    mcp: '🔌',
                    settings: '⚙️',
                };
                const emoji = typeEmoji[item.type] || '📄';
                console.log(chalk.bold(`${index + 1}. ${emoji} ${chalk.green(item.name)}`));
                console.log(chalk.gray(`   Type: ${item.type} | Category: ${item.category}`));
                console.log(chalk.gray(`   ⬇️  ${item.downloads.toLocaleString()} | ⭐ ${item.upvotes.toLocaleString()}`));
                console.log(chalk.gray(`   ${item.description.substring(0, 80)}${item.description.length > 80 ? '...' : ''}`));
                console.log();
            });
        }
        console.log(chalk.gray(`\n💡 Use 'ay-claude info <name>' for detailed information`));
        console.log(chalk.gray(`💡 Use 'ay-claude install <name>' to install a package\n`));
    }
    catch (error) {
        console.error(chalk.red(`\n✗ Search failed: ${error instanceof Error ? error.message : String(error)}\n`));
        process.exit(1);
    }
}
//# sourceMappingURL=search.js.map