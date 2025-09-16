import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ApiService } from '@/api/generated';
import {
  useHistoryList,
  useHistoryDetail,
  getHistoryTypeLabel,
  getHistoryTypeColor,
  getAvailableModels,
  APP_DOMAINS
} from './api';

// Mock ApiService
vi.mock('@/api/generated', () => ({
  ApiService: {
    listBatchBatchHistory: vi.fn(),
    retrieveBatchBatchHistoryDetail: vi.fn()
  }
}));

const mockBatchHistoryResponse = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      history_id: 1,
      history_user: 'testuser',
      history_date: '2024-01-01T10:00:00Z',
      history_type: '+' as const,
      history_change_reason: 'Initial creation',
      id: 1,
      batch_number: 'BATCH-001',
      status: 'ACTIVE' as const
    },
    {
      history_id: 2,
      history_user: 'testuser',
      history_date: '2024-01-02T10:00:00Z',
      history_type: '~' as const,
      history_change_reason: 'Status update',
      id: 1,
      batch_number: 'BATCH-001',
      status: 'COMPLETED' as const
    }
  ]
};

const mockBatchHistoryDetail = {
  history_id: 1,
  history_user: 'testuser',
  history_date: '2024-01-01T10:00:00Z',
  history_type: '+' as const,
  history_change_reason: 'Initial creation',
  id: 1,
  batch_number: 'BATCH-001',
  status: 'ACTIVE' as const
};

describe('Audit Trail API Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0
        }
      }
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  describe('useHistoryList', () => {
    it('should fetch history list successfully', async () => {
      const mockApiService = vi.mocked(ApiService);
      mockApiService.listBatchBatchHistory.mockResolvedValue(mockBatchHistoryResponse);

      const { result } = renderHook(
        () => useHistoryList(APP_DOMAINS.BATCH, 'batch'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockBatchHistoryResponse);
      expect(mockApiService.listBatchBatchHistory).toHaveBeenCalledWith(
        undefined, undefined, // batchNumber, batchType
        undefined, undefined, undefined, undefined, // dateFrom, dateTo, historyType, historyUser
        undefined, undefined, undefined, undefined, undefined, undefined // lifecycleStage, ordering, page, search, species, status
      );
    });

    it('should fetch history list with filters', async () => {
      const mockApiService = vi.mocked(ApiService);
      mockApiService.listBatchBatchHistory.mockResolvedValue(mockBatchHistoryResponse);

      const filters = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        historyUser: 'testuser',
        historyType: '+' as const,
        page: 1
      };

      const { result } = renderHook(
        () => useHistoryList(APP_DOMAINS.BATCH, 'batch', filters),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiService.listBatchBatchHistory).toHaveBeenCalledWith(
        undefined, undefined, // batchNumber, batchType
        '2024-01-01', '2024-01-31', '+', 'testuser', // dateFrom, dateTo, historyType, historyUser
        undefined, undefined, 1, undefined, undefined, undefined // lifecycleStage, ordering, page, search, species, status
      );
    });


    it('should not fetch when appDomain or model is missing', () => {
      const mockApiService = vi.mocked(ApiService);

      renderHook(
        () => useHistoryList(APP_DOMAINS.BATCH, ''),
        { wrapper }
      );

      expect(mockApiService.listBatchBatchHistory).not.toHaveBeenCalled();
    });

    it('should assert proper envelope handling with count and results', async () => {
      const mockApiService = vi.mocked(ApiService);
      mockApiService.listBatchBatchHistory.mockResolvedValue(mockBatchHistoryResponse);

      const { result } = renderHook(
        () => useHistoryList(APP_DOMAINS.BATCH, 'batch'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Assert envelope structure
      expect(result.current.data).toHaveProperty('count');
      expect(result.current.data).toHaveProperty('next');
      expect(result.current.data).toHaveProperty('previous');
      expect(result.current.data).toHaveProperty('results');
      expect(result.current.data?.count).toBe(2);
      expect(Array.isArray(result.current.data?.results)).toBe(true);
      expect(result.current.data?.results).toHaveLength(2);
    });
  });

  describe('useHistoryDetail', () => {
    it('should fetch history detail successfully', async () => {
      const mockApiService = vi.mocked(ApiService);
      mockApiService.retrieveBatchBatchHistoryDetail.mockResolvedValue(mockBatchHistoryDetail);

      const { result } = renderHook(
        () => useHistoryDetail(APP_DOMAINS.BATCH, 'batch', 1),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockBatchHistoryDetail);
      expect(mockApiService.retrieveBatchBatchHistoryDetail).toHaveBeenCalledWith(1);
    });


    it('should not fetch when historyId is missing', () => {
      const mockApiService = vi.mocked(ApiService);

      renderHook(
        () => useHistoryDetail(APP_DOMAINS.BATCH, 'batch', 0),
        { wrapper }
      );

      expect(mockApiService.retrieveBatchBatchHistoryDetail).not.toHaveBeenCalled();
    });

    it('should not fetch when appDomain or model is missing', () => {
      const mockApiService = vi.mocked(ApiService);

      renderHook(
        () => useHistoryDetail(APP_DOMAINS.BATCH, '', 1),
        { wrapper }
      );

      expect(mockApiService.retrieveBatchBatchHistoryDetail).not.toHaveBeenCalled();
    });
  });

  describe('getHistoryTypeLabel', () => {
    it('should return correct labels for history types', () => {
      expect(getHistoryTypeLabel('+')).toBe('Created');
      expect(getHistoryTypeLabel('~')).toBe('Updated');
      expect(getHistoryTypeLabel('-')).toBe('Deleted');
    });

    it('should return "Unknown" for invalid types', () => {
      expect(getHistoryTypeLabel('' as any)).toBe('Unknown');
    });
  });

  describe('getHistoryTypeColor', () => {
    it('should return correct colors for history types', () => {
      expect(getHistoryTypeColor('+')).toBe('bg-green-100 text-green-800 border-green-200');
      expect(getHistoryTypeColor('~')).toBe('bg-blue-100 text-blue-800 border-blue-200');
      expect(getHistoryTypeColor('-')).toBe('bg-red-100 text-red-800 border-red-200');
    });

    it('should return default color for invalid types', () => {
      expect(getHistoryTypeColor('' as any)).toBe('bg-gray-100 text-gray-800 border-gray-200');
    });
  });

  describe('getAvailableModels', () => {
    it('should return models for valid app domains', () => {
      const batchModels = getAvailableModels(APP_DOMAINS.BATCH);
      expect(batchModels).toHaveLength(5);
      expect(batchModels[0]).toEqual({ value: 'batch', label: 'Batches' });

      const infraModels = getAvailableModels(APP_DOMAINS.INFRASTRUCTURE);
      expect(infraModels).toHaveLength(8);
      expect(infraModels[0]).toEqual({ value: 'area', label: 'Areas' });
    });

    it('should return empty array for invalid app domains', () => {
      expect(getAvailableModels('invalid' as any)).toEqual([]);
    });
  });
});
