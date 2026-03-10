import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { LiceTrendPoint } from '../types';

interface LiceTrendsChartsProps {
  data: LiceTrendPoint[];
  isLoading: boolean;
}

function formatPeriod(period: string): string {
  try {
    const d = new Date(period);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return period;
  }
}

export function LiceTrendsCharts({ data, isLoading }: LiceTrendsChartsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse h-64 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-8">
            No lice trend data available for the selected period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lice Trends (Last 52 Weeks)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="period" tickFormatter={formatPeriod} interval="preserveStartEnd" className="text-xs" />
            <YAxis className="text-xs" label={{ value: 'per fish', angle: -90, position: 'insideLeft', className: 'text-xs' }} />
            <Tooltip
              labelFormatter={(label) => {
                try { return new Date(label).toLocaleDateString(); } catch { return label; }
              }}
              formatter={(value: number) => [value?.toFixed(2), 'Avg per fish']}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Line type="monotone" dataKey="average_per_fish" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
