import chalk from 'chalk';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getClaudePaths } from '../utils/paths.js';

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
 * Get search history file path
 */
function getSearchHistoryPath(): string {
  const paths = getClaudePaths();
  return join(paths.global, 'search-history.json');
}

/**
 * Load search history
 */
export async function loadSearchHistory(): Promise<SearchHistory> {
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
  } catch (error) {
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
export async function saveSearchHistory(history: SearchHistory): Promise<void> {
  const historyPath = getSearchHistoryPath();
  const { ensureDir } = await import('../utils/paths.js');
  const { dirname } = await import('path');
  
  await ensureDir(dirname(historyPath));
  await writeFile(historyPath, JSON.stringify(history, null, 2));
}

/**
 * Record a search
 */
export async function recordSearch(
  query: string,
  resultsCount: number,
  filters?: { type?: string; category?: string }
): Promise<void> {
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
  const queryCounts = new Map<string, number>();
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
export async function getSearchSuggestions(limit: number = 5): Promise<string[]> {
  const history = await loadSearchHistory();
  return history.suggestions.slice(0, limit);
}

/**
 * Get recent searches
 */
export async function getRecentSearches(limit: number = 10): Promise<SearchHistoryEntry[]> {
  const history = await loadSearchHistory();
  return history.searches.slice(-limit).reverse();
}
