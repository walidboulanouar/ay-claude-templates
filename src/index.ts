#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { searchCommand } from './commands/search.js';
import { uninstallCommand } from './commands/uninstall.js';
import { infoCommand } from './commands/info.js';
import { updateCommand } from './commands/update.js';
import { initCommand } from './commands/init.js';
import { loginCommand, logoutCommand, whoamiCommand } from './commands/auth.js';
import { browseCommand } from './commands/browse.js';
import { helpCommand } from './commands/help.js';
import { troubleshootCommand } from './commands/troubleshoot.js';
import { statsCommand } from './commands/stats.js';
import { bundleCommand } from './commands/bundle.js';
import { favoritesCommand } from './commands/favorites.js';
import { healthCommand, compareCommand, recommendationsCommand, updatesCommand } from './commands/advanced-features.js';
import { workspaceCommand, templateCommand, searchHistoryCommand } from './commands/workspace-features.js';
import { checkUpdate } from './utils/update-notifier.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

// Check for updates
checkUpdate();

program
  .name('claude-skills')
  .description('CLI tool for installing and managing Claude Skills, Agents, Commands, Hooks, Plugins, MCPs, and Settings')
  .version(packageJson.version || '1.0.0')
  .addHelpCommand(false); // We'll add custom help

// Auth commands
program
  .command('login')
  .description('Authenticate with Claude Skills Platform')
  .action(loginCommand);

program
  .command('logout')
  .description('Log out and remove stored credentials')
  .action(logoutCommand);

program
  .command('whoami')
  .description('Show current authentication status')
  .action(whoamiCommand);

// Init command
program
  .command('init')
  .description('Initialize Claude Skills CLI in current directory or globally')
  .option('-g, --global', 'Initialize globally in ~/.claude')
  .option('-l, --local', 'Initialize locally in ./.claude')
  .action(initCommand);

// Install command
program
  .command('install [packages...]')
  .alias('i')
  .description('Install Skills, Agents, Commands, Hooks, or Plugins')
  .option('-g, --global', 'Install globally in ~/.claude')
  .option('-l, --local', 'Install locally in ./.claude (default)')
  .option('-t, --type <type>', 'Content type: skill, agent, command, hook, plugin, mcp, settings')
  .option('--version <version>', 'Install specific version')
  .option('--skip-dependencies', 'Skip installing dependencies')
  .action(installCommand);

// List command
program
  .command('list')
  .alias('ls')
  .description('List installed packages')
  .option('-g, --global', 'List globally installed packages')
  .option('-l, --local', 'List locally installed packages')
  .option('-t, --type <type>', 'Filter by content type')
  .option('--format <format>', 'Output format: table, list, json', 'list')
  .action(listCommand);

// Search command
program
  .command('search [query]')
  .alias('s')
  .description('Search the Claude Skills marketplace across all content types')
  .option('-t, --type <type>', 'Filter by content type: skill, agent, command, hook, plugin, mcp, settings')
  .option('-c, --category <category>', 'Filter by category')
  .option('--limit <number>', 'Limit results', '20')
  .option('--format <format>', 'Output format: table, list, json', 'list')
  .action(searchCommand);

// Browse command
program
  .command('browse')
  .alias('b')
  .description('Browse all available content')
  .option('-t, --type <type>', 'Filter by content type')
  .option('-c, --category <category>', 'Filter by category')
  .option('--sort <sort>', 'Sort: popular, recent, upvotes, downloads', 'popular')
  .option('--limit <number>', 'Limit results', '20')
  .action(browseCommand);

// Uninstall command
program
  .command('uninstall <package>')
  .alias('remove')
  .alias('rm')
  .description('Uninstall a package')
  .option('-g, --global', 'Uninstall from global location')
  .option('-l, --local', 'Uninstall from local location')
  .action(uninstallCommand);

// Info command
program
  .command('info <package>')
  .description('Show detailed information about any package (skill, agent, command, etc.)')
  .option('-t, --type <type>', 'Specify content type')
  .action(infoCommand);

// Help command
program
  .command('help [command]')
  .description('Show help for commands')
  .action(helpCommand);

// Troubleshoot command
program
  .command('troubleshoot')
  .alias('debug')
  .description('Run diagnostics and troubleshooting guide')
  .action(troubleshootCommand);

// Stats command
program
  .command('stats')
  .description('Show CLI and platform statistics')
  .action(statsCommand);

// Update command
program
  .command('update [packages...]')
  .alias('upgrade')
  .description('Update installed packages')
  .option('-g, --global', 'Update globally installed packages')
  .option('-l, --local', 'Update locally installed packages')
  .option('-a, --all', 'Update all packages')
  .action(updateCommand);

// Bundle command
program
  .command('bundle <action> [bundleId]')
  .description('Install curated package bundles')
  .option('-g, --global', 'Install globally')
  .option('-l, --local', 'Install locally')
  .option('--list', 'List available bundles')
  .action(bundleCommand);

// Favorites command
program
  .command('favorite <action> [packageId]')
  .alias('fav')
  .description('Manage favorite packages and collections')
  .option('--list', 'List favorites')
  .option('--collections', 'List collections')
  .option('--add', 'Add to favorites')
  .option('--remove', 'Remove from favorites')
  .option('--create <name>', 'Create collection')
  .action(favoritesCommand);

// Health command
program
  .command('health [package]')
  .description('Show package health scores')
  .option('--all', 'Show health for all installed packages')
  .action(healthCommand);

// Compare command
program
  .command('compare <packages...>')
  .description('Compare similar packages side-by-side')
  .action(compareCommand);

// Recommendations command
program
  .command('recommendations')
  .alias('recs')
  .description('Get smart package recommendations')
  .option('--limit <number>', 'Limit results', '5')
  .action(recommendationsCommand);

// Updates check command
program
  .command('updates')
  .description('Check for available package updates')
  .option('--install', 'Install available updates')
  .action(updatesCommand);

// Search history command
program
  .command('search-history')
  .alias('history')
  .description('View search history and suggestions')
  .action(searchHistoryCommand);

// Workspace command
program
  .command('workspace <action> [workspaceId]')
  .description('Manage team workspaces')
  .option('--list', 'List workspaces')
  .option('--create <name>', 'Create workspace')
  .option('--sync', 'Sync workspace')
  .action(workspaceCommand);

// Template command
program
  .command('template <action> [templateId]')
  .description('Create packages from templates')
  .option('--list', 'List templates')
  .option('--create <id>', 'Create from template')
  .action(templateCommand);

// Error handling
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.error(`See 'claude-skills --help' for available commands.`);
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  helpCommand();
}
