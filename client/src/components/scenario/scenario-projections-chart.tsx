import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProjectionDataPoint {
  day: number;
  week: number;
  weight: number;
  count: number;
  mortality: number;
  fcr: number;
  totalBiomass: number;
  temperature: number;
}

interface ScenarioProjectionsChartProps {
  data: ProjectionDataPoint[];
  title?: string;
  showMetrics?: boolean;
  highlightPeriods?: Array<{
    start: number;
    end: number;
    label: string;
    color: string;
  }>;
}

export function ScenarioProjectionsChart({ 
  data, 
  title = "Growth Projections", 
  showMetrics = true,
  highlightPeriods = []
}: ScenarioProjectionsChartProps) {
  const metrics = useMemo(() => {
    if (!data || data.length === 0) return null;

    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];
    
    const totalGrowth = lastPoint.weight - firstPoint.weight;
    const growthRate = ((lastPoint.weight / firstPoint.weight) ** (1 / (data.length / 30)) - 1) * 100; // Monthly growth rate
    const survivalRate = ((lastPoint.count / firstPoint.count) * 100);
    const avgFcr = data.reduce((sum, point) => sum + point.fcr, 0) / data.length;
    const finalBiomass = lastPoint.totalBiomass;

    return {
      totalGrowth: totalGrowth.toFixed(1),
      growthRate: growthRate.toFixed(1),
      survivalRate: survivalRate.toFixed(1),
      avgFcr: avgFcr.toFixed(2),
      finalBiomass: (finalBiomass / 1000).toFixed(1), // Convert to tonnes
      duration: Math.max(...data.map(d => d.day)),
    };
  }, [data]);

  const formatXAxisLabel = (tickItem: number) => {
    return `W${Math.floor(tickItem / 7)}`;
  };

  const formatTooltipLabel = (value: number) => {
    const weeks = Math.floor(value / 7);
    const days = value % 7;
    return `Week ${weeks}, Day ${days}`;
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No projection data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showMetrics && metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Growth</p>
                  <p className="text-lg font-bold">{metrics.totalGrowth}g</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                  <p className="text-lg font-bold">{metrics.growthRate}%/mo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${parseFloat(metrics.survivalRate) > 90 ? 'bg-green-600' : parseFloat(metrics.survivalRate) > 80 ? 'bg-yellow-600' : 'bg-red-600'}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Survival Rate</p>
                  <p className="text-lg font-bold">{metrics.survivalRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Minus className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg FCR</p>
                  <p className="text-lg font-bold">{metrics.avgFcr}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Final Biomass</p>
                  <p className="text-lg font-bold">{metrics.finalBiomass}t</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-600 rounded-full" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-bold">{metrics.duration}d</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Weight Growth</Badge>
              <Badge variant="outline">Fish Count</Badge>
              <Badge variant="outline">FCR</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="day"
                tickFormatter={formatXAxisLabel}
                interval="preserveStartEnd"
                className="text-xs"
              />
              <YAxis 
                yAxisId="weight"
                orientation="left"
                label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <YAxis 
                yAxisId="count"
                orientation="right"
                label={{ value: 'Fish Count', angle: 90, position: 'insideRight' }}
                className="text-xs"
              />
              <Tooltip
                labelFormatter={formatTooltipLabel}
                formatter={(value: number, name: string) => {
                  if (name === 'weight') return [`${value.toFixed(1)}g`, 'Average Weight'];
                  if (name === 'count') return [value.toLocaleString(), 'Fish Count'];
                  if (name === 'fcr') return [value.toFixed(2), 'FCR'];
                  if (name === 'mortality') return [`${value.toFixed(2)}%`, 'Mortality Rate'];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              
              {/* Reference lines for highlight periods */}
              {highlightPeriods.map((period, index) => (
                <ReferenceLine
                  key={index}
                  x={period.start}
                  stroke={period.color}
                  strokeDasharray="5 5"
                  label={{ value: period.label, position: "top" }}
                />
              ))}
              
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                name="weight"
              />
              
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--destructive))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "hsl(var(--destructive))", strokeWidth: 2 }}
                name="count"
              />
              
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="fcr"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="fcr"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}