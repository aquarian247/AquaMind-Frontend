import { useState, useMemo } from 'react';
import type { ExtendedBatch } from '@/features/batch/types';

/**
 * Custom hook for managing batch filtering state and logic
 * Handles search term, status filter, and lifecycle stage filter
 * Returns filtered batch list based on current filter criteria
 */
export function useBatchFilters(batches: ExtendedBatch[], stages: any[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      const matchesSearch = 
        batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.species_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        batch.status === statusFilter;
      
      const matchesStage = 
        stageFilter === "all" || 
        batch.current_lifecycle_stage?.name === stageFilter;
      
      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [batches, searchTerm, statusFilter, stageFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stageFilter,
    setStageFilter,
    filteredBatches,
  };
}

