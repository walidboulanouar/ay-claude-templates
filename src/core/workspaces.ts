import chalk from 'chalk';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getClaudePaths } from '../utils/paths.js';

/**
 * Team Workspaces System
 * Share configurations across teams
 */

export interface WorkspaceMember {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: WorkspaceMember[];
  packages: Array<{
    name: string;
    type: string;
    version?: string;
  }>;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceConfig {
  workspaces: Workspace[];
  currentWorkspace?: string;
  version: string;
}

/**
 * Get workspace config file path
 */
function getWorkspaceConfigPath(): string {
  const paths = getClaudePaths();
  return join(paths.global, 'workspaces.json');
}

/**
 * Load workspace config
 */
export async function loadWorkspaceConfig(): Promise<WorkspaceConfig> {
  const configPath = getWorkspaceConfigPath();
  
  if (!existsSync(configPath)) {
    return {
      workspaces: [],
      version: '1.0.0',
    };
  }

  try {
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {
      workspaces: [],
      version: '1.0.0',
    };
  }
}

/**
 * Save workspace config
 */
export async function saveWorkspaceConfig(config: WorkspaceConfig): Promise<void> {
  const configPath = getWorkspaceConfigPath();
  const { ensureDir } = await import('../utils/paths.js');
  const { dirname } = await import('path');
  
  await ensureDir(dirname(configPath));
  await writeFile(configPath, JSON.stringify(config, null, 2));
}

/**
 * Create workspace
 */
export async function createWorkspace(
  name: string,
  description?: string
): Promise<Workspace> {
  const config = await loadWorkspaceConfig();
  
  const workspace: Workspace = {
    id: `workspace-${Date.now()}`,
    name,
    description,
    members: [],
    packages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  config.workspaces.push(workspace);
  await saveWorkspaceConfig(config);
  
  return workspace;
}

/**
 * Sync workspace packages
 */
export async function syncWorkspace(workspaceId: string): Promise<void> {
  const config = await loadWorkspaceConfig();
  const workspace = config.workspaces.find((w) => w.id === workspaceId);
  
  if (!workspace) {
    throw new Error('Workspace not found');
  }

  // Install all workspace packages
  const { installCommand } = await import('../commands/install.js');
  
  for (const pkg of workspace.packages) {
    await installCommand([pkg.name], {
      type: pkg.type,
      version: pkg.version,
      local: true, // Workspace packages are local
    });
  }

  workspace.updatedAt = new Date().toISOString();
  await saveWorkspaceConfig(config);
}
