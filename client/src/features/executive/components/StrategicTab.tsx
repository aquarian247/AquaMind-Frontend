/**
 * StrategicTab Component
 * 
 * Strategic planning tab showing capacity utilization, harvest forecasts,
 * sea-transfer forecasts, and integration with scenario planning features.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, ExternalLink, TrendingUp, ChevronDown, ChevronUp, Ship, Fish, Calendar } from 'lucide-react';
import { KPICard } from './KPICard';
import { useExecutiveSummary, useHarvestForecast, useSeaTransferForecast } from '../api/api';
import type { 
  GeographyFilterValue, 
  KPIData, 
  CapacityUtilization,
  UpcomingHarvest,
  UpcomingSeaTransfer,
  ConfidenceLevel,
} from '../types';
import { formatKPI } from '../utils/kpiCalculations';
import { Link } from 'wouter';

export interface StrategicTabProps {
  geography: GeographyFilterValue;
  onNavigateToScenario?: () => void;
}

/**
 * Get confidence level based on confidence score
 */
function getConfidenceLevel(confidence: number | null): ConfidenceLevel {
  if (confidence === null) return 'low';
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}

/**
 * Get Tailwind color class for confidence level
 */
function getConfidenceColor(confidence: number | null): string {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high': return 'text-emerald-600 bg-emerald-50';
    case 'medium': return 'text-amber-600 bg-amber-50';
    case 'low': return 'text-rose-600 bg-rose-50';
  }
}

/**
 * Format days until event with friendly text
 */
