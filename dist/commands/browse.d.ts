import type { ContentType } from '../utils/content-info.js';
export declare function browseCommand(options: {
    type?: ContentType;
    category?: string;
    sort?: 'popular' | 'recent' | 'upvotes' | 'downloads';
    limit?: string;
}): Promise<void>;
//# sourceMappingURL=browse.d.ts.map