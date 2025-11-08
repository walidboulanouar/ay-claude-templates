import chalk from 'chalk';
import { SecureAPIClient } from '../core/secure-api-client.js';
import { displayContentInfo, getDetailedInfo } from '../utils/content-info.js';
export async function infoCommand(packageName, options) {
    try {
        const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
        const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
        const apiClient = new SecureAPIClient(apiUrl, clientId);
        // Get detailed information
        const info = await getDetailedInfo(apiClient, packageName, options.type);
        // Display information
        displayContentInfo(info);
    }
    catch (error) {
        console.error(chalk.red(`\n✗ Failed to get package info: ${error instanceof Error ? error.message : String(error)}\n`));
        // Provide helpful suggestions
        console.log(chalk.yellow('💡 Suggestions:'));
        console.log(chalk.gray('  • Check if the package name is correct'));
        console.log(chalk.gray('  • Try searching: claude-skills search "' + packageName + '"'));
        console.log(chalk.gray('  • Specify type: claude-skills info ' + packageName + ' --type skill'));
        console.log();
        process.exit(1);
    }
}
//# sourceMappingURL=info.js.map