import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { ForensicPanelData } from '../types';

interface MultiPanelTimeSeriesProps {
  panels: ForensicPanelData[];
  isLoading: boolean;
}

const PANEL_COLORS: Record<string, string> = {
  'Oxygen': 'hsl(var(--chart-1))',
  'CO2': 'hsl(var(--chart-2))',
  'NO2': 'hsl(var(--chart-3))',
  'NO3': 'hsl(var(--chart-4))',
  'Temperature': 'hsl(var(--chart-5))',
  'Mortality': '#ef4444',
  'Feed': '#22c55e',
  'Health': '#8b5cf6',
};

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return dateStr;
  }
}

function PanelChart({ panel }: { panel: ForensicPanelData }) {
  const color = PANEL_COLORS[panel.parameter] || 'hsl(var(--chart-1))';

  if (panel.data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            {panel.parameter} ({panel.unit})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="h-32 flex items-center justify-center text-xs text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {panel.parameter} ({panel.unit})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={panel.data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              interval="preserveStartEnd"
              className="text-[10px]"
            />
            <YAxis className="text-[10px]" />
            <Tooltip
              labelFormatter={(label) => {
                try { return new Date(label).toLocaleDateString(); } catch { return label; }
              }}
              formatter={(value: number) => [`${value?.toFixed(2)} ${panel.unit}`, panel.parameter]}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--popover-foreground))',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MultiPanelTimeSeries({ panels, isLoading }: MultiPanelTimeSeriesProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {panels.map((panel) => (
        <PanelChart key={panel.parameter} panel={panel} />
      ))}
    </div>
  );
}
