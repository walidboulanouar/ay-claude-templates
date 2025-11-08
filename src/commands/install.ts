import chalk from 'chalk';
import { rm } from 'fs/promises';
import inquirer from 'inquirer';
import ora from 'ora';
import { tmpdir } from 'os';
import { join } from 'path';
import { AuditLogger } from '../core/audit-logger.js';
import { readPackageManifest, resolveDependencies } from '../core/dependencies.js';
import { installPackage } from '../core/installer.js';
import { PackageVerifier } from '../core/package-verifier.js';
import { addToRegistry } from '../core/registry.js';
import { SecureAPIClient } from '../core/secure-api-client.js';
import { recordVersionInstallation } from '../core/version-management.js';
import { detectScope, getClaudePaths, getInstallDir } from '../utils/paths.js';

export async function installCommand(
  packages: string[],
  options: {
    global?: boolean;
    local?: boolean;
    type?: string;
    version?: string;
    skipDependencies?: boolean;
  }
) {
  if (packages.length === 0) {
    console.error(chalk.red('Please specify at least one package to install'));
    console.log(chalk.gray('Example: ay-claude install playwright-automation-skill'));
    process.exit(1);
  }

  // Initialize secure API client
  const apiUrl = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
  const clientId = process.env.AY_CLAUDE_CLIENT_ID || 'ay-claude-cli';
  const apiClient = new SecureAPIClient(apiUrl, clientId);

  // Initialize audit logger
  const paths = getClaudePaths();
  const auditLogger = new AuditLogger(paths.global);

  // Determine scope
  const scope = options.local ? 'local' : options.global ? 'global' : detectScope();

  console.log(chalk.blue(`Installing to ${scope} location: ${getInstallDir(scope)}`));

  for (const pkgName of packages) {
    const spinner = ora(`Installing ${pkgName}...`).start();

    try {
      // Determine content type
      let contentType = options.type;
      if (!contentType) {
        const { type } = await inquirer.prompt([
          {
            type: 'list',
            name: 'type',
            message: `What type is "${pkgName}"?`,
            choices: ['skill', 'agent', 'command', 'hook', 'plugin', 'mcp', 'settings'],
            default: 'skill',
          },
        ]);
        contentType = type;
      }

      // Search for package
      spinner.text = `Searching for ${pkgName}...`;
      const searchResponse = await apiClient.client.get('/functions/v1/search', {
        params: {
          q: pkgName,
          type: contentType,
          limit: 5,
        },
      });

      const searchResults = searchResponse.data;
      if (!searchResults.items || searchResults.items.length === 0) {
        spinner.fail(`Package not found: ${pkgName}`);
        await auditLogger.logInstall(pkgName, contentType || 'unknown', false, 'Package not found');
        continue;
      }

      // Select package if multiple matches
      let selectedPackage = searchResults.items[0];
      if (searchResults.items.length > 1) {
        const { selected } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selected',
            message: `Multiple packages found. Select one:`,
            choices: searchResults.items.map((item: any) => ({
              name: `${item.name} (${item.type}) - ${item.description}`,
              value: item,
            })),
          },
        ]);
        selectedPackage = selected;
      }

      // Get download URL (using secure client)
      spinner.text = `Getting download URL...`;
      const downloadResponse = await apiClient.client.post(
        `/functions/v1/download-${selectedPackage.type}`,
        {
          id: selectedPackage.id,
          version: options.version,
        }
      );

      const downloadInfo = downloadResponse.data;

      // Download package
      spinner.text = `Downloading ${pkgName}...`;
      const tempZip = join(tmpdir(), `${pkgName}-${Date.now()}.zip`);
      const downloadFileResponse = await apiClient.client.get(downloadInfo.url, {
        responseType: 'arraybuffer',
      });

      const { writeFile } = await import('fs/promises');
      await writeFile(tempZip, Buffer.from(downloadFileResponse.data));

      // Verify package integrity
      spinner.text = `Verifying package integrity...`;
      const verification = await PackageVerifier.verifyPackage(
        tempZip,
        tempZip, // Will extract to verify
        selectedPackage.type,
        downloadInfo.integrityHash
      );

      if (!verification.valid) {
        spinner.fail('Package verification failed');
        console.error(chalk.red('Security verification errors:'));
        verification.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
        await auditLogger.logInstall(selectedPackage.id, selectedPackage.type, false, 'Verification failed', {
          errors: verification.errors,
        });
        await rm(tempZip);
        continue;
      }

      // Install package
      spinner.text = `Installing ${pkgName}...`;
      const installDir = await installPackage(tempZip, selectedPackage.slug, {
        scope,
        contentType: selectedPackage.type,
        version: downloadInfo.version,
      });

      // Add to registry
      await addToRegistry(
        {
          name: selectedPackage.slug,
          type: selectedPackage.type,
          version: downloadInfo.version,
          installedAt: new Date().toISOString(),
          path: installDir,
          scope,
        },
        scope
      );

      // Record version installation
      await recordVersionInstallation(
        selectedPackage.id,
        selectedPackage.slug,
        selectedPackage.type,
        downloadInfo.version,
        scope
      );

      // Check and install dependencies if not skipped
      if (!options.skipDependencies) {
        spinner.text = `Checking dependencies...`;
        const { getInstalledPackages } = await import('../core/registry.js');
        const installed = await getInstalledPackages(scope);
        
        const manifest = await readPackageManifest(installDir);
        if (manifest) {
          const missingDeps = await resolveDependencies(manifest, installed);
          
          if (missingDeps.length > 0) {
            spinner.text = `Installing ${missingDeps.length} dependencies...`;
            console.log(chalk.blue(`\n📦 Installing ${missingDeps.length} dependencies:`));
            
            for (const dep of missingDeps) {
              const depSpinner = ora(`  Installing ${dep.name}...`).start();
              try {
                // Recursively install dependency
                await installCommand([dep.name], {
                  type: dep.type,
                  version: dep.version,
                  global: scope === 'global',
                  local: scope === 'local',
                  skipDependencies: false, // Install deps of deps
                });
                depSpinner.succeed(`  ✓ Installed ${dep.name}`);
              } catch (error) {
                if (dep.optional) {
                  depSpinner.warn(`  ⚠ Optional dependency ${dep.name} failed (skipped)`);
                } else {
                  depSpinner.fail(`  ✗ Failed to install ${dep.name}`);
                  // Continue anyway - don't fail main installation
                }
              }
            }
          }
        }
      }

      // Cleanup temp file
      await rm(tempZip);

      // Log successful installation
      await auditLogger.logInstall(selectedPackage.id, selectedPackage.type, true, undefined, {
        version: downloadInfo.version,
        scope,
      });

      spinner.succeed(`Successfully installed ${selectedPackage.name}@${downloadInfo.version}`);
    } catch (error) {
      spinner.fail(`Failed to install ${pkgName}`);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(errorMessage));
      
      // Log failed installation
      await auditLogger.logInstall(pkgName, options.type || 'unknown', false, errorMessage);
    }
  }
}
