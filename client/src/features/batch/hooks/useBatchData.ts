import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ExtendedBatch } from "../types";

export function useBatchData(selectedGeography: string) {
  const batchesQuery = useQuery<ExtendedBatch[]>({
    queryKey: ["batch/batches", selectedGeography],
    queryFn: async () => {
      const res = await api.batch.getAll();
      const items = res.results || [];
      return items.map((b: any) => ({
        ...b,
        // Ensure required/core fields exist with safe defaults
        status: b.status || "ACTIVE",
        batch_number: b.batch_number || b.name || "",
        start_date:
          b.start_date || b.created_at || new Date().toISOString(),
        created_at: b.created_at || new Date().toISOString(),
        updated_at: b.updated_at || new Date().toISOString(),
      })) as ExtendedBatch[];
    },
  });

  const speciesQuery = useQuery({
    queryKey: ["batch/species"],
    queryFn: async () => (await api.batch.getSpecies()).results || [],
  });

  const stagesQuery = useQuery({
    queryKey: ["batch/lifecycle-stages"],
    queryFn: async () => (await api.batch.getLifecycleStages()).results || [],
  });

  const containersQuery = useQuery({
    queryKey: ["infrastructure/containers"],
    queryFn: async () => (await api.infrastructure.getContainers()).results || [],
  });

  const broodstockPairsQuery = useQuery({
    queryKey: ["broodstock/pairs"],
    queryFn: async () => (await (api as any).broodstock.getPairs()).results || [],
  });

  const eggSuppliersQuery = useQuery({
    queryKey: ["broodstock/egg-suppliers"],
    queryFn: async () => (await (api as any).broodstock.getEggSuppliers()).results || [],
  });

  return {
    batches: batchesQuery.data || [],
    species: speciesQuery.data || [],
    stages: stagesQuery.data || [],
    containers: containersQuery.data || [],
    broodstockPairs: broodstockPairsQuery.data || [],
    eggSuppliers: eggSuppliersQuery.data || [],
    isLoading: batchesQuery.isLoading || speciesQuery.isLoading || stagesQuery.isLoading || containersQuery.isLoading,
    batchesLoading: batchesQuery.isLoading,
  };
}
