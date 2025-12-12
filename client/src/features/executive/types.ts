/**
 * Executive Dashboard - TypeScript Type Definitions
 * 
 * Defines all types and interfaces for the Executive Dashboard feature.
 * These types align with backend API responses and internal state management.
 */

/**
 * Geography filter options for dashboard-wide filtering
 */
export type GeographyFilterValue = 'global' | number;

export interface GeographyFilterOption {
  id: GeographyFilterValue;
  name: string;
}

/**
 * Time interval options for trend data
 * Note: 'daily' not supported by backend API (only weekly and monthly)
 */
export type TrendInterval = 'weekly' | 'monthly';

/**
 * Trend direction for KPI indicators
 */
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Alert levels for health indicators
 */
export type AlertLevel = 'success' | 'warning' | 'danger' | 'info';

/**
 * KPI card data structure
 */
export interface KPIData {
  title: string;
  value: number | null;
  unit: string;
  subtitle?: string;
  trend?: {
    direction: TrendDirection;
    percentage: number;
    period?: string;
  };
  alertLevel?: AlertLevel;
}

/**
 * Executive Summary - Overall KPIs aggregated by geography
 */
export interface ExecutiveSummary {
  geography_id: number | null;
  geography_name: string;
  period_start: string | null;
  period_end: string | null;
  
  // Biomass & Population
  total_biomass_kg: number | null;
  total_population: number | null;
  average_weight_g: number | null;
  
  // Growth Metrics
  tgc_average: number | null;
  sgr_average: number | null;
  
  // Feed & FCR
  feed_this_week_kg: number | null;
  fcr_average: number | null;
  
  // Mortality
  mortality_count_week: number | null;
  mortality_biomass_kg: number | null;
  mortality_percentage: number | null;
  
  // Lice Management
  mature_lice_average: number | null;
  movable_lice_average: number | null;
  lice_alert_level: AlertLevel;
  
  // Infrastructure
  total_containers: number | null;
  active_batches: number | null;
  capacity_utilization_percentage: number | null;
  
  // Freshwater Releases
  released_from_freshwater_week: number | null;
}

/**
 * Facility summary for facility list table
 */
export interface FacilitySummary {
  id: number;
  name: string;
  type: 'sea_farm' | 'freshwater_station' | 'hatchery';
  geography_id: number;
  geography_name: string;
  
  // Key Metrics
  biomass_kg: number | null;
  average_weight_g: number | null;
  tgc: number | null;
  fcr: number | null;
  mortality_percentage: number | null;
  
  // Lice Status
  mature_lice_average: number | null;
  lice_alert_level: AlertLevel;
  
  // Capacity
  total_rings?: number | null;
  active_containers: number | null;
  capacity_utilization_percentage: number | null;
  
  // Health Status
  health_status: AlertLevel;
  last_updated: string;
}

/**
 * Financial metrics for Financial Tab
 */
export interface FinancialSummary {
  geography_id: number | null;
  period: string;
  
  // Revenue
  total_revenue: number | null;
  revenue_trend?: {
    direction: TrendDirection;
    percentage: number;
  };
  
  // Costs
  total_costs: number | null;
  cost_breakdown?: {
    feed_percentage: number;
    labor_percentage: number;
    transport_percentage: number;
    maintenance_percentage: number;
    other_percentage: number;
  };
  
  // Margins
  gross_margin: number | null;
  gross_margin_percentage: number | null;
  operating_margin_percentage: number | null;
  ebitda: number | null;
  
  // ROI & Cash Flow
  roi_percentage: number | null;
  cash_flow: number | null;
}

/**
 * Capacity utilization by facility type
 */
export interface CapacityUtilization {
  facility_type: 'sea_farms' | 'freshwater_stations' | 'hatcheries';
  utilization_percentage: number | null;
  total_capacity: number | null;
  used_capacity: number | null;
}

/**
 * Harvest forecast for Strategic Tab (legacy placeholder structure)
 */
export interface HarvestForecast {
  geography_id: number | null;
  forecasts: {
    period: 'next_30_days' | 'next_60_days' | 'next_90_days';
    tonnes: number | null;
    revenue_estimate: number | null;
  }[];
}

/**
 * Harvest forecast summary from the new forecast endpoint
 */
export interface HarvestForecastSummary {
  total_batches: number;
  harvest_ready_count: number;
  avg_days_to_harvest: number | null;
  total_projected_biomass_tonnes: number;
}

/**
 * Individual batch harvest forecast data
 */
export interface UpcomingHarvest {
  batch_id: number;
  batch_number: string;
  species: string;
  facility: string;
  current_weight_g: number | null;
  target_weight_g: number;
  projected_harvest_date: string | null;
  days_until_harvest: number | null;
  projected_biomass_kg: number | null;
  confidence: number | null;
  planned_activity_id: number | null;
  planned_activity_status: string | null;
}

/**
 * Quarterly aggregation for harvests
 */
export interface HarvestQuarterlyData {
  count: number;
  biomass_tonnes: number;
}

/**
 * Full harvest forecast response from backend
 */
export interface HarvestForecastResponse {
  summary: HarvestForecastSummary;
  upcoming: UpcomingHarvest[];
  by_quarter: Record<string, HarvestQuarterlyData>;
}

/**
 * Sea-transfer forecast summary
 */
export interface SeaTransferForecastSummary {
  total_freshwater_batches: number;
  transfer_ready_count: number;
  avg_days_to_transfer: number | null;
}

/**
 * Individual batch sea-transfer forecast data
 */
export interface UpcomingSeaTransfer {
  batch_id: number;
  batch_number: string;
  current_stage: string;
  target_stage: string;
  current_facility: string;
  target_facility: string | null;
  projected_transfer_date: string | null;
  days_until_transfer: number | null;
  current_weight_g: number | null;
  target_weight_g: number;
  confidence: number | null;
  planned_activity_id: number | null;
}

/**
 * Monthly aggregation for sea-transfers
 */
export interface SeaTransferMonthlyData {
  count: number;
}

/**
 * Full sea-transfer forecast response from backend
 */
export interface SeaTransferForecastResponse {
  summary: SeaTransferForecastSummary;
  upcoming: UpcomingSeaTransfer[];
  by_month: Record<string, SeaTransferMonthlyData>;
}

/**
 * Confidence level thresholds for color coding
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Forecast filter options
 */
export interface ForecastFilters {
  species_id?: number;
  from_date?: string;
  to_date?: string;
  min_confidence?: number;
}

/**
 * Market price data for Market Tab
 */
export interface MarketPrice {
  current_price_per_kg: number | null;
  currency: string;
  trend?: {
    direction: TrendDirection;
    percentage: number;
  };
  market_outlook: 'strong' | 'neutral' | 'weak' | null;
  last_updated: string;
}

/**
 * Market share data
 */
export interface MarketShare {
  company_share_percentage: number | null;
  global_production_tonnes: number | null;
  company_production_tonnes: number | null;
  competitors: {
    name: string;
    share_percentage: number;
  }[];
}

/**
 * Lice trend data point
 */
export interface LiceTrendPoint {
  date: string;
  mature_lice_average: number | null;
  movable_lice_average: number | null;
  batch_count: number;
}

/**
 * FCR trend data point
 */
export interface FCRTrendPoint {
  date: string;
  fcr_average: number | null;
  feed_kg: number | null;
  biomass_gain_kg: number | null;
}

