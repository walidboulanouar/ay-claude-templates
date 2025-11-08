import chalk from 'chalk';
import Table from 'cli-table3';
// Simple time ago formatter
function formatTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60)
        return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
        return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)
        return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
/**
 * Get detailed information about any content type
 */
export async function getDetailedInfo(apiClient, identifier, type) {
    // First, search for the content
    const searchResponse = await apiClient.client.get('/functions/v1/search', {
        params: {
            q: identifier,
            type: type,
            limit: 10,
        },
    });
    const results = searchResponse.data.items || [];
    if (results.length === 0) {
        throw new Error(`Content not found: ${identifier}`);
    }
    // Find exact match or best match
    let content = results.find((item) => item.slug === identifier ||
        item.name.toLowerCase() === identifier.toLowerCase() ||
        item.id === identifier) || results[0];
    // Fetch detailed information based on type
    const detailResponse = await apiClient.client.get(`/api/v1/content/${content.type}/${content.id}`);
    return {
        ...content,
        ...detailResponse.data,
    };
}
/**
 * Display detailed information in a beautiful format
 */
export function displayContentInfo(info) {
    const typeEmoji = {
        skill: '📦',
        agent: '🤖',
        command: '⚡',
        hook: '🪝',
        plugin: '🧩',
        mcp: '🔌',
        settings: '⚙️',
    }[info.type] || '📄';
    console.log(chalk.bold(`\n${typeEmoji} ${info.name}\n`));
    console.log(chalk.dim('─'.repeat(60)));
    // Basic Information Table
    const infoTable = new Table({
        head: [chalk.cyan('Property'), chalk.white('Value')],
        colWidths: [20, 40],
    });
    infoTable.push(['Type', chalk.cyan(info.type.charAt(0).toUpperCase() + info.type.slice(1))], ['Version', info.version || chalk.gray('latest')], ['Category', info.category], ['Downloads', chalk.yellow(info.downloads.toLocaleString())], ['Upvotes', chalk.yellow(info.upvotes.toLocaleString())]);
    if (info.author) {
        infoTable.push(['Author', chalk.cyan(info.author.name)]);
    }
    if (info.createdAt) {
        infoTable.push(['Created', chalk.gray(formatTimeAgo(new Date(info.createdAt)))]);
    }
    if (info.updatedAt) {
        infoTable.push(['Updated', chalk.gray(formatTimeAgo(new Date(info.updatedAt)))]);
    }
    if (info.size) {
        const sizeMB = (info.size / 1024 / 1024).toFixed(2);
        infoTable.push(['Size', chalk.gray(`${sizeMB} MB`)]);
    }
    console.log(infoTable.toString());
    // Description
    console.log(chalk.bold('\n📝 Description\n'));
    console.log(chalk.gray(info.description));
    console.log();
    // Tags
    if (info.tags && info.tags.length > 0) {
        console.log(chalk.bold('🏷️  Tags\n'));
        console.log(info.tags.map((t) => chalk.blue(`#${t}`)).join(' '));
        console.log();
    }
    // Type-specific information
    if (info.type === 'command' && info.commandSyntax) {
        console.log(chalk.bold('⚡ Command Syntax\n'));
        console.log(chalk.green(`  ${info.commandSyntax}`));
        console.log();
        if (info.usageExamples) {
            console.log(chalk.bold('💡 Usage Examples\n'));
            const examples = info.usageExamples.split('\n').filter(line => line.trim());
            examples.forEach(example => {
                console.log(chalk.gray(`  ${example}`));
            });
            console.log();
        }
    }
    if (info.type === 'hook' && info.hookType) {
        console.log(chalk.bold('🪝 Hook Type\n'));
        console.log(chalk.cyan(`  ${info.hookType}`));
        console.log();
    }
    if (info.type === 'mcp' && info.mcpUrl) {
        console.log(chalk.bold('🔌 MCP URL\n'));
        console.log(chalk.cyan(`  ${info.mcpUrl}`));
        console.log();
    }
    if (info.type === 'plugin' && info.compatibility) {
        console.log(chalk.bold('🔧 Compatibility\n'));
        info.compatibility.forEach(comp => {
            console.log(chalk.gray(`  • ${comp}`));
        });
        console.log();
    }
    if (info.type === 'settings' && info.settingsJson) {
        console.log(chalk.bold('⚙️  Settings Configuration\n'));
        console.log(chalk.gray(JSON.stringify(info.settingsJson, null, 2)));
        console.log();
    }
    // Versions
    if (info.versions && info.versions.length > 0) {
        console.log(chalk.bold('📋 Version History\n'));
        const versionTable = new Table({
            head: [chalk.cyan('Version'), chalk.cyan('Released'), chalk.cyan('Notes')],
            colWidths: [15, 20, 25],
        });
        info.versions.slice(0, 5).forEach((v) => {
            versionTable.push([
                v.version,
                chalk.gray(formatTimeAgo(new Date(v.createdAt))),
                v.releaseNotes ? chalk.gray(v.releaseNotes.substring(0, 30) + '...') : chalk.gray('-'),
            ]);
        });
        console.log(versionTable.toString());
        console.log();
    }
    // Links
    if (info.documentationUrl) {
        console.log(chalk.bold('📚 Documentation\n'));
        console.log(chalk.blue(`  ${info.documentationUrl}\n`));
    }
    // Installation command
    console.log(chalk.bold('🚀 Installation\n'));
    console.log(chalk.green(`  ay-claude install ${info.slug}`));
    if (info.type) {
        console.log(chalk.gray(`  # Or specify type:`));
        console.log(chalk.gray(`  ay-claude install ${info.slug} --type ${info.type}`));
    }
    console.log();
}
//# sourceMappingURL=content-info.js.map