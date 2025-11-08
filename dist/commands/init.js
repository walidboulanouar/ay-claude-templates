import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ensureDir, getClaudePaths } from '../utils/paths.js';
export async function initCommand(options) {
    const scope = options.local ? 'local' : options.global ? 'global' : 'local';
    console.log(chalk.blue(`\nInitializing Claude Skills CLI (${scope} scope)...\n`));
    try {
        const paths = getClaudePaths();
        const baseDir = scope === 'global' ? paths.global : paths.local;
        // Create directory structure
        await ensureDir(join(baseDir, 'skills'));
        await ensureDir(join(baseDir, 'agents'));
        await ensureDir(join(baseDir, 'commands'));
        await ensureDir(join(baseDir, 'hooks'));
        await ensureDir(join(baseDir, 'plugins'));
        await ensureDir(join(baseDir, 'mcps'));
        await ensureDir(join(baseDir, 'settings'));
        // Create registry file
        const registry = {
            packages: [],
            version: '1.0.0',
        };
        await writeFile(join(baseDir, 'registry.json'), JSON.stringify(registry, null, 2));
        console.log(chalk.green(`✓ Initialized Claude Skills CLI`));
        console.log(chalk.gray(`  Location: ${baseDir}\n`));
        console.log(chalk.blue('Next steps:'));
        console.log(chalk.gray('  claude-skills search "automation"  # Find packages'));
        console.log(chalk.gray('  claude-skills install <package>     # Install a package'));
        console.log(chalk.gray('  claude-skills list                 # List installed packages\n'));
    }
    catch (error) {
        console.error(chalk.red(`Failed to initialize: ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map