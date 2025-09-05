import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/lib/api';
import { ApiService } from '@/api/generated';

// Mock localStorage for auth token
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

/*
 * Restore all spies after every test to avoid cross-test pollution.
 */
afterEach(() => {
  vi.restoreAllMocks();
});

describe('Container Filtering Business Rules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-token');
  });

  describe('Station Filtering (Sea Areas vs Halls)', () => {
    it('should filter containers with area_id not null as sea area containers (Rule 1)', async () => {
      // Mock containers with area_id assigned
      const mockContainers = [
        { id: 1, name: 'Container 1', area: 10, hall: null, container_type_name: 'Test Type' },
        { id: 2, name: 'Container 2', area: null, hall: 5, container_type_name: 'Test Type' },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
        { container: { id: 2 }, biomass_kg: '200' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      const result = await api.infrastructure.getContainersOverview({ station: 'areas' });

      // Should only return container with area_id (Container 1)
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
      expect(result.results[0].location.area).toBe(''); // Will be empty since area_name not provided
    });

    it('should filter containers with hall_id null as sea area containers (Rule 2)', async () => {
      // Mock containers where one has hall_id null
      const mockContainers = [
        { id: 1, name: 'Container 1', area: null, hall: null, container_type_name: 'Test Type' },
        { id: 2, name: 'Container 2', area: null, hall: 5, container_type_name: 'Test Type' },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
        { container: { id: 2 }, biomass_kg: '200' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      const result = await api.infrastructure.getContainersOverview({ station: 'areas' });

      // Should only return container with hall_id null (Container 1)
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
    });

    it('should filter containers with PEN category as sea area containers (Rule 3)', async () => {
      // Mock containers where one has PEN type
      const mockContainers = [
        { id: 1, name: 'Container 1', area: null, hall: 5, container_type_name: 'Sea Rings (Pen)' },
        { id: 2, name: 'Container 2', area: null, hall: 5, container_type_name: 'Fry Tanks (Tank)' },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
        { container: { id: 2 }, biomass_kg: '200' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      const result = await api.infrastructure.getContainersOverview({ station: 'areas' });

      // Should only return container with PEN type (Container 1)
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
    });

    it('should filter containers with hall_id not null as freshwater hall containers', async () => {
      // Mock containers where one has hall_id
      const mockContainers = [
        { id: 1, name: 'Container 1', area: null, hall: 5, container_type_name: 'Fry Tanks (Tank)' },
        { id: 2, name: 'Container 2', area: null, hall: null, container_type_name: 'Sea Rings (Pen)' },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
        { container: { id: 2 }, biomass_kg: '200' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      const result = await api.infrastructure.getContainersOverview({ station: 'stations' });

      // Should only return container with hall_id (Container 1)
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
    });

    it('should handle multiple rules - container qualifies as sea area via multiple rules', async () => {
      // Mock container that qualifies via multiple rules (area_id + PEN type)
      const mockContainers = [
        {
          id: 1,
          name: 'Container 1',
          area: 10,
          hall: null,
          container_type_name: 'Sea Rings (Pen)'
        },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      const result = await api.infrastructure.getContainersOverview({ station: 'areas' });

      // Should return the container (qualifies via Rule 1 and Rule 3)
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
    });

    it('should handle edge case - container with no clear categorization', async () => {
      // Mock container that doesn't fit any category clearly
      const mockContainers = [
        { id: 1, name: 'Container 1', area: null, hall: null, container_type_name: 'Unknown Type' },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      const result = await api.infrastructure.getContainersOverview({ station: 'areas' });

      // Should return the container (qualifies via Rule 2 - hall_id is null)
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
    });

    it('should handle empty container list gracefully', async () => {
      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: [], next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: [], next: null });

      const result = await api.infrastructure.getContainersOverview({ station: 'areas' });

      expect(result.results).toHaveLength(0);
    });
  });

  describe('Combined Filtering Scenarios', () => {
    it('should apply station filter combined with geography filter', async () => {
      // Mock containers with mixed locations
      const mockContainers = [
        {
          id: 1,
          name: 'Faroe Container',
          area: 10,
          hall: null,
          container_type_name: 'Sea Rings (Pen)',
          area_name: 'Faroe Islands Sea Area 1'
        },
        {
          id: 2,
          name: 'Scotland Container',
          area: 20,
          hall: null,
          container_type_name: 'Sea Rings (Pen)',
          area_name: 'Scotland Sea Area 1'
        },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
        { container: { id: 2 }, biomass_kg: '200' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      // Filter for areas AND Faroe Islands
      const result = await api.infrastructure.getContainersOverview({
        station: 'areas',
        geography: 'Faroe Islands'
      });

      // Should only return Faroe container
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
      expect(result.results[0].location.geography).toBe('Faroe Islands Sea Area 1');
    });

    it('should apply station filter combined with status filter', async () => {
      // Mock containers with mixed status
      const mockContainers = [
        {
          id: 1,
          name: 'Active Area Container',
          area: 10,
          hall: null,
          container_type_name: 'Sea Rings (Pen)',
          active: true
        },
        {
          id: 2,
          name: 'Inactive Area Container',
          area: 20,
          hall: null,
          container_type_name: 'Sea Rings (Pen)',
          active: false
        },
      ];

      const mockAssignments = [
        { container: { id: 1 }, biomass_kg: '100' },
        { container: { id: 2 }, biomass_kg: '200' },
      ];

      // Mock ApiService calls
      vi.spyOn(ApiService, 'apiV1InfrastructureContainersList')
        .mockResolvedValueOnce({ results: mockContainers, next: null })
        .mockResolvedValueOnce({ results: [], next: null });
      vi.spyOn(ApiService, 'apiV1BatchContainerAssignmentsList')
        .mockResolvedValue({ results: mockAssignments, next: null });

      // Filter for areas AND active status
      const result = await api.infrastructure.getContainersOverview({
        station: 'areas',
        status: 'active'
      });

      // Should only return active area container
      expect(result.results).toHaveLength(1);
      expect(result.results[0].id).toBe(1);
      expect(result.results[0].status).toBe('active');
    });
  });
});
