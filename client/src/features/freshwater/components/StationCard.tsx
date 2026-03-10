import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FacilityHealthBadge } from '@/features/executive/components/FacilityHealthBadge';
import { formatFallback } from '@/lib/formatFallback';
import type { FreshwaterStationSummary } from '../types';
import { getFreshwaterStationHealthStatus } from '../utils/performanceThresholds';

interface StationCardProps {
  station: FreshwaterStationSummary;
}

export function StationCard({ station }: StationCardProps) {
  const [, navigate] = useLocation();

  const healthStatus = getFreshwaterStationHealthStatus({
    mortality_pct: null,
    tgc: null,
    fcr: null,
  });

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/infrastructure/stations/${station.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/infrastructure/stations/${station.id}`);
        }
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{station.name}</CardTitle>
          <FacilityHealthBadge level={healthStatus} />
        </div>
        <p className="text-xs text-muted-foreground">{station.geography_name}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Biomass</p>
            <p className="font-medium">
              {station.active_biomass_kg !== null
                ? formatFallback(station.active_biomass_kg / 1000, 't', { precision: 1 })
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Population</p>
            <p className="font-medium">
              {station.population_count !== null
                ? formatFallback(station.population_count / 1_000_000, 'M', { precision: 2 })
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Weight</p>
            <p className="font-medium">
              {station.avg_weight_kg !== null
                ? formatFallback(station.avg_weight_kg * 1000, 'g', { precision: 1 })
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Batches</p>
            <p className="font-medium">
              {formatFallback(station.active_batches, '', { precision: 0 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Halls / Tanks</p>
            <p className="font-medium">
              {formatFallback(station.hall_count, '', { precision: 0 })}
              {' / '}
              {formatFallback(station.tank_count, '', { precision: 0 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Capacity</p>
            <p className="font-medium">
              {formatFallback(station.capacity_utilization_percent, '%', { precision: 0 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
