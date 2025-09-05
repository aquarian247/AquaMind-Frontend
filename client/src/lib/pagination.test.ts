import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAllPages, extractPageFromUrl, fetchAllPagesWithProgress } from './pagination';

describe('Pagination Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllPages', () => {
    it('should fetch all pages successfully', async () => {
      const mockFetchPageFn = vi.fn();

      // Mock responses for 3 pages
      mockFetchPageFn
        .mockResolvedValueOnce({
          count: 150,
          next: 'http://api.example.com?page=2',
          previous: null,
          results: [{ id: 1 }, { id: 2 }, { id: 3 }]
        })
        .mockResolvedValueOnce({
          count: 150,
          next: 'http://api.example.com?page=3',
          previous: 'http://api.example.com?page=1',
          results: [{ id: 4 }, { id: 5 }, { id: 6 }]
        })
        .mockResolvedValueOnce({
          count: 150,
          next: null,
          previous: 'http://api.example.com?page=2',
          results: [{ id: 7 }, { id: 8 }, { id: 9 }]
        });

      const result = await fetchAllPages(mockFetchPageFn, 10);

      expect(result).toHaveLength(9);
      expect(result).toEqual([
        { id: 1 }, { id: 2 }, { id: 3 },
        { id: 4 }, { id: 5 }, { id: 6 },
        { id: 7 }, { id: 8 }, { id: 9 }
      ]);
      expect(mockFetchPageFn).toHaveBeenCalledTimes(3);
      expect(mockFetchPageFn).toHaveBeenNthCalledWith(1, 1);
      expect(mockFetchPageFn).toHaveBeenNthCalledWith(2, 2);
      expect(mockFetchPageFn).toHaveBeenNthCalledWith(3, 3);
    });

    it('should handle single page response', async () => {
      const mockFetchPageFn = vi.fn().mockResolvedValue({
        count: 3,
        next: null,
        previous: null,
        results: [{ id: 1 }, { id: 2 }, { id: 3 }]
      });

      const result = await fetchAllPages(mockFetchPageFn);

      expect(result).toHaveLength(3);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      expect(mockFetchPageFn).toHaveBeenCalledTimes(1);
      expect(mockFetchPageFn).toHaveBeenCalledWith(1);
    });

    it('should respect maxPages limit', async () => {
      const mockFetchPageFn = vi.fn();

      // Mock infinite pagination
      mockFetchPageFn.mockResolvedValue({
        count: 1000,
        next: 'http://api.example.com?page=2',
        previous: null,
        results: [{ id: 1 }, { id: 2 }, { id: 3 }]
      });

      const result = await fetchAllPages(mockFetchPageFn, 2);

      expect(result).toHaveLength(6); // 2 pages × 3 items each
      expect(mockFetchPageFn).toHaveBeenCalledTimes(2);
    });

    it('should call progress callback when provided', async () => {
      const mockFetchPageFn = vi.fn();
      const mockOnProgress = vi.fn();

      mockFetchPageFn
        .mockResolvedValueOnce({
          count: 9,
          next: 'http://api.example.com?page=2',
          previous: null,
          results: [{ id: 1 }, { id: 2 }, { id: 3 }]
        })
        .mockResolvedValueOnce({
          count: 9,
          next: null,
          previous: 'http://api.example.com?page=1',
          results: [{ id: 4 }, { id: 5 }, { id: 6 }]
        });

      await fetchAllPages(mockFetchPageFn, 10, mockOnProgress);

      expect(mockOnProgress).toHaveBeenCalledTimes(2);
      expect(mockOnProgress).toHaveBeenNthCalledWith(1, 1, 3); // page 1, estimated 3 pages
      expect(mockOnProgress).toHaveBeenNthCalledWith(2, 2, 3); // page 2, estimated 3 pages
    });

    it('should handle API errors gracefully', async () => {
      const mockFetchPageFn = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(fetchAllPages(mockFetchPageFn)).rejects.toThrow('Network error');
    });

    it('should handle empty results', async () => {
      const mockFetchPageFn = vi.fn().mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: []
      });

      const result = await fetchAllPages(mockFetchPageFn);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle malformed response data', async () => {
      const mockFetchPageFn = vi.fn().mockResolvedValue({
        count: 5,
        next: null,
        previous: null,
        results: null // Malformed results
      });

      const result = await fetchAllPages(mockFetchPageFn);

      expect(result).toHaveLength(0);
    });
  });

  describe('extractPageFromUrl', () => {
    it('should extract page number from URL', () => {
      expect(extractPageFromUrl('http://api.example.com?page=5')).toBe(5);
      expect(extractPageFromUrl('https://api.example.com/data?page=10&limit=20')).toBe(10);
      expect(extractPageFromUrl('http://api.example.com?page=1')).toBe(1);
    });

    it('should return null for URLs without page parameter', () => {
      expect(extractPageFromUrl('http://api.example.com')).toBeNull();
      expect(extractPageFromUrl('http://api.example.com?limit=20')).toBeNull();
    });

    it('should return null for invalid URLs', () => {
      expect(extractPageFromUrl(null)).toBeNull();
      expect(extractPageFromUrl('')).toBeNull();
      expect(extractPageFromUrl('not-a-url')).toBeNull();
    });

    it('should handle invalid page values', () => {
      expect(extractPageFromUrl('http://api.example.com?page=abc')).toBeNull();
      expect(extractPageFromUrl('http://api.example.com?page=')).toBeNull();
    });
  });

  describe('fetchAllPagesWithProgress', () => {
    it('should fetch all pages with progress tracking', async () => {
      const mockFetchPageFn = vi.fn();
      const mockOnProgress = vi.fn();

      mockFetchPageFn
        .mockResolvedValueOnce({
          count: 6,
          next: 'http://api.example.com?page=2',
          previous: null,
          results: [{ id: 1 }, { id: 2 }]
        })
        .mockResolvedValueOnce({
          count: 6,
          next: null,
          previous: 'http://api.example.com?page=1',
          results: [{ id: 3 }, { id: 4 }]
        });

      const result = await fetchAllPagesWithProgress(mockFetchPageFn, mockOnProgress);

      expect(result).toHaveLength(4);
      expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

      expect(mockOnProgress).toHaveBeenCalledTimes(2);
      expect(mockOnProgress).toHaveBeenNthCalledWith(1, 1, 3, 2, 6); // page 1, totalPages 3, currentItems 2, totalItems 6
      expect(mockOnProgress).toHaveBeenNthCalledWith(2, 2, 3, 4, 6); // page 2, totalPages 3, currentItems 4, totalItems 6
    });

    it('should handle single page with progress', async () => {
      const mockFetchPageFn = vi.fn().mockResolvedValue({
        count: 2,
        next: null,
        previous: null,
        results: [{ id: 1 }, { id: 2 }]
      });
      const mockOnProgress = vi.fn();

      const result = await fetchAllPagesWithProgress(mockFetchPageFn, mockOnProgress);

      expect(result).toHaveLength(2);
      expect(mockOnProgress).toHaveBeenCalledTimes(1);
      expect(mockOnProgress).toHaveBeenCalledWith(1, 1, 2, 2); // page 1, totalPages 1, currentItems 2, totalItems 2
    });

    it('should respect maxPages option', async () => {
      const mockFetchPageFn = vi.fn();
      const mockOnProgress = vi.fn();

      // Mock infinite pagination
      mockFetchPageFn.mockResolvedValue({
        count: 1000,
        next: 'http://api.example.com?page=2',
        previous: null,
        results: [{ id: 1 }, { id: 2 }]
      });

      const result = await fetchAllPagesWithProgress(mockFetchPageFn, mockOnProgress, { maxPages: 2 });

      expect(result).toHaveLength(4); // 2 pages × 2 items each
      expect(mockOnProgress).toHaveBeenCalledTimes(2);
    });

    it('should handle API errors in progress version', async () => {
      const mockFetchPageFn = vi.fn().mockRejectedValue(new Error('Network error'));
      const mockOnProgress = vi.fn();

      await expect(fetchAllPagesWithProgress(mockFetchPageFn, mockOnProgress)).rejects.toThrow('Network error');
    });

    it('should handle zero count gracefully', async () => {
      const mockFetchPageFn = vi.fn().mockResolvedValue({
        count: 0,
        next: null,
        previous: null,
        results: []
      });
      const mockOnProgress = vi.fn();

      const result = await fetchAllPagesWithProgress(mockFetchPageFn, mockOnProgress);

      expect(result).toHaveLength(0);
      expect(mockOnProgress).toHaveBeenCalledTimes(1);
      expect(mockOnProgress).toHaveBeenCalledWith(1, 0, 0, 0);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle large datasets efficiently', async () => {
      const mockFetchPageFn = vi.fn();
      const mockOnProgress = vi.fn();

      // Simulate 10 pages with 50 items each
      for (let page = 1; page <= 10; page++) {
        const hasNext = page < 10;
        mockFetchPageFn.mockResolvedValueOnce({
          count: 500,
          next: hasNext ? `http://api.example.com?page=${page + 1}` : null,
          previous: page > 1 ? `http://api.example.com?page=${page}` : null,
          results: Array.from({ length: 50 }, (_, i) => ({
            id: (page - 1) * 50 + i + 1,
            name: `Item ${(page - 1) * 50 + i + 1}`
          }))
        });
      }

      const result = await fetchAllPages(mockFetchPageFn, 20, mockOnProgress);

      expect(result).toHaveLength(500);
      expect(mockFetchPageFn).toHaveBeenCalledTimes(10);
      expect(mockOnProgress).toHaveBeenCalledTimes(10);
    });

    it('should handle network interruptions gracefully', async () => {
      const mockFetchPageFn = vi.fn();

      // First page succeeds, second fails
      mockFetchPageFn
        .mockResolvedValueOnce({
          count: 6,
          next: 'http://api.example.com?page=2',
          previous: null,
          results: [{ id: 1 }, { id: 2 }]
        })
        .mockRejectedValueOnce(new Error('Network timeout'));

      await expect(fetchAllPages(mockFetchPageFn)).rejects.toThrow('Network timeout');

      // Should have fetched first page successfully
      expect(mockFetchPageFn).toHaveBeenCalledTimes(2);
    });

    it('should handle inconsistent page sizes', async () => {
      const mockFetchPageFn = vi.fn();

      mockFetchPageFn
        .mockResolvedValueOnce({
          count: 7,
          next: 'http://api.example.com?page=2',
          previous: null,
          results: [{ id: 1 }, { id: 2 }] // 2 items
        })
        .mockResolvedValueOnce({
          count: 7,
          next: 'http://api.example.com?page=3',
          previous: 'http://api.example.com?page=1',
          results: [{ id: 3 }, { id: 4 }, { id: 5 }] // 3 items
        })
        .mockResolvedValueOnce({
          count: 7,
          next: null,
          previous: 'http://api.example.com?page=2',
          results: [{ id: 6 }, { id: 7 }] // 2 items
        });

      const result = await fetchAllPages(mockFetchPageFn);

      expect(result).toHaveLength(7);
      expect(result.map(item => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });
});
