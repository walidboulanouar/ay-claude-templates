import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { rm } from 'fs/promises';
import { removeFromRegistry, getInstalledPackages } from '../core/registry.js';
import { detectScope } from '../utils/paths.js';

export async function uninstallCommand(
  packageName: string,
  options: {
    global?: boolean;
    local?: boolean;
  }
) {
  const scope = options.local ? 'local' : options.global ? 'global' : detectScope();

  const spinner = ora(`Uninstalling ${packageName}...`).start();

  try {
    // Find installed package
    const packages = await getInstalledPackages(scope);
    const pkg = packages.find((p) => p.name === packageName || p.name.includes(packageName));

    if (!pkg) {
      spinner.fail(`Package not found: ${packageName}`);
      process.exit(1);
    }

    // Remove from filesystem
    spinner.text = `Removing files...`;
    await rm(pkg.path, { recursive: true, force: true });

    // Remove from registry
    await removeFromRegistry(pkg.name, pkg.type, scope);

    spinner.succeed(`Successfully uninstalled ${pkg.name}`);
  } catch (error) {
    spinner.fail(`Failed to uninstall ${packageName}`);
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}
