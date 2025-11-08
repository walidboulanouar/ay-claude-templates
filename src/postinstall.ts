#!/usr/bin/env node
/**
 * Post-install script for AY Claude CLI
 * Configures PATH and verifies installation
 */

import { platform } from 'process';
import { existsSync, writeFileSync, readFileSync, chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get npm global bin directory
 */
function getNpmGlobalBin(): string {
  try {
    const prefix = execSync('npm config get prefix', { encoding: 'utf-8' }).trim();
    return join(prefix, platform === 'win32' ? '' : 'bin');
  } catch (error) {
    const { homedir } = require('os');
    const home = homedir();
    if (platform === 'win32') {
      return join(home, 'AppData', 'Roaming', 'npm');
    } else {
      return join(home, '.npm-global', 'bin');
    }
  }
}

/**
 * Check if PATH contains the bin directory
 */
function isInPath(binDir: string): boolean {
  const pathEnv = process.env.PATH || process.env.Path || '';
  return pathEnv.split(platform === 'win32' ? ';' : ':').includes(binDir);
}

/**
 * Add to PATH (platform-specific)
 */
function addToPath(binDir: string): void {
  const shell = process.env.SHELL || '';
  const home = require('os').homedir();

  if (platform === 'win32') {
    // Windows: Add to user PATH via registry or PowerShell
    console.log('\n📝 To add CLI to PATH on Windows:');
    console.log(`   1. Open System Properties > Environment Variables`);
    console.log(`   2. Add: ${binDir}`);
    console.log(`   3. Or run: setx PATH "%PATH%;${binDir}"`);
  } else if (shell.includes('zsh')) {
    // Zsh
    const zshrc = join(home, '.zshrc');
    const exportLine = `export PATH="$PATH:${binDir}"`;
    
    if (existsSync(zshrc)) {
      const content = readFileSync(zshrc, 'utf-8');
      if (!content.includes(binDir)) {
        writeFileSync(zshrc, `${content}\n# AY Claude CLI\n${exportLine}\n`, { flag: 'a' });
        console.log(`\n✅ Added to ~/.zshrc`);
        console.log(`   Run: source ~/.zshrc`);
      }
    } else {
      writeFileSync(zshrc, `# AY Claude CLI\n${exportLine}\n`);
      console.log(`\n✅ Created ~/.zshrc with PATH`);
    }
  } else if (shell.includes('bash')) {
    // Bash
    const bashrc = join(home, '.bashrc');
    const exportLine = `export PATH="$PATH:${binDir}"`;
    
    if (existsSync(bashrc)) {
      const content = readFileSync(bashrc, 'utf-8');
      if (!content.includes(binDir)) {
        writeFileSync(bashrc, `${content}\n# AY Claude CLI\n${exportLine}\n`, { flag: 'a' });
        console.log(`\n✅ Added to ~/.bashrc`);
        console.log(`   Run: source ~/.bashrc`);
      }
    } else {
      writeFileSync(bashrc, `# AY Claude CLI\n${exportLine}\n`);
      console.log(`\n✅ Created ~/.bashrc with PATH`);
    }
  } else {
    // Fallback
    console.log(`\n📝 Add to your shell config:`);
    console.log(`   export PATH="$PATH:${binDir}"`);
  }
}

/**
 * Main post-install logic
 */
function main() {
  console.log('\n🚀 AY Claude CLI - Post-Install Setup\n');

  // Get bin directory
  const binDir = getNpmGlobalBin();
  console.log(`📦 Bin directory: ${binDir}`);

  // Check if CLI is in PATH
  if (isInPath(binDir)) {
    console.log('✅ CLI is already in PATH');
  } else {
    console.log('⚠️  CLI is not in PATH');
    addToPath(binDir);
  }

  // Verify CLI executable
  const cliPath = join(__dirname, '..', 'dist', 'index.js');
  if (existsSync(cliPath)) {
    try {
      chmodSync(cliPath, 0o755); // Make executable
      console.log('✅ CLI executable permissions set');
    } catch (error) {
      // Ignore errors on Windows
    }
  }

  // Create Claude Code directories
  const { homedir } = require('os');
  const claudeDir = join(homedir(), '.claude');
  if (!existsSync(claudeDir)) {
    const { mkdirSync } = require('fs');
    mkdirSync(claudeDir, { recursive: true });
    console.log('✅ Created ~/.claude directory');
  }

  console.log('\n✨ Installation complete!');
  console.log('\n📚 Next steps:');
  console.log('   1. Restart your terminal');
  console.log('   2. Run: ay-claude login');
  console.log('   3. Run: ay-claude search "automation"');
  console.log('\n💡 For help: ay-claude help\n');
}

// Run post-install
main();
