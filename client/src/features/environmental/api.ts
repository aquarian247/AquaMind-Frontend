/**
 * Environmental domain API hooks
 * 
 * Provides TanStack Query hooks for environmental management operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { useCrudMutation } from '@/features/shared/hooks/useCrudMutation';
import type { EnvironmentalParameter, PhotoperiodData } from '@/api/generated';

// ============================================================================
// Environmental Parameter Hooks
// ============================================================================

/**
 * List environmental parameters with optional filtering
 */
export function useEnvironmentalParameters(filters?: { name?: string; unit?: string }) {
  return useQuery({
    queryKey: ['environmental', 'parameters', filters],
    queryFn: () => ApiService.apiV1EnvironmentalParametersList(
      filters?.name,
      undefined,
      undefined,
      undefined,
      undefined,
      filters?.unit
    ),
  });
}

/**
 * Get single environmental parameter by ID
 */
export function useEnvironmentalParameter(id: number) {
  return useQuery({
    queryKey: ['environmental', 'parameters', id],
    queryFn: () => ApiService.apiV1EnvironmentalParametersRetrieve(id),
    enabled: !!id,
  });
}

/**
 * Create new environmental parameter
 */
export function useCreateEnvironmentalParameter() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1EnvironmentalParametersCreate,
    description: 'Environmental parameter created successfully',
    invalidateQueries: ['environmental', 'parameters'],
  });
}

/**
 * Update existing environmental parameter
 */
export function useUpdateEnvironmentalParameter(id: number) {
  return useCrudMutation({
    mutationFn: (data: Partial<EnvironmentalParameter>) =>
      ApiService.apiV1EnvironmentalParametersPartialUpdate(id, data),
    description: 'Environmental parameter updated successfully',
    invalidateQueries: ['environmental', 'parameters'],
  });
}

/**
 * Delete environmental parameter
 */
export function useDeleteEnvironmentalParameter() {
  return useCrudMutation({
    mutationFn: (id: number) => ApiService.apiV1EnvironmentalParametersDestroy(id),
    description: 'Environmental parameter deleted successfully',
    invalidateQueries: ['environmental', 'parameters'],
  });
}

// ============================================================================
// Photoperiod Data Hooks
// ============================================================================

/**
 * List photoperiod data with optional filtering
 */
export function usePhotoperiodData(filters?: {
  area?: number;
  from_date?: string;
  to_date?: string;
  is_interpolated?: boolean;
}) {
  return useQuery({
    queryKey: ['environmental', 'photoperiod', filters],
    queryFn: () => ApiService.apiV1EnvironmentalPhotoperiodList(
      filters?.area,
      undefined,
      filters?.from_date,
      filters?.is_interpolated
    ),
  });
}

/**
 * Get single photoperiod data record by ID
 */
export function usePhotoperiodDataRecord(id: number) {
  return useQuery({
    queryKey: ['environmental', 'photoperiod', id],
    queryFn: () => ApiService.apiV1EnvironmentalPhotoperiodRetrieve(id),
    enabled: !!id,
  });
}

/**
 * Create new photoperiod data record
 */
export function useCreatePhotoperiodData() {
  return useCrudMutation({
    mutationFn: ApiService.apiV1EnvironmentalPhotoperiodCreate,
    description: 'Photoperiod data created successfully',
    invalidateQueries: ['environmental', 'photoperiod'],
  });
}

/**
 * Update existing photoperiod data record
 */
export function useUpdatePhotoperiodData(id: number) {
  return useCrudMutation({
    mutationFn: (data: Partial<PhotoperiodData>) =>
      ApiService.apiV1EnvironmentalPhotoperiodPartialUpdate(id, data),
    description: 'Photoperiod data updated successfully',
    invalidateQueries: ['environmental', 'photoperiod'],
  });
}

/**
 * Delete photoperiod data record
 */
export function useDeletePhotoperiodData() {
  return useCrudMutation({
    mutationFn: (id: number) => ApiService.apiV1EnvironmentalPhotoperiodDestroy(id),
    description: 'Photoperiod data deleted successfully',
    invalidateQueries: ['environmental', 'photoperiod'],
  });
}