function formatDaysUntil(days: number | null): string {
  if (days === null) return 'Unknown';
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days} days`;
  if (days <= 30) return `${Math.round(days / 7)} weeks`;
  return `${Math.round(days / 30)} months`;
}

/**
 * Forecast Summary Card Component
 */
interface ForecastSummaryCardProps {
  title: string;
  icon: React.ReactNode;
  totalCount: number;
  readyCount: number;
  avgDays: number | null;
  extraMetric?: {
    label: string;
    value: string;
  };
  isLoading: boolean;
}

function ForecastSummaryCard({ 
  title, 
  icon, 
  totalCount, 
  readyCount, 
  avgDays,
  extraMetric,
  isLoading 
}: ForecastSummaryCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-20 mb-2" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            {icon}
          </div>
          <h3 className="font-semibold text-slate-700">{title}</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-3xl font-bold text-slate-900">{totalCount}</div>
            <div className="text-sm text-slate-500">Total batches tracked</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg font-semibold text-emerald-600">{readyCount}</div>
              <div className="text-xs text-slate-500">Ready now</div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-lg font-semibold text-slate-700">
                {avgDays !== null ? `${Math.round(avgDays)}d` : 'N/A'}
              </div>
              <div className="text-xs text-slate-500">Avg. time</div>
            </div>
            {extraMetric && (
              <>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <div className="text-lg font-semibold text-slate-700">{extraMetric.value}</div>
                  <div className="text-xs text-slate-500">{extraMetric.label}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Harvest Table Component
 */
interface HarvestTableProps {
  harvests: UpcomingHarvest[];
  isLoading: boolean;
  maxRows?: number;
}

function HarvestTable({ harvests, isLoading, maxRows = 5 }: HarvestTableProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const displayedHarvests = isExpanded ? harvests : harvests.slice(0, maxRows);
  const hasMore = harvests.length > maxRows;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (harvests.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Fish className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No batches approaching harvest weight</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-600">Batch</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Species</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Facility</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600">Weight (g)</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600">Target</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Harvest Date</th>
              <th className="text-center py-2 px-3 font-medium text-slate-600">Confidence</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedHarvests.map((harvest) => (
              <tr 
                key={harvest.batch_id} 
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-3">
                  <Link href={`/batch-details/${harvest.batch_id}`}>
                    <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                      {harvest.batch_number}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-3 text-slate-600">{harvest.species}</td>
                <td className="py-3 px-3 text-slate-600">{harvest.facility}</td>
                <td className="py-3 px-3 text-right font-mono text-slate-700">
                  {harvest.current_weight_g?.toLocaleString() ?? 'N/A'}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-500">
                  {harvest.target_weight_g.toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700">
                      {harvest.projected_harvest_date 
                        ? new Date(harvest.projected_harvest_date).toLocaleDateString()
                        : 'TBD'}
                    </span>
                    <span className="text-slate-400 text-xs">
                      ({formatDaysUntil(harvest.days_until_harvest)})
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex justify-center">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getConfidenceColor(harvest.confidence)}`}
                    >
                      {harvest.confidence !== null 
                        ? `${Math.round(harvest.confidence * 100)}%`
                        : 'N/A'}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-3">
                  {harvest.planned_activity_status && (
                    <Badge variant="outline" className="text-xs">
                      {harvest.planned_activity_status}
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1"
          >
            {isExpanded ? (
              <>Show less <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Show all {harvests.length} batches <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Sea-Transfer Table Component
 */
interface SeaTransferTableProps {
  transfers: UpcomingSeaTransfer[];
  isLoading: boolean;
  maxRows?: number;
}

function SeaTransferTable({ transfers, isLoading, maxRows = 5 }: SeaTransferTableProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const displayedTransfers = isExpanded ? transfers : transfers.slice(0, maxRows);
  const hasMore = transfers.length > maxRows;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Ship className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No batches approaching sea-transfer</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-600">Batch</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Current Stage</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Current Facility</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600">Weight (g)</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600">Target</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Transfer Date</th>
              <th className="text-center py-2 px-3 font-medium text-slate-600">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransfers.map((transfer) => (
              <tr 
                key={transfer.batch_id} 
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-3">
                  <Link href={`/batch-details/${transfer.batch_id}`}>
                    <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                      {transfer.batch_number}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-600">{transfer.current_stage}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-emerald-600 font-medium">{transfer.target_stage}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {transfer.current_facility}
                  {transfer.target_facility && (
                    <span className="text-slate-400 text-xs ml-1">
                      → {transfer.target_facility}
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-700">
                  {transfer.current_weight_g?.toLocaleString() ?? 'N/A'}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-500">
                  {transfer.target_weight_g.toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700">
                      {transfer.projected_transfer_date 
                        ? new Date(transfer.projected_transfer_date).toLocaleDateString()
                        : 'TBD'}
                    </span>
                    <span className="text-slate-400 text-xs">
                      ({formatDaysUntil(transfer.days_until_transfer)})
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex justify-center">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getConfidenceColor(transfer.confidence)}`}
                    >
                      {transfer.confidence !== null 
                        ? `${Math.round(transfer.confidence * 100)}%`
                        : 'N/A'}
                    </Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1"
          >
            {isExpanded ? (
              <>Show less <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Show all {transfers.length} batches <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * StrategicTab Component
 * 
 * Displays capacity utilization, harvest forecasts, sea-transfer forecasts,
 * and scenario planning integration.
 */
export function StrategicTab({ geography, onNavigateToScenario }: StrategicTabProps) {
  const { data: summary } = useExecutiveSummary(geography);
  const { data: harvestForecast, isLoading: harvestLoading } = useHarvestForecast(geography);
  const { data: seaTransferForecast, isLoading: transferLoading } = useSeaTransferForecast(geography);

  // Capacity Utilization KPIs
  const capacityKPIs: KPIData[] = React.useMemo(() => {
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
      utilization_percentage: null,
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

      {/* Forecast Summary Cards */}
      <section aria-label="Forecast Summary">
        <h2 className="text-lg font-semibold mb-4">Production Forecasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ForecastSummaryCard
            title="Harvest Forecast"
            icon={<TrendingUp className="h-5 w-5" />}
            totalCount={harvestForecast?.summary.total_batches ?? 0}
            readyCount={harvestForecast?.summary.harvest_ready_count ?? 0}
            avgDays={harvestForecast?.summary.avg_days_to_harvest ?? null}
            extraMetric={{
              label: 'Biomass',
              value: harvestForecast?.summary.total_projected_biomass_tonnes 
                ? `${harvestForecast.summary.total_projected_biomass_tonnes.toFixed(1)}t`
                : 'N/A'
            }}
            isLoading={harvestLoading}
          />
          <ForecastSummaryCard
            title="Sea-Transfer Forecast"
            icon={<Ship className="h-5 w-5" />}
            totalCount={seaTransferForecast?.summary.total_freshwater_batches ?? 0}
            readyCount={seaTransferForecast?.summary.transfer_ready_count ?? 0}
            avgDays={seaTransferForecast?.summary.avg_days_to_transfer ?? null}
            isLoading={transferLoading}
          />
        </div>
      </section>

      {/* Upcoming Harvests Table */}
      <section aria-label="Upcoming Harvests">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5 text-slate-600" />
              Upcoming Harvests
            </CardTitle>
            <CardDescription>
              Batches approaching harvest weight, sorted by projected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HarvestTable 
              harvests={harvestForecast?.upcoming ?? []} 
              isLoading={harvestLoading}
            />
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Sea-Transfers Table */}
      <section aria-label="Upcoming Sea-Transfers">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-slate-600" />
              Upcoming Sea-Transfers
            </CardTitle>
            <CardDescription>
              Freshwater batches approaching smolt stage for sea cage transfer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeaTransferTable 
              transfers={seaTransferForecast?.upcoming ?? []} 
              isLoading={transferLoading}
            />
          </CardContent>
        </Card>
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

      {/* Scenario Planning Integration */}
      <section aria-label="Scenario Planning">
        <Card>
          <CardHeader>
            <CardTitle>Scenario Planning</CardTitle>
            <CardDescription>
              Create detailed projections using the Scenario Planner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 mb-4">
                Access the full Scenario Planner for detailed what-if analysis, 
                growth projections, and harvest optimization.
              </p>
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
    </div>
  );
}
