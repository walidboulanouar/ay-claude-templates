import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { platform, version as nodeVersion, arch } from 'process';
import { SecureTokenStorage } from '../core/auth.js';
import { getClaudePaths, getPlatformName } from '../utils/paths.js';
import { readdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function troubleshootCommand() {
  console.log(chalk.bold('\n🔧 Claude Skills CLI - Troubleshooting Guide\n'));
  console.log(chalk.dim('─'.repeat(60)));
  console.log();

  // Platform information
  console.log(chalk.bold('0️⃣  Platform Information\n'));
  console.log(chalk.gray(`  Platform: ${getPlatformName()} (${platform})`));
  console.log(chalk.gray(`  Architecture: ${arch}`));
  console.log(chalk.gray(`  Node.js: ${nodeVersion}`));
  
  // Check keytar availability (for secure storage)
  try {
    const keytar = await import('keytar');
    console.log(chalk.green('  ✓ Secure storage available (keytar)'));
  } catch (error) {
    console.log(chalk.yellow('  ⚠ Secure storage may not be available'));
    if (platform === 'linux') {
      console.log(chalk.yellow('  → Install libsecret: sudo apt-get install libsecret-1-dev'));
    }
  }
  console.log();

  // Check authentication
  console.log(chalk.bold('1️⃣  Authentication Status\n'));
  const token = await SecureTokenStorage.getToken();
  if (token) {
    const isValid = await SecureTokenStorage.isTokenValid();
    console.log(chalk.green('  ✓ Token found'));
    console.log(chalk.gray(`  Status: ${isValid ? chalk.green('Valid') : chalk.red('Expired')}`));
    if (!isValid) {
      console.log(chalk.yellow('  → Run: claude-skills login'));
    }
  } else {
    console.log(chalk.red('  ✗ Not authenticated'));
    console.log(chalk.yellow('  → Run: claude-skills login'));
  }
  console.log();

  // Check installation directories
  console.log(chalk.bold('2️⃣  Installation Directories\n'));
  const paths = getClaudePaths();
  console.log(chalk.gray(`  Global: ${paths.global}`));
  console.log(chalk.gray(`  Local:  ${paths.local}`));
  
  const globalExists = existsSync(paths.global);
  const localExists = existsSync(paths.local);
  
  console.log(`  Global exists: ${globalExists ? chalk.green('✓') : chalk.yellow('✗')}`);
  console.log(`  Local exists:  ${localExists ? chalk.green('✓') : chalk.yellow('✗')}`);
  
  if (!globalExists && !localExists) {
    console.log(chalk.yellow('  → Run: claude-skills init'));
  }
  console.log();

  // Check installed packages
  console.log(chalk.bold('3️⃣  Installed Packages\n'));
  try {
    const { getInstalledPackages } = await import('../core/registry.js');
    const packages = await getInstalledPackages();
    console.log(chalk.gray(`  Total installed: ${packages.length}`));
    
    if (packages.length > 0) {
      const byType = packages.reduce((acc, pkg) => {
        acc[pkg.type] = (acc[pkg.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(byType).forEach(([type, count]) => {
        console.log(chalk.gray(`  ${type}: ${count}`));
      });
    } else {
      console.log(chalk.yellow('  No packages installed'));
      console.log(chalk.yellow('  → Run: claude-skills search "automation"'));
    }
  } catch (error) {
    console.log(chalk.red('  ✗ Error reading registry'));
  }
  console.log();

  // Check environment variables
  console.log(chalk.bold('4️⃣  Environment Configuration\n'));
  const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  
  console.log(`  API URL: ${apiUrl ? chalk.green('✓ Set') : chalk.yellow('✗ Not set')}`);
  console.log(`  Anon Key: ${anonKey ? chalk.green('✓ Set') : chalk.yellow('✗ Not set')}`);
  
  if (!apiUrl || !anonKey) {
    console.log(chalk.yellow('  → Set environment variables:'));
    console.log(chalk.gray('    export SUPABASE_URL="https://your-project.supabase.co"'));
    console.log(chalk.gray('    export SUPABASE_ANON_KEY="your-anon-key"'));
  }
  console.log();

  // Common issues and solutions
  console.log(chalk.bold('5️⃣  Common Issues & Solutions\n'));
  
  console.log(chalk.cyan('  Issue: "Not authenticated"'));
  console.log(chalk.gray('  Solution: Run claude-skills login'));
  console.log();

  console.log(chalk.cyan('  Issue: "Package not found"'));
  console.log(chalk.gray('  Solution: Try searching first: claude-skills search "<name>"'));
  console.log(chalk.gray('            Or specify type: claude-skills install <name> --type skill'));
  console.log();

  console.log(chalk.cyan('  Issue: "Rate limit exceeded"'));
  console.log(chalk.gray('  Solution: Wait a few minutes and try again'));
  console.log(chalk.gray('            Or check your usage: claude-skills stats'));
  console.log();

  console.log(chalk.cyan('  Issue: "Package verification failed"'));
  console.log(chalk.gray('  Solution: Package may be corrupted. Try downloading again.'));
  console.log(chalk.gray('            Report issue if problem persists.'));
  console.log();

  console.log(chalk.bold('📖 More Help\n'));
  console.log(chalk.gray('  Documentation: https://claude-skills.com/docs/cli'));
  console.log(chalk.gray('  GitHub Issues: https://github.com/claude-skills/cli/issues'));
  console.log(chalk.gray('  Support: support@claude-skills.com'));
  console.log();
}
