import axios from 'axios';
// Get API URL from environment or use Supabase function URL
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.CLAUDE_SKILLS_API_URL || 'https://your-project.supabase.co';
const API_BASE_URL = `${SUPABASE_URL}/functions/v1`;
/**
 * API client for Claude Skills Platform
 */
export class APIClient {
    baseURL;
    apiKey;
    constructor(baseURL = API_BASE_URL, apiKey) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
    }
    /**
     * Search for content
     */
    async search(query, options) {
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
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Search failed: ${error.message}`);
            }
            throw error;
        }
    }
    /**
     * Get content by slug or ID
     */
    async getContent(type, identifier) {
        try {
            // For now, use search to find content by slug
            const searchResults = await this.search(identifier, { type, limit: 1 });
            if (searchResults.items.length === 0) {
                throw new Error(`Content not found: ${identifier}`);
            }
            return searchResults.items[0];
        }
        catch (error) {
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
    async getDownloadUrl(type, id, version) {
        try {
            // Use Supabase download-skill function (or equivalent)
            const functionName = type === 'skill' ? 'download-skill' : `download-${type}`;
            const response = await axios.post(`${this.baseURL}/${functionName}`, { id, version }, {
                headers: {
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
                    ...(this.apiKey ? { 'X-API-Key': this.apiKey } : {}),
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to get download URL: ${error.message}`);
            }
            throw error;
        }
    }
    /**
     * Download file from URL
     */
    async downloadFile(url, outputPath) {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
            });
            const { writeFile } = await import('fs/promises');
            await writeFile(outputPath, Buffer.from(response.data));
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Download failed: ${error.message}`);
            }
            throw error;
        }
    }
}
// Default API client instance
export const apiClient = new APIClient();
//# sourceMappingURL=api-client.js.map