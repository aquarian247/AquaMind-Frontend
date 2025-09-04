import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import {
  TrendingUp,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ConfidenceLevel } from "./FCRSummaryCard";

export interface FCRDataPoint {
  period_start: string;
  period_end: string;
  actual_fcr: number | null;
  confidence: ConfidenceLevel;
  predicted_fcr: number | null;
  deviation: number | null;
  scenarios_used: number;
  container_name?: string | null;
  assignment_id?: number | null;
  container_count?: number | null;
  total_containers?: number | null;
}

interface FCRTrendChartProps {
  data: FCRDataPoint[];
  title?: string;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  className?: string;
  showConfidenceIndicators?: boolean;
}

const chartConfig = {
  actual_fcr: {
    label: "Actual FCR",
    color: "#3b82f6",
  },
  predicted_fcr: {
    label: "Predicted FCR",
    color: "#f59e0b",
  },
  deviation: {
    label: "Deviation",
    color: "#ef4444",
  },
};

const confidenceColors: Record<string, string> = {
  VERY_HIGH: "#22c55e",
  HIGH: "#3b82f6",
  MEDIUM: "#f59e0b",
  LOW: "#ef4444"
};

const confidenceIcons: Record<string, React.ComponentType<any>> = {
  VERY_HIGH: CheckCircle,
  HIGH: CheckCircle,
  MEDIUM: AlertTriangle,
  LOW: AlertTriangle
};

export function FCRTrendChart({
  data,
  title = "FCR Trends",
  isLoading = false,
  error = null,
  onRefresh,
  className,
  showConfidenceIndicators = true
}: FCRTrendChartProps) {
  const [timeframe, setTimeframe] = useState("90");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();

  // Process data for chart
  const processedData = data.map(point => ({
    ...point,
    date: new Date(point.period_start).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    fullDate: point.period_start,
    confidenceColor: confidenceColors[point.confidence],
    hasData: point.actual_fcr !== null || point.predicted_fcr !== null
  }));

  // Filter data based on timeframe
  const daysAgo = parseInt(timeframe);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

  const filteredData = processedData.filter(point =>
    new Date(point.period_start) >= cutoffDate
  );

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    const ConfidenceIcon = confidenceIcons[data.confidence];

    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium mb-2">
          {new Date(data.period_start).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>

        <div className="space-y-2">
          {data.actual_fcr !== null && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: confidenceColors[data.confidence] }}
                />
                <span className="text-sm">Actual FCR</span>
              </div>
              <span className="font-medium">{data.actual_fcr.toFixed(2)}</span>
            </div>
          )}

          {data.predicted_fcr !== null && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chartConfig.predicted_fcr.color }}
                />
                <span className="text-sm">Predicted FCR</span>
              </div>
              <span className="font-medium">{data.predicted_fcr.toFixed(2)}</span>
            </div>
          )}

          {data.deviation !== null && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Deviation</span>
              <span className={cn(
                "font-medium",
                data.deviation > 0.1 ? "text-red-600" :
                data.deviation < -0.1 ? "text-green-600" : "text-gray-600"
              )}>
                {data.deviation > 0 ? '+' : ''}{data.deviation.toFixed(2)}
              </span>
            </div>
          )}

          {showConfidenceIndicators && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <ConfidenceIcon
                className={cn(
                  "h-3 w-3",
                  data.confidence === 'VERY_HIGH' || data.confidence === 'HIGH'
                    ? "text-green-600" : "text-orange-600"
                )}
              />
              <span className="text-xs text-muted-foreground">
                {data.confidence.replace('_', ' ').toLowerCase()} confidence
              </span>
            </div>
          )}

          {data.container_name && (
            <div className="text-xs text-muted-foreground pt-1 border-t">
              Container: {data.container_name}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading FCR Data</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            {onRefresh && (
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && filteredData.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p>Loading FCR trend data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredData.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No FCR Data Available</h3>
            <p className="text-muted-foreground text-center">
              FCR trends will appear here once feeding and growth data is available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            {title}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="180">Last 6 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>

            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", (isLoading || isRefreshing) && "animate-spin")} />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
                {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: isMobile ? 10 : 30,
              left: isMobile ? 10 : 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              interval={isMobile ? 2 : 0} // Show fewer ticks on mobile
            />
            <YAxis
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
              width={isMobile ? 40 : 60}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Predicted FCR Line */}
            <Line
              type="monotone"
              dataKey="predicted_fcr"
              stroke={chartConfig.predicted_fcr.color}
              strokeWidth={isMobile ? 1.5 : 2}
              strokeDasharray="5 5"
              dot={{
                fill: chartConfig.predicted_fcr.color,
                strokeWidth: 2,
                r: isMobile ? 3 : 4
              }}
              connectNulls={false}
            />

            {/* Actual FCR Line with confidence-based coloring */}
            <Line
              type="monotone"
              dataKey="actual_fcr"
              stroke="#3b82f6"
              strokeWidth={isMobile ? 2 : 3}
              dot={(props: any) => {
                const { payload } = props;
                if (!payload) return <></>;

                return (
                  <circle
                    r={isMobile ? 4 : 5}
                    fill={payload.confidenceColor}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.actual_fcr.color }} />
              <span>Actual FCR</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: chartConfig.predicted_fcr.color }} />
              <span>Predicted FCR</span>
            </div>
            {showConfidenceIndicators && (
              <div className="flex items-center gap-3 ml-4">
                <span className="text-muted-foreground">Confidence:</span>
                <div className="flex gap-1">
                  {Object.entries(confidenceColors).map(([level, color]) => {
                    const Icon = confidenceIcons[level as ConfidenceLevel];
                    return (
                      <div key={level} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <Icon className={cn(
                          "h-3 w-3",
                          level === 'VERY_HIGH' || level === 'HIGH'
                            ? "text-green-600" : "text-orange-600"
                        )} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold">
                {filteredData.filter(d => d.actual_fcr !== null).length}
              </div>
              <div className="text-xs text-muted-foreground">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {filteredData.length > 0 ?
                  (filteredData.reduce((sum, d) => sum + (d.scenarios_used || 0), 0) / filteredData.length).toFixed(0) :
                  '0'
                }
              </div>
              <div className="text-xs text-muted-foreground">Avg Scenarios</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {filteredData.filter(d => d.confidence === 'VERY_HIGH' || d.confidence === 'HIGH').length}
              </div>
              <div className="text-xs text-muted-foreground">High Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {filteredData.length > 0 && filteredData.some(d => d.deviation !== null) ?
                  Math.abs(filteredData
                    .filter(d => d.deviation !== null)
                    .reduce((sum, d) => sum + (d.deviation || 0), 0) /
                    filteredData.filter(d => d.deviation !== null).length
                  ).toFixed(2) :
                  '0.00'
                }
              </div>
              <div className="text-xs text-muted-foreground">Avg Deviation</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
