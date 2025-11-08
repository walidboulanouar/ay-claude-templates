import chalk from 'chalk';
import Table from 'cli-table3';
import { getInstalledPackages } from '../core/registry.js';
import { detectScope } from '../utils/paths.js';

// Simple time ago formatter
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function listCommand(options: {
  global?: boolean;
  local?: boolean;
  type?: string;
  format?: 'table' | 'list' | 'json';
}) {
  const scope = options.local ? 'local' : options.global ? 'global' : undefined;
  const packages = await getInstalledPackages(scope, options.type);

  if (packages.length === 0) {
    console.log(chalk.gray('\nNo packages installed\n'));
    console.log(chalk.yellow('💡 Get started:'));
    console.log(chalk.gray('  ay-claude search "automation"'));
    console.log(chalk.gray('  ay-claude install <package-name>\n'));
    return;
  }

  // JSON output
  if (options.format === 'json') {
    console.log(JSON.stringify(packages, null, 2));
    return;
  }

  // Table format
  if (options.format === 'table') {
    const table = new Table({
      head: [
        chalk.cyan('Type'),
        chalk.cyan('Name'),
        chalk.cyan('Version'),
        chalk.cyan('Scope'),
        chalk.cyan('Installed'),
      ],
      colWidths: [12, 30, 15, 10, 15],
    });

    packages.forEach((pkg) => {
      const typeEmoji = {
        skill: '📦',
        agent: '🤖',
        command: '⚡',
        hook: '🪝',
        plugin: '🧩',
        mcp: '🔌',
        settings: '⚙️',
      }[pkg.type] || '📄';

      table.push([
        `${typeEmoji} ${pkg.type}`,
        chalk.white(pkg.name),
        pkg.version,
        pkg.scope === 'global' ? chalk.gray('global') : chalk.gray('local'),
        formatTimeAgo(new Date(pkg.installedAt)),
      ]);
    });

    console.log(chalk.bold(`\n📦 Installed Packages (${packages.length})\n`));
    console.log(table.toString());
    console.log();
    return;
  }

  // List format (default)
  const grouped = packages.reduce((acc, pkg) => {
    if (!acc[pkg.type]) {
      acc[pkg.type] = [];
    }
    acc[pkg.type].push(pkg);
    return acc;
  }, {} as Record<string, typeof packages>);

  console.log(chalk.bold(`\n📦 Installed Packages (${packages.length})\n`));

  for (const [type, pkgs] of Object.entries(grouped)) {
    const typeEmoji = {
      skill: '📦',
      agent: '🤖',
      command: '⚡',
      hook: '🪝',
      plugin: '🧩',
      mcp: '🔌',
      settings: '⚙️',
    }[type] || '📄';

    console.log(chalk.cyan(`${typeEmoji} ${type.charAt(0).toUpperCase() + type.slice(1)}s (${pkgs.length})`));
    for (const pkg of pkgs) {
      const scopeLabel = pkg.scope === 'global' ? chalk.gray('[global]') : chalk.gray('[local]');
      const timeAgo = formatTimeAgo(new Date(pkg.installedAt));
      console.log(
        `  • ${chalk.green(pkg.name)} ${chalk.gray(`v${pkg.version}`)} ${scopeLabel} ${chalk.gray(`(${timeAgo})`)}`
      );
    }
    console.log();
  }
}
