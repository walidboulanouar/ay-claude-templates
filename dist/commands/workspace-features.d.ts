/**
 * Search history command
 */
export declare function searchHistoryCommand(): Promise<void>;
/**
 * Workspace command
 */
export declare function workspaceCommand(action: string, workspaceId: string | undefined, options?: {
    list?: boolean;
    create?: string;
    sync?: boolean;
}): Promise<void>;
/**
 * Template command
 */
export declare function templateCommand(action: string, templateId: string | undefined, options?: {
    list?: boolean;
    create?: string;
}): Promise<void>;
//# sourceMappingURL=workspace-features.d.ts.map