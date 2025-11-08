import chalk from 'chalk';
import ora from 'ora';
import type { InstallationScope } from '../utils/paths.js';

/**
 * Package Bundles System
 * Install multiple related packages together
 */

export interface PackageBundle {
  id: string;
  name: string;
  description: string;
  packages: Array<{
    name: string;
    type: string;
    version?: string;
  }>;
  category: string;
  tags: string[];
  author?: string;
}

/**
 * Predefined bundles (can be loaded from API later)
 */
export const PREDEFINED_BUNDLES: PackageBundle[] = [
  {
    id: 'react-dev-stack',
    name: 'React Development Stack',
    description: 'Complete React development setup with TypeScript, formatting, and testing',
    category: 'Development',
    tags: ['react', 'typescript', 'frontend'],
    packages: [
      { name: 'react-dev-settings', type: 'settings' },
      { name: 'typescript-formatter', type: 'hook' },
      { name: 'eslint-config-react', type: 'settings' },
      { name: 'prettier-config', type: 'settings' },
    ],
  },
  {
    id: 'nodejs-backend',
    name: 'Node.js Backend Stack',
    description: 'Complete Node.js backend setup with API tools and testing',
    category: 'Development',
    tags: ['nodejs', 'backend', 'api'],
    packages: [
      { name: 'nodejs-dev-settings', type: 'settings' },
      { name: 'api-testing-hook', type: 'hook' },
      { name: 'database-mcp', type: 'mcp' },
    ],
  },
  {
    id: 'code-quality',
    name: 'Code Quality Tools',
    description: 'Essential code quality tools: linting, formatting, testing',
    category: 'Quality',
    tags: ['linting', 'formatting', 'testing'],
    packages: [
      { name: 'eslint-hook', type: 'hook' },
      { name: 'prettier-hook', type: 'hook' },
      { name: 'test-runner', type: 'hook' },
    ],
  },
  {
    id: 'git-workflow',
    name: 'Git Workflow Automation',
    description: 'Automate Git workflows: commits, pushes, branch management',
    category: 'Workflow',
    tags: ['git', 'automation', 'workflow'],
    packages: [
      { name: 'git-commit-hook', type: 'hook' },
      { name: 'git-push-hook', type: 'hook' },
      { name: 'branch-manager', type: 'command' },
    ],
  },
];

/**
 * Install a bundle
 */
export async function installBundle(
  bundleId: string,
  scope: InstallationScope,
  installFn: (name: string, type: string, opts: any) => Promise<void>
): Promise<void> {
  const bundle = PREDEFINED_BUNDLES.find((b) => b.id === bundleId);
  
  if (!bundle) {
    throw new Error(`Bundle not found: ${bundleId}`);
  }

  const spinner = ora(`Installing bundle: ${bundle.name}`).start();
  console.log(chalk.blue(`\n📦 ${bundle.name}`));
  console.log(chalk.gray(`   ${bundle.description}\n`));

  try {
    for (let i = 0; i < bundle.packages.length; i++) {
      const pkg = bundle.packages[i];
      const pkgSpinner = ora(`  [${i + 1}/${bundle.packages.length}] Installing ${pkg.name}...`).start();
      
      try {
        await installFn(pkg.name, pkg.type, {
          scope,
          version: pkg.version,
        });
        pkgSpinner.succeed(`  [${i + 1}/${bundle.packages.length}] ✓ Installed ${pkg.name}`);
      } catch (error) {
        pkgSpinner.fail(`  [${i + 1}/${bundle.packages.length}] ✗ Failed to install ${pkg.name}`);
        throw error;
      }
    }

    spinner.succeed(`Successfully installed bundle: ${bundle.name}`);
    console.log(chalk.green(`\n✨ Bundle installation complete!\n`));
  } catch (error) {
    spinner.fail(`Failed to install bundle: ${bundle.name}`);
    throw error;
  }
}

/**
 * List available bundles
 */
export function listBundles(): PackageBundle[] {
  return PREDEFINED_BUNDLES;
}

/**
 * Get bundle by ID
 */
export function getBundle(bundleId: string): PackageBundle | undefined {
  return PREDEFINED_BUNDLES.find((b) => b.id === bundleId);
}
