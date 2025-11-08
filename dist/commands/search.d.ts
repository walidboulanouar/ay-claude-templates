import type { ContentType } from '../utils/content-info.js';
export declare function searchCommand(query: string | undefined, options: {
    type?: ContentType;
    category?: string;
    limit?: string;
    format?: 'table' | 'list' | 'json';
}): Promise<void>;
//# sourceMappingURL=search.d.ts.map