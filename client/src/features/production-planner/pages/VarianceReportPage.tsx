/**
 * Variance Report Page
 * 
 * Displays variance analysis comparing planned vs actual activity execution.
 * Shows summary KPIs, charts by activity type, and time series data.
 * 
 * Phase 3.3 - Operational Scheduling
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  TrendingUp,
  Calendar,
  Fish,
} from 'lucide-react';
import { useVarianceReport } from '../api/api';
import { getActivityTypeOptions } from '../utils/activityHelpers';
import type { VarianceReport as VarianceReportType } from '@/api/generated/models/VarianceReport';

// FCR status thresholds for color coding
const FCR_THRESHOLDS = {
  excellent: 1.2,  // Green: FCR <= 1.2
  acceptable: 1.5, // Yellow: 1.2 < FCR <= 1.5
  // Red: FCR > 1.5
};

function getFCRStatusColor(fcr: number | null): string {
  if (fcr === null) return 'text-muted-foreground';
  if (fcr <= FCR_THRESHOLDS.excellent) return 'text-emerald-600';
  if (fcr <= FCR_THRESHOLDS.acceptable) return 'text-amber-600';
  return 'text-rose-600';
}

function getFCRStatusBgColor(fcr: number | null): string {
  if (fcr === null) return '#94a3b8';  // slate-400
  if (fcr <= FCR_THRESHOLDS.excellent) return '#10b981';  // emerald-500
  if (fcr <= FCR_THRESHOLDS.acceptable) return '#f59e0b';  // amber-500
  return '#ef4444';  // red-500
}

// ============================================================================
// TYPES
// ============================================================================

interface VarianceFilters {
  scenario?: number;
  activityType?: string;
  dueDateAfter?: string;
  dueDateBefore?: string;
  groupBy: 'month' | 'week';
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
}) {
  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-slate-600',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trendLabel && trend && (
              <p className={`text-xs mt-2 ${trendColors[trend]}`}>
                {trendLabel}
              </p>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
  );
}

// ============================================================================
// CHARTS
// ============================================================================

function CompletionByTypeChart({
  data,
}: {
  data: VarianceReportType['by_activity_type'];
}) {
  const chartData = useMemo(
    () =>
      data.map((item) => ({
        name: item.activity_type_display,
        completionRate: item.completion_rate,
        onTimeRate: item.on_time_rate,
        total: item.total_count,
        completed: item.completed_count,
      })),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Completion Rates by Activity Type</CardTitle>
        <CardDescription>
          Percentage of activities completed and on-time for each type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              className="text-xs"
            />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tick={{ fontSize: 11 }}
              className="text-xs"
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name,
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar
              dataKey="completionRate"
              name="Completion Rate"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="onTimeRate"
              name="On-Time Rate"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function TimeSeriesChart({
  data,
  groupBy,
}: {
  data: VarianceReportType['time_series'];
  groupBy: 'month' | 'week';
}) {
  const chartData = useMemo(
    () =>
      data.map((item) => ({
        period: item.period,
        'Completion Rate': item.completion_rate,
        'On-Time Rate': item.on_time_rate,
        totalDue: item.total_due,
        completed: item.completed,
        onTime: item.on_time,
        late: item.late,
      })),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance Over Time</CardTitle>
        <CardDescription>
          Completion and on-time rates by {groupBy === 'month' ? 'month' : 'week'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="period" className="text-xs" tick={{ fontSize: 10 }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              className="text-xs"
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name,
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Completion Rate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="On-Time Rate"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function VarianceDistributionChart({
  data,
}: {
  data: VarianceReportType['by_activity_type'];
}) {
  const chartData = useMemo(() => {
    const totals = data.reduce(
      (acc, item) => {
        acc.early += item.early_count;
        acc.onTime += item.on_time_count;
        acc.late += item.late_count;
        return acc;
      },
      { early: 0, onTime: 0, late: 0 }
    );

    return [
      { name: 'Early', value: totals.early, fill: '#10b981' },
      { name: 'On-Time', value: totals.onTime, fill: '#3b82f6' },
      { name: 'Late', value: totals.late, fill: '#f97316' },
    ];
  }, [data]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Variance Distribution</CardTitle>
        <CardDescription>
          Distribution of completed activities by timing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                name,
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * FCR Metrics Card - Phase 8.5 Feature
 * 
 * Displays FCR reference information and color legend for FCR status.
 * Shows example FCR thresholds used for color coding in the variance report.
 */
function FCRMetricsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Fish className="h-5 w-5" />
          FCR Performance Guide
        </CardTitle>
        <CardDescription>
          Feed Conversion Ratio thresholds for aquaculture operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* FCR Legend */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <div>
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  Excellent
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  FCR ≤ {FCR_THRESHOLDS.excellent}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="w-4 h-4 rounded-full bg-amber-500" />
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-300">
                  Acceptable
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {FCR_THRESHOLDS.excellent} &lt; FCR ≤ {FCR_THRESHOLDS.acceptable}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950 rounded-lg">
              <div className="w-4 h-4 rounded-full bg-rose-500" />
              <div>
                <p className="font-medium text-rose-700 dark:text-rose-300">
                  Needs Attention
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  FCR &gt; {FCR_THRESHOLDS.acceptable}
                </p>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <div className="text-sm text-muted-foreground border-t pt-3">
            <p>
              <strong>FCR (Feed Conversion Ratio)</strong> measures feed efficiency.
              Lower values indicate better conversion of feed to fish biomass.
            </p>
            <p className="mt-1">
              Typical Atlantic salmon FCR: 1.0-1.3 (excellent), 1.3-1.5 (normal).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// FILTERS
// ============================================================================

function VarianceFiltersPanel({
  filters,
  onFiltersChange,
}: {
  filters: VarianceFilters;
  onFiltersChange: (filters: VarianceFilters) => void;
}) {
  const activityTypeOptions = getActivityTypeOptions();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Report Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="activityType">Activity Type</Label>
            <Select
              value={filters.activityType || 'ALL'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  activityType: value === 'ALL' ? undefined : value,
                })
              }
            >
              <SelectTrigger id="activityType">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {activityTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateAfter">Due Date After</Label>
            <Input
              id="dateAfter"
              type="date"
              value={filters.dueDateAfter || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dueDateAfter: e.target.value || undefined,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateBefore">Due Date Before</Label>
            <Input
              id="dateBefore"
              type="date"
              value={filters.dueDateBefore || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dueDateBefore: e.target.value || undefined,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupBy">Group By</Label>
            <Select
              value={filters.groupBy}
              onValueChange={(value: 'month' | 'week') =>
                onFiltersChange({ ...filters, groupBy: value })
              }
            >
              <SelectTrigger id="groupBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() =>
                onFiltersChange({
                  groupBy: 'month',
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VarianceReportPage() {
  const [filters, setFilters] = useState<VarianceFilters>({
    groupBy: 'month',
  });

  const { data, isLoading, error } = useVarianceReport({
    scenario: filters.scenario,
    activityType: filters.activityType as any,
    dueDateAfter: filters.dueDateAfter,
    dueDateBefore: filters.dueDateBefore,
    groupBy: filters.groupBy,
    includeDetails: false,
  });

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <h2 className="font-semibold">Error loading variance report</h2>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/production-planner">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Planner
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Variance Report</h1>
            <p className="text-muted-foreground">
              Comparing planned vs actual activity execution
            </p>
          </div>
        </div>
        {data && (
          <p className="text-xs text-muted-foreground">
            Report generated:{' '}
            {new Date(data.report_generated_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* Filters */}
      <VarianceFiltersPanel filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <LoadingSkeleton />
      ) : data ? (
        <>
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Activities"
              value={data.summary.total_activities}
              subtitle={`${data.summary.completed_activities} completed`}
              icon={Activity}
            />
            <KPICard
              title="Completion Rate"
              value={`${data.summary.overall_completion_rate}%`}
              subtitle={`${data.summary.pending_activities} pending`}
              icon={CheckCircle}
              trend={data.summary.overall_completion_rate >= 80 ? 'up' : 'down'}
              trendLabel={
                data.summary.overall_completion_rate >= 80
                  ? 'On track'
                  : 'Below target'
              }
            />
            <KPICard
              title="On-Time Rate"
              value={`${data.summary.overall_on_time_rate}%`}
              subtitle={`${data.summary.late_activities} late, ${data.summary.early_activities} early`}
              icon={Clock}
              trend={data.summary.overall_on_time_rate >= 70 ? 'up' : 'down'}
              trendLabel={
                data.summary.overall_on_time_rate >= 70
                  ? 'Good timing'
                  : 'Needs improvement'
              }
            />
            <KPICard
              title="Overdue Activities"
              value={data.summary.overdue_activities}
              subtitle={
                data.summary.avg_variance_days !== null
                  ? `Avg variance: ${data.summary.avg_variance_days > 0 ? '+' : ''}${data.summary.avg_variance_days} days`
                  : 'No completed activities'
              }
              icon={AlertTriangle}
              trend={data.summary.overdue_activities === 0 ? 'up' : 'down'}
              trendLabel={
                data.summary.overdue_activities === 0
                  ? 'No overdue items'
                  : 'Action needed'
              }
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.by_activity_type.length > 0 && (
              <CompletionByTypeChart data={data.by_activity_type} />
            )}
            {data.by_activity_type.length > 0 && (
              <VarianceDistributionChart data={data.by_activity_type} />
            )}
          </div>

          {/* Time Series Chart */}
          {data.time_series.length > 0 && (
            <TimeSeriesChart data={data.time_series} groupBy={filters.groupBy} />
          )}

          {/* FCR Performance Guide - Phase 8.5 */}
          <FCRMetricsCard />

          {/* Activity Type Details Table */}
          {data.by_activity_type.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Type Details</CardTitle>
                <CardDescription>
                  Detailed statistics for each activity type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Type</th>
                        <th className="text-right py-2 px-3 font-medium">Total</th>
                        <th className="text-right py-2 px-3 font-medium">Completed</th>
                        <th className="text-right py-2 px-3 font-medium">Pending</th>
                        <th className="text-right py-2 px-3 font-medium">
                          Completion %
                        </th>
                        <th className="text-right py-2 px-3 font-medium">Early</th>
                        <th className="text-right py-2 px-3 font-medium">On-Time</th>
                        <th className="text-right py-2 px-3 font-medium">Late</th>
                        <th className="text-right py-2 px-3 font-medium">
                          On-Time %
                        </th>
                        <th className="text-right py-2 px-3 font-medium">
                          Avg Variance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.by_activity_type.map((item) => (
                        <tr
                          key={item.activity_type}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-2 px-3 font-medium">
                            {item.activity_type_display}
                          </td>
                          <td className="text-right py-2 px-3">
                            {item.total_count}
                          </td>
                          <td className="text-right py-2 px-3">
                            {item.completed_count}
                          </td>
                          <td className="text-right py-2 px-3">
                            {item.pending_count}
                          </td>
                          <td className="text-right py-2 px-3">
                            <span
                              className={
                                item.completion_rate >= 80
                                  ? 'text-emerald-600'
                                  : item.completion_rate >= 50
                                    ? 'text-amber-600'
                                    : 'text-rose-600'
                              }
                            >
                              {item.completion_rate}%
                            </span>
                          </td>
                          <td className="text-right py-2 px-3 text-emerald-600">
                            {item.early_count}
                          </td>
                          <td className="text-right py-2 px-3 text-blue-600">
                            {item.on_time_count}
                          </td>
                          <td className="text-right py-2 px-3 text-orange-600">
                            {item.late_count}
                          </td>
                          <td className="text-right py-2 px-3">
                            <span
                              className={
                                item.on_time_rate >= 70
                                  ? 'text-emerald-600'
                                  : item.on_time_rate >= 40
                                    ? 'text-amber-600'
                                    : 'text-rose-600'
                              }
                            >
                              {item.on_time_rate}%
                            </span>
                          </td>
                          <td className="text-right py-2 px-3">
                            {item.avg_variance_days !== null
                              ? `${item.avg_variance_days > 0 ? '+' : ''}${item.avg_variance_days}`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No variance data available</p>
          <p className="text-sm mt-2">
            Try adjusting your filters or add more planned activities
          </p>
        </div>
      )}
    </div>
  );
}




