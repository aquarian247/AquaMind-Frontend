import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { GrowthPerformanceRow } from '../types';
import { calculateSizeDistribution } from '../utils/sizeDistributionCalc';

interface SizeDistributionChartProps {
  growthData: GrowthPerformanceRow[];
  isLoading: boolean;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-1))',
];

export function SizeDistributionChart({ growthData, isLoading }: SizeDistributionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse h-64 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const batchesWithWeight = growthData.filter(b => b.current_weight_g !== null);
  if (batchesWithWeight.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">
            No growth data available for size distribution calculation
          </p>
        </CardContent>
      </Card>
    );
  }

  const weights = batchesWithWeight.map(b => b.current_weight_g!);
  const avgWeight = weights.reduce((s, w) => s + w, 0) / weights.length;
  const stdDev = weights.length > 1
    ? Math.sqrt(weights.reduce((s, w) => s + (w - avgWeight) ** 2, 0) / (weights.length - 1))
    : avgWeight * 0.3;

  const totalCount = batchesWithWeight.reduce((s, b) => s + (b.count ?? 0), 0);
  const distribution = calculateSizeDistribution(avgWeight, stdDev, totalCount);

  const chartData = distribution.map(d => ({
    name: d.label,
    percentage: d.percentage,
    count: d.count,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Size Distribution (avg: {avgWeight.toFixed(1)}g, std: {stdDev.toFixed(1)}g)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis unit="%" className="text-xs" />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'percentage') return [`${value.toFixed(1)}%`, 'Percentage'];
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
