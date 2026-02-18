import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { eachDayOfInterval, format, subDays } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ApiService } from "@/api/generated";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, Skull, Utensils, Thermometer, HeartPulse } from "lucide-react";
import { formatFallback } from "@/lib/formatFallback";

type ScopeMode = "batch" | "container" | "lineage";

interface ContainerInsightSelection {
  assignmentId?: number;
  containerId?: number;
  containerName?: string;
}

interface BatchContainerInsightsViewProps {
  batchId: number;
  batchName: string;
  initialSelection?: ContainerInsightSelection | null;
}

interface AssignmentOption {
  assignmentId: number;
  containerId: number;
  containerName: string;
}

interface InsightsMetric {
  key: string;
  label: string;
  unit: string;
}

interface InsightsHealthFactor {
  key: string;
  label: string;
  parameter_id: number;
  min_score: number;
  max_score: number;
}

interface InsightsRowApi {
  date: string;
  mortality: number;
  feed_kg: number;
  environmental: Record<string, number | null | undefined>;
  health_factors: Record<string, number | null | undefined>;
}

interface InsightsResponse {
  batch_id: number;
  batch_number: string;
  scope: ScopeMode;
  container_id: number | null;
  assignment_id: number | null;
  date_range: {
    start_date: string;
    end_date: string;
  };
  lineage_summary?: {
    anchor_assignment_id: number;
    assignment_count: number;
    container_count: number;
    max_depth: number;
    root_assignment_ids: number[];
    earliest_assignment_date: string | null;
    latest_activity_date: string | null;
    assignments: Array<{
      assignment_id: number;
      container_id: number;
      assignment_date: string | null;
      departure_date: string | null;
    }>;
  } | null;
  environmental_metrics: InsightsMetric[];
  health_factors: InsightsHealthFactor[];
  rows: InsightsRowApi[];
}

interface ChartRow {
  date: string;
  label: string;
  mortality: number;
  feedKg: number;
  environmental: Record<string, number | null>;
  healthFactors: Record<string, number | null>;
}

const PERIOD_OPTIONS = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "180", label: "Last 180 days" },
];

const ENV_COLORS: Record<string, string> = {
  temperature: "#f97316",
  o2: "#2563eb",
  co2: "#334155",
  no2: "#9333ea",
  no3: "#a855f7",
  ph: "#14b8a6",
  salinity: "#0f766e",
};

const HEALTH_COLORS = ["#f59e0b", "#dc2626", "#0f766e", "#2563eb", "#7c3aed", "#db2777", "#16a34a"];

