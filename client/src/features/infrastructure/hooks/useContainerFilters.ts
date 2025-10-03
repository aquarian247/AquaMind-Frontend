/**
 * useContainerFilters Hook
 * 
 * Manages filtering state for containers/rings in Area Detail page.
 * Provides search and status filtering with memoized results.
 * 
 * @module features/infrastructure/hooks/useContainerFilters
 */

import { useState, useMemo } from "react";
import type { Ring } from "./useAreaData";

/**
 * Hook return value
 */
export interface UseContainerFiltersReturn {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredContainers: Ring[];
}

/**
 * Manage container/ring filtering with search and status
 * 
 * @param containers - Array of containers/rings to filter
 * @returns Filter state and filtered results
 * 
 * @example
 * ```typescript
 * const { rings } = useAreaData(123);
 * const {
 *   statusFilter,
 *   setStatusFilter,
 *   searchQuery,
 *   setSearchQuery,
 *   filteredContainers
 * } = useContainerFilters(rings);
 * 
 * // filteredContainers contains only rings matching both filters
 * ```
 */
export function useContainerFilters(
  containers: Ring[]
): UseContainerFiltersReturn {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtering logic
  const filteredContainers = useMemo(() => {
    return containers.filter((container) => {
      // Status filter
      const matchesStatus =
        statusFilter === "all" || container.status === statusFilter;

      // Search filter (case-insensitive, matches name)
      const matchesSearch =
        !searchQuery ||
        container.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [containers, statusFilter, searchQuery]);

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredContainers,
  };
}

