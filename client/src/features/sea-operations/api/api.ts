import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { ApiError } from '@/api/generated/core/ApiError';
import type {
  GeographyFilterValue,
  SeaOperationsKPIs,
  AreaFacilitySummary,
  LiceStatusRow,
  LiceTrendPoint,
  FacilityRanking,
  RankingMetric,
} from '../types';
import { getCombinedLiceAlertLevel, getLiceStatus } from '../utils/liceThresholds';
import { rankByMetric } from '../utils/performanceRankings';

async function fetchLiceSummarySafe(
  endDate: string,
  geography?: number,
  area?: number,
  startDate?: string
): Promise<any | null> {
  try {
    return await ApiService.apiV1HealthLiceCountsSummaryRetrieve(area, endDate, geography, startDate);
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) return null;
    throw error;
  }
}

async function fetchLiceTrendsSafe(
  endDate: string,
  interval: 'weekly' | 'monthly',
  geography?: number,
  area?: number,
  startDate?: string
): Promise<any | null> {
  try {
    return await ApiService.apiV1HealthLiceCountsTrendsRetrieve(area, endDate, geography, interval, startDate);
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) return null;
    throw error;
  }
}

// ============================================================================
// Master KPI Hook
// ============================================================================

export function useSeaOperationsKPIs(
  geography: GeographyFilterValue
): UseQueryResult<SeaOperationsKPIs, Error> {
  return useQuery({
    queryKey: ['sea-operations-kpis', geography],
    queryFn: async (): Promise<SeaOperationsKPIs> => {
      const geographyId = geography === 'global' ? null : geography;
      const today = new Date().toISOString().split('T')[0];
      const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];

      let geoSummary: any = {};
      let batchSummary: any = {};
      let liceSummary: any = null;
      let feedSummary: any = {};

      if (geographyId) {
        try {
          geoSummary = await ApiService.batchGeographySummary(geographyId);
        } catch { /* non-critical */ }
      }

      try {
        batchSummary = await ApiService.batchContainerAssignmentsSummary(
          undefined, 'PEN', geographyId ?? undefined, undefined, true, undefined
        );
      } catch { /* non-critical */ }

      try {
        liceSummary = await fetchLiceSummarySafe(today, geographyId ?? undefined, undefined, twoWeeksAgo);
      } catch { /* non-critical */ }

      try {
        feedSummary = await ApiService.feedingEventsSummary(
          undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined,
          geographyId ?? undefined, undefined, undefined, undefined, undefined
        );
      } catch { /* non-critical */ }

      const growth = geoSummary.growth_metrics ?? {};
      const mortality = geoSummary.mortality_metrics ?? {};
      const feed = geoSummary.feed_metrics ?? feedSummary;
      const liceByStage = liceSummary?.by_development_stage ?? {};

      const matureLice = liceByStage.mature ?? liceSummary?.average_per_fish ?? null;
      const movableLice = liceByStage.movable ?? liceSummary?.average_per_fish ?? null;

      return {
        geography_id: geographyId,
        geography_name: geoSummary.geography_name ?? (geographyId ? 'Unknown' : 'Global'),
        total_biomass_tons: growth.total_biomass_kg != null ? growth.total_biomass_kg / 1000 : (batchSummary.active_biomass_kg != null ? batchSummary.active_biomass_kg / 1000 : null),
        avg_weight_kg: growth.avg_weight_g != null ? growth.avg_weight_g / 1000 : null,
        feed_this_week_tons: feed.total_feed_kg != null ? feed.total_feed_kg / 1000 : null,
        tgc: growth.avg_tgc ?? null,
        sgr_pct: growth.avg_sgr ?? null,
        mortality_count: mortality.total_count ?? null,
        mortality_biomass_tons: mortality.total_biomass_kg != null ? mortality.total_biomass_kg / 1000 : null,
        mature_lice_per_fish: matureLice,
        movable_lice_per_fish: movableLice,
        released_from_freshwater: null,
        total_rings: batchSummary.count ?? null,
        capacity_utilization_pct: null,
        lice_alert_level: getCombinedLiceAlertLevel(matureLice, movableLice),
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Area Summaries
// ============================================================================

export function useAreaSummaries(
  geography: GeographyFilterValue
): UseQueryResult<AreaFacilitySummary[], Error> {
  return useQuery({
    queryKey: ['sea-area-summaries', geography],
    queryFn: async (): Promise<AreaFacilitySummary[]> => {
      const geographyId = geography === 'global' ? undefined : geography;
      const today = new Date().toISOString().split('T')[0];
      const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];

      const areasList = await ApiService.apiV1InfrastructureAreasList(
        true, undefined, undefined, geographyId
      );
      if (!areasList.results?.length) return [];

      const summaries = await Promise.all(
        areasList.results.map(async (area) => {
          let areaSummaryData: any = {};
          let liceSummaryData: any = null;

          try {
            areaSummaryData = await ApiService.areaSummary(area.id);
          } catch { /* non-critical */ }

          try {
            liceSummaryData = await fetchLiceSummarySafe(today, undefined, area.id, twoWeeksAgo);
          } catch { /* non-critical */ }

          const matureLice = liceSummaryData?.by_development_stage?.mature ?? liceSummaryData?.average_per_fish ?? null;
          const movableLice = liceSummaryData?.by_development_stage?.movable ?? liceSummaryData?.average_per_fish ?? null;

          return {
            id: area.id,
            name: area.name || `Area ${area.id}`,
            geography_id: (area as any).geography ?? 0,
            geography_name: (area as any).geography_name ?? '',
            biomass_tons: areaSummaryData.active_biomass_kg != null ? areaSummaryData.active_biomass_kg / 1000 : null,
            avg_weight_kg: areaSummaryData.avg_weight_kg ?? null,
            population: areaSummaryData.population_count ?? null,
            tgc: null,
            fcr: null,
            mortality_pct: null,
            mature_lice: matureLice,
            movable_lice: movableLice,
            lice_alert_level: getCombinedLiceAlertLevel(matureLice, movableLice),
            ring_count: areaSummaryData.ring_count ?? areaSummaryData.container_count ?? null,
          } as AreaFacilitySummary;
        })
      );

      return summaries;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Lice Data
// ============================================================================

export function useSeaLiceSummary(
  geography: GeographyFilterValue
): UseQueryResult<LiceStatusRow[], Error> {
  return useQuery({
    queryKey: ['sea-lice-summary', geography],
    queryFn: async (): Promise<LiceStatusRow[]> => {
      const geographyId = geography === 'global' ? undefined : geography;
      const today = new Date().toISOString().split('T')[0];
      const twoWeeksAgo = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0];

      const areasList = await ApiService.apiV1InfrastructureAreasList(true, undefined, undefined, geographyId);
      if (!areasList.results?.length) return [];

      const rows = await Promise.all(
        areasList.results.map(async (area) => {
          let liceSummary: any = null;
          try {
            liceSummary = await fetchLiceSummarySafe(today, undefined, area.id, twoWeeksAgo);
          } catch { /* non-critical */ }

          const mature = liceSummary?.by_development_stage?.mature ?? liceSummary?.average_per_fish ?? null;
          const movable = liceSummary?.by_development_stage?.movable ?? liceSummary?.average_per_fish ?? null;
          const total = mature !== null && movable !== null ? mature + movable : null;

          return {
            area_id: area.id,
            area_name: area.name || `Area ${area.id}`,
            geography_name: (area as any).geography_name ?? '',
            mature_lice: mature,
            movable_lice: movable,
            total_lice: total,
            fish_sampled: liceSummary?.fish_sampled ?? null,
            alert_level: getCombinedLiceAlertLevel(mature, movable),
            status: getLiceStatus(mature, movable),
          } as LiceStatusRow;
        })
      );

      return rows;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSeaLiceTrends(
  geography: GeographyFilterValue,
  interval: 'weekly' | 'monthly' = 'weekly'
): UseQueryResult<LiceTrendPoint[], Error> {
  return useQuery({
    queryKey: ['sea-lice-trends', geography, interval],
    queryFn: async (): Promise<LiceTrendPoint[]> => {
      const geographyId = geography === 'global' ? undefined : geography;
      const today = new Date().toISOString().split('T')[0];
      const oneYearAgo = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0];

      const trends = await fetchLiceTrendsSafe(today, interval, geographyId, undefined, oneYearAgo);
      if (!trends?.trends?.length) return [];

      return trends.trends.map((point: any) => ({
        period: point.period ?? '',
        average_per_fish: point.average_per_fish ?? null,
        total_counts: point.total_counts ?? null,
        fish_sampled: point.fish_sampled ?? null,
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Facility Rankings
// ============================================================================

export function useFacilityRankings(
  geography: GeographyFilterValue,
  metric: RankingMetric,
  topN: number = 5
): UseQueryResult<FacilityRanking[], Error> {
  const { data: areaSummaries } = useAreaSummaries(geography);

  return useQuery({
    queryKey: ['sea-facility-rankings', geography, metric, topN],
    queryFn: async (): Promise<FacilityRanking[]> => {
      if (!areaSummaries?.length) return [];
      return rankByMetric(areaSummaries, metric, topN);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!areaSummaries,
  });
}
