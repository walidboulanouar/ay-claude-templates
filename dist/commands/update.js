import chalk from 'chalk';
import { getInstalledPackages } from '../core/registry.js';
import { detectScope } from '../utils/paths.js';
import { installCommand } from './install.js';
export async function updateCommand(packages, options) {
    const scope = options.local ? 'local' : options.global ? 'global' : detectScope();
    if (options.all) {
        // Update all packages
        const installed = await getInstalledPackages(scope);
        if (installed.length === 0) {
            console.log(chalk.gray('No packages installed'));
            return;
        }
        console.log(chalk.blue(`Updating ${installed.length} packages...`));
        for (const pkg of installed) {
            await installCommand([pkg.name], { ...options, type: pkg.type });
        }
    }
    else if (packages.length > 0) {
        // Update specific packages
        for (const pkgName of packages) {
            await installCommand([pkgName], options);
        }
    }
    else {
        console.error(chalk.red('Please specify packages to update or use --all'));
        console.log(chalk.gray('Example: claude-skills update package-name'));
        console.log(chalk.gray('         claude-skills update --all'));
        process.exit(1);
    }
}
//# sourceMappingURL=update.js.map