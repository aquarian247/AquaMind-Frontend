/**
 * StrategicTab Component
 * 
 * Strategic planning tab showing capacity utilization, harvest forecasts,
 * and integration with scenario planning features.
 * 
 * Now includes Live Forward Projection tiered forecast display.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, ExternalLink, Calendar, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { KPICard } from './KPICard';
import { useExecutiveSummary, useTieredHarvestForecast, type TieredHarvestForecast } from '../api/api';
import type { GeographyFilterValue, KPIData, CapacityUtilization } from '../types';
import { formatKPI } from '../utils/kpiCalculations';

export interface StrategicTabProps {
  geography: GeographyFilterValue;
}

/**
 * StrategicTab Component
 * 
 * Displays capacity utilization, harvest forecasts, and scenario planning integration.
 * 
 * @example
 * ```tsx
 * <StrategicTab geography="global" />
 * ```
 */
export function StrategicTab({ geography }: StrategicTabProps) {
  const { data: summary } = useExecutiveSummary(geography);
  const { data: forecasts, isLoading: forecastsLoading } = useTieredHarvestForecast(geography, 90);

  // Group forecasts by tier
  const forecastsByTier = React.useMemo(() => {
    if (!forecasts) return { PLANNED: [], PROJECTED: [], NEEDS_PLANNING: [] };
    
    return {
      PLANNED: forecasts.filter(f => f.tier === 'PLANNED'),
      PROJECTED: forecasts.filter(f => f.tier === 'PROJECTED'),
      NEEDS_PLANNING: forecasts.filter(f => f.tier === 'NEEDS_PLANNING'),
    };
  }, [forecasts]);

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

      {/* Harvest Forecast - Tiered Display */}
      <section aria-label="Harvest Forecast">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Harvest Forecast</CardTitle>
                <CardDescription>Live forward projections for next 90 days</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>90-day horizon</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {forecastsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading forecasts...</span>
              </div>
            ) : forecasts && forecasts.length > 0 ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">
                    All ({forecasts.length})
                  </TabsTrigger>
                  <TabsTrigger value="planned" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Planned ({forecastsByTier.PLANNED.length})
                  </TabsTrigger>
                  <TabsTrigger value="projected" className="text-blue-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Projected ({forecastsByTier.PROJECTED.length})
                  </TabsTrigger>
                  <TabsTrigger value="needs_planning" className="text-amber-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Needs Plan ({forecastsByTier.NEEDS_PLANNING.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <ForecastTable forecasts={forecasts} />
                </TabsContent>
                <TabsContent value="planned">
                  <ForecastTable forecasts={forecastsByTier.PLANNED} tier="PLANNED" />
                </TabsContent>
                <TabsContent value="projected">
                  <ForecastTable forecasts={forecastsByTier.PROJECTED} tier="PROJECTED" />
                </TabsContent>
                <TabsContent value="needs_planning">
                  <ForecastTable forecasts={forecastsByTier.NEEDS_PLANNING} tier="NEEDS_PLANNING" />
                </TabsContent>
              </Tabs>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  No harvest forecasts available. Live forward projections are computed nightly
                  for batches with active assignments.
                </AlertDescription>
              </Alert>
            )}
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

/**
 * ForecastTable Component
 * 
 * Displays a table of harvest forecasts with tier-specific styling.
 */
interface ForecastTableProps {
  forecasts: TieredHarvestForecast[];
  tier?: 'PLANNED' | 'PROJECTED' | 'NEEDS_PLANNING';
}

function ForecastTable({ forecasts, tier }: ForecastTableProps) {
  if (forecasts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No forecasts in this category</p>
      </div>
    );
  }

  const getTierBadge = (itemTier: string) => {
    switch (itemTier) {
      case 'PLANNED':
        return <Badge variant="default" className="bg-green-600">Planned</Badge>;
      case 'PROJECTED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Projected</Badge>;
      case 'NEEDS_PLANNING':
        return <Badge variant="destructive" className="bg-amber-100 text-amber-800">Needs Plan</Badge>;
      default:
        return <Badge variant="outline">{itemTier}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium">Batch</th>
            {!tier && <th className="text-left p-2 font-medium">Status</th>}
            <th className="text-right p-2 font-medium">Weight</th>
            <th className="text-left p-2 font-medium">Harvest Date</th>
            <th className="text-right p-2 font-medium">Days</th>
            <th className="text-right p-2 font-medium">Variance</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.slice(0, 20).map((forecast, index) => (
            <tr key={`${forecast.batch_id}-${forecast.container_id}-${index}`} className="border-b hover:bg-muted/50">
              <td className="p-2">
                <div className="font-medium">{forecast.batch_number}</div>
                {forecast.container_name && (
                  <div className="text-xs text-muted-foreground">{forecast.container_name}</div>
                )}
              </td>
              {!tier && <td className="p-2">{getTierBadge(forecast.tier)}</td>}
              <td className="text-right p-2">
                {forecast.current_weight_g 
                  ? `${(forecast.current_weight_g / 1000).toFixed(2)} kg`
                  : '—'}
              </td>
              <td className="p-2">
                {forecast.planned_date || forecast.projected_date || '—'}
              </td>
              <td className="text-right p-2">
                {forecast.days_to_harvest != null ? forecast.days_to_harvest : '—'}
              </td>
              <td className="text-right p-2">
                {forecast.variance_days != null ? (
                  <span className={forecast.variance_days > 0 ? 'text-red-600' : 'text-green-600'}>
                    {forecast.variance_days > 0 ? '+' : ''}{forecast.variance_days}d
                  </span>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {forecasts.length > 20 && (
        <div className="text-center py-2 text-sm text-muted-foreground">
          Showing 20 of {forecasts.length} forecasts
        </div>
      )}
    </div>
  );
}
