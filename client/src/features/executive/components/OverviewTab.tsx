/**
 * OverviewTab Component
 * 
 * Main overview tab for Executive Dashboard displaying 12 strategic KPIs
 * and a facility overview table with health indicators.
 */

import * as React from 'react';
import { KPICard, KPICardSkeleton } from './KPICard';
import { FacilityList } from './FacilityList';
import { useExecutiveSummary, useFacilitySummaries } from '../api/api';
import type { GeographyFilterValue, KPIData } from '../types';
import { formatKPI } from '../utils/kpiCalculations';

export interface OverviewTabProps {
  geography: GeographyFilterValue;
}

/**
 * OverviewTab Component
 * 
 * Displays 12 executive KPIs in a grid layout plus a facility overview table.
 * 
 * @example
 * ```tsx
 * <OverviewTab geography="global" />
 * <OverviewTab geography={1} /> // Specific geography ID
 * ```
 */
export function OverviewTab({ geography }: OverviewTabProps) {
  const { data: summary, isLoading: isSummaryLoading } = useExecutiveSummary(geography);
  const { data: facilities, isLoading: isFacilitiesLoading } = useFacilitySummaries(geography);

  // Prepare 12 KPI cards
  const kpis: KPIData[] = React.useMemo(() => {
    // Return empty array if no data (will show skeletons)
    if (!summary) {
      return [];
    }

    return [
      // Row 1: Biomass & Population
      formatKPI({
        title: 'Total Biomass',
        value: summary.total_biomass_kg,
        unit: 'kg',
        subtitle: 'All active batches',
      }),
      formatKPI({
        title: 'Average Weight',
        value: summary.average_weight_g,
        unit: 'g',
        subtitle: 'Per fish',
      }),
      formatKPI({
        title: 'Total Population',
        value: summary.total_population,
        unit: 'fish',
        subtitle: 'All facilities',
        decimalPlaces: 0,
      }),

      // Row 2: Growth Metrics
      formatKPI({
        title: 'TGC',
        value: summary.tgc_average,
        unit: '',
        subtitle: 'Thermal Growth Coefficient',
      }),
      formatKPI({
        title: 'SGR',
        value: summary.sgr_average,
        unit: '%',
        subtitle: 'Specific Growth Rate',
      }),
      formatKPI({
        title: 'Feed This Week',
        value: summary.feed_this_week_kg,
        unit: 'kg',
        subtitle: 'All facilities',
      }),

      // Row 3: Mortality
      formatKPI({
        title: 'Mortality Count',
        value: summary.mortality_count_week,
        unit: 'fish',
        subtitle: 'This week',
        decimalPlaces: 0,
      }),
      formatKPI({
        title: 'Mortality Biomass',
        value: summary.mortality_biomass_kg,
        unit: 'kg',
        subtitle: 'This week',
      }),
      formatKPI({
        title: 'Mortality %',
        value: summary.mortality_percentage,
        unit: '%',
        subtitle: 'Of total population',
      }),

      // Row 4: Lice & Operations
      formatKPI({
        title: 'Mature Lice',
        value: summary.mature_lice_average,
        unit: 'per fish',
        subtitle: 'Last 7 days',
        // Note: Alert level displayed via FacilityList table, not in KPI card
      }),
      formatKPI({
        title: 'Movable Lice',
        value: summary.movable_lice_average,
        unit: 'per fish',
        subtitle: 'Last 7 days',
      }),
      formatKPI({
        title: 'Capacity Utilization',
        value: summary.capacity_utilization_percentage,
        unit: '%',
        subtitle: `${summary.total_containers || 'N/A'} containers`,
      }),
    ];
  }, [summary]);

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <section aria-label="Key Performance Indicators">
        <h2 className="text-lg font-semibold mb-4">Strategic KPIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isSummaryLoading || kpis.length === 0 ? (
            // Loading skeletons
            Array.from({ length: 12 }).map((_, i) => (
              <KPICardSkeleton key={`skeleton-${i}`} />
            ))
          ) : (
            // Actual KPI cards
            kpis.map((kpi, index) => (
              <KPICard key={`kpi-${index}`} data={kpi} />
            ))
          )}
        </div>
      </section>

      {/* Facility Overview Table */}
      <section aria-label="Facility Overview">
        <h2 className="text-lg font-semibold mb-4">Facility Overview</h2>
        <FacilityList
          facilities={facilities || []}
          isLoading={isFacilitiesLoading}
        />
      </section>
    </div>
  );
}

