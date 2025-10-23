import { PeriodFilterControls } from "./PeriodFilterControls";
import { PeriodOverviewCard } from "./PeriodOverviewCard";
import { FeedTypePerformanceCard } from "./FeedTypePerformanceCard";
import { OperationalInsightsCard } from "./OperationalInsightsCard";
import { HistoricalSummariesSection } from "./HistoricalSummariesSection";

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

interface FeedTypeUsage {
  feedType: string;
  feedBrand: string;
  totalAmountKg: number;
  totalCost: number;
  eventsCount: number;
  averageAmountPerEvent: number;
}

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

interface PeriodSummariesTabProps {
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
  feedingSummaries: FeedingSummary[];
  totalFeedConsumed: number;
  feedingSummary: { eventsCount: number; totalFeedKg?: number } | null | undefined;
  totalEvents: number;
  feedingEvents: FeedingEvent[];
  currentFCR: number | null;
  averageDailyFeed: number;
  feedTypeUsage: FeedTypeUsage[];
  uniqueContainers: string[];
  currentDateRange: { from?: Date; to?: Date };
}

export function PeriodSummariesTab({
  periodFilter,
  setPeriodFilter,
  dateRange,
  setDateRange,
  feedingSummaries,
  totalFeedConsumed,
  feedingSummary,
  totalEvents,
  feedingEvents,
  currentFCR,
  averageDailyFeed,
  feedTypeUsage,
  uniqueContainers,
  currentDateRange,
}: PeriodSummariesTabProps) {
  return (
    <div className="space-y-6">
      <PeriodFilterControls
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <PeriodOverviewCard
        periodFilter={periodFilter}
        totalFeedConsumed={totalFeedConsumed}
        feedingSummaryEventsCount={feedingSummary?.eventsCount}
        totalEvents={totalEvents}
        feedingEventsLength={feedingEvents.length}
        currentFCR={currentFCR}
        averageDailyFeed={averageDailyFeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedTypePerformanceCard
          feedTypeUsage={feedTypeUsage}
          totalFeedConsumed={totalFeedConsumed}
        />

        <OperationalInsightsCard
          feedingEvents={feedingEvents}
          currentDateRange={currentDateRange}
          uniqueContainers={uniqueContainers}
          currentFCR={currentFCR}
        />
      </div>

      <HistoricalSummariesSection
        feedingSummaries={feedingSummaries}
      />
    </div>
  );
}
