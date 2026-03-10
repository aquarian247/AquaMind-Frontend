import type { GeographyFilterValue } from '../types';
import { useSeaOperationsKPIs, useSeaLiceSummary, useSeaLiceTrends } from '../api/api';
import { LiceGoalsCard } from './LiceGoalsCard';
import { LiceStatusTable } from './LiceStatusTable';
import { LiceTrendsCharts } from './LiceTrendsCharts';

interface LiceManagementTabProps {
  geography: GeographyFilterValue;
}

export function LiceManagementTab({ geography }: LiceManagementTabProps) {
  const { data: kpis } = useSeaOperationsKPIs(geography);
  const { data: liceStatus, isLoading: statusLoading } = useSeaLiceSummary(geography);
  const { data: liceTrends, isLoading: trendsLoading } = useSeaLiceTrends(geography);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Lice Management</h2>
        <p className="text-sm text-muted-foreground">Tracking and trend analysis</p>
      </div>

      <LiceGoalsCard
        currentMature={kpis?.mature_lice_per_fish ?? null}
        currentMovable={kpis?.movable_lice_per_fish ?? null}
      />

      <section aria-label="Current Lice Status">
        <h3 className="text-base font-medium mb-3">Current Lice Status by Area</h3>
        <LiceStatusTable data={liceStatus || []} isLoading={statusLoading} />
      </section>

      <section aria-label="Lice Trends">
        <LiceTrendsCharts data={liceTrends || []} isLoading={trendsLoading} />
      </section>
    </div>
  );
}
