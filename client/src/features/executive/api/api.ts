/**
 * Executive Dashboard - API Layer
 * 
 * TanStack Query hooks for fetching executive-level data.
 * Uses generated ApiService from OpenAPI spec (contract-first).
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import type {
  ExecutiveSummary,
  FacilitySummary,
  FinancialSummary,
  MarketPrice,
  LiceTrendPoint,
  FCRTrendPoint,
  TrendInterval,
  GeographyFilterValue,
} from '../types';
import {
  getLiceAlertLevel,
  getFacilityHealthStatus,
} from '../utils/alertLevels';
import {
  calculateAverageWeight,
  calculateCapacityUtilization,
} from '../utils/kpiCalculations';

/**
 * Hook: useExecutiveSummary
 *
 * Fetches geography-level aggregated KPIs for the executive dashboard.
 * Uses the new geography summary endpoint when specific geography is selected,
 * otherwise combines data from infrastructure, batch, and lice endpoints.
 *
 * @param geography - Geography ID or 'global' for all geographies
 */
export function useExecutiveSummary(
  geography: GeographyFilterValue
): UseQueryResult<ExecutiveSummary, Error> {
  return useQuery({
    queryKey: ['executive-summary', geography],
    queryFn: async (): Promise<ExecutiveSummary> => {
      // Determine if we're querying a specific geography or global
      const geographyId = geography === 'global' ? null : geography;

      // If specific geography is selected, use the new geography summary endpoint
      if (geographyId) {
        // Fetch geography summary (cumulative data for demo - test data lacks recent activity), infrastructure summary, batch summary, and lice summary (last 2 weeks) in parallel
        const [geographySummary, infraSummary, batchSummary, liceSummary] = await Promise.all([
          ApiService.batchGeographySummary(geographyId, undefined, undefined),
          ApiService.apiV1InfrastructureGeographiesSummaryRetrieve(geographyId) as Promise<any>,
          ApiService.batchContainerAssignmentsSummary(
            undefined, // area
            undefined, // containerType
            geographyId, // geography
            undefined, // hall
            true, // isActive
            undefined // station
          ),
          ApiService.apiV1HealthLiceCountsSummaryRetrieve(
            undefined, // area
            new Date().toISOString().split('T')[0], // endDate
            geographyId, // geography
            new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // startDate (2 weeks)
          ),
        ]);

        // Map geography summary response to ExecutiveSummary interface
        const summary: ExecutiveSummary = {
          geography_id: geographySummary.geography_id || geographyId,
          geography_name: geographySummary.geography_name || 'Unknown',
          period_start: geographySummary.period_start || null,
          period_end: geographySummary.period_end || null,

          // Biomass & Population from multiple sources
          total_biomass_kg: geographySummary.growth_metrics?.total_biomass_kg || null,
          total_population: batchSummary.total_population || null, // From batch container assignments
          average_weight_g: geographySummary.growth_metrics?.avg_weight_g || null,

          // Growth Metrics from geography summary
          tgc_average: geographySummary.growth_metrics?.avg_tgc || null,
          sgr_average: geographySummary.growth_metrics?.avg_sgr || null,

          // Feed & FCR from feed metrics
          feed_this_week_kg: geographySummary.feed_metrics?.total_feed_kg || null,
          fcr_average: geographySummary.feed_metrics?.avg_fcr || null,

          // Mortality from mortality metrics (cumulative totals across all batches)
          mortality_count_week: geographySummary.mortality_metrics?.total_count || null,
          mortality_biomass_kg: geographySummary.mortality_metrics?.total_biomass_kg || null,
          mortality_percentage: geographySummary.mortality_metrics?.avg_mortality_rate_percent || null,

          // Lice Management from lice summary
          mature_lice_average: liceSummary.by_development_stage?.mature || liceSummary.average_per_fish || null,
          movable_lice_average: liceSummary.by_development_stage?.movable || liceSummary.average_per_fish || null,
          lice_alert_level: getLiceAlertLevel(
            liceSummary.by_development_stage?.mature || liceSummary.average_per_fish || null,
            liceSummary.by_development_stage?.movable || liceSummary.average_per_fish || null
          ),

          // Infrastructure from infra summary
          total_containers: infraSummary.container_count || null,
          active_batches: geographySummary.total_batches || null,
          capacity_utilization_percentage: calculateCapacityUtilization(
            geographySummary.growth_metrics?.total_biomass_kg ?? null,
            infraSummary.capacity_kg ?? null
          ),

          // Freshwater Releases (not available)
          released_from_freshwater_week: null,
        };

        return summary;
      }

      // For global view, combine data from multiple endpoints (existing behavior)
      // Parallel fetch of all required data
      const [batchSummary, liceSummary] = await Promise.all([
        // Batch/container summary (global)
        ApiService.batchContainerAssignmentsSummary(
          undefined, // area
          undefined, // containerType
          undefined, // geography (global)
          undefined, // hall
          true, // isActive
          undefined // station
        ),

        // Lice summary (last 7 days, global)
        ApiService.apiV1HealthLiceCountsSummaryRetrieve(
          undefined, // area
          new Date().toISOString().split('T')[0], // endDate
          undefined, // geography (global)
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // startDate
        ),
      ]);

      // Calculate derived metrics from API response
      const totalBiomassKg = batchSummary.active_biomass_kg || null;
      const totalPopulation = batchSummary.total_population || null; // Total fish count across all assignments
      const assignmentCount = batchSummary.count || null; // Number of container assignments
      const averageWeightG = calculateAverageWeight(totalBiomassKg, totalPopulation);

      // Lice data (using average_per_fish and development stage breakdown)
      const liceAvgPerFish = liceSummary.average_per_fish || null;
      const liceByStage = liceSummary.by_development_stage || {};
      const matureLiceAvg = liceByStage['mature'] || liceAvgPerFish || null;
      const movableLiceAvg = liceByStage['movable'] || liceAvgPerFish || null;
      const liceAlertLevel = getLiceAlertLevel(matureLiceAvg, movableLiceAvg);

      // Note: Container counts not available in this endpoint
      const totalContainers = null;
      const activeContainers = null;
      const capacityUtilization = null;

      // Construct executive summary
      const summary: ExecutiveSummary = {
        geography_id: null, // Global view
        geography_name: 'Global',
        period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        period_end: new Date().toISOString().split('T')[0],

        // Biomass & Population
        total_biomass_kg: totalBiomassKg,
        total_population: totalPopulation,
        average_weight_g: averageWeightG,

        // Growth Metrics (placeholder - may need dedicated endpoints)
        tgc_average: null, // TODO: Calculate from batch growth data
        sgr_average: null, // TODO: Calculate from batch growth data

        // Feed & FCR (placeholder - may need feeding event summaries)
        feed_this_week_kg: null, // TODO: Sum from feeding events
        fcr_average: null, // TODO: Calculate from FCR trends

        // Mortality (placeholder - may need mortality event summaries)
        mortality_count_week: null, // TODO: Sum from mortality events
        mortality_biomass_kg: null, // TODO: Sum from mortality events
        mortality_percentage: null, // TODO: Calculate

        // Lice Management
        mature_lice_average: matureLiceAvg,
        movable_lice_average: movableLiceAvg,
        lice_alert_level: liceAlertLevel,

        // Infrastructure (limited data from current API)
        total_containers: totalContainers,
        active_batches: assignmentCount, // Number of active container assignments
        capacity_utilization_percentage: capacityUtilization,

        // Freshwater Releases (placeholder)
        released_from_freshwater_week: null, // TODO: Query freshwater transfers
      };

      return summary;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook: useFacilitySummaries
 * 
 * Fetches per-facility summaries for the facility list table.
 * Aggregates data at the geography/area/station level.
 * 
 * @param geography - Geography ID or 'global'
 */
export function useFacilitySummaries(
  geography: GeographyFilterValue
): UseQueryResult<FacilitySummary[], Error> {
  return useQuery({
    queryKey: ['facility-summaries', geography],
    queryFn: async (): Promise<FacilitySummary[]> => {
      const geographyId = geography === 'global' ? null : geography;

      // Fetch geographies (for facility list)
      // Note: List endpoint doesn't filter by single ID, returns all with optional filters
      const geographiesList = await ApiService.apiV1InfrastructureGeographiesList();

      if (!geographiesList.results || geographiesList.results.length === 0) {
        return [];
      }

      // Filter geographies if specific geography selected
      const geosToProcess = geographyId
        ? geographiesList.results.filter((g) => g.id === geographyId)
        : geographiesList.results;

      // For each geography, fetch summary data including the new geography summary endpoint
      const facilitySummaries: FacilitySummary[] = await Promise.all(
        geosToProcess.map(async (geo) => {
          try {
            const [geographySummary, batchSummary, liceSummary] = await Promise.all([
              ApiService.batchGeographySummary(geo.id!, undefined, undefined),
              ApiService.batchContainerAssignmentsSummary(
                undefined, // area
                undefined, // containerType
                geo.id, // geography
                undefined, // hall
                true, // isActive
                undefined // station
              ),
              ApiService.apiV1HealthLiceCountsSummaryRetrieve(
                undefined, // area
                new Date().toISOString().split('T')[0], // endDate
                geo.id, // geography
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // startDate
              ),
            ]);

            const biomassKg = geographySummary.growth_metrics?.total_biomass_kg || null;
            const population = batchSummary.total_population || null; // Total fish count
            const averageWeightG = geographySummary.growth_metrics?.avg_weight_g || null;

            const liceAvgPerFish = liceSummary.average_per_fish || null;
            const liceByStage = liceSummary.by_development_stage || {};
            const matureLice = liceByStage['mature'] || liceAvgPerFish || null;
            const movableLice = liceByStage['movable'] || liceAvgPerFish || null;
            const liceAlertLevel = getLiceAlertLevel(matureLice, movableLice);

            const mortalityPercentage = geographySummary.mortality_metrics?.avg_mortality_rate_percent || null;
            const fcr = geographySummary.feed_metrics?.avg_fcr || null;

            const healthStatus = getFacilityHealthStatus({
              matureLice,
              movableLice,
              mortalityPercentage,
              fcr,
            });

            // Note: Container counts not available in batch summary endpoint
            const totalContainers = null;
            const activeContainers = null;
            const capacityUtilization = null;

            const summary: FacilitySummary = {
              id: geo.id!,
              name: geo.name || 'Unknown',
              type: 'sea_farm', // Placeholder - may need type from infrastructure
              geography_id: geo.id!,
              geography_name: geo.name || 'Unknown',

              // Key Metrics
              biomass_kg: biomassKg,
              average_weight_g: averageWeightG,
              tgc: geographySummary.growth_metrics?.avg_tgc || null,
              fcr: fcr,
              mortality_percentage: mortalityPercentage,

              // Lice Status
              mature_lice_average: matureLice,
              lice_alert_level: liceAlertLevel,

              // Capacity
              active_containers: activeContainers,
              capacity_utilization_percentage: capacityUtilization,

              // Health Status
              health_status: healthStatus,
              last_updated: new Date().toISOString(),
            };

            return summary;
          } catch (error) {
            console.error(`Failed to fetch data for geography ${geo.id}:`, error);
            // Return placeholder with geography info
            return {
              id: geo.id!,
              name: geo.name || 'Unknown',
              type: 'sea_farm',
              geography_id: geo.id!,
              geography_name: geo.name || 'Unknown',
              biomass_kg: null,
              average_weight_g: null,
              tgc: null,
              fcr: null,
              mortality_percentage: null,
              mature_lice_average: null,
              lice_alert_level: 'info',
              active_containers: null,
              capacity_utilization_percentage: null,
              health_status: 'info',
              last_updated: new Date().toISOString(),
            };
          }
        })
      );

      return facilitySummaries;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook: useLiceTrends
 * 
 * Fetches historical lice trends data for charting.
 * 
 * @param geography - Geography ID or 'global'
 * @param interval - Time interval (daily/weekly/monthly)
 */
export function useLiceTrends(
  geography: GeographyFilterValue,
  interval: TrendInterval = 'weekly'
): UseQueryResult<LiceTrendPoint[], Error> {
  return useQuery({
    queryKey: ['lice-trends', geography, interval],
    queryFn: async (): Promise<LiceTrendPoint[]> => {
      const geographyId = geography === 'global' ? undefined : geography;

      // Fetch last 90 days of lice trends
      const trends = await ApiService.apiV1HealthLiceCountsTrendsRetrieve(
        undefined, // area
        new Date().toISOString().split('T')[0], // endDate
        geographyId, // geography
        interval, // interval
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // startDate
      );

      if (!trends.trends || trends.trends.length === 0) {
        return [];
      }

      // Map to LiceTrendPoint format
      // Note: API doesn't provide stage-specific data in trends, only average_per_fish
      const trendPoints: LiceTrendPoint[] = trends.trends.map((point) => ({
        date: point.period || '',
        mature_lice_average: point.average_per_fish || null,
        movable_lice_average: point.average_per_fish || null,
        batch_count: point.fish_sampled || 0,
      }));

      return trendPoints;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (historical data changes slowly)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook: useFCRTrends
 * 
 * Fetches FCR trend data for performance monitoring.
 * 
 * @param geography - Geography ID or 'global'
 * @param interval - Time interval (daily/weekly/monthly)
 */
export function useFCRTrends(
  geography: GeographyFilterValue,
  interval: TrendInterval = 'weekly'
): UseQueryResult<FCRTrendPoint[], Error> {
  return useQuery({
    queryKey: ['fcr-trends', geography, interval],
    queryFn: async (): Promise<FCRTrendPoint[]> => {
      const geographyId = geography === 'global' ? undefined : geography;

      // Fetch FCR trends (last 90 days)
      // Note: Disabled until endpoint signature is verified
      // const trends = await ApiService.apiV1OperationalFcrTrendsGeographyTrendsRetrieve(
      //   geographyId
      // );

      // TODO: Map response to FCRTrendPoint format once API response structure is known
      // For now, return empty array
      return [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: false, // Disabled until FCR trends endpoint is verified
  });
}

/**
 * Hook: useFinancialSummary
 * 
 * Fetches financial summary data.
 * ⚠️ PLACEHOLDER - Backend endpoint TBD (see TASK_0_BACKEND_API_GAPS.md)
 * 
 * @param geography - Geography ID or 'global'
 */
export function useFinancialSummary(
  geography: GeographyFilterValue
): UseQueryResult<FinancialSummary, Error> {
  return useQuery({
    queryKey: ['financial-summary', geography],
    queryFn: async (): Promise<FinancialSummary> => {
      // TODO: Replace with real endpoint when available
      // For now, return mock data with clear indication

      const mockSummary: FinancialSummary = {
        geography_id: geography === 'global' ? null : geography,
        period: new Date().toISOString().split('T')[0].slice(0, 7), // YYYY-MM

        // Placeholder values (clearly marked as mock)
        total_revenue: null,
        revenue_trend: undefined,
        total_costs: null,
        cost_breakdown: undefined,
        gross_margin: null,
        gross_margin_percentage: null,
        operating_margin_percentage: null,
        ebitda: null,
        roi_percentage: null,
        cash_flow: null,
      };

      return mockSummary;
    },
    staleTime: Infinity, // Mock data never stale
    gcTime: Infinity,
    enabled: false, // Disabled until real endpoint available
  });
}

/**
 * Hook: useMarketPrices
 * 
 * Fetches salmon market price data.
 * ⚠️ PLACEHOLDER - Backend endpoint TBD (see TASK_0_BACKEND_API_GAPS.md)
 */
export function useMarketPrices(): UseQueryResult<MarketPrice, Error> {
  return useQuery({
    queryKey: ['market-prices'],
    queryFn: async (): Promise<MarketPrice> => {
      // TODO: Replace with real endpoint when available
      // May require external API integration (Stágri Salmon Index)

      const mockPrice: MarketPrice = {
        current_price_per_kg: null,
        currency: 'EUR',
        trend: undefined,
        market_outlook: null,
        last_updated: new Date().toISOString(),
      };

      return mockPrice;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: false, // Disabled until real endpoint available
  });
}

