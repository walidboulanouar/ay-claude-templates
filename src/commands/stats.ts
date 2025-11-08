import chalk from 'chalk';
import { SecureAPIClient } from '../core/secure-api-client.js';
import Table from 'cli-table3';
import { getInstalledPackages } from '../core/registry.js';

export async function statsCommand() {
  try {
    const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
    const clientId = process.env.AY_CLAUDE_CLIENT_ID || 'ay-claude-cli';
    const apiClient = new SecureAPIClient(apiUrl, clientId);

    console.log(chalk.bold('\n📊 AY Claude CLI - Statistics\n'));
    console.log(chalk.dim('─'.repeat(60)));
    console.log();

    // Get installed packages
    const installed = await getInstalledPackages();
    
    console.log(chalk.bold('📦 Installed Packages\n'));
    console.log(chalk.gray(`  Total: ${installed.length}`));
    
    if (installed.length > 0) {
      const byType = installed.reduce((acc, pkg) => {
        acc[pkg.type] = (acc[pkg.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statsTable = new Table({
        head: [chalk.cyan('Type'), chalk.cyan('Count')],
        colWidths: [20, 10],
      });

      Object.entries(byType).forEach(([type, count]) => {
        statsTable.push([type, count.toString()]);
      });

      console.log(statsTable.toString());
    } else {
      console.log(chalk.yellow('  No packages installed'));
    }
    console.log();

    // Get platform statistics
    try {
      console.log(chalk.bold('🌐 Platform Statistics\n'));
      
      // Search for all content to get counts
      const response = await apiClient.client.get('/functions/v1/search', {
        params: { q: '', limit: 1 },
      });

      const total = response.data.total || 0;
      console.log(chalk.gray(`  Total packages available: ${total.toLocaleString()}`));
      console.log();

      // Get counts by type
      const types = ['skill', 'agent', 'command', 'hook', 'plugin', 'mcp', 'settings'];
      const typeCounts: Record<string, number> = {};

      for (const type of types) {
        try {
          const typeResponse = await apiClient.client.get('/functions/v1/search', {
            params: { q: '', type, limit: 1 },
          });
          typeCounts[type] = typeResponse.data.total || 0;
        } catch (error) {
          typeCounts[type] = 0;
        }
      }

      const platformTable = new Table({
        head: [chalk.cyan('Type'), chalk.cyan('Available')],
        colWidths: [20, 15],
      });

      Object.entries(typeCounts).forEach(([type, count]) => {
        platformTable.push([type, count.toLocaleString()]);
      });

      console.log(platformTable.toString());
    } catch (error) {
      console.log(chalk.yellow('  Unable to fetch platform statistics'));
    }
    console.log();

    console.log(chalk.bold('💡 Tips\n'));
    console.log(chalk.gray('  • Use "ay-claude search" to discover new packages'));
    console.log(chalk.gray('  • Use "ay-claude browse" to explore by category'));
    console.log(chalk.gray('  • Use "ay-claude update" to update installed packages'));
    console.log();
  } catch (error) {
    console.error(chalk.red(`\n✗ Failed to get statistics: ${error instanceof Error ? error.message : String(error)}\n`));
    process.exit(1);
  }
}
