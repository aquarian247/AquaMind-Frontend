/**
 * Scenario KPI Calculation Utilities
 * 
 * Pure functions for computing scenario planning KPIs from backend data.
 * 
 * TASK 3: CCN Reduction (from 18 to ≤12)
 * - Extracted from useScenarioData.ts useMemo (lines 83-130)
 * - Broken into smaller, testable helper functions
 * - Supports both server-side aggregation and client-side fallback
 * 
 * @module features/scenario/utils/kpiCalculations
 */

/**
 * Scenario planning KPI metrics
 */
export interface ScenarioPlanningKPIs {
  totalActiveScenarios: number;
  scenariosInProgress: number;
  completedProjections: number;
  averageProjectionDuration: number;
}

/**
 * Scenario object shape (minimal interface for KPI calculation)
 */
interface ScenarioData {
  status?: string;
  duration_days?: number;
}

/**
 * Check if backend response contains summary fields
 * 
 * Backend may add summary fields to Scenario object per spec.
 * This helper checks if those fields are present.
 * 
 * @param data - Backend response data
 * @returns True if backend-provided summary fields exist
 */
export function hasBackendSummaryFields(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  return (
    'totalActiveScenarios' in data ||
    'scenariosInProgress' in data ||
    'completedProjections' in data ||
    'averageProjectionDuration' in data
  );
}

/**
 * Extract KPIs from backend-provided summary data
 * 
 * When backend includes summary fields in response, use them directly
 * with honest fallbacks (0) for missing values.
 * 
 * @param summaryData - Backend response with summary fields
 * @returns ScenarioPlanningKPIs from backend data
 */
export function extractBackendKPIs(summaryData: any): ScenarioPlanningKPIs {
  return {
    totalActiveScenarios: summaryData.totalActiveScenarios ?? 0,
    scenariosInProgress: summaryData.scenariosInProgress ?? 0,
    completedProjections: summaryData.completedProjections ?? 0,
    averageProjectionDuration: summaryData.averageProjectionDuration ?? 0,
  };
}

/**
 * Calculate total scenarios in progress (running status)
 * 
 * @param scenarios - Array of scenario objects
 * @returns Count of scenarios with "running" status
 */
export function countScenariosInProgress(scenarios: ScenarioData[]): number {
  return scenarios.filter(s => s.status === "running").length;
}

/**
 * Calculate total completed projections
 * 
 * @param scenarios - Array of scenario objects
 * @returns Count of scenarios with "completed" status
 */
export function countCompletedProjections(scenarios: ScenarioData[]): number {
  return scenarios.filter(s => s.status === "completed").length;
}

/**
 * Calculate average projection duration across scenarios
 * 
 * Computes mean duration_days, handling null/undefined values.
 * Returns 0 for empty arrays (honest fallback).
 * 
 * @param scenarios - Array of scenario objects
 * @returns Average duration in days, or 0 if no scenarios
 */
export function calculateAverageProjectionDuration(scenarios: ScenarioData[]): number {
  if (scenarios.length === 0) {
    return 0;
  }

  const totalDuration = scenarios.reduce((sum, s) => {
    return sum + (s.duration_days ?? 0);
  }, 0);

  return totalDuration / scenarios.length;
}

/**
 * Calculate KPIs from client-side scenario list (fallback)
 * 
 * When backend doesn't provide summary stats, compute from scenarios array.
 * Uses honest fallbacks (0) for empty data.
 * 
 * @param scenarios - Array of scenario objects from API
 * @returns Computed ScenarioPlanningKPIs
 */
export function calculateClientKPIs(scenarios: ScenarioData[]): ScenarioPlanningKPIs {
  // Empty state: return zero values (honest fallback)
  if (scenarios.length === 0) {
    return {
      totalActiveScenarios: 0,
      scenariosInProgress: 0,
      completedProjections: 0,
      averageProjectionDuration: 0,
    };
  }

  // Compute each KPI using focused helper functions
  return {
    totalActiveScenarios: scenarios.length,
    scenariosInProgress: countScenariosInProgress(scenarios),
    completedProjections: countCompletedProjections(scenarios),
    averageProjectionDuration: calculateAverageProjectionDuration(scenarios),
  };
}

/**
 * Main KPI calculation function (primary API)
 * 
 * Attempts to use backend summary stats first, falls back to client-side calculation.
 * This is the main function called from useScenarioData hook.
 * 
 * **Architecture:**
 * 1. Check if backend response has summary fields
 * 2. If yes: extract and return backend KPIs
 * 3. If no: compute from scenarios list (client-side fallback)
 * 
 * @param summaryData - Backend summary stats response (may contain summary fields)
 * @param scenariosList - Array of scenarios from API (fallback data source)
 * @returns Computed ScenarioPlanningKPIs
 * 
 * @example
 * ```typescript
 * // Backend provides summary fields
 * const kpis = calculateScenarioKPIs(
 *   { totalActiveScenarios: 10, scenariosInProgress: 3, ... },
 *   []
 * );
 * 
 * // Backend doesn't provide summary - fallback to client calculation
 * const kpis = calculateScenarioKPIs(
 *   null,
 *   [{ status: 'running', duration_days: 30 }, ...]
 * );
 * ```
 */
export function calculateScenarioKPIs(
  summaryData: any,
  scenariosList: ScenarioData[]
): ScenarioPlanningKPIs {
  // Try backend-provided summary stats first
  if (hasBackendSummaryFields(summaryData)) {
    return extractBackendKPIs(summaryData);
  }

  // Fallback: client-side calculation from scenarios list
  return calculateClientKPIs(scenariosList);
}

