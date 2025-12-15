/**
 * StrategicTab Component
 * 
 * Strategic planning tab showing capacity utilization, harvest forecasts,
 * and integration with scenario planning features.
 * 
 * Now includes 3-tier forecast display from Live Forward Projections:
 * - PLANNED (Tier 1): Confirmed PlannedActivity records
 * - PROJECTED (Tier 2): Live projections without plans
 * - NEEDS_PLANNING (Tier 3): Approaching threshold without plan
 * 
 * Issue: Live Forward Projection Feature
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { KPICard } from './KPICard';
import { useExecutiveSummary, useTieredHarvestForecast } from '../api/api';
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
  
  // Fetch tiered harvest forecast from Live Forward Projections
  const { 
    data: harvestForecast, 
    isLoading: forecastLoading,
    error: forecastError,
  } = useTieredHarvestForecast(
    geography === 'global' ? undefined : parseInt(String(geography))
  );

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

      {/* Tiered Harvest Forecast - Live Forward Projections */}
      <section aria-label="Harvest Forecast">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Harvest Forecast
              {forecastLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              Three-tier forecast: Planned activities, live projections, and items needing attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tier Explanation Panel */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tier 1: Planned</p>
                  <p className="text-xs text-muted-foreground">
                    Confirmed PlannedActivity records
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tier 2: Projected</p>
                  <p className="text-xs text-muted-foreground">
                    Live projection without plan
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tier 3: Needs Planning</p>
                  <p className="text-xs text-muted-foreground">
                    Approaching threshold without plan
                  </p>
                </div>
              </div>
            </div>
            
            {/* Summary Counts */}
            {harvestForecast?.summary && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {harvestForecast.summary.planned_count}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">Planned</p>
                </div>
                <div className="text-center p-4 border rounded-lg border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {harvestForecast.summary.projected_count}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-500">Projected</p>
                </div>
                <div className="text-center p-4 border rounded-lg border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    {harvestForecast.summary.needs_attention_count}
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-500">Needs Attention</p>
                </div>
              </div>
            )}
            
            {/* Forecast Error State */}
            {forecastError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Failed to load forecast data. Live projections may not be computed yet.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Forecast Table */}
            {harvestForecast?.forecasts && harvestForecast.forecasts.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {harvestForecast.forecasts.slice(0, 10).map((forecast, index) => (
                  <div
                    key={`forecast-${forecast.batch_id}-${index}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Tier Badge */}
                      <Badge
                        variant={
                          forecast.tier === 'PLANNED' ? 'default' :
                          forecast.tier === 'NEEDS_PLANNING' ? 'destructive' : 'secondary'
                        }
                        className={
                          forecast.tier === 'PLANNED' ? 'bg-green-500 hover:bg-green-600' :
                          forecast.tier === 'NEEDS_PLANNING' ? 'bg-amber-500 hover:bg-amber-600' : ''
                        }
                      >
                        {forecast.tier === 'PLANNED' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {forecast.tier === 'PROJECTED' && <Clock className="h-3 w-3 mr-1" />}
                        {forecast.tier === 'NEEDS_PLANNING' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {forecast.tier.replace('_', ' ')}
                      </Badge>
                      
                      {/* Batch Info */}
                      <div>
                        <p className="font-medium text-sm">{forecast.batch_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {forecast.container_name}
                        </p>
                      </div>
                    </div>
                    
                    {/* Dates and Weight */}
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {forecast.planned_date || forecast.projected_date || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {forecast.days_to_harvest != null && `${forecast.days_to_harvest} days`}
                        {forecast.current_weight_g && ` • ${(forecast.current_weight_g / 1000).toFixed(1)}kg`}
                      </p>
                    </div>
                  </div>
                ))}
                
                {harvestForecast.forecasts.length > 10 && (
                  <p className="text-center text-sm text-muted-foreground py-2">
                    Showing 10 of {harvestForecast.forecasts.length} forecasts
                  </p>
                )}
              </div>
            ) : !forecastLoading && (
              <div className="text-center py-8">
                <Info className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No forecast data available. Live projections may not have been computed yet.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToScenario}
                  className="mt-4 gap-2"
                >
                  <span>Open Scenario Planner</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
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

