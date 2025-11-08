import chalk from 'chalk';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import { addFavorite, removeFavorite, getFavorites, createCollection, getCollections, } from '../core/favorites.js';
import { SecureAPIClient } from '../core/secure-api-client.js';
/**
 * Favorites command - Manage favorite packages and collections
 */
export async function favoritesCommand(action, packageId, options = {}) {
    const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
    const clientId = process.env.CLAUDE_SKILLS_CLIENT_ID || 'claude-skills-cli';
    const apiClient = new SecureAPIClient(apiUrl, clientId);
    // List favorites
    if (options.list || action === 'list') {
        const favorites = await getFavorites();
        if (favorites.length === 0) {
            console.log(chalk.yellow('\nNo favorites yet\n'));
            console.log(chalk.gray('Add favorites: claude-skills favorite add <package-name>'));
            return;
        }
        console.log(chalk.bold(`\n⭐ Favorites (${favorites.length})\n`));
        const table = new Table({
            head: [chalk.cyan('Type'), chalk.cyan('Name'), chalk.cyan('Added')],
            colWidths: [12, 30, 20],
        });
        for (const fav of favorites) {
            const typeEmoji = {
                skill: '📦',
                agent: '🤖',
                command: '⚡',
                hook: '🪝',
                plugin: '🧩',
                mcp: '🔌',
                settings: '⚙️',
            }[fav.packageType] || '📄';
            const date = new Date(fav.addedAt);
            table.push([
                `${typeEmoji} ${fav.packageType}`,
                chalk.white(fav.packageName),
                chalk.gray(date.toLocaleDateString()),
            ]);
        }
        console.log(table.toString());
        console.log();
        return;
    }
    // List collections
    if (options.collections || action === 'collections') {
        const collections = await getCollections();
        if (collections.length === 0) {
            console.log(chalk.yellow('\nNo collections yet\n'));
            console.log(chalk.gray('Create collection: claude-skills favorite create <name>'));
            return;
        }
        console.log(chalk.bold(`\n📚 Collections (${collections.length})\n`));
        for (const collection of collections) {
            console.log(chalk.cyan(`  ${collection.name}`));
            if (collection.description) {
                console.log(chalk.gray(`    ${collection.description}`));
            }
            console.log(chalk.gray(`    Packages: ${collection.packages.length}`));
            console.log();
        }
        return;
    }
    // Add favorite
    if (options.add || action === 'add') {
        if (!packageId) {
            console.error(chalk.red('Please specify a package ID'));
            console.log(chalk.gray('Example: claude-skills favorite add playwright-automation-skill'));
            process.exit(1);
        }
        try {
            // Search for package
            const searchResponse = await apiClient.client.get('/functions/v1/search', {
                params: { q: packageId, limit: 1 },
            });
            if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
                console.error(chalk.red(`Package not found: ${packageId}`));
                process.exit(1);
            }
            const pkg = searchResponse.data.items[0];
            const { notes } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'notes',
                    message: 'Add notes (optional):',
                },
            ]);
            await addFavorite(pkg.id, pkg.name, pkg.type, notes);
            console.log(chalk.green(`\n✓ Added ${pkg.name} to favorites\n`));
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('already')) {
                console.log(chalk.yellow(`\n${packageId} is already in favorites\n`));
            }
            else {
                console.error(chalk.red(`Failed to add favorite: ${error instanceof Error ? error.message : String(error)}`));
                process.exit(1);
            }
        }
        return;
    }
    // Remove favorite
    if (options.remove || action === 'remove') {
        if (!packageId) {
            console.error(chalk.red('Please specify a package ID'));
            process.exit(1);
        }
        try {
            await removeFavorite(packageId);
            console.log(chalk.green(`\n✓ Removed ${packageId} from favorites\n`));
        }
        catch (error) {
            console.error(chalk.red(`Failed to remove favorite: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
        }
        return;
    }
    // Create collection
    if (options.create || action === 'create') {
        const name = options.create || packageId;
        if (!name) {
            console.error(chalk.red('Please specify a collection name'));
            process.exit(1);
        }
        const { description, tags } = await inquirer.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'Description (optional):',
            },
            {
                type: 'input',
                name: 'tags',
                message: 'Tags (comma-separated, optional):',
            },
        ]);
        const tagArray = tags ? tags.split(',').map((t) => t.trim()) : undefined;
        try {
            const collection = await createCollection(name, description, tagArray);
            console.log(chalk.green(`\n✓ Created collection: ${collection.name}\n`));
        }
        catch (error) {
            console.error(chalk.red(`Failed to create collection: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
        }
        return;
    }
    // Default: show help
    console.log(chalk.bold('\n⭐ Favorites & Collections\n'));
    console.log('  list              List all favorites');
    console.log('  collections       List all collections');
    console.log('  add <package>     Add package to favorites');
    console.log('  remove <package>  Remove package from favorites');
    console.log('  create <name>     Create a new collection');
    console.log();
}
//# sourceMappingURL=favorites.js.map