import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { apiRequest } from '@/lib/queryClient';
import type {
  StationFilterValue,
  FreshwaterStationSummary,
  FacilityOverviewRow,
  GrowthPerformanceRow,
  BatchPerformanceKPI,
  TransferReadyBatch,
  TransferSummary,
  ForensicPanelData,
} from '../types';
import { calculateSGR, calculateTGC } from '../../executive/utils/kpiCalculations';

/**
 * Extract batch IDs from the station summary's active_batches field,
 * which may be an array of objects, a number, or null.
 */
function extractBatchIds(activeBatches: unknown): number[] {
  if (Array.isArray(activeBatches)) {
    return activeBatches
      .map((b: any) => b.id ?? b.batch_id ?? (typeof b === 'number' ? b : null))
      .filter((id): id is number => id !== null);
  }
  return [];
}

function countActiveBatches(activeBatches: unknown): number | null {
  if (Array.isArray(activeBatches)) return activeBatches.length;
  if (typeof activeBatches === 'number') return activeBatches;
  return null;
}

// ============================================================================
// Station Summaries
// ============================================================================

export function useFreshwaterStations(): UseQueryResult<FreshwaterStationSummary[], Error> {
  return useQuery({
    queryKey: ['freshwater-stations-summaries'],
    queryFn: async (): Promise<FreshwaterStationSummary[]> => {
      const stationsList = await ApiService.apiV1InfrastructureFreshwaterStationsList(
        true // active only
      );

      if (!stationsList.results || stationsList.results.length === 0) return [];

      const summaries = await Promise.all(
        stationsList.results.map(async (station) => {
          try {
            const [summary, batchSummary] = await Promise.all([
              ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(station.id) as Promise<any>,
              ApiService.batchContainerAssignmentsSummary(
                undefined, 'TANK', undefined, undefined, true, station.id
              ),
            ]);

            return {
              id: station.id,
              name: station.name,
              station_type: station.station_type,
              geography_name: station.geography_name,
              hall_count: summary.hall_count ?? null,
              tank_count: summary.tank_count ?? summary.container_count ?? null,
              active_biomass_kg: summary.active_biomass_kg ?? batchSummary.active_biomass_kg ?? null,
              capacity_utilization_percent: summary.capacity_utilization_percent ?? null,
              population_count: batchSummary.total_population ?? summary.population_count ?? null,
              avg_weight_kg: summary.avg_weight_kg ?? null,
              active_batches: countActiveBatches(summary.active_batches),
            } as FreshwaterStationSummary;
          } catch (error) {
            console.error(`Failed to fetch summary for station ${station.id}:`, error);
            return {
              id: station.id,
              name: station.name,
              station_type: station.station_type,
              geography_name: station.geography_name,
              hall_count: null, tank_count: null, active_biomass_kg: null,
              capacity_utilization_percent: null, population_count: null,
              avg_weight_kg: null, active_batches: null,
            } as FreshwaterStationSummary;
          }
        })
      );

      return summaries;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Facility Overview
// ============================================================================

export function useFacilityOverview(
  stationId: StationFilterValue
): UseQueryResult<FacilityOverviewRow[], Error> {
  return useQuery({
    queryKey: ['freshwater-facility-overview', stationId],
    queryFn: async (): Promise<FacilityOverviewRow[]> => {
      const stationsList = await ApiService.apiV1InfrastructureFreshwaterStationsList(true);
      if (!stationsList.results?.length) return [];

      const stations = stationId === 'all'
        ? stationsList.results
        : stationsList.results.filter(s => s.id === stationId);

      const rows = await Promise.all(
        stations.map(async (station) => {
          // Fetch core data (station summary + batch summary) independently
          // from date-sensitive data (feed) so one failure doesn't cascade.
          let summary: any = {};
          let batchSummary: any = {};
          let feedTotalKg: number | null = null;

          try {
            [summary, batchSummary] = await Promise.all([
              ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(station.id) as Promise<any>,
              ApiService.batchContainerAssignmentsSummary(
                undefined, 'TANK', undefined, undefined, true, station.id
              ),
            ]);
          } catch (error) {
            console.error(`Failed core data for station ${station.id}:`, error);
          }

          try {
            const feedSummary = await ApiService.feedingEventsSummary(
              undefined, undefined, undefined, undefined, undefined,
              undefined, undefined, station.id, undefined,
              undefined, undefined, undefined, undefined, undefined
            );
            feedTotalKg = feedSummary.total_feed_kg ?? null;
          } catch {
            // Feed data unavailable - non-critical
          }

          const biomassKg = summary.active_biomass_kg ?? batchSummary.active_biomass_kg ?? null;
          const population = batchSummary.total_population ?? summary.population_count ?? null;
          const avgWeightKg = summary.avg_weight_kg ?? null;

          return {
            station_id: station.id,
            station_name: station.name,
            avg_weight_g: avgWeightKg !== null ? avgWeightKg * 1000 : null,
            count_millions: population !== null ? population / 1_000_000 : null,
            biomass_tons: biomassKg !== null ? biomassKg / 1000 : null,
            feed_tons: feedTotalKg !== null ? feedTotalKg / 1000 : null,
            mortality_count: null,
            mortality_percentage: null,
            mortality_avg_weight_g: null,
          } as FacilityOverviewRow;
        })
      );

      return rows;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Growth Performance - uses batch IDs from station summary
// ============================================================================

export function useGrowthPerformance(
  stationId: StationFilterValue
): UseQueryResult<GrowthPerformanceRow[], Error> {
  return useQuery({
    queryKey: ['freshwater-growth-performance', stationId],
    queryFn: async (): Promise<GrowthPerformanceRow[]> => {
      const stationsList = await ApiService.apiV1InfrastructureFreshwaterStationsList(true);
      if (!stationsList.results?.length) return [];

      const stations = stationId === 'all'
        ? stationsList.results
        : stationsList.results.filter(s => s.id === stationId);

      const rows: GrowthPerformanceRow[] = [];

      for (const station of stations) {
        try {
          const summary = await ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(station.id) as any;
          const batchIds = extractBatchIds(summary.active_batches);

          if (batchIds.length === 0) continue;

          for (const batchId of batchIds) {
            try {
              const [growthAnalysis, perfMetrics] = await Promise.all([
                ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId) as Promise<any>,
                ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId) as Promise<any>,
              ]);

              const metrics = growthAnalysis.growth_metrics || [];
              const primoWeight = metrics.length > 0 ? metrics[0].avg_weight_g : null;
              const currentWeight = metrics.length > 0 ? metrics[metrics.length - 1].avg_weight_g : null;
              const days = metrics.length > 1
                ? Math.max(1, Math.round((new Date(metrics[metrics.length - 1].date).getTime() - new Date(metrics[0].date).getTime()) / 86400000))
                : null;

              const containerMetrics = perfMetrics.container_metrics;
              const totalBiomassKg = Array.isArray(containerMetrics)
                ? containerMetrics.reduce((s: number, c: any) => s + (c.biomass_kg ?? 0), 0)
                : null;
              const totalPopulation = Array.isArray(containerMetrics)
                ? containerMetrics.reduce((s: number, c: any) => s + (c.population ?? 0), 0)
                : null;

              rows.push({
                batch_id: batchId,
                batch_number: growthAnalysis.batch_number || perfMetrics.batch_number || `Batch ${batchId}`,
                station_name: station.name,
                count: totalPopulation,
                biomass_kg: totalBiomassKg,
                primo_weight_g: primoWeight,
                current_weight_g: currentWeight,
                sgr: calculateSGR(currentWeight, primoWeight, days),
                growth_kg: totalBiomassKg !== null && primoWeight !== null && currentWeight !== null && currentWeight > 0
                  ? totalBiomassKg - (totalBiomassKg * primoWeight / currentWeight)
                  : null,
                feed_kg: perfMetrics.feed_metrics?.total_feed_kg ?? null,
                temperature: null,
                fcr: perfMetrics.feed_metrics?.avg_fcr ?? null,
              });
            } catch {
              // Skip batches with missing data
            }
          }
        } catch {
          // Skip station on error
        }
      }

      return rows;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Batch Performance KPIs
// ============================================================================

export function useBatchPerformanceKPIs(
  stationId: StationFilterValue
): UseQueryResult<BatchPerformanceKPI[], Error> {
  return useQuery({
    queryKey: ['freshwater-batch-kpis', stationId],
    queryFn: async (): Promise<BatchPerformanceKPI[]> => {
      const stationsList = await ApiService.apiV1InfrastructureFreshwaterStationsList(true);
      if (!stationsList.results?.length) return [];

      const stations = stationId === 'all'
        ? stationsList.results
        : stationsList.results.filter(s => s.id === stationId);

      const kpis: BatchPerformanceKPI[] = [];

      for (const station of stations) {
        try {
          const summary = await ApiService.apiV1InfrastructureFreshwaterStationsSummaryRetrieve(station.id) as any;
          const batchIds = extractBatchIds(summary.active_batches);

          if (batchIds.length === 0) continue;

          for (const batchId of batchIds) {
            try {
              const [growthAnalysis, perfMetrics, batchDetail] = await Promise.all([
                ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId) as Promise<any>,
                ApiService.apiV1BatchBatchesPerformanceMetricsRetrieve(batchId) as Promise<any>,
                ApiService.apiV1BatchBatchesRetrieve(batchId) as Promise<any>,
              ]);

              const metrics = growthAnalysis.growth_metrics || [];
              const currentWeight = metrics.length > 0 ? metrics[metrics.length - 1].avg_weight_g : null;

              const containerMetrics = perfMetrics.container_metrics;
              const totalBiomassKg = Array.isArray(containerMetrics)
                ? containerMetrics.reduce((s: number, c: any) => s + (c.biomass_kg ?? 0), 0)
                : null;
              const totalPopulation = Array.isArray(containerMetrics)
                ? containerMetrics.reduce((s: number, c: any) => s + (c.population ?? 0), 0)
                : null;

              const computeWindowedMetrics = (days: number) => {
                const cutoff = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
                const windowMetrics = metrics.filter((m: any) => m.date >= cutoff);
                if (windowMetrics.length < 2) return { mortality: null, tgc: null };

                const startW = windowMetrics[0].avg_weight_g;
                const endW = windowMetrics[windowMetrics.length - 1].avg_weight_g;
                const avgTemp = windowMetrics.reduce((s: number, m: any) => s + (m.temperature ?? 10), 0) / windowMetrics.length;

                return {
                  mortality: perfMetrics.mortality_metrics?.mortality_rate ?? null,
                  tgc: calculateTGC(endW, startW, avgTemp, days),
                };
              };

              const w14 = computeWindowedMetrics(14);
              const w30 = computeWindowedMetrics(30);
              const w90 = computeWindowedMetrics(90);

              kpis.push({
                batch_id: batchId,
                batch_number: batchDetail.batch_number || `Batch ${batchId}`,
                release_date: batchDetail.start_date || null,
                station_name: station.name,
                year_class: batchDetail.start_date ? new Date(batchDetail.start_date).getFullYear().toString() : null,
                avg_weight_g: currentWeight,
                count: totalPopulation,
                biomass_kg: totalBiomassKg,
                mortality_14d_pct: w14.mortality,
                mortality_30d_pct: w30.mortality,
                mortality_90d_pct: w90.mortality,
                tgc_14d: w14.tgc,
                tgc_30d: w30.tgc,
                tgc_90d: w90.tgc,
              });
            } catch {
              // Skip batch on error
            }
          }
        } catch {
          // Skip station on error
        }
      }

      return kpis;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Environmental & Transfer Planning
// ============================================================================

export function useForensicData(
  containerId: number | null,
  dayRange: number = 500
): UseQueryResult<ForensicPanelData[], Error> {
  return useQuery({
    queryKey: ['freshwater-forensic', containerId, dayRange],
    queryFn: async (): Promise<ForensicPanelData[]> => {
      if (!containerId) return [];

      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - dayRange * 86400000).toISOString();

      const readings = await ApiService.apiV1EnvironmentalReadingsByContainerRetrieve(
        containerId, endTime, 5000, undefined, startTime
      );

      const parameterMap = new Map<string, Array<{ date: string; value: number | null }>>();

      for (const reading of readings) {
        const paramName = (reading as any).parameter_name || `Param ${(reading as any).parameter}`;
        if (!parameterMap.has(paramName)) {
          parameterMap.set(paramName, []);
        }
        parameterMap.get(paramName)!.push({
          date: (reading as any).timestamp || (reading as any).reading_time || '',
          value: (reading as any).value ?? null,
        });
      }

      const panels: ForensicPanelData[] = [];
      const desiredParams = ['Oxygen', 'CO2', 'NO2', 'NO3', 'Temperature'];

      for (const paramName of desiredParams) {
        const matchingKey = [...parameterMap.keys()].find(
          k => k.toLowerCase().includes(paramName.toLowerCase())
        );
        panels.push({
          parameter: paramName,
          unit: paramName === 'Temperature' ? '°C' : 'mg/L',
          data: matchingKey
            ? parameterMap.get(matchingKey)!.sort((a, b) => a.date.localeCompare(b.date))
            : [],
        });
      }

      return panels;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!containerId,
  });
}

export function useSeaTransferForecast(): UseQueryResult<{
  summary: TransferSummary;
  upcoming: TransferReadyBatch[];
}, Error> {
  return useQuery({
    queryKey: ['freshwater-sea-transfer-forecast'],
    queryFn: async () => {
      const data = await ApiService.forecastviewsetSeaTransfer();

      return {
        summary: {
          total_freshwater_batches: data.summary?.total_freshwater_batches ?? 0,
          transfer_ready_count: data.summary?.transfer_ready_count ?? 0,
          avg_days_to_transfer: data.summary?.avg_days_to_transfer ?? null,
        },
        upcoming: (data.upcoming || []).map((b) => ({
          batch_id: b.batch_id ?? 0,
          batch_number: b.batch_number ?? '',
          current_stage: b.current_stage ?? '',
          current_facility: b.current_facility ?? '',
          target_facility: b.target_facility ?? null,
          projected_transfer_date: b.projected_transfer_date ?? null,
          days_until_transfer: b.days_until_transfer ?? null,
          current_weight_g: b.current_weight_g ?? null,
          target_weight_g: b.target_weight_g ?? 0,
          confidence: b.confidence ?? null,
        })),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}
