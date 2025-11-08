import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getClaudePaths } from '../utils/paths.js';
/**
 * Get workspace config file path
 */
function getWorkspaceConfigPath() {
    const paths = getClaudePaths();
    return join(paths.global, 'workspaces.json');
}
/**
 * Load workspace config
 */
export async function loadWorkspaceConfig() {
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
    }
    catch (error) {
        return {
            workspaces: [],
            version: '1.0.0',
        };
    }
}
/**
 * Save workspace config
 */
export async function saveWorkspaceConfig(config) {
    const configPath = getWorkspaceConfigPath();
    const { ensureDir } = await import('../utils/paths.js');
    const { dirname } = await import('path');
    await ensureDir(dirname(configPath));
    await writeFile(configPath, JSON.stringify(config, null, 2));
}
/**
 * Create workspace
 */
export async function createWorkspace(name, description) {
    const config = await loadWorkspaceConfig();
    const workspace = {
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
export async function syncWorkspace(workspaceId) {
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
//# sourceMappingURL=workspaces.js.map