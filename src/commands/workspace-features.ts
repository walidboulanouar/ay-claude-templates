import chalk from 'chalk';
import { getRecentSearches, getSearchSuggestions } from '../core/search-history.js';
import { createWorkspace, syncWorkspace, loadWorkspaceConfig } from '../core/workspaces.js';
import { listTemplates, createFromTemplate } from '../core/templates.js';
import inquirer from 'inquirer';
import { resolve } from 'path';

/**
 * Search history command
 */
export async function searchHistoryCommand() {
  const recent = await getRecentSearches(10);
  const suggestions = await getSearchSuggestions(5);

  console.log(chalk.bold('\n🔍 Search History\n'));

  if (recent.length === 0) {
    console.log(chalk.yellow('No search history yet\n'));
    return;
  }

  console.log(chalk.cyan('Recent Searches:\n'));
  for (const search of recent) {
    const date = new Date(search.timestamp);
    console.log(`  ${chalk.white(search.query)} ${chalk.gray(`(${search.resultsCount} results, ${date.toLocaleDateString()})`)}`);
  }

  if (suggestions.length > 0) {
    console.log(chalk.cyan('\nSuggestions:\n'));
    for (const suggestion of suggestions) {
      console.log(`  ${chalk.gray('•')} ${suggestion}`);
    }
  }

  console.log();
}

/**
 * Workspace command
 */
export async function workspaceCommand(
  action: string,
  workspaceId: string | undefined,
  options: {
    list?: boolean;
    create?: string;
    sync?: boolean;
  } = {}
) {
  if (options.list || action === 'list') {
    const config = await loadWorkspaceConfig();
    
    if (config.workspaces.length === 0) {
      console.log(chalk.yellow('\nNo workspaces yet\n'));
      console.log(chalk.gray('Create workspace: claude-skills workspace create <name>'));
      return;
    }

    console.log(chalk.bold('\n👥 Workspaces\n'));
    
    for (const workspace of config.workspaces) {
      console.log(chalk.cyan(`  ${workspace.name}`));
      if (workspace.description) {
        console.log(chalk.gray(`    ${workspace.description}`));
      }
      console.log(chalk.gray(`    Packages: ${workspace.packages.length} | Members: ${workspace.members.length}`));
      console.log();
    }
    
    return;
  }

  if (options.create || action === 'create') {
    const name = options.create || workspaceId;
    
    if (!name) {
      console.error(chalk.red('Please specify a workspace name'));
      process.exit(1);
    }

    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Description (optional):',
      },
    ]);

    try {
      const workspace = await createWorkspace(name, description);
      console.log(chalk.green(`\n✓ Created workspace: ${workspace.name}\n`));
    } catch (error) {
      console.error(chalk.red(`Failed to create workspace: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
    return;
  }

  if (options.sync || action === 'sync') {
    if (!workspaceId) {
      console.error(chalk.red('Please specify a workspace ID'));
      process.exit(1);
    }

    try {
      await syncWorkspace(workspaceId);
      console.log(chalk.green(`\n✓ Synced workspace\n`));
    } catch (error) {
      console.error(chalk.red(`Failed to sync workspace: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
    return;
  }

  // Default: show help
  console.log(chalk.bold('\n👥 Workspaces\n'));
  console.log('  list              List all workspaces');
  console.log('  create <name>     Create a new workspace');
  console.log('  sync <id>         Sync workspace packages');
  console.log();
}

/**
 * Template command
 */
export async function templateCommand(
  action: string,
  templateId: string | undefined,
  options: {
    list?: boolean;
    create?: string;
  } = {}
) {
  if (options.list || action === 'list') {
    const templates = listTemplates();
    
    console.log(chalk.bold('\n📝 Package Templates\n'));
    
    const byType = templates.reduce((acc, t) => {
      if (!acc[t.contentType]) {
        acc[t.contentType] = [];
      }
      acc[t.contentType].push(t);
      return acc;
    }, {} as Record<string, typeof templates>);

    for (const [type, typeTemplates] of Object.entries(byType)) {
      console.log(chalk.cyan(`  ${type.charAt(0).toUpperCase() + type.slice(1)}s:`));
      for (const template of typeTemplates) {
        console.log(chalk.white(`    ${template.id}`));
        console.log(chalk.gray(`      ${template.description}`));
      }
      console.log();
    }
    
    return;
  }

  if (options.create || action === 'create') {
    const name = options.create || templateId;
    
    if (!name) {
      console.error(chalk.red('Please specify a template ID'));
      console.log(chalk.gray('Use "claude-skills template list" to see available templates'));
      process.exit(1);
    }

    const template = listTemplates().find((t) => t.id === name);
    
    if (!template) {
      console.error(chalk.red(`Template not found: ${name}`));
      process.exit(1);
    }

    // Get package details
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name:',
        default: name,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: process.env.USER || 'unknown',
      },
      {
        type: 'input',
        name: 'outputDir',
        message: 'Output directory:',
        default: `./${name}`,
      },
    ]);

    try {
      await createFromTemplate(
        template.id,
        answers.packageName,
        {
          name: answers.packageName,
          description: answers.description,
          author: answers.author,
        },
        resolve(answers.outputDir)
      );
      
      console.log(chalk.green(`\n✓ Package created successfully!\n`));
      console.log(chalk.gray(`  Next steps:`));
      console.log(chalk.gray(`  1. Review the generated files`));
      console.log(chalk.gray(`  2. Customize as needed`));
      console.log(chalk.gray(`  3. Package and upload to marketplace\n`));
    } catch (error) {
      console.error(chalk.red(`Failed to create package: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
    return;
  }

  // Default: show help
  console.log(chalk.bold('\n📝 Package Templates\n'));
  console.log('  list              List all templates');
  console.log('  create <id>       Create package from template');
  console.log();
}
