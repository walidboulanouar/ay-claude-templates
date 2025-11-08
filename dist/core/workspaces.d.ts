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
 * Load workspace config
 */
export declare function loadWorkspaceConfig(): Promise<WorkspaceConfig>;
/**
 * Save workspace config
 */
export declare function saveWorkspaceConfig(config: WorkspaceConfig): Promise<void>;
/**
 * Create workspace
 */
export declare function createWorkspace(name: string, description?: string): Promise<Workspace>;
/**
 * Sync workspace packages
 */
export declare function syncWorkspace(workspaceId: string): Promise<void>;
//# sourceMappingURL=workspaces.d.ts.map