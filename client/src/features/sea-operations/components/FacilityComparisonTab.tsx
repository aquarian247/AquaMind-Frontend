import type { GeographyFilterValue } from '../types';
import { useAreaSummaries, useFacilityRankings } from '../api/api';
import { PerformanceRankingChart } from './PerformanceRankingChart';
import { FacilitySummaryTable } from './FacilitySummaryTable';

interface FacilityComparisonTabProps {
  geography: GeographyFilterValue;
}

export function FacilityComparisonTab({ geography }: FacilityComparisonTabProps) {
  const { data: areas, isLoading: areasLoading } = useAreaSummaries(geography);
  const { data: tgcRanking, isLoading: tgcLoading } = useFacilityRankings(geography, 'tgc');
  const { data: fcrRanking, isLoading: fcrLoading } = useFacilityRankings(geography, 'fcr');
  const { data: mortalityRanking, isLoading: mortLoading } = useFacilityRankings(geography, 'mortality');
  const { data: liceRanking, isLoading: liceLoading } = useFacilityRankings(geography, 'lice');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Facility Comparison</h2>
        <p className="text-sm text-muted-foreground">Performance rankings and analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceRankingChart
          title="Top Performers by TGC"
          data={tgcRanking || []}
          color="hsl(var(--chart-1))"
          isLoading={tgcLoading}
        />
        <PerformanceRankingChart
          title="Best FCR (Lower is Better)"
          data={fcrRanking || []}
          color="hsl(var(--chart-2))"
          isLoading={fcrLoading}
        />
        <PerformanceRankingChart
          title="Lowest Mortality"
          data={mortalityRanking || []}
          color="hsl(var(--chart-3))"
          isLoading={mortLoading}
          unit="%"
        />
        <PerformanceRankingChart
          title="Lowest Lice Counts"
          data={liceRanking || []}
          color="hsl(var(--chart-4))"
          isLoading={liceLoading}
          unit="/fish"
        />
      </div>

      <section aria-label="Comprehensive Comparison">
        <h3 className="text-base font-medium mb-3">All Facilities</h3>
        <FacilitySummaryTable data={areas || []} isLoading={areasLoading} />
      </section>
    </div>
  );
}
