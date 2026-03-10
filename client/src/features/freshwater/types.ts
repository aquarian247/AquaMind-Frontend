import type { AlertLevel, TrendDirection } from '../executive/types';

export type StationFilterValue = 'all' | number;

export interface StationFilterOption {
  id: StationFilterValue;
  name: string;
}

export interface FreshwaterStationSummary {
  id: number;
  name: string;
  station_type: 'FRESHWATER' | 'BROODSTOCK';
  geography_name: string;

  hall_count: number | null;
  tank_count: number | null;
  active_biomass_kg: number | null;
  capacity_utilization_percent: number | null;
  population_count: number | null;
  avg_weight_kg: number | null;
  active_batches: number | null;
}

export interface FacilityOverviewRow {
  station_id: number;
  station_name: string;
  avg_weight_g: number | null;
  count_millions: number | null;
  biomass_tons: number | null;
  feed_tons: number | null;
  mortality_count: number | null;
  mortality_percentage: number | null;
  mortality_avg_weight_g: number | null;
}

export interface GrowthPerformanceRow {
  batch_id: number;
  batch_number: string;
  station_name: string;
  count: number | null;
  biomass_kg: number | null;
  primo_weight_g: number | null;
  current_weight_g: number | null;
  sgr: number | null;
  growth_kg: number | null;
  feed_kg: number | null;
  temperature: number | null;
  fcr: number | null;
}

export interface SizeClass {
  label: string;
  min_g: number;
  max_g: number;
  percentage: number;
  count: number | null;
}

export interface SizeDistribution {
  station_name: string;
  total_count: number | null;
  classes: SizeClass[];
}

export interface BatchPerformanceKPI {
  batch_id: number;
  batch_number: string;
  release_date: string | null;
  station_name: string;
  year_class: string | null;
  avg_weight_g: number | null;
  count: number | null;
  biomass_kg: number | null;
  mortality_14d_pct: number | null;
  mortality_30d_pct: number | null;
  mortality_90d_pct: number | null;
  tgc_14d: number | null;
  tgc_30d: number | null;
  tgc_90d: number | null;
}

export interface ForensicPanelData {
  parameter: string;
  unit: string;
  data: Array<{
    date: string;
    value: number | null;
  }>;
}

export interface TransferReadyBatch {
  batch_id: number;
  batch_number: string;
  current_stage: string;
  current_facility: string;
  target_facility: string | null;
  projected_transfer_date: string | null;
  days_until_transfer: number | null;
  current_weight_g: number | null;
  target_weight_g: number;
  confidence: number | null;
}

export interface TransferSummary {
  total_freshwater_batches: number;
  transfer_ready_count: number;
  avg_days_to_transfer: number | null;
}

export interface NinetyDayDataPoint {
  date: string;
  value: number | null;
  year: number;
}

export type MortalityPeriod = '14d' | '30d' | '90d';

export type { AlertLevel, TrendDirection };
