/**
 * StrategicTab Component
 * 
 * Strategic planning tab showing capacity utilization, harvest forecasts,
 * and integration with scenario planning features.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ExternalLink } from 'lucide-react';
import { KPICard } from './KPICard';
import { useExecutiveSummary } from '../api/api';
import type { GeographyFilterValue, KPIData, CapacityUtilization } from '../types';
import { formatKPI } from '../utils/kpiCalculations';

export interface StrategicTabProps {
  geography: GeographyFilterValue;
  onNavigateToScenario?: () => void;
}

/**
 * StrategicTab Component
 * 
 * Displays capacity utilization, harvest forecasts, and scenario planning integration.
 * 
 * @example
 * ```tsx
 * <StrategicTab
 *   geography="global"
 *   onNavigateToScenario={() => navigate('/scenario-planning')}
 * />
 * ```
 */
export function StrategicTab({ geography, onNavigateToScenario }: StrategicTabProps) {
  const { data: summary } = useExecutiveSummary(geography);

  // Capacity Utilization KPIs
  const capacityKPIs: KPIData[] = React.useMemo(() => {
    // Return empty array if no data
    if (!summary) {
      return [];
    }

    return [
      formatKPI({
        title: 'Overall Capacity',
        value: summary.capacity_utilization_percentage,
        unit: '%',
        subtitle: `${summary.total_containers || 'N/A'} total containers`,
      }),
      formatKPI({
        title: 'Active Batches',
        value: summary.active_batches,
        unit: 'batches',
        subtitle: 'Currently in production',
        decimalPlaces: 0,
      }),
      formatKPI({
        title: 'Total Biomass',
        value: summary.total_biomass_kg,
        unit: 'kg',
        subtitle: 'Production capacity used',
      }),
    ];
  }, [summary]);

  // Mock capacity breakdown by facility type (placeholder until endpoint available)
  const capacityBreakdown: CapacityUtilization[] = [
    {
      facility_type: 'sea_farms',
      utilization_percentage: null, // Will come from API
      total_capacity: null,
      used_capacity: null,
    },
    {
      facility_type: 'freshwater_stations',
      utilization_percentage: null,
      total_capacity: null,
      used_capacity: null,
    },
    {
      facility_type: 'hatcheries',
      utilization_percentage: null,
      total_capacity: null,
      used_capacity: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Capacity Utilization KPIs */}
      <section aria-label="Capacity Utilization">
        <h2 className="text-lg font-semibold mb-4">Capacity Utilization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {capacityKPIs.length === 0 ? (
            <div className="col-span-3 text-center text-muted-foreground py-4">
              Capacity data loading...
            </div>
          ) : (
            capacityKPIs.map((kpi, index) => (
              <KPICard key={`capacity-kpi-${index}`} data={kpi} />
            ))
          )}
        </div>
      </section>

      {/* Capacity by Facility Type (Placeholder) */}
      <section aria-label="Capacity by Facility Type">
        <Card>
          <CardHeader>
            <CardTitle>Capacity by Facility Type</CardTitle>
            <CardDescription>Utilization across sea farms, freshwater stations, and hatcheries</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Detailed capacity breakdown by facility type coming soon.
                Currently showing overall capacity metrics above.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {capacityBreakdown.map((item) => (
                <div
                  key={item.facility_type}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="font-medium">
                    {item.facility_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    N/A
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Harvest Forecast (Placeholder) */}
      <section aria-label="Harvest Forecast">
        <Card>
          <CardHeader>
            <CardTitle>Harvest Forecast</CardTitle>
            <CardDescription>Projected harvest volumes for next 30, 60, 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Harvest forecasts can be generated using the Scenario Planning tool.
                Click below to access detailed projections.
              </AlertDescription>
            </Alert>

            <div className="text-center py-8">
              <Button
                variant="outline"
                size="lg"
                onClick={onNavigateToScenario}
                className="gap-2"
              >
                <span>Open Scenario Planner</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Market Timing (Placeholder) */}
      <section aria-label="Market Timing">
        <Card>
          <CardHeader>
            <CardTitle>Market Timing Indicators</CardTitle>
            <CardDescription>Optimal harvest timing based on market conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Info className="h-6 w-6 mx-auto text-muted-foreground/50" />
                <p className="text-sm">Market timing analysis coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

