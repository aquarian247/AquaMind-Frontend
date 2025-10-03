/**
 * Scenario Filters Hook
 * 
 * TASK 3: Extracted from ScenarioPlanning.tsx (lines ~192-202)
 * Manages search term and status filter state with memoized filtering logic.
 * 
 * @module features/scenario/hooks/useScenarioFilters
 */

import { useState, useMemo } from "react";

/**
 * Minimal scenario interface for filtering
 * Properties are optional to support various API response shapes
 */
interface FilterableScenario {
  name?: string;
  description?: string;
  genotype?: string;
  status?: string;
}

/**
 * Hook providing scenario filter state and filtered results
 * 
 * Manages search term and status filter with optimized filtering logic.
 * Uses useMemo to prevent unnecessary re-computation.
 * 
 * @param scenarios - Array of scenarios to filter (from API)
 * @returns Filter state, setters, and filtered scenarios
 * 
 * @example
 * ```typescript
 * const { 
 *   searchTerm, 
 *   setSearchTerm, 
 *   statusFilter, 
 *   setStatusFilter, 
 *   filteredScenarios 
 * } = useScenarioFilters(scenarios?.results ?? []);
 * 
 * // Use in search input
 * <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 * 
 * // Use in status filter
 * <Select value={statusFilter} onValueChange={setStatusFilter}>
 *   <SelectItem value="all">All</SelectItem>
 *   <SelectItem value="running">Running</SelectItem>
 * </Select>
 * 
 * // Render filtered results
 * {filteredScenarios.map(scenario => ...)}
 * ```
 */
export function useScenarioFilters(scenarios: FilterableScenario[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /**
   * Filter scenarios based on search term and status
   * 
   * Search matches against:
   * - Name (case-insensitive)
   * - Description (case-insensitive)
   * - Genotype (case-insensitive)
   * 
   * Status filter:
   * - "all" shows all scenarios
   * - Specific status (e.g., "running", "completed") filters to matching scenarios
   * 
   * Memoized to prevent unnecessary re-computation on unrelated re-renders.
   */
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      // Search term filtering (handle optional fields safely)
      const matchesSearch = !searchTerm || 
        scenario.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.genotype?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filtering (handle optional status field)
      const matchesStatus = statusFilter === 'all' || scenario.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [scenarios, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredScenarios,
  };
}

