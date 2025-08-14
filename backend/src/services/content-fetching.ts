import axios from 'axios';

/**
 * Fetches the raw HTML content from a given URL using Axios.
 * This function is responsible only for retrieving the web page's source.
 *
 * @param url The URL of the web page to fetch.
 * @returns A Promise that resolves to the HTML content as a string.
 * @throws Error if the fetch operation fails (e.g., network error, non-200 HTTP status).
 */
async function fetchHtmlContent(url: string): Promise<string> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
            },
            timeout: 10000,
            responseType: 'text'
        });

        return response.data;
    } catch (error) {
        // Axios errors often have a `response` property with more details for HTTP errors.
        if (axios.isAxiosError(error) && error.response) {
            console.error(`HTTP error! Status: ${error.response.status} for URL: ${url}`);
            throw new Error(`Could not fetch content: HTTP Status ${error.response.status}`);
        } else {
            console.error(`Failed to fetch HTML from ${url}:`, error);
            throw new Error(`Could not fetch content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}


export default fetchHtmlContent;