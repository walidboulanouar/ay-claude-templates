import chalk from 'chalk';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export function helpCommand(command) {
    if (command) {
        // Show help for specific command
        showCommandHelp(command);
    }
    else {
        // Show general help
        showGeneralHelp();
    }
}
function showGeneralHelp() {
    console.log(chalk.bold('\n📚 AY Claude CLI - Complete Guide\n'));
    console.log(chalk.dim('─'.repeat(60)));
    console.log();
    console.log(chalk.bold('🔐 Authentication\n'));
    console.log(chalk.gray('  ay-claude login              Authenticate with platform'));
    console.log(chalk.gray('  ay-claude logout             Remove stored credentials'));
    console.log(chalk.gray('  ay-claude whoami             Show current auth status'));
    console.log();
    console.log(chalk.bold('🔍 Discovery\n'));
    console.log(chalk.gray('  ay-claude search <query>     Search all content types'));
    console.log(chalk.gray('  ay-claude browse              Browse all content'));
    console.log(chalk.gray('  ay-claude info <name>         Get detailed information'));
    console.log();
    console.log(chalk.bold('📦 Installation\n'));
    console.log(chalk.gray('  ay-claude install <name>      Install a package'));
    console.log(chalk.gray('  ay-claude list                List installed packages'));
    console.log(chalk.gray('  ay-claude update              Update packages'));
    console.log(chalk.gray('  ay-claude uninstall <name>    Remove a package'));
    console.log();
    console.log(chalk.bold('📋 Content Types\n'));
    console.log(chalk.gray('  • Skills    📦  - Claude extensions with SKILL.md'));
    console.log(chalk.gray('  • Agents    🤖  - Pre-configured AI assistants'));
    console.log(chalk.gray('  • Commands  ⚡  - Custom slash commands'));
    console.log(chalk.gray('  • Hooks     🪝  - Event-driven scripts'));
    console.log(chalk.gray('  • Plugins   🧩  - Extension bundles'));
    console.log(chalk.gray('  • MCPs      🔌  - Model Context Protocol servers'));
    console.log(chalk.gray('  • Settings  ⚙️   - Configuration presets'));
    console.log();
    console.log(chalk.bold('💡 Examples\n'));
    console.log(chalk.green('  # Search for automation tools'));
    console.log(chalk.gray('  ay-claude search "automation"'));
    console.log();
    console.log(chalk.green('  # Install a skill'));
    console.log(chalk.gray('  ay-claude install playwright-automation-skill'));
    console.log();
    console.log(chalk.green('  # Get detailed info'));
    console.log(chalk.gray('  ay-claude info playwright-automation-skill'));
    console.log();
    console.log(chalk.green('  # Browse all agents'));
    console.log(chalk.gray('  ay-claude browse --type agent'));
    console.log();
    console.log(chalk.bold('📖 Documentation\n'));
    console.log(chalk.gray('  Visit: https://ay-claude.com/docs/cli'));
    console.log(chalk.gray('  Run: ay-claude help <command> for command-specific help'));
    console.log();
    console.log(chalk.bold('🆘 Troubleshooting\n'));
    console.log(chalk.gray('  Run: ay-claude troubleshoot'));
    console.log(chalk.gray('  Or visit: https://ay-claude.com/docs/cli/troubleshooting'));
    console.log();
}
function showCommandHelp(command) {
    const helpTexts = {
        install: `
${chalk.bold('📦 Install Command')}

${chalk.cyan('Usage:')}
  ay-claude install <package-name> [options]

${chalk.cyan('Options:')}
  -g, --global          Install globally in ~/.claude
  -l, --local           Install locally in ./.claude
  -t, --type <type>     Specify content type
  --version <version>    Install specific version

${chalk.cyan('Examples:')}
  ay-claude install playwright-automation-skill
  ay-claude install code-review-agent --type agent
  ay-claude install my-skill --version 1.2.0
  ay-claude install skill-1 skill-2 --local

${chalk.cyan('Content Types:')}
  skill, agent, command, hook, plugin, mcp, settings
`,
        search: `
${chalk.bold('🔍 Search Command')}

${chalk.cyan('Usage:')}
  ay-claude search <query> [options]

${chalk.cyan('Options:')}
  -t, --type <type>         Filter by content type
  -c, --category <cat>      Filter by category
  --limit <number>          Limit results (default: 20)
  --format <format>         Output format: table, list, json

${chalk.cyan('Examples:')}
  ay-claude search "automation"
  ay-claude search "testing" --type skill
  ay-claude search "data" --category "Data Analysis"
  ay-claude search "api" --format json

${chalk.cyan('Tips:')}
  • Use quotes for multi-word queries
  • Combine filters for precise results
  • Use --format json for scripting
`,
        info: `
${chalk.bold('ℹ️  Info Command')}

${chalk.cyan('Usage:')}
  ay-claude info <package-name> [options]

${chalk.cyan('Options:')}
  -t, --type <type>     Specify content type

${chalk.cyan('Examples:')}
  ay-claude info playwright-automation-skill
  ay-claude info code-review-agent --type agent

${chalk.cyan('Shows:')}
  • Detailed package information
  • Version history
  • Installation instructions
  • Usage examples (for commands)
  • Compatibility (for plugins)
  • Documentation links
`,
        browse: `
${chalk.bold('📚 Browse Command')}

${chalk.cyan('Usage:')}
  ay-claude browse [options]

${chalk.cyan('Options:')}
  -t, --type <type>         Filter by content type
  -c, --category <cat>      Filter by category
  --sort <sort>             Sort: popular, recent, upvotes, downloads
  --limit <number>          Limit results (default: 20)

${chalk.cyan('Examples:')}
  ay-claude browse
  ay-claude browse --type agent
  ay-claude browse --category "Development Tools"
  ay-claude browse --sort popular --limit 50
`,
    };
    const help = helpTexts[command];
    if (help) {
        console.log(help);
    }
    else {
        console.log(chalk.red(`\nNo help available for command: ${command}\n`));
        console.log(chalk.gray('Available commands: install, search, info, browse, list, update, uninstall'));
    }
}
//# sourceMappingURL=help.js.map