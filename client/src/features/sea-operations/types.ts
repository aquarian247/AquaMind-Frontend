import type { AlertLevel, TrendDirection, GeographyFilterValue } from '../executive/types';

export interface SeaOperationsKPIs {
  geography_id: number | null;
  geography_name: string;

  total_biomass_tons: number | null;
  avg_weight_kg: number | null;
  feed_this_week_tons: number | null;
  tgc: number | null;
  sgr_pct: number | null;
  mortality_count: number | null;
  mortality_biomass_tons: number | null;
  mature_lice_per_fish: number | null;
  movable_lice_per_fish: number | null;
  released_from_freshwater: number | null;
  total_rings: number | null;
  capacity_utilization_pct: number | null;
  lice_alert_level: AlertLevel;
}

export interface AreaFacilitySummary {
  id: number;
  name: string;
  geography_id: number;
  geography_name: string;
  biomass_tons: number | null;
  avg_weight_kg: number | null;
  population: number | null;
  tgc: number | null;
  fcr: number | null;
  mortality_pct: number | null;
  mature_lice: number | null;
  movable_lice: number | null;
  lice_alert_level: AlertLevel;
  ring_count: number | null;
}

export interface LiceStatusRow {
  area_id: number;
  area_name: string;
  geography_name: string;
  mature_lice: number | null;
  movable_lice: number | null;
  total_lice: number | null;
  fish_sampled: number | null;
  alert_level: AlertLevel;
  status: 'good' | 'warning' | 'critical';
}

export interface LiceTrendPoint {
  period: string;
  average_per_fish: number | null;
  total_counts: number | null;
  fish_sampled: number | null;
}

export type RankingMetric = 'tgc' | 'fcr' | 'mortality' | 'lice';

export interface FacilityRanking {
  facility: string;
  value: number;
  area_id: number;
  geography: string;
}

export interface LiceGoals {
  mature: { target: number; warning: number; critical: number };
  movable: { target: number; warning: number; critical: number };
  spring: { matureLiceMax: number };
}

export type { AlertLevel, TrendDirection, GeographyFilterValue };
