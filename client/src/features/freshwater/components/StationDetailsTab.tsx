import type { StationFilterValue } from '../types';
import { useFreshwaterStations } from '../api/api';
import { StationCard } from './StationCard';

interface StationDetailsTabProps {
  stationId: StationFilterValue;
}

export function StationDetailsTab({ stationId }: StationDetailsTabProps) {
  const { data: stations, isLoading } = useFreshwaterStations();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse h-48 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  const filteredStations = stationId === 'all'
    ? stations || []
    : (stations || []).filter(s => s.id === stationId);

  if (filteredStations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No freshwater stations found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Click a station card to view detailed information.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
}
