export interface ContentItem {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: 'skill' | 'agent' | 'command' | 'hook' | 'plugin' | 'mcp' | 'settings';
    category: string;
    tags: string[];
    downloads: number;
    upvotes: number;
    version?: string;
    author?: {
        id: string;
        name: string;
    };
}
export interface SearchResult {
    items: ContentItem[];
    total: number;
    page: number;
    limit: number;
}
export interface DownloadInfo {
    url: string;
    version: string;
    size: number;
    integrityHash: string;
}
/**
 * API client for AY Claude Platform
 */
export declare class APIClient {
    private baseURL;
    private apiKey?;
    constructor(baseURL?: string, apiKey?: string);
    /**
     * Search for content
     */
    search(query: string, options?: {
        type?: string;
        category?: string;
        limit?: number;
        offset?: number;
    }): Promise<SearchResult>;
    /**
     * Get content by slug or ID
     */
    getContent(type: string, identifier: string): Promise<ContentItem>;
    /**
     * Get download URL for content
     */
    getDownloadUrl(type: string, id: string, version?: string): Promise<DownloadInfo>;
    /**
     * Download file from URL
     */
    downloadFile(url: string, outputPath: string): Promise<void>;
}
export declare const apiClient: APIClient;
//# sourceMappingURL=api-client.d.ts.map