import { KPICard, KPICardSkeleton } from '@/features/executive/components/KPICard';
import type { StationFilterValue } from '../types';
import { useSeaTransferForecast } from '../api/api';
import { TransferReadinessCards } from './TransferReadinessCards';

interface TransferPlanningTabProps {
  stationId: StationFilterValue;
}

export function TransferPlanningTab({ stationId }: TransferPlanningTabProps) {
  const { data, isLoading } = useSeaTransferForecast();

  const summary = data?.summary;
  const upcoming = data?.upcoming ?? [];

  return (
    <div className="space-y-8">
      <section aria-label="Transfer Summary KPIs">
        <h3 className="text-base font-medium mb-3">Transfer Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
            </>
          ) : (
            <>
              <KPICard data={{
                title: 'Total Freshwater Batches',
                value: summary?.total_freshwater_batches ?? null,
                unit: '',
                subtitle: 'Active in freshwater',
              }} />
              <KPICard data={{
                title: 'Transfer Ready',
                value: summary?.transfer_ready_count ?? null,
                unit: '',
                subtitle: 'Approaching smolt weight',
                alertLevel: (summary?.transfer_ready_count ?? 0) > 0 ? 'success' : 'info',
              }} />
              <KPICard data={{
                title: 'Avg Days to Transfer',
                value: summary?.avg_days_to_transfer ?? null,
                unit: 'days',
                subtitle: 'Across upcoming batches',
              }} />
            </>
          )}
        </div>
      </section>

      <section aria-label="Upcoming Transfers">
        <h3 className="text-base font-medium mb-3">Upcoming Transfers</h3>
        <TransferReadinessCards batches={upcoming} isLoading={isLoading} />
      </section>
    </div>
  );
}
