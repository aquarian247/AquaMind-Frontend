import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import type { StationFilterValue } from '../types';
import { useForensicData, useFreshwaterStations } from '../api/api';
import { MultiPanelTimeSeries } from './MultiPanelTimeSeries';

interface ForensicAnalysisTabProps {
  stationId: StationFilterValue;
}

export function ForensicAnalysisTab({ stationId }: ForensicAnalysisTabProps) {
  const [selectedContainer, setSelectedContainer] = useState<number | null>(null);
  const { data: stations } = useFreshwaterStations();
  const { data: panels, isLoading } = useForensicData(selectedContainer);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="w-full sm:w-64">
          <Label className="mb-2 inline-block text-sm">Container</Label>
          <Select
            value={selectedContainer?.toString() ?? ''}
            onValueChange={(v) => setSelectedContainer(v ? parseInt(v, 10) : null)}
          >
            <SelectTrigger aria-label="Select container for forensic analysis">
              <SelectValue placeholder="Select a container..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" disabled>
                Select a container to view environmental data
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedContainer ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Forensic Analysis</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Select a container above to view 8-panel environmental and outcome
                time series. This view correlates O2, CO2, NO2, NO3, temperature,
                mortality, feed, and health data over a 500-day timeline.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Tip: Navigate to a station detail page and select a specific tank
                to populate the container list.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <MultiPanelTimeSeries panels={panels || []} isLoading={isLoading} />
      )}
    </div>
  );
}
