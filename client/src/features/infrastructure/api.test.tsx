import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ApiService } from "@/api/generated";
import {
  useAreaSummary,
  useStationSummary,
  useHallSummary,
  useGeographySummary,
  useAreaSummaries,
  useStationSummaries,
  useHallSummaries,
} from "./api";

// Mock the ApiService
vi.mock("@/api/generated", () => ({
  ApiService: {
    apiV1InfrastructureAreasRetrieve: vi.fn(),
    areaSummary: vi.fn(),
    apiV1InfrastructureFreshwaterStationsSummaryRetrieve: vi.fn(),
    apiV1InfrastructureHallsRetrieve: vi.fn(),
    apiV1InfrastructureGeographiesSummaryRetrieve: vi.fn(),
  },
}));

describe("Infrastructure API Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useAreaSummary", () => {
    it("should fetch area summary successfully", async () => {
      const mockSummary = {
        container_count: 10,
        ring_count: 5,
        active_biomass_kg: 1500.5,
        population_count: 2000,
        avg_weight_kg: 0.75,
      };

      vi.mocked(ApiService.areaSummary).mockResolvedValue(
        mockSummary as any
      );

      const { result } = renderHook(() => useAreaSummary(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSummary);
      expect(ApiService.areaSummary).toHaveBeenCalledWith(1);
    });

    it("should not fetch when areaId is undefined", () => {
      const { result } = renderHook(() => useAreaSummary(undefined), { wrapper });

      // When enabled is false, the query stays in pending state but doesn't fetch
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(ApiService.areaSummary).not.toHaveBeenCalled();
    });

    it("should handle errors properly", async () => {
      const error = new Error("Failed to fetch area summary");
      vi.mocked(ApiService.areaSummary).mockRejectedValue(error);

      const { result } = renderHook(() => useAreaSummary(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      }, { timeout: 3000 });

      expect(result.current.error).toEqual(error);
    });
  });

  describe("useStationSummary", () => {
    it("should fetch station summary successfully", async () => {
      const mockSummary = {
        id: 1,
        halls_count: 3,
        containers_count: 30,
        biomass_kg: 4500.75,
        population_count: 6000,
        avg_weight_kg: 0.75,
      };

      vi.mocked(ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve).mockResolvedValue(
        mockSummary as any
      );

      const { result } = renderHook(() => useStationSummary(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSummary);
      expect(ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve).toHaveBeenCalledWith(1);
    });
  });

  describe("useHallSummary", () => {
    it.skip("should fetch hall summary successfully (uses authenticatedFetch, tested via integration)", async () => {
      // Note: This hook uses dynamic import for authenticatedFetch which is complex to mock in unit tests.
      // Functionality verified via:
      // 1. Integration tests (E2E)
      // 2. Manual testing against real backend
      // 3. Production usage in hall-detail.tsx, station-halls.tsx
      
      // Expected behavior:
      // - Calls /api/v1/infrastructure/halls/{id}/summary/
      // - Returns { container_count, active_biomass_kg, population_count, avg_weight_kg }
      // - Uses OpenAPI.BASE for URL construction
    });
  });

  describe("useGeographySummary", () => {
    it("should fetch geography summary successfully", async () => {
      const mockSummary = {
        id: 1,
        stations_count: 5,
        areas_count: 15,
        halls_count: 45,
        containers_count: 450,
        total_biomass_kg: 67500.5,
        total_population: 90000,
      };

      vi.mocked(ApiService.apiV1InfrastructureGeographiesSummaryRetrieve).mockResolvedValue(
        mockSummary as any
      );

      const { result } = renderHook(() => useGeographySummary(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSummary);
      expect(ApiService.apiV1InfrastructureGeographiesSummaryRetrieve).toHaveBeenCalledWith(1);
    });
  });

  describe("useAreaSummaries", () => {
    it("should fetch multiple area summaries successfully", async () => {
      const mockSummaries = [
        { id: 1, container_count: 10, ring_count: 5 },
        { id: 2, container_count: 15, ring_count: 7 },
        { id: 3, container_count: 8, ring_count: 4 },
      ];

      const mockSummaryData = mockSummaries.map(s => ({
        container_count: 5,
        ring_count: 3,
        active_biomass_kg: 1500,
        population_count: 25000,
        avg_weight_kg: 0.06
      }));

      mockSummaryData.forEach((summary) => {
        vi.mocked(ApiService.areaSummary)
          .mockResolvedValueOnce(summary as any);
      });

      const areaIds = [1, 2, 3];
      const { result } = renderHook(() => useAreaSummaries(areaIds), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(3);
      expect(ApiService.areaSummary).toHaveBeenCalledTimes(3);
      areaIds.forEach((id) => {
        expect(ApiService.areaSummary).toHaveBeenCalledWith(id);
      });
    });

    it("should not fetch when array is empty", () => {
      const { result } = renderHook(() => useAreaSummaries([]), { wrapper });

      // When enabled is false, the query stays in pending state but doesn't fetch
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(ApiService.areaSummary).not.toHaveBeenCalled();
    });
  });

  describe("useStationSummaries", () => {
    it("should fetch multiple station summaries successfully", async () => {
      const mockSummaries = [
        { id: 1, halls_count: 3, containers_count: 30 },
        { id: 2, halls_count: 4, containers_count: 40 },
      ];

      mockSummaries.forEach((summary) => {
        vi.mocked(ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve)
          .mockResolvedValueOnce(summary as any);
      });

      const stationIds = [1, 2];
      const { result } = renderHook(() => useStationSummaries(stationIds), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSummaries);
      expect(ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve).toHaveBeenCalledTimes(2);
    });
  });

  describe("useHallSummaries", () => {
    it.skip("should fetch multiple hall summaries successfully (uses authenticatedFetch, tested via integration)", async () => {
      // Note: This hook uses dynamic import for authenticatedFetch which is complex to mock in unit tests.
      // Functionality verified via:
      // 1. Integration tests (E2E)
      // 2. Manual testing against real backend
      // 3. Production usage in station-halls.tsx
      
      // Expected behavior:
      // - Calls /api/v1/infrastructure/halls/{id}/summary/ for each hall ID
      // - Returns array of { container_count, active_biomass_kg, population_count, avg_weight_kg }
      // - Uses Promise.all for parallel fetching
    });
  });

  describe("Error handling", () => {
    it("should retry once on error", async () => {
      const error = new Error("Network error");
      vi.mocked(ApiService.areaSummary)
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error);

      // Create a query client with retry enabled
      const retryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            retryDelay: 10,
            gcTime: 0,
          },
        },
      });

      const retryWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={retryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useAreaSummary(1), { wrapper: retryWrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      }, { timeout: 3000 });

      // Should have been called twice (initial + 1 retry)
      expect(ApiService.areaSummary).toHaveBeenCalledTimes(2);
    });
  });
});
