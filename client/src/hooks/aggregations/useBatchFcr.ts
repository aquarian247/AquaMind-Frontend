/**
 * @deprecated This hook has a critical pagination bug and is NOT used in the application.
 * 
 * BUG: Fetches only the first page (20 records) of 1.6M feeding events, then tries
 * to calculate FCR from that incomplete data - resulting in wildly incorrect values.
 * 
 * USE INSTEAD:
 * - For batch FCR: Use `BatchFeedingSummary.weighted_avg_fcr` from the backend
 * - For FCR trends: Use `/api/v1/operational/fcr-trends/batch-trends/` endpoint
 * 
 * @see analyticsCalculations.ts for the correct implementation
 * @see PAGINATION_STRATEGY.md for pagination guidelines
 */
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated/services/ApiService';

/** @deprecated See file header for alternatives */
export interface BatchFcrResult {
  fcr: number | null;
  totalFeedKg: number;
  biomassGainKg: number;
  eventCount: number;
  sampleCount: number;
}

export interface DateRange {
  from?: string | Date;
  to?: string | Date;
}

// Pure helper: Filter feeding events by batch and date range
export function filterFeedingEvents(events: any[], batchId: number, range?: DateRange): any[] {
  let filtered = events.filter(event => event.batch === batchId);

  if (!range) return filtered;

  const fromDate = range.from ? new Date(range.from) : null;
  const toDate = range.to ? new Date(range.to) : null;

  return filtered.filter(event => {
    const eventDate = new Date(event.feeding_date ?? '1970-01-01');
    if (fromDate && eventDate < fromDate) return false;
    if (toDate && eventDate > toDate) return false;
    return true;
  });
}

// Pure helper: Calculate total feed amount
export function calculateTotalFeedKg(feedingEvents: any[]): number {
  return feedingEvents.reduce(
    (sum, event) => {
      const amount = Number(event.amount_kg || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    },
    0
  );
}

// Pure helper: Sort growth samples by date
export function sortGrowthSamples(samples: any[]): any[] {
  return [...samples].sort((a, b) => {
    const dateA = new Date(a.sample_date ?? '1970-01-01').getTime();
    const dateB = new Date(b.sample_date ?? '1970-01-01').getTime();
    return dateA - dateB;
  });
}

// Pure helper: Select samples for FCR calculation
export function selectFcrSamples(samples: any[], range?: DateRange): any[] {
  if (samples.length === 0) return [];

  const baseline = samples[0];
  let latest = samples[samples.length - 1];

  if (range?.to) {
    const toDate = new Date(range.to);
    for (let i = samples.length - 1; i >= 0; i--) {
      const sampleDate = new Date(samples[i].sample_date ?? '1970-01-01');
      if (sampleDate <= toDate) {
        latest = samples[i];
        break;
      }
    }
  }

  const baselineDate = new Date(baseline.sample_date ?? '1970-01-01');
  const latestDate = new Date(latest.sample_date ?? '1970-01-01');

  if (baseline.id !== latest.id && latestDate >= baselineDate) {
    return [baseline, latest];
  }

  return [baseline];
}

// Pure helper: Calculate biomass gain
export async function calculateBiomassGain(
  growthSamples: any[],
  batchId: number
): Promise<number> {
  if (growthSamples.length < 2) return 0;

  const earliestSample = growthSamples[0];
  const latestSample = growthSamples[1];

  const batchDetails = await ApiService.apiV1BatchBatchesRetrieve(batchId);
  const estimatedPopulation = Number(batchDetails?.calculated_population_count || 0);

  const earliestWeight = Number(earliestSample.avg_weight_g || 0);
  const latestWeight = Number(latestSample.avg_weight_g || 0);

  const weightGainGrams = (isNaN(latestWeight) ? 0 : latestWeight) - (isNaN(earliestWeight) ? 0 : earliestWeight);
  return (weightGainGrams / 1000) * estimatedPopulation;
}

/** @deprecated See file header for alternatives - this hook has a critical pagination bug */
export const useBatchFcr = (batchId: number, range?: DateRange) => {
  return useQuery<BatchFcrResult>({
    queryKey: ['batch-fcr', batchId, range?.from ?? null, range?.to ?? null],
    queryFn: async () => {
      // Fetch feeding events and filter
      const feedingEventsResponse = await ApiService.apiV1InventoryFeedingEventsList();
      const allFeedingEvents: any[] = (feedingEventsResponse as any).results || [];
      const feedingEvents = filterFeedingEvents(allFeedingEvents, batchId, range);

      // Calculate total feed amount
      const totalFeedKg = calculateTotalFeedKg(feedingEvents);

      // Fetch and process growth samples
      const growthSamplesResponse = await ApiService.apiV1BatchGrowthSamplesList(batchId as any);
      const allGrowthSamples: any[] = (growthSamplesResponse as any).results || [];
      const sortedGrowthSamples = sortGrowthSamples(allGrowthSamples);
      const growthSamplesForCalc = selectFcrSamples(sortedGrowthSamples, range);

      // Calculate biomass gain
      const biomassGainKg = await calculateBiomassGain(growthSamplesForCalc, batchId);

      // Calculate FCR
      const fcr = biomassGainKg > 0 ? totalFeedKg / biomassGainKg : null;

      return {
        fcr,
        totalFeedKg,
        biomassGainKg,
        eventCount: feedingEvents.length,
        sampleCount: growthSamplesForCalc.length
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
