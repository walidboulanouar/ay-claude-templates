import chalk from 'chalk';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import JSZip from 'jszip';
import ora from 'ora';
import { dirname, join } from 'path';
import { platform } from 'process';
import { ensureDir, getContentTypeDir } from '../utils/paths.js';
import { registerInClaudeCode } from './claude-code-integration.js';
/**
 * Extract ZIP file to destination directory
 */
export async function extractZip(zipPath, destDir) {
    const spinner = ora('Extracting package...').start();
    try {
        const zipBuffer = await readFile(zipPath);
        const zip = await JSZip.loadAsync(zipBuffer);
        // Create destination directory
        await ensureDir(destDir);
        // Extract all files
        const entries = Object.keys(zip.files);
        for (const entry of entries) {
            const file = zip.files[entry];
            if (file.dir) {
                // Create directory
                const dirPath = join(destDir, entry);
                await ensureDir(dirPath);
            }
            else {
                // Extract file
                const content = await file.async('nodebuffer');
                const filePath = join(destDir, entry);
                const fileDir = dirname(filePath);
                await ensureDir(fileDir);
                await writeFile(filePath, content);
            }
        }
        spinner.succeed('Package extracted successfully');
    }
    catch (error) {
        spinner.fail('Failed to extract package');
        throw error;
    }
}
/**
 * Install content package
 */
export async function installPackage(zipPath, packageName, options) {
    const { scope, contentType } = options;
    // Get installation directory
    const { getInstallDir } = await import('../utils/paths.js');
    const baseDir = getInstallDir(scope);
    const contentTypeDir = getContentTypeDir(baseDir, contentType);
    const packageDir = join(contentTypeDir, packageName);
    // Ensure directories exist
    await ensureDir(contentTypeDir);
    // Extract ZIP
    await extractZip(zipPath, packageDir);
    // Create package metadata
    const metadata = {
        name: packageName,
        type: contentType,
        installedAt: new Date().toISOString(),
        version: options.version || 'latest',
        scope,
    };
    const metadataPath = join(packageDir, '.claude-install.json');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    // Make scripts executable (Unix-like systems)
    if (platform !== 'win32') {
        try {
            const { execSync } = await import('child_process');
            execSync(`find "${packageDir}" -type f -name "*.sh" -exec chmod +x {} \\;`, { stdio: 'ignore' });
            execSync(`find "${packageDir}" -type f -name "*.py" -exec chmod +x {} \\;`, { stdio: 'ignore' });
        }
        catch (error) {
            // Ignore errors
        }
    }
    // Register with Claude Code
    try {
        await registerInClaudeCode(contentType, packageName, packageDir, scope);
    }
    catch (error) {
        console.warn(chalk.yellow(`  ⚠ Failed to register in Claude Code: ${error instanceof Error ? error.message : String(error)}`));
    }
    console.log(chalk.green(`✓ Installed ${packageName} to ${packageDir}`));
    return packageDir;
}
/**
 * Validate package structure
 */
export async function validatePackage(packageDir, contentType) {
    const requiredFiles = {
        skill: ['SKILL.md'],
        agent: ['AGENT.md'],
        command: [], // Commands can be single files
        hook: [], // Hooks can be single files
        plugin: ['plugin.json', 'manifest.json'],
        mcp: ['mcp.json'],
        settings: ['settings.json'],
    };
    const required = requiredFiles[contentType] || [];
    for (const file of required) {
        const filePath = join(packageDir, file);
        if (!existsSync(filePath)) {
            console.error(chalk.red(`✗ Missing required file: ${file}`));
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=installer.js.map