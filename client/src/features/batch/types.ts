import type { Batch } from "@/api/generated/models/Batch";

export interface ExtendedBatch {
  // Core fields from Django API
  id: number;
  batch_number: string;
  species: number;
  species_name?: string;
  lifecycle_stage?: number;
  status: string;
  batch_type?: string;
  start_date: string;
  expected_end_date?: string;
  actual_end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  population_count?: number;
  biomass_kg?: number;

  // Calculated fields from Django API
  calculated_population_count?: number;
  calculated_biomass_kg?: string;
  current_lifecycle_stage?: {
    id: number;
    name: string;
  };
  expected_harvest_date?: string;
  egg_source?: string;

  // Frontend-calculated fields
  fcr?: number;
  survivalRate?: number;
  avgWeight?: number;
  daysActive?: number;
  containerCount?: number;
  healthStatus?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  mortalityRate?: number;
  biomassGrowthRate?: number;

  // Legacy fields for compatibility
  name?: string; // Maps to batch_number
  initialCount?: number;
  speciesName?: string;
  stageName?: string;
  containerName?: string;
}

// Insert type for creating new batches
export type InsertBatch = {
  name: string;
  species: number;
  startDate: string;
  initialCount: number;
  initialBiomassKg: string;
  currentCount: number;
  currentBiomassKg: string;
  container?: number;
  stage?: number;
  status: string;
  expectedHarvestDate?: string;
  notes?: string;
  eggSource: 'internal' | 'external';
  broodstockPairId?: number;
  eggSupplierId?: number;
  eggBatchNumber?: string;
  eggProductionDate?: string;
};

// Container distribution type
export interface ContainerDistribution {
  containerId: number;
  containerName: string;
  containerType: string;
  status: 'healthy' | 'warning' | 'critical';
  fishCount: number;
  biomassKg: number;
  lastUpdate: string;
}

// Helper function to convert ExtendedBatch to Batch for component compatibility
export function mapExtendedToBatch(b: ExtendedBatch): Batch {
  return {
    id: b.id,
    batch_number: b.batch_number,
    /* Optional, but required (read-only) in generated Batch type */
    species_name: b.species_name ?? "",
    species: b.species,
    lifecycle_stage: b.lifecycle_stage ?? 0,
    status: (b.status as Batch["status"]) ?? "ACTIVE",
    batch_type: (b.batch_type as Batch["batch_type"]) ?? "STANDARD",
    start_date: b.start_date,
    expected_end_date: b.expected_end_date ?? null,
    notes: b.notes ?? "",

    /* read-only / calculated */
    created_at: b.created_at,
    updated_at: b.updated_at,
    calculated_population_count: b.calculated_population_count ?? 0,
    calculated_biomass_kg:
      typeof b.calculated_biomass_kg === "string"
        ? parseFloat(b.calculated_biomass_kg)
        : b.calculated_biomass_kg ?? 0,
    /* Derive average weight if not provided */
    calculated_avg_weight_g: (() => {
      if (typeof b.avgWeight === "number") return b.avgWeight;
      const pop = b.calculated_population_count ?? 0;
      const biomassKg =
        typeof b.calculated_biomass_kg === "string"
          ? parseFloat(b.calculated_biomass_kg)
          : b.calculated_biomass_kg ?? 0;
      return pop > 0 ? (biomassKg * 1000) / pop : 0;
    })(),
    current_lifecycle_stage: b.current_lifecycle_stage ?? null,
    days_in_production: b.daysActive ?? 0,
    active_containers: [], // placeholder – fetched separately
  };
}
