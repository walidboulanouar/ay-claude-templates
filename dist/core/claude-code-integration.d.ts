import type { InstallationScope } from '../utils/paths.js';
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
export declare function loadClaudeCodeSettings(scope: InstallationScope): Promise<ClaudeCodeSettings>;
/**
 * Save Claude Code settings.json
 */
export declare function saveClaudeCodeSettings(settings: ClaudeCodeSettings, scope: InstallationScope): Promise<void>;
/**
 * Merge settings (deep merge arrays and objects)
 */
export declare function mergeSettings(base: ClaudeCodeSettings, overlay: ClaudeCodeSettings): ClaudeCodeSettings;
/**
 * Register installed content in Claude Code settings
 */
export declare function registerInClaudeCode(contentType: string, packageName: string, packagePath: string, scope: InstallationScope): Promise<void>;
//# sourceMappingURL=claude-code-integration.d.ts.map