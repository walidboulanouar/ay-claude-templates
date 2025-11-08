import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getClaudePaths } from '../utils/paths.js';
/**
 * Get search history file path
 */
function getSearchHistoryPath() {
    const paths = getClaudePaths();
    return join(paths.global, 'search-history.json');
}
/**
 * Load search history
 */
export async function loadSearchHistory() {
    const historyPath = getSearchHistoryPath();
    if (!existsSync(historyPath)) {
        return {
            searches: [],
            suggestions: [],
            version: '1.0.0',
        };
    }
    try {
        const content = await readFile(historyPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        return {
            searches: [],
            suggestions: [],
            version: '1.0.0',
        };
    }
}
/**
 * Save search history
 */
export async function saveSearchHistory(history) {
    const historyPath = getSearchHistoryPath();
    const { ensureDir } = await import('../utils/paths.js');
    const { dirname } = await import('path');
    await ensureDir(dirname(historyPath));
    await writeFile(historyPath, JSON.stringify(history, null, 2));
}
/**
 * Record a search
 */
export async function recordSearch(query, resultsCount, filters) {
    const history = await loadSearchHistory();
    history.searches.push({
        query,
        timestamp: new Date().toISOString(),
        resultsCount,
        filters,
    });
    // Keep only last 100 searches
    if (history.searches.length > 100) {
        history.searches = history.searches.slice(-100);
    }
    // Update suggestions (most common queries)
    const queryCounts = new Map();
    for (const search of history.searches) {
        queryCounts.set(search.query, (queryCounts.get(search.query) || 0) + 1);
    }
    history.suggestions = Array.from(queryCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query]) => query);
    await saveSearchHistory(history);
}
/**
 * Get search suggestions
 */
export async function getSearchSuggestions(limit = 5) {
    const history = await loadSearchHistory();
    return history.suggestions.slice(0, limit);
}
/**
 * Get recent searches
 */
export async function getRecentSearches(limit = 10) {
    const history = await loadSearchHistory();
    return history.searches.slice(-limit).reverse();
}
//# sourceMappingURL=search-history.js.map