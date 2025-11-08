import chalk from 'chalk';
import inquirer from 'inquirer';
import { listBundles, installBundle, getBundle } from '../core/bundles.js';
import { detectScope } from '../utils/paths.js';
import { installCommand } from './install.js';
/**
 * Bundle command - Install curated package bundles
 */
export async function bundleCommand(action, bundleId, options = {}) {
    if (options.list || action === 'list') {
        // List available bundles
        const bundles = listBundles();
        console.log(chalk.bold('\n📦 Available Bundles\n'));
        for (const bundle of bundles) {
            console.log(chalk.cyan(`  ${bundle.id}`));
            console.log(chalk.white(`    ${bundle.name}`));
            console.log(chalk.gray(`    ${bundle.description}`));
            console.log(chalk.gray(`    Packages: ${bundle.packages.length}`));
            console.log();
        }
        return;
    }
    if (!bundleId) {
        console.error(chalk.red('Please specify a bundle ID'));
        console.log(chalk.gray('Example: claude-skills bundle install react-dev-stack'));
        console.log(chalk.gray('Or list bundles: claude-skills bundle list'));
        process.exit(1);
    }
    const bundle = getBundle(bundleId);
    if (!bundle) {
        console.error(chalk.red(`Bundle not found: ${bundleId}`));
        console.log(chalk.gray('Use "claude-skills bundle list" to see available bundles'));
        process.exit(1);
    }
    // Determine scope
    const scope = options.local ? 'local' : options.global ? 'global' : detectScope();
    // Confirm installation
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Install bundle "${bundle.name}" with ${bundle.packages.length} packages?`,
            default: true,
        },
    ]);
    if (!confirm) {
        console.log(chalk.yellow('Installation cancelled'));
        return;
    }
    // Install bundle
    await installBundle(bundleId, scope, async (name, type, opts) => {
        // Use the install command logic
        await installCommand([name], {
            type,
            version: opts.version,
            global: opts.scope === 'global',
            local: opts.scope === 'local',
            skipDependencies: true, // Bundles handle dependencies
        });
    });
}
//# sourceMappingURL=bundle.js.map