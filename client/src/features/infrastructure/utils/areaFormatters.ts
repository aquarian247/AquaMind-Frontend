/**
 * Area Detail Formatters
 * 
 * Pure formatting utilities for Area detail page data.
 * Handles server-side aggregated KPIs from useAreaSummary endpoint.
 * 
 * @module features/infrastructure/utils/areaFormatters
 */

import { formatWeight, formatCount, formatFallback } from "@/lib/formatFallback";
import type { AreaSummaryData } from "@/features/infrastructure/api";

/**
 * Container/Ring display data after formatting
 */
export interface FormattedContainerData {
  biomass: string;
  capacity: string;
  fishCount: string;
  averageWeight: string;
  utilization: string;
}

/**
 * Area KPI display data after formatting
 */
export interface FormattedAreaKPIs {
  totalBiomass: string;
  totalBiomassTooltip: string;
  averageWeight: string;
  averageWeightTooltip: string;
  containerCount: string;
  containerCountTooltip: string;
  populationCount: string;
  populationCountTooltip: string;
  ringCount: string;
  ringCountTooltip: string;
}

/**
 * Format area KPIs from server-side aggregation
 * 
 * Uses honest fallbacks when data is unavailable:
 * - Weight: "0 kg", "0 t" (never shows as non-zero without data)
 * - Count: "0" (never shows as non-zero without data)
 * 
 * @param summary - Server-side aggregated area summary (may be undefined during loading)
 * @returns Formatted KPI strings ready for display
 * 
 * @example
 * ```typescript
 * const { data: summary } = useAreaSummary(areaId);
 * const kpis = formatAreaKPIs(summary);
 * // kpis.totalBiomass = "45.2 t" or "0 t"
 * ```
 */
export function formatAreaKPIs(summary: AreaSummaryData | undefined): FormattedAreaKPIs {
  // Biomass: Convert kg to tonnes, 1 decimal place
  // Honest fallback: use 0 when data unavailable (not N/A) for numerical displays
  const biomassKg = summary?.active_biomass_kg ?? null;
  const biomassTonnes = biomassKg !== null ? biomassKg / 1000 : 0;
  // Format with exactly 1 decimal place (formatFallback skips decimals for integers)
  const totalBiomass = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(biomassTonnes) + ' t';
  const totalBiomassTooltip = (biomassKg !== null && biomassKg !== undefined && biomassKg > 0)
    ? 'Current active biomass (from server)'
    : 'No biomass data available';
  
  // Average Weight: kg per fish, 2 decimal places
  const avgWeight = summary?.avg_weight_kg ?? 0; // Honest zero fallback
  // Format with exactly 2 decimal places for consistency
  const averageWeight = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(avgWeight) + ' kg';
  const averageWeightTooltip = (summary?.avg_weight_kg !== null && summary?.avg_weight_kg !== undefined && summary?.avg_weight_kg > 0)
    ? 'kg per fish'
    : 'No weight data available';
  
  // Container Count
  const containerCount = formatCount(summary?.container_count ?? 0, 'containers'); // Honest zero fallback
  const containerCountTooltip = summary?.container_count !== undefined ? 'Total containers' : 'No data available';
  
  // Population Count
  const populationCount = formatCount(summary?.population_count ?? 0, 'fish'); // Honest zero fallback
  const populationCountTooltip = summary?.population_count !== undefined ? 'Total fish' : 'No data available';
  
  // Ring Count (prioritize server data)
  const ringCount = formatCount(summary?.ring_count ?? 0, 'rings'); // Honest zero fallback
  const ringCountTooltip = summary?.ring_count !== undefined ? 'Production units (from server)' : 'No data available';
  
  return {
    totalBiomass,
    totalBiomassTooltip,
    averageWeight,
    averageWeightTooltip,
    containerCount,
    containerCountTooltip,
    populationCount,
    populationCountTooltip,
    ringCount,
    ringCountTooltip,
  };
}

/**
 * Format container/ring data for display
 * 
 * Note: Individual container metrics are not calculated client-side anymore.
 * These are placeholders for when server-side container details are available.
 * 
 * @param container - Container data from API
 * @returns Formatted container display strings
 * 
 * @example
 * ```typescript
 * const formatted = formatContainerData(container);
 * // formatted.biomass = "0 kg" (honest fallback)
 * ```
 */
export function formatContainerData(container: {
  biomass?: number;
  capacity?: number;
  fishCount?: number;
  averageWeight?: number;
}): FormattedContainerData {
  // Biomass: Convert tonnes to kg for display (container.biomass is in tonnes)
  const biomassKg = container.biomass !== undefined ? container.biomass * 1000 : null;
  const biomass = biomassKg !== null ? `${biomassKg.toLocaleString()} kg` : '0 kg';
  
  // Capacity: tonnes
  const capacity = container.capacity !== undefined ? `${container.capacity.toLocaleString()} t` : 'N/A';
  
  // Fish count
  const fishCount = container.fishCount !== undefined ? container.fishCount.toLocaleString() : '0';
  
  // Average weight: kg
  const averageWeight = container.averageWeight !== undefined && container.averageWeight > 0 
    ? `${container.averageWeight.toFixed(2)} kg` 
    : '0.00 kg';
  
  // Utilization percentage
  const utilization = (container.biomass !== undefined && container.capacity !== undefined && container.capacity > 0)
    ? `${Math.round((container.biomass / container.capacity) * 100)}%`
    : '0%';
  
  return {
    biomass,
    capacity,
    fishCount,
    averageWeight,
    utilization,
  };
}

/**
 * Calculate utilization percentage from area summary
 * 
 * @param areaSummary - Server-side aggregated area summary
 * @param areaCapacity - Area capacity in tonnes
 * @returns Utilization percentage (0-100) or 0 if data unavailable
 */
export function calculateAreaUtilization(
  areaSummary: AreaSummaryData | undefined,
  areaCapacity: number | undefined
): number {
  if (!areaSummary?.active_biomass_kg || !areaCapacity || areaCapacity === 0) {
    return 0;
  }
  
  const biomassTonnes = areaSummary.active_biomass_kg / 1000;
  return Math.round((biomassTonnes / areaCapacity) * 100);
}

/**
 * Calculate average ring depth from filtered rings
 * 
 * @param rings - Array of rings/containers with waterDepth property
 * @returns Average depth string with 1 decimal place or "N/A" if no rings
 */
export function calculateAverageRingDepth(rings: Array<{ waterDepth: number }>): string {
  if (!rings || rings.length === 0) {
    return 'N/A';
  }
  
  const totalDepth = rings.reduce((sum, ring) => sum + ring.waterDepth, 0);
  const avgDepth = totalDepth / rings.length;
  return `${avgDepth.toFixed(1)}m`;
}

/**
 * Count active rings from filtered rings
 *
 * @param rings - Array of rings with status property
 * @returns Count of active rings
 */
export function countActiveRings(rings: Array<{ status: string }>): number {
  if (!rings || rings.length === 0) {
    return 0;
  }

  return rings.filter(ring => ring.status === 'active').length;
}

/**
 * Format container name from assignment data
 *
 * Handles both object and primitive container references consistently.
 * When container is an object, uses the name property.
 * When container is primitive, falls back to container_name or "Unknown".
 *
 * @param assignment - Batch container assignment object
 * @returns Formatted container name string
 *
 * @example
 * ```typescript
 * // Object container
 * formatContainerName({ container: { id: 1, name: "Tank A" } }) // "Tank A"
 *
 * // Primitive container ID
 * formatContainerName({ container: 123, container_name: "Tank B" }) // "Tank B"
 *
 * // Missing data
 * formatContainerName({ container: 123 }) // "Unknown"
 * ```
 */
export function formatContainerName(assignment: {
  container?: any;
  container_name?: string;
}): string {
  if (typeof assignment.container === 'object') {
    return assignment.container?.name || 'Unknown';
  }
  return assignment.container_name || 'Unknown';
}

/**
 * Format lifecycle stage name from assignment data
 *
 * Handles both object and primitive lifecycle_stage references consistently.
 * When lifecycle_stage is an object, uses the name property.
 * When lifecycle_stage is primitive, falls back to lifecycle_stage_name or "Unknown".
 *
 * @param assignment - Batch container assignment object
 * @returns Formatted lifecycle stage name string
 *
 * @example
 * ```typescript
 * // Object lifecycle stage
 * formatLifecycleStageName({ lifecycle_stage: { id: 1, name: "Smolt" } }) // "Smolt"
 *
 * // Primitive lifecycle stage ID
 * formatLifecycleStageName({ lifecycle_stage: 456, lifecycle_stage_name: "Post-Smolt" }) // "Post-Smolt"
 *
 * // Missing data
 * formatLifecycleStageName({ lifecycle_stage: 456 }) // "Unknown"
 * ```
 */
export function formatLifecycleStageName(assignment: {
  lifecycle_stage?: any;
  lifecycle_stage_name?: string;
}): string {
  if (typeof assignment.lifecycle_stage === 'object') {
    return assignment.lifecycle_stage?.name || 'Unknown';
  }
  return assignment.lifecycle_stage_name || 'Unknown';
}

