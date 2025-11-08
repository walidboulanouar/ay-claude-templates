import chalk from 'chalk';
import { SecureAPIClient } from '../core/secure-api-client.js';
import { displayContentInfo, getDetailedInfo, type ContentType } from '../utils/content-info.js';

export async function infoCommand(packageName: string, options: { type?: ContentType }) {
  try {
    const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
    const clientId = process.env.AY_CLAUDE_CLIENT_ID || 'ay-claude-cli';
    const apiClient = new SecureAPIClient(apiUrl, clientId);

    // Get detailed information
    const info = await getDetailedInfo(apiClient, packageName, options.type);

    // Display information
    displayContentInfo(info);
  } catch (error) {
    console.error(chalk.red(`\n✗ Failed to get package info: ${error instanceof Error ? error.message : String(error)}\n`));
    
    // Provide helpful suggestions
    console.log(chalk.yellow('💡 Suggestions:'));
    console.log(chalk.gray('  • Check if the package name is correct'));
    console.log(chalk.gray('  • Try searching: ay-claude search "' + packageName + '"'));
    console.log(chalk.gray('  • Specify type: ay-claude info ' + packageName + ' --type skill'));
    console.log();
    
    process.exit(1);
  }
}