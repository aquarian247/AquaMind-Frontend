/**
 * Utility functions for handling paginated API responses
 */

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Fetches all pages from a paginated API endpoint
 * @param fetchPageFn Function that fetches a single page, returns a promise with paginated response
 * @param maxPages Maximum number of pages to fetch (to prevent infinite loops)
 * @param onProgress Optional callback for progress updates
 * @returns Promise resolving to all results across all pages
 */
export async function fetchAllPages<T>(
  fetchPageFn: (page: number) => Promise<PaginatedResponse<T>>,
  maxPages: number = 100,
  onProgress?: (currentPage: number, totalPages: number) => void
): Promise<T[]> {
  const allResults: T[] = [];
  let currentPage = 1;
  let hasNextPage = true;
  let totalPages = 1;

  try {
    while (hasNextPage && currentPage <= maxPages) {
      console.log(`📄 Fetching page ${currentPage}...`);

      const response = await fetchPageFn(currentPage);

      // Update total pages estimate
      if (currentPage === 1 && response.count > 0) {
        // Estimate total pages based on first page results
        const pageSize = response.results.length;
        totalPages = Math.ceil(response.count / pageSize);
        console.log(`📊 Estimated ${totalPages} pages total (${response.count} items)`);
      }

      allResults.push(...response.results);
      hasNextPage = response.next !== null;

      // Call progress callback if provided
      if (onProgress) {
        onProgress(currentPage, totalPages);
      }

      currentPage++;

      // Safety check: if we have more pages than expected, break
      if (currentPage > maxPages) {
        console.warn(`⚠️ Reached maximum page limit (${maxPages}), stopping fetch`);
        break;
      }
    }

    console.log(`✅ Successfully fetched ${allResults.length} items across ${currentPage - 1} pages`);
    return allResults;

  } catch (error) {
    console.error('❌ Error fetching paginated data:', error);
    throw error;
  }
}

/**
 * Extracts page number from a pagination URL
 * @param url Pagination URL (next/previous)
 * @returns Page number or null if URL is invalid
 */
export function extractPageFromUrl(url: string | null): number | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get('page');
    return page ? parseInt(page, 10) : null;
  } catch {
    return null;
  }
}

/**
 * Creates a progress-aware version of fetchAllPages for large datasets
 * @param fetchPageFn Function that fetches a single page
 * @param onProgress Callback for progress updates
 * @param options Additional options
 * @returns Promise resolving to all results
 */
export async function fetchAllPagesWithProgress<T>(
  fetchPageFn: (page: number) => Promise<PaginatedResponse<T>>,
  onProgress: (currentPage: number, totalPages: number, currentItems: number, totalItems: number) => void,
  options: { maxPages?: number; batchSize?: number } = {}
): Promise<T[]> {
  const { maxPages = 100, batchSize = 50 } = options;
  const allResults: T[] = [];
  let currentPage = 1;
  let hasNextPage = true;
  let totalItems = 0;

  try {
    while (hasNextPage && currentPage <= maxPages) {
      const response = await fetchPageFn(currentPage);

      if (currentPage === 1) {
        totalItems = response.count;
      }

      allResults.push(...response.results);
      hasNextPage = response.next !== null;

      // Call progress callback
      onProgress(currentPage, Math.ceil(totalItems / response.results.length), allResults.length, totalItems);

      currentPage++;
    }

    return allResults;
  } catch (error) {
    console.error('❌ Error in fetchAllPagesWithProgress:', error);
    throw error;
  }
}
