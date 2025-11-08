import chalk from 'chalk';
import { SecureAPIClient } from '../core/secure-api-client.js';
import { SecureTokenStorage } from '../core/auth.js';
export async function loginCommand() {
    const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
    const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
    const client = new SecureAPIClient(apiUrl, clientId);
    try {
        await client.authentication.login();
        console.log(chalk.green('\n✓ Successfully authenticated!'));
        console.log(chalk.gray('You can now use all CLI commands.\n'));
    }
    catch (error) {
        console.error(chalk.red(`\n✗ Authentication failed: ${error instanceof Error ? error.message : String(error)}\n`));
        process.exit(1);
    }
}
export async function logoutCommand() {
    const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
    const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
    const client = new SecureAPIClient(apiUrl, clientId);
    await client.authentication.logout();
}
export async function whoamiCommand() {
    const token = await SecureTokenStorage.getToken();
    if (!token) {
        console.log(chalk.yellow('Not authenticated. Run "claude-skills login" first.'));
        return;
    }
    const isValid = await SecureTokenStorage.isTokenValid();
    console.log(chalk.blue('\n🔐 Authentication Status\n'));
    console.log(chalk.white('User ID:'), chalk.cyan(token.userId));
    console.log(chalk.white('Device ID:'), chalk.cyan(token.deviceId));
    console.log(chalk.white('Status:'), isValid ? chalk.green('Valid') : chalk.red('Expired'));
    console.log(chalk.white('Expires:'), chalk.gray(token.expiresAt.toLocaleString()));
    console.log(chalk.white('Scopes:'), chalk.gray(token.scopes.join(', ')));
    console.log();
}
//# sourceMappingURL=auth.js.map