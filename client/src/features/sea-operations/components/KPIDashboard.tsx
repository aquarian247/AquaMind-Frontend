import * as React from 'react';
import { KPICard, KPICardSkeleton } from '@/features/executive/components/KPICard';
import { formatKPI } from '@/features/executive/utils/kpiCalculations';
import type { KPIData } from '@/features/executive/types';
import type { SeaOperationsKPIs } from '../types';

interface KPIDashboardProps {
  kpis: SeaOperationsKPIs | undefined;
  isLoading: boolean;
}

export function KPIDashboard({ kpis, isLoading }: KPIDashboardProps) {
  const cards: KPIData[] = React.useMemo(() => {
    if (!kpis) return [];
    return [
      formatKPI({ title: 'Total Biomass', value: kpis.total_biomass_tons, unit: 'tons', decimalPlaces: 0 }),
      formatKPI({ title: 'Average Weight', value: kpis.avg_weight_kg, unit: 'kg', decimalPlaces: 2 }),
      formatKPI({ title: 'Feed This Week', value: kpis.feed_this_week_tons, unit: 'tons', decimalPlaces: 0 }),
      formatKPI({ title: 'TGC', value: kpis.tgc, unit: '', decimalPlaces: 2 }),
      formatKPI({ title: 'SGR', value: kpis.sgr_pct, unit: '%', decimalPlaces: 2 }),
      formatKPI({ title: 'Mortality Count', value: kpis.mortality_count, unit: 'fish', decimalPlaces: 0 }),
      formatKPI({ title: 'Mortality Biomass', value: kpis.mortality_biomass_tons, unit: 'tons', decimalPlaces: 1 }),
      { title: 'Mature Lice', value: kpis.mature_lice_per_fish, unit: '/fish', alertLevel: kpis.lice_alert_level },
      { title: 'Movable Lice', value: kpis.movable_lice_per_fish, unit: '/fish' },
      formatKPI({ title: 'Released from FW', value: kpis.released_from_freshwater, unit: 'fish', decimalPlaces: 0 }),
      formatKPI({ title: 'Total Rings', value: kpis.total_rings, unit: '', decimalPlaces: 0 }),
      formatKPI({ title: 'Capacity Utilization', value: kpis.capacity_utilization_pct, unit: '%', decimalPlaces: 0 }),
    ];
  }, [kpis]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {isLoading || cards.length === 0
        ? Array.from({ length: 12 }).map((_, i) => <KPICardSkeleton key={`skel-${i}`} />)
        : cards.map((card, i) => <KPICard key={`kpi-${i}`} data={card} />)
      }
    </div>
  );
}