async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<{ results?: T[]; next?: string | null }>,
  maxPages = 80,
): Promise<T[]> {
  let page = 1;
  const all: T[] = [];
  let hasMore = true;

  while (hasMore && page <= maxPages) {
    const response = await fetchPage(page);
    all.push(...(response.results || []));
    hasMore = !!response.next;
    page += 1;
  }

  return all;
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function BatchContainerInsightsView({
  batchId,
  batchName,
  initialSelection,
}: BatchContainerInsightsViewProps) {
  const [scope, setScope] = useState<ScopeMode>(initialSelection?.containerId ? "container" : "batch");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | undefined>(initialSelection?.assignmentId);
  const [periodDays, setPeriodDays] = useState("90");

  const endDate = useMemo(() => new Date(), [periodDays]);
  const startDate = useMemo(() => subDays(endDate, Number(periodDays) - 1), [endDate, periodDays]);

  const startDateStr = useMemo(() => format(startDate, "yyyy-MM-dd"), [startDate]);
  const endDateStr = useMemo(() => format(endDate, "yyyy-MM-dd"), [endDate]);

  const shouldLoadAssignments =
    scope !== "batch" || !!initialSelection?.containerId || !!initialSelection?.assignmentId;

  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ["batch", "container-insights", "assignments", batchId],
    queryFn: async () => {
      const rows = await fetchAllPages<any>(async (page) =>
        ApiService.apiV1BatchContainerAssignmentsList(
          undefined,
          undefined,
          undefined,
          batchId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          true,
          undefined,
          undefined,
          page,
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      );

      return rows
        .map((row) => {
          const containerId = row.container?.id || row.container_id || row.container;
          const containerName = row.container?.name || row.container_name || `Container ${containerId ?? "Unknown"}`;
          if (!containerId) return null;
          return {
            assignmentId: row.id,
            containerId: Number(containerId),
            containerName,
          } as AssignmentOption;
        })
        .filter(Boolean) as AssignmentOption[];
    },
    enabled: !!batchId && shouldLoadAssignments,
    staleTime: 60_000,
  });

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.assignmentId === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

  useEffect(() => {
    if (!initialSelection) return;
    if (initialSelection.containerId) setScope("container");
    if (initialSelection.assignmentId) {
      setSelectedAssignmentId(initialSelection.assignmentId);
      return;
    }
    if (initialSelection.containerId && assignments.length > 0) {
      const byContainer = assignments.find((assignment) => assignment.containerId === initialSelection.containerId);
      if (byContainer) setSelectedAssignmentId(byContainer.assignmentId);
    }
  }, [initialSelection?.assignmentId, initialSelection?.containerId, assignments]);

  useEffect(() => {
    if (scope === "batch") return;
    if (selectedAssignmentId && assignments.some((assignment) => assignment.assignmentId === selectedAssignmentId)) return;
    if (assignments.length > 0) {
      setSelectedAssignmentId(assignments[0].assignmentId);
    }
  }, [scope, assignments, selectedAssignmentId]);

  const selectedContainerId = selectedAssignment?.containerId;

  const { data: insights, isLoading: insightsLoading, error: insightsError } = useQuery({
    queryKey: [
      "batch",
      "container-insights",
      "timeseries",
      batchId,
      scope,
      selectedContainerId,
      startDateStr,
      endDateStr,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        start_date: startDateStr,
        end_date: endDateStr,
        scope,
      });
      if ((scope === "container" || scope === "lineage") && selectedContainerId) {
        params.set("container_id", String(selectedContainerId));
      }
      if (scope === "lineage" && selectedAssignmentId) {
        params.set("assignment_id", String(selectedAssignmentId));
      }

      const response = await apiRequest(
        "GET",
        `/api/v1/batch/batches/${batchId}/insights-timeseries/?${params.toString()}`,
      );
      return (await response.json()) as InsightsResponse;
    },
    enabled: !!batchId && (scope === "batch" || !!selectedAssignmentId),
    staleTime: 30_000,
  });

  const environmentalMetrics = insights?.environmental_metrics || [];
  const healthFactors = insights?.health_factors || [];

  const chartData = useMemo<ChartRow[]>(() => {
    const envKeys = environmentalMetrics.map((metric) => metric.key);
    const healthKeys = healthFactors.map((factor) => factor.key);

    const baseRows = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const environmental: Record<string, number | null> = {};
      const health: Record<string, number | null> = {};
      envKeys.forEach((key) => {
        environmental[key] = null;
      });
      healthKeys.forEach((key) => {
        health[key] = null;
      });

      return {
        date: dateKey,
        label: format(date, "MMM d"),
        mortality: 0,
        feedKg: 0,
        environmental,
        healthFactors: health,
      };
    });

    const rowMap = new Map<string, ChartRow>();
    baseRows.forEach((row) => rowMap.set(row.date, row));

    (insights?.rows || []).forEach((row) => {
      const target = rowMap.get(row.date);
      if (!target) return;
      target.mortality = toNumber(row.mortality);
      target.feedKg = toNumber(row.feed_kg);

      envKeys.forEach((key) => {
        target.environmental[key] = toNullableNumber(row.environmental?.[key]);
      });
      healthKeys.forEach((key) => {
        target.healthFactors[key] = toNullableNumber(row.health_factors?.[key]);
      });
    });

    return baseRows;
  }, [startDate, endDate, environmentalMetrics, healthFactors, insights?.rows]);

  const hasEnvironmentalData = useMemo(() => {
    return environmentalMetrics.some((metric) =>
      chartData.some((row) => row.environmental[metric.key] !== null),
    );
  }, [environmentalMetrics, chartData]);

  const hasHealthData = useMemo(() => {
    return healthFactors.some((factor) =>
      chartData.some((row) => row.healthFactors[factor.key] !== null),
    );
  }, [healthFactors, chartData]);

  const healthDomain = useMemo<[number, number]>(() => {
    if (healthFactors.length === 0) return [0, 4];
    const min = Math.min(...healthFactors.map((factor) => factor.min_score ?? 0));
    const max = Math.max(...healthFactors.map((factor) => factor.max_score ?? 4));
    return [min, max];
  }, [healthFactors]);

  const totals = useMemo(() => {
    const mortalityTotal = chartData.reduce((sum, row) => sum + row.mortality, 0);
    const feedTotal = chartData.reduce((sum, row) => sum + row.feedKg, 0);

    const temperatureValues = chartData
      .map((row) => row.environmental.temperature)
      .filter((value): value is number => value !== null);
    const avgTemp = temperatureValues.length
      ? temperatureValues.reduce((sum, value) => sum + value, 0) / temperatureValues.length
      : null;

    const healthValues: number[] = [];
    chartData.forEach((row) => {
      healthFactors.forEach((factor) => {
        const value = row.healthFactors[factor.key];
        if (value !== null) healthValues.push(value);
      });
    });
    const avgHealth = healthValues.length
      ? healthValues.reduce((sum, value) => sum + value, 0) / healthValues.length
      : null;

    return { mortalityTotal, feedTotal, avgTemp, avgHealth };
  }, [chartData, healthFactors]);

  const isLoading = insightsLoading || (scope !== "batch" && assignmentsLoading);

  if (scope !== "batch" && assignments.length === 0 && !assignmentsLoading) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          No active container assignments found for this batch.
        </CardContent>
      </Card>
    );
  }

  if (insightsError) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          Failed to load container insights.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Container Insights for {batchName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Correlate environment, mortality, feeding, and health factor changes over time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={scope} onValueChange={(value) => setScope(value as ScopeMode)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="batch">Entire Batch</SelectItem>
              <SelectItem value="container">Single Container</SelectItem>
              <SelectItem value="lineage">Container Lineage</SelectItem>
            </SelectContent>
          </Select>

          {scope !== "batch" && (
            <Select
              value={selectedAssignmentId ? String(selectedAssignmentId) : ""}
              onValueChange={(value) => setSelectedAssignmentId(Number(value))}
            >
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Select container" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.assignmentId} value={String(assignment.assignmentId)}>
                    {assignment.containerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={periodDays} onValueChange={setPeriodDays}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          Scope:{" "}
          {scope === "batch"
            ? "Entire Batch"
            : scope === "lineage"
            ? `Lineage of ${selectedAssignment?.containerName || initialSelection?.containerName || "Container"}`
            : selectedAssignment?.containerName || initialSelection?.containerName || "Container"}
        </Badge>
        <Badge variant="outline">
          Window: {startDateStr} to {endDateStr}
        </Badge>
        {scope === "lineage" && insights?.lineage_summary && (
          <Badge variant="outline">
            Lineage: {insights.lineage_summary.assignment_count} assignments, {insights.lineage_summary.container_count} containers
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Skull className="h-4 w-4 text-red-500" />
              Mortality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.mortalityTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total fish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Utensils className="h-4 w-4 text-green-500" />
              Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.feedTotal.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">Total feed issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.avgTemp !== null ? `${totals.avgTemp.toFixed(1)} C` : formatFallback(null)}
            </div>
            <p className="text-xs text-muted-foreground">Daily mean</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-blue-500" />
              Health Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totals.avgHealth !== null ? totals.avgHealth.toFixed(2) : formatFallback(null)}
            </div>
            <p className="text-xs text-muted-foreground">Average sampled factor score</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            Loading container insights...
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Mortality</CardTitle>
              <CardDescription>Mortality events by day.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" minTickGap={18} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="mortality" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Feed</CardTitle>
              <CardDescription>Feed amounts by day.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" minTickGap={18} />
                  <YAxis unit="kg" />
                  <Tooltip />
                  <Bar dataKey="feedKg" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {hasEnvironmentalData ? (
            environmentalMetrics.map((metric) => (
              <Card key={metric.key}>
                <CardHeader>
                  <CardTitle className="text-base">{metric.label} Trend</CardTitle>
                  <CardDescription>
                    Average daily {metric.label.toLowerCase()} readings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" minTickGap={18} />
                      <YAxis unit={metric.unit || undefined} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey={(row: ChartRow) => row.environmental[metric.key]}
                        stroke={ENV_COLORS[metric.key] || "#1d4ed8"}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                        name={metric.label}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Environmental Trends</CardTitle>
                <CardDescription>No environmental readings in this window.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {hasHealthData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Scores</CardTitle>
                <CardDescription>Point graph of sampled health factors over time.</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" minTickGap={18} />
                    <YAxis domain={healthDomain} />
                    <Tooltip />
                    <Legend />
                    {healthFactors.map((factor, index) => (
                      <Line
                        key={factor.key}
                        type="monotone"
                        dataKey={(row: ChartRow) => row.healthFactors[factor.key]}
                        name={factor.label}
                        stroke={HEALTH_COLORS[index % HEALTH_COLORS.length]}
                        strokeWidth={0}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4 }}
                        connectNulls={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Scores</CardTitle>
                <CardDescription>No health factor observations in this window.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
