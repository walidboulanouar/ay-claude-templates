/**
 * Search History System
 * Remember and suggest based on search history
 */
export interface SearchHistoryEntry {
    query: string;
    timestamp: string;
    resultsCount: number;
    filters?: {
        type?: string;
        category?: string;
    };
}
export interface SearchHistory {
    searches: SearchHistoryEntry[];
    suggestions: string[];
    version: string;
}
/**
 * Load search history
 */
export declare function loadSearchHistory(): Promise<SearchHistory>;
/**
 * Save search history
 */
export declare function saveSearchHistory(history: SearchHistory): Promise<void>;
/**
 * Record a search
 */
export declare function recordSearch(query: string, resultsCount: number, filters?: {
    type?: string;
    category?: string;
}): Promise<void>;
/**
 * Get search suggestions
 */
export declare function getSearchSuggestions(limit?: number): Promise<string[]>;
/**
 * Get recent searches
 */
export declare function getRecentSearches(limit?: number): Promise<SearchHistoryEntry[]>;
//# sourceMappingURL=search-history.d.ts.map