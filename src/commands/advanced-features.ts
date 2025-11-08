import chalk from 'chalk';
import { calculateHealthScore, displayHealthScore, getSmartRecommendations } from '../core/health-score.js';
import { SecureAPIClient } from '../core/secure-api-client.js';
import { comparePackages, displayComparison } from '../core/package-comparison.js';
import { checkForUpdates } from '../core/version-management.js';
import { detectScope } from '../utils/paths.js';
import inquirer from 'inquirer';

/**
 * Health command - Show package health scores
 */
export async function healthCommand(packageName: string | undefined, options: { all?: boolean } = {}) {
  const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
  const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
  const apiClient = new SecureAPIClient(apiUrl, clientId);

  if (options.all) {
    // Show health for all installed packages
    const { getInstalledPackages } = await import('../core/registry.js');
    const installed = await getInstalledPackages();

    if (installed.length === 0) {
      console.log(chalk.yellow('\nNo packages installed\n'));
      return;
    }

    console.log(chalk.bold('\n📊 Package Health Scores\n'));

    for (const pkg of installed) {
      try {
        const searchResponse = await apiClient.client.get('/functions/v1/search', {
          params: { q: pkg.name, type: pkg.type, limit: 1 },
        });

        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          const packageData = searchResponse.data.items[0];
          const health = await calculateHealthScore(packageData, apiClient);
          
          const badge = health.overall >= 90 ? '🟢' : health.overall >= 75 ? '🟡' : health.overall >= 50 ? '🟠' : '🔴';
          console.log(`${badge} ${chalk.cyan(pkg.name)}: ${health.overall}/100`);
        }
      } catch (error) {
        console.log(`❓ ${chalk.gray(pkg.name)}: Unable to calculate`);
      }
    }
    console.log();
    return;
  }

  if (!packageName) {
    console.error(chalk.red('Please specify a package name'));
    console.log(chalk.gray('Example: claude-skills health playwright-automation-skill'));
    process.exit(1);
  }

  // Get package info
  const searchResponse = await apiClient.client.get('/functions/v1/search', {
    params: { q: packageName, limit: 1 },
  });

  if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
    console.error(chalk.red(`Package not found: ${packageName}`));
    process.exit(1);
  }

  const packageData = searchResponse.data.items[0];
  const health = await calculateHealthScore(packageData, apiClient);

  console.log(chalk.bold(`\n📦 ${packageData.name}\n`));
  displayHealthScore(health);
}

/**
 * Compare command - Compare similar packages
 */
export async function compareCommand(packageNames: string[]) {
  if (packageNames.length < 2) {
    console.error(chalk.red('Please specify at least 2 packages to compare'));
    console.log(chalk.gray('Example: claude-skills compare package1 package2 package3'));
    process.exit(1);
  }

  const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
  const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
  const apiClient = new SecureAPIClient(apiUrl, clientId);

  try {
    const comparison = await comparePackages(packageNames, apiClient);
    displayComparison(comparison);
  } catch (error) {
    console.error(chalk.red(`Failed to compare packages: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}

/**
 * Recommendations command - Get smart package recommendations
 */
export async function recommendationsCommand(options: { limit?: number }) {
  const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
  const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
  const apiClient = new SecureAPIClient(apiUrl, clientId);

  console.log(chalk.bold('\n🤖 Smart Recommendations\n'));
  console.log(chalk.gray('Based on your installed packages...\n'));

  try {
    const recommendations = await getSmartRecommendations(apiClient, options.limit || 5);

    if (recommendations.length === 0) {
      console.log(chalk.yellow('No recommendations available\n'));
      return;
    }

    for (let i = 0; i < recommendations.length; i++) {
      const rec = recommendations[i];
      const typeEmoji = {
        skill: '📦',
        agent: '🤖',
        command: '⚡',
        hook: '🪝',
        plugin: '🧩',
        mcp: '🔌',
        settings: '⚙️',
      }[rec.type] || '📄';

      console.log(`${i + 1}. ${typeEmoji} ${chalk.cyan(rec.name)}`);
      console.log(chalk.gray(`   ${rec.description}`));
      console.log(chalk.gray(`   Downloads: ${rec.downloads?.toLocaleString() || 0} | Upvotes: ${rec.upvotes?.toLocaleString() || 0}`));
      console.log();
    }

    console.log(chalk.gray('Install: claude-skills install <package-name>\n'));
  } catch (error) {
    console.error(chalk.red(`Failed to get recommendations: ${error instanceof Error ? error.message : String(error)}`));
  }
}

/**
 * Updates command - Check for package updates
 */
export async function updatesCommand(options: { install?: boolean }) {
  const scope = detectScope();
  
  console.log(chalk.bold('\n🔄 Checking for Updates\n'));

  try {
    const updates = await checkForUpdates(scope);

    if (updates.length === 0) {
      console.log(chalk.green('✓ All packages are up to date\n'));
      return;
    }

    console.log(chalk.yellow(`Found ${updates.length} update(s) available:\n`));

    for (const update of updates) {
      console.log(`  ${chalk.cyan(update.package.name)}`);
      console.log(chalk.gray(`    Current: ${update.package.currentVersion}`));
      console.log(chalk.green(`    Latest:  ${update.latestVersion}`));
      if (update.changelog) {
        console.log(chalk.gray(`    Changes: ${update.changelog.substring(0, 100)}...`));
      }
      console.log();
    }

    if (options.install) {
      const { selected } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selected',
          message: 'Select packages to update:',
          choices: updates.map((u) => ({
            name: `${u.package.name} (${u.package.currentVersion} → ${u.latestVersion})`,
            value: u.package.name,
          })),
        },
      ]);

      if (selected.length > 0) {
        const { updateCommand } = await import('./update.js');
        await updateCommand(selected, { global: scope === 'global', local: scope === 'local' });
      }
    } else {
      console.log(chalk.gray('Run "claude-skills updates --install" to update packages\n'));
    }
  } catch (error) {
    console.error(chalk.red(`Failed to check updates: ${error instanceof Error ? error.message : String(error)}`));
  }
}
