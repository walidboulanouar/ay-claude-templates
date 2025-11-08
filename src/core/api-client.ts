import axios from 'axios';

// Get API URL from environment or use Supabase function URL
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;

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
 * API client for Claude Skills Platform
 */
export class APIClient {
  private baseURL: string;
  private apiKey?: string;

  constructor(baseURL: string = API_BASE_URL, apiKey?: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  /**
   * Search for content
   */
  async search(query: string, options?: {
    type?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(options?.type && { type: options.type }),
        ...(options?.category && { category: options.category }),
        ...(options?.limit && { limit: options.limit.toString() }),
        ...(options?.offset && { offset: options.offset.toString() }),
      });

      const response = await axios.get(`${this.baseURL}/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Search failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get content by slug or ID
   */
  async getContent(type: string, identifier: string): Promise<ContentItem> {
    try {
      // For now, use search to find content by slug
      const searchResults = await this.search(identifier, { type, limit: 1 });
      if (searchResults.items.length === 0) {
        throw new Error(`Content not found: ${identifier}`);
      }
      return searchResults.items[0];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Content not found: ${identifier}`);
        }
        throw new Error(`Failed to fetch content: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get download URL for content
   */
  async getDownloadUrl(type: string, id: string, version?: string): Promise<DownloadInfo> {
    try {
      // Use Supabase download-skill function (or equivalent)
      const functionName = type === 'skill' ? 'download-skill' : `download-${type}`;
      const response = await axios.post(
        `${this.baseURL}/${functionName}`,
        { id, version },
        {
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
            ...(this.apiKey ? { 'X-API-Key': this.apiKey } : {}),
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get download URL: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Download file from URL
   */
  async downloadFile(url: string, outputPath: string): Promise<void> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
      });

      const { writeFile } = await import('fs/promises');
      await writeFile(outputPath, Buffer.from(response.data));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Download failed: ${error.message}`);
      }
      throw error;
    }
  }
}

// Default API client instance
export const apiClient = new APIClient();
