import { SecureAPIClient } from '../core/secure-api-client.js';
export type ContentType = 'skill' | 'agent' | 'command' | 'hook' | 'plugin' | 'mcp' | 'settings';
export interface DetailedContentInfo {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: ContentType;
    category: string;
    tags: string[];
    downloads: number;
    upvotes: number;
    version?: string;
    author?: {
        id: string;
        name: string;
        avatar?: string;
    };
    createdAt?: string;
    updatedAt?: string;
    readme?: string;
    releaseNotes?: string;
    compatibility?: string[];
    documentationUrl?: string;
    iconUrl?: string;
    size?: number;
    integrityHash?: string;
    versions?: Array<{
        version: string;
        createdAt: string;
        releaseNotes?: string;
    }>;
    commandSyntax?: string;
    usageExamples?: string;
    hookType?: string;
    mcpUrl?: string;
    settingsJson?: any;
}
/**
 * Get detailed information about any content type
 */
export declare function getDetailedInfo(apiClient: SecureAPIClient, identifier: string, type?: ContentType): Promise<DetailedContentInfo>;
/**
 * Display detailed information in a beautiful format
 */
export declare function displayContentInfo(info: DetailedContentInfo): void;
//# sourceMappingURL=content-info.d.ts.map