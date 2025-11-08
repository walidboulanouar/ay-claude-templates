import chalk from 'chalk';
import { SecureAPIClient } from '../core/secure-api-client.js';
import Table from 'cli-table3';
import type { ContentType } from '../utils/content-info.js';

export async function browseCommand(options: {
  type?: ContentType;
  category?: string;
  sort?: 'popular' | 'recent' | 'upvotes' | 'downloads';
  limit?: string;
}) {
  try {
    const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
    const clientId = process.env.AY_CLAUDE_CLIENT_ID || 'ay-claude-cli';
    const apiClient = new SecureAPIClient(apiUrl, clientId);

    const limit = parseInt(options.limit || '20', 10);

    // Build search query - empty query with filters shows all
    const params: any = {
      q: '',
      limit,
    };

    if (options.type) params.type = options.type;
    if (options.category) params.category = options.category;
    if (options.sort) params.sort = options.sort;

    const response = await apiClient.client.get('/functions/v1/search', { params });
    const results = response.data;

    if (results.items.length === 0) {
      console.log(chalk.yellow('\nNo content found\n'));
      return;
    }

    const title = options.type 
      ? `📚 ${options.type.charAt(0).toUpperCase() + options.type.slice(1)}s`
      : '📚 All Content';

    console.log(chalk.bold(`\n${title} (${results.total} total)\n`));

    const table = new Table({
      head: [
        chalk.cyan('#'),
        chalk.cyan('Name'),
        chalk.cyan('Type'),
        chalk.cyan('Category'),
        chalk.cyan('Downloads'),
        chalk.cyan('Upvotes'),
      ],
      colWidths: [5, 30, 12, 18, 12, 12],
    });

    results.items.forEach((item: any, index: number) => {
      const typeEmoji: Record<string, string> = {
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
        index + 1,
        chalk.white(item.name),
        `${emoji} ${item.type}`,
        item.category,
        chalk.yellow(item.downloads.toLocaleString()),
        chalk.yellow(item.upvotes.toLocaleString()),
      ]);
    });

    console.log(table.toString());
    console.log(chalk.gray(`\n💡 Use 'ay-claude info <name>' for details`));
    console.log(chalk.gray(`💡 Use 'ay-claude install <name>' to install\n`));
  } catch (error) {
    console.error(chalk.red(`\n✗ Browse failed: ${error instanceof Error ? error.message : String(error)}\n`));
    process.exit(1);
  }
}
