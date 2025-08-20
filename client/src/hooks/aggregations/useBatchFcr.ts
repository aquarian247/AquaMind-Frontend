import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated/services/ApiService';

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

export const useBatchFcr = (batchId: number, range?: DateRange) => {
  return useQuery<BatchFcrResult>({
    queryKey: ['batch-fcr', batchId, range?.from ?? null, range?.to ?? null],
    queryFn: async () => {
      // Fetch feeding events
      const feedingEventsResponse = await ApiService.apiV1InventoryFeedingEventsList();
      let feedingEvents: any[] = (feedingEventsResponse as any).results || [];
      
      // Filter events by batch
      feedingEvents = feedingEvents.filter(event => event.batch === batchId);
      
      // Filter by date range if provided
      if (range) {
        const fromDate = range.from ? new Date(range.from) : null;
        const toDate = range.to ? new Date(range.to) : null;
        
        feedingEvents = feedingEvents.filter(event => {
          const eventDate = new Date(event.feeding_date ?? '1970-01-01');
          if (fromDate && eventDate < fromDate) return false;
          if (toDate && eventDate > toDate) return false;
          return true;
        });
      }
      
      // Calculate total feed amount
      const totalFeedKg = feedingEvents.reduce(
        (sum, event) => sum + Number(event.amount_kg || 0),
        0
      );
      
      // Fetch growth samples
      const growthSamplesResponse = await ApiService.apiV1BatchGrowthSamplesList(batchId as any);
      let growthSamples: any[] = (growthSamplesResponse as any).results || [];
      
      // Sort samples by date
      growthSamples.sort((a, b) => {
        const dateA = new Date(a.sample_date ?? '1970-01-01').getTime();
        const dateB = new Date(b.sample_date ?? '1970-01-01').getTime();
        return dateA - dateB;
      });
      
      // Select baseline and latest samples for FCR calculation
      let growthSamplesForCalc: any[] = [];
      
      if (growthSamples.length > 0) {
        // Baseline is always the earliest sample
        const baseline = growthSamples[0];
        
        // Find the latest sample within the date range (if provided)
        let latest = growthSamples[growthSamples.length - 1];
        
        if (range?.to) {
          const toDate = new Date(range.to);
          // Find the latest sample that's not after toDate
          for (let i = growthSamples.length - 1; i >= 0; i--) {
            const sampleDate = new Date(growthSamples[i].sample_date ?? '1970-01-01');
            if (sampleDate <= toDate) {
              latest = growthSamples[i];
              break;
            }
          }
        }
        
        // Ensure baseline and latest are different samples and latest is not before baseline
        const baselineDate = new Date(baseline.sample_date ?? '1970-01-01');
        const latestDate = new Date(latest.sample_date ?? '1970-01-01');
        
        if (baseline.id !== latest.id && latestDate >= baselineDate) {
          growthSamplesForCalc = [baseline, latest];
        } else {
          growthSamplesForCalc = [baseline];
        }
      }
      
      let biomassGainKg = 0;
      
      // Calculate biomass gain if we have at least two samples
      if (growthSamplesForCalc.length >= 2) {
        const earliestSample = growthSamplesForCalc[0];
        const latestSample = growthSamplesForCalc[1];
        
        // Get batch details to find population count
        const batchDetails = await ApiService.apiV1BatchBatchesRetrieve(batchId);
        const estimatedPopulation = Number(batchDetails?.calculated_population_count || 0);
        
        // Calculate biomass gain
        const weightGainGrams = Number(latestSample.avg_weight_g || 0) - Number(earliestSample.avg_weight_g || 0);
        biomassGainKg = (weightGainGrams / 1000) * estimatedPopulation;
      }
      
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
