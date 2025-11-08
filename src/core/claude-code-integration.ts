import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { getSettingsPath } from '../utils/paths.js';
import type { InstallationScope } from '../utils/paths.js';
import chalk from 'chalk';

/**
 * Claude Code Settings Integration
 * Manages integration with Claude Code's settings.json files
 */

export interface ClaudeCodeSettings {
  permissions?: {
    allow?: string[];
    ask?: string[];
    deny?: string[];
    additionalDirectories?: string[];
    defaultMode?: 'acceptEdits' | 'reviewEdits' | 'rejectEdits';
  };
  env?: Record<string, string>;
  model?: string;
  modelConfig?: Record<string, any>;
  hooks?: Record<string, any[]>;
  statusLine?: {
    type: 'command';
    command: string;
    padding?: number;
  };
  enabledPlugins?: string[];
  enabledMcpjsonServers?: string[];
  disabledMcpjsonServers?: string[];
  mcpApprovals?: Record<string, any>;
}

/**
 * Load Claude Code settings.json
 */
export async function loadClaudeCodeSettings(scope: InstallationScope): Promise<ClaudeCodeSettings> {
  const settingsPath = getSettingsPath(scope);
  
  if (!existsSync(settingsPath)) {
    return {};
  }

  try {
    const content = await readFile(settingsPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(chalk.yellow(`Failed to load settings.json: ${error instanceof Error ? error.message : String(error)}`));
    return {};
  }
}

/**
 * Save Claude Code settings.json
 */
export async function saveClaudeCodeSettings(
  settings: ClaudeCodeSettings,
  scope: InstallationScope
): Promise<void> {
  const settingsPath = getSettingsPath(scope);
  const { ensureDir } = await import('../utils/paths.js');
  const { dirname } = await import('path');
  
  await ensureDir(dirname(settingsPath));
  await writeFile(settingsPath, JSON.stringify(settings, null, 2));
}

/**
 * Merge settings (deep merge arrays and objects)
 */
export function mergeSettings(
  base: ClaudeCodeSettings,
  overlay: ClaudeCodeSettings
): ClaudeCodeSettings {
  const merged = { ...base };

  // Merge permissions
  if (overlay.permissions) {
    merged.permissions = {
      ...base.permissions,
      ...overlay.permissions,
      allow: [...(base.permissions?.allow || []), ...(overlay.permissions?.allow || [])],
      ask: [...(base.permissions?.ask || []), ...(overlay.permissions?.ask || [])],
      deny: [...(base.permissions?.deny || []), ...(overlay.permissions?.deny || [])],
      additionalDirectories: [
        ...(base.permissions?.additionalDirectories || []),
        ...(overlay.permissions?.additionalDirectories || []),
      ],
    };
  }

  // Merge env
  if (overlay.env) {
    merged.env = { ...base.env, ...overlay.env };
  }

  // Merge hooks
  if (overlay.hooks) {
    merged.hooks = { ...base.hooks };
    for (const [event, hooks] of Object.entries(overlay.hooks)) {
      merged.hooks[event] = [...(merged.hooks[event] || []), ...hooks];
    }
  }

  // Merge plugins
  if (overlay.enabledPlugins) {
    merged.enabledPlugins = [...(base.enabledPlugins || []), ...overlay.enabledPlugins];
  }

  // Merge MCP servers
  if (overlay.enabledMcpjsonServers) {
    merged.enabledMcpjsonServers = [
      ...(base.enabledMcpjsonServers || []),
      ...overlay.enabledMcpjsonServers,
    ];
  }

  // Override other fields
  if (overlay.model) merged.model = overlay.model;
  if (overlay.modelConfig) merged.modelConfig = overlay.modelConfig;
  if (overlay.statusLine) merged.statusLine = overlay.statusLine;
  if (overlay.mcpApprovals) merged.mcpApprovals = { ...base.mcpApprovals, ...overlay.mcpApprovals };

  return merged;
}

/**
 * Register installed content in Claude Code settings
 */
export async function registerInClaudeCode(
  contentType: string,
  packageName: string,
  packagePath: string,
  scope: InstallationScope
): Promise<void> {
  const settings = await loadClaudeCodeSettings(scope);

  // Register hooks
  if (contentType === 'hook') {
    // Hooks are registered in settings.json hooks section
    // The actual hook files are in .claude/hooks/
    // This is handled by the hook installation process
    console.log(chalk.gray(`  → Hook registered in Claude Code settings`));
  }

  // Register plugins
  if (contentType === 'plugin') {
    if (!settings.enabledPlugins) {
      settings.enabledPlugins = [];
    }
    if (!settings.enabledPlugins.includes(packageName)) {
      settings.enabledPlugins.push(packageName);
      await saveClaudeCodeSettings(settings, scope);
      console.log(chalk.gray(`  → Plugin enabled in Claude Code settings`));
    }
  }

  // Register MCP servers
  if (contentType === 'mcp' || contentType === 'agent' || contentType === 'skill') {
    // Check if package has mcp.json
    const { existsSync } = await import('fs');
    const { join } = await import('path');
    const mcpJsonPath = join(packagePath, 'mcp.json');
    
    if (existsSync(mcpJsonPath)) {
      const mcpConfig = JSON.parse(await readFile(mcpJsonPath, 'utf-8'));
      const serverName = mcpConfig.name || packageName;
      
      if (!settings.enabledMcpjsonServers) {
        settings.enabledMcpjsonServers = [];
      }
      if (!settings.enabledMcpjsonServers.includes(serverName)) {
        settings.enabledMcpjsonServers.push(serverName);
        await saveClaudeCodeSettings(settings, scope);
        console.log(chalk.gray(`  → MCP server "${serverName}" enabled in Claude Code settings`));
      }
    }
  }

  // Register settings presets
  if (contentType === 'settings') {
    // Settings presets are merged into settings.json
    const presetSettingsPath = join(packagePath, 'settings.json');
    if (existsSync(presetSettingsPath)) {
      const presetSettings = JSON.parse(await readFile(presetSettingsPath, 'utf-8'));
      const merged = mergeSettings(settings, presetSettings);
      await saveClaudeCodeSettings(merged, scope);
      console.log(chalk.gray(`  → Settings preset merged into Claude Code settings`));
    }
  }
}
