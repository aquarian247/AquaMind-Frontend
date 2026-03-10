import type { StationFilterValue } from '../types';
import { useFacilityOverview, useGrowthPerformance, useBatchPerformanceKPIs } from '../api/api';
import { FacilityOverviewTable } from './FacilityOverviewTable';
import { GrowthPerformanceTable } from './GrowthPerformanceTable';
import { BatchPerformanceKPIsTable } from './BatchPerformanceKPIsTable';
import { SizeDistributionChart } from './SizeDistributionChart';
import { getCurrentWeek } from '../utils/reportFormatting';
import { ExportToPDFButton } from './ExportToPDFButton';

interface WeeklyReportTabProps {
  stationId: StationFilterValue;
}

export function WeeklyReportTab({ stationId }: WeeklyReportTabProps) {
  const { data: facilityData, isLoading: facilityLoading } = useFacilityOverview(stationId);
  const { data: growthData, isLoading: growthLoading } = useGrowthPerformance(stationId);
  const { data: batchKPIs, isLoading: kpisLoading } = useBatchPerformanceKPIs(stationId);

  const { week, year } = getCurrentWeek();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Weekly Freshwater Report &mdash; Week {week}, {year}
        </h2>
        <ExportToPDFButton />
      </div>

      <section aria-label="Facility Overview">
        <h3 className="text-base font-medium mb-3">Facility Overview</h3>
        <FacilityOverviewTable data={facilityData || []} isLoading={facilityLoading} />
      </section>

      <section aria-label="Growth Performance">
        <h3 className="text-base font-medium mb-3">Growth Performance</h3>
        <GrowthPerformanceTable data={growthData || []} isLoading={growthLoading} />
      </section>

      <section aria-label="Size Distribution">
        <h3 className="text-base font-medium mb-3">Size Distribution</h3>
        <SizeDistributionChart growthData={growthData || []} isLoading={growthLoading} />
      </section>

      <section aria-label="Batch Performance KPIs">
        <h3 className="text-base font-medium mb-3">Batch Performance KPIs</h3>
        <BatchPerformanceKPIsTable data={batchKPIs || []} isLoading={kpisLoading} />
      </section>
    </div>
  );
}
