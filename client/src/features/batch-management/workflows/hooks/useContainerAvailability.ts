/**
 * Container Availability Hook
 * 
 * TanStack Query hook for timeline-aware container selection with occupancy forecasting.
 * Calls the backend container availability endpoint to get enriched container data
 * showing which containers are available, will be available, or have conflicts.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/fetch';

/**
 * Container availability status types
 */
export type AvailabilityStatus = 'EMPTY' | 'AVAILABLE' | 'OCCUPIED_BUT_OK' | 'CONFLICT';

/**
 * Current assignment in a container
 */
export interface ContainerAssignment {
  batch_id: number;
  batch_number: string;
  population_count: number;
  lifecycle_stage: string;
  assignment_date: string;
  expected_departure_date: string | null;
}

/**
 * Enriched container with availability forecast
 */
export interface ContainerWithAvailability {
  id: number;
  name: string;
  container_type: string;
  volume_m3: number;
  max_biomass_kg: number;
  
  // Current occupancy
  current_status: 'EMPTY' | 'OCCUPIED';
  current_assignments: ContainerAssignment[];
  
  // Availability forecast
  availability_status: AvailabilityStatus;
  days_until_available: number | null;
  availability_message: string;
  
  // Capacity
  available_capacity_kg: number;
  available_capacity_percent: number;
}

/**
 * Response from container availability endpoint
 */
export interface ContainerAvailabilityResponse {
  count: number;
  results: ContainerWithAvailability[];
}

/**
 * Hook parameters
 */
export interface UseContainerAvailabilityParams {
  geography: number;
  deliveryDate: string; // ISO date string (YYYY-MM-DD)
  containerType?: string;
  lifecycleStage?: number;
  includeOccupied?: boolean;
  enabled?: boolean;
}

/**
 * React Query hook for fetching container availability with timeline forecasting
 * 
 * @param params - Query parameters
 * @returns TanStack Query result with enriched containers
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useContainerAvailability({
 *   geography: 1,
 *   deliveryDate: '2026-01-31',
 *   containerType: 'TRAY',
 *   enabled: true
 * });
 * 
 * // Access containers sorted by availability priority
 * const emptyContainers = data?.results.filter(c => c.availability_status === 'EMPTY');
 * const availableContainers = data?.results.filter(c => c.availability_status === 'AVAILABLE');
 * ```
 */
export function useContainerAvailability({
  geography,
  deliveryDate,
  containerType,
  lifecycleStage,
  includeOccupied = true,
  enabled = true,
}: UseContainerAvailabilityParams) {
  return useQuery<ContainerAvailabilityResponse>({
    queryKey: [
      'container-availability',
      geography,
      deliveryDate,
      containerType,
      lifecycleStage,
      includeOccupied,
    ],
    queryFn: async () => {
      // Build query params
      const params = new URLSearchParams();
      params.set('geography', geography.toString());
      params.set('delivery_date', deliveryDate);
      
      if (containerType) {
        params.set('container_type', containerType);
      }
      
      if (lifecycleStage) {
        params.set('lifecycle_stage', lifecycleStage.toString());
      }
      
      params.set('include_occupied', includeOccupied.toString());
      
      // Call API endpoint
      const response = await fetchApi(
        `/api/v1/batch/containers/availability/?${params.toString()}`,
        {
          method: 'GET',
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || 'Failed to fetch container availability');
      }
      
      return response.json();
    },
    enabled: enabled && !!geography && !!deliveryDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Helper function to get availability status icon/emoji
 */
export function getAvailabilityIcon(status: AvailabilityStatus): string {
  switch (status) {
    case 'EMPTY':
      return '✅';
    case 'AVAILABLE':
      return '⏰';
    case 'OCCUPIED_BUT_OK':
      return '⚠️';
    case 'CONFLICT':
      return '❌';
  }
}

/**
 * Helper function to get availability status color (Tailwind classes)
 */
export function getAvailabilityColor(status: AvailabilityStatus): string {
  switch (status) {
    case 'EMPTY':
      return 'text-green-600 dark:text-green-400';
    case 'AVAILABLE':
      return 'text-blue-600 dark:text-blue-400';
    case 'OCCUPIED_BUT_OK':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'CONFLICT':
      return 'text-red-600 dark:text-red-400';
  }
}

/**
 * Helper function to check if container should be disabled for selection
 */
export function isContainerDisabled(container: ContainerWithAvailability): boolean {
  return container.availability_status === 'CONFLICT';
}

