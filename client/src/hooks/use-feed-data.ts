import { useMemo } from "react";
import { format } from "date-fns";

interface FeedingEvent {
  id: number;
  feedingDate: string;
  feedingTime: string;
  amountKg: number;
  feedType: string;
  feedBrand: string;
  containerName: string;
  batchBiomassKg: number;
  feedCost: number;
  method: string;
  notes?: string;
  recordedBy: string;
}

interface FeedingSummary {
  id: number;
  periodStart: string;
  periodEnd: string;
  totalFeedKg: number;
  totalFeedConsumedKg: number;
  totalBiomassGainKg: number;
  fcr: number;
  averageFeedingPercentage: number;
  feedingEventsCount: number;
  totalCost: number;
}

export interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

export function useFeedData({
  feedingEvents,
  feedingSummaries,
  currentDateRange
}: {
  feedingEvents: FeedingEvent[];
  feedingSummaries: FeedingSummary[];
  currentDateRange: { from?: Date; to?: Date };
}) {

  // Calculate feed analytics using summary data for accurate totals
  const totalFeedConsumed = useMemo(() => {
    return feedingSummaries.length > 0
      ? feedingSummaries.reduce((sum, summary) => sum + (summary.totalFeedKg || 0), 0)
      : 0;
  }, [feedingSummaries]);

  const totalFeedCost = useMemo(() => {
    return feedingEvents.reduce((sum, event) => sum + (event.feedCost || 0), 0);
  }, [feedingEvents]);

  const daysSinceStart = useMemo(() => {
    const batchStartDate = new Date('2023-05-08'); // From batch data
    const today = new Date();
    return Math.ceil((today.getTime() - batchStartDate.getTime()) / (1000 * 60 * 60 * 24));
  }, []);

  const averageDailyFeed = useMemo(() => {
    return totalFeedConsumed > 0 ? totalFeedConsumed / daysSinceStart : 0;
  }, [totalFeedConsumed, daysSinceStart]);

  // Calculate FCR (Feed Conversion Ratio) - mock calculation
  const currentFCR = useMemo(() => {
    const latestSummary = feedingSummaries[feedingSummaries.length - 1];
    return latestSummary?.fcr || 1.25;
  }, [feedingSummaries]);

  // Group feeding events by feed type
  const feedTypeUsage = useMemo((): FeedTypeUsage[] => {
    return feedingEvents.reduce((acc, event) => {
      const key = `${event.feedType}-${event.feedBrand}`;
      const existing = acc.find(item => `${item.feedType}-${item.feedBrand}` === key);

      if (existing) {
        existing.totalAmountKg += event.amountKg;
        existing.totalCost += event.feedCost || 0;
        existing.eventsCount += 1;
        existing.averageAmountPerEvent = existing.totalAmountKg / existing.eventsCount;
      } else {
        acc.push({
          feedType: event.feedType,
          feedBrand: event.feedBrand,
          totalAmountKg: event.amountKg,
          totalCost: event.feedCost || 0,
          eventsCount: 1,
          averageAmountPerEvent: event.amountKg
        });
      }

      return acc;
    }, [] as FeedTypeUsage[]);
  }, [feedingEvents]);

  // Get unique feed types and containers for filters
  const uniqueFeedTypes = useMemo(() => {
    return [...new Set(feedingEvents.map(event => event.feedType))];
  }, [feedingEvents]);

  const uniqueContainers = useMemo(() => {
    return [...new Set(feedingEvents.map(event => event.containerName))];
  }, [feedingEvents]);

  // Group events by day for feeding patterns
  const dailyFeedingPatterns = useMemo(() => {
    return Object.entries(
      feedingEvents.reduce((acc, event) => {
        const day = format(new Date(event.feedingDate), "MMM dd");
        if (!acc[day]) acc[day] = { total: 0, events: 0, cost: 0 };
        acc[day].total += event.amountKg;
        acc[day].events += 1;
        acc[day].cost += event.feedCost || 0;
        return acc;
      }, {} as Record<string, { total: number; events: number; cost: number }>)
    );
  }, [feedingEvents]);

  // Calculate feeding frequency
  const feedingFrequency = useMemo(() => {
    if (feedingEvents.length > 0 && currentDateRange.from && currentDateRange.to) {
      return (feedingEvents.length / Math.ceil((currentDateRange.to.getTime() - currentDateRange.from.getTime()) / (1000 * 60 * 60 * 24))).toFixed(1);
    }
    return '0';
  }, [feedingEvents, currentDateRange]);

  // Calculate feed method distribution
  const feedMethodDistribution = useMemo(() => {
    if (feedingEvents.length === 0) return { auto: 0, manual: 0 };

    const auto = Math.round((feedingEvents.filter(e => e.method === 'Automatic').length / feedingEvents.length) * 100);
    const manual = Math.round((feedingEvents.filter(e => e.method === 'Manual').length / feedingEvents.length) * 100);

    return { auto, manual };
  }, [feedingEvents]);

  // Calculate container utilization
  const containerUtilization = useMemo(() => {
    return uniqueContainers.length;
  }, [uniqueContainers]);

  // Calculate feed brands used
  const feedBrandsUsed = useMemo(() => {
    return [...new Set(feedingEvents.map(e => e.feedBrand))].length;
  }, [feedingEvents]);

  // Period comparison data
  const periodComparison = useMemo(() => {
    if (feedingSummaries.length < 2) return { previousFCR: currentFCR + 0.05, improvement: -4.0 };

    const current = feedingSummaries[feedingSummaries.length - 1];
    const previous = feedingSummaries[feedingSummaries.length - 2];

    const previousFCR = previous?.fcr || currentFCR + 0.05;
    const improvement = ((previousFCR - current.fcr) / previousFCR * 100).toFixed(1);

    return {
      previousFCR,
      improvement: Number(improvement)
    };
  }, [feedingSummaries, currentFCR]);

  return {
    totalFeedConsumed,
    totalFeedCost,
    daysSinceStart,
    averageDailyFeed,
    currentFCR,
    feedTypeUsage,
    uniqueFeedTypes,
    uniqueContainers,
    dailyFeedingPatterns,
    feedingFrequency,
    feedMethodDistribution,
    containerUtilization,
    feedBrandsUsed,
    periodComparison
  };
}
