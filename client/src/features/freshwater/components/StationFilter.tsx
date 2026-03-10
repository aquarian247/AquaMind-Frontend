import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Droplets } from 'lucide-react';
import type { StationFilterValue, StationFilterOption } from '../types';

export interface StationFilterProps {
  value: StationFilterValue;
  onChange: (value: StationFilterValue) => void;
  stations?: StationFilterOption[];
  showLabel?: boolean;
  className?: string;
}

const DEFAULT_STATIONS: StationFilterOption[] = [
  { id: 'all', name: 'All Stations' },
];

export function StationFilter({
  value,
  onChange,
  stations = DEFAULT_STATIONS,
  showLabel = true,
  className,
}: StationFilterProps) {
  const handleChange = (newValue: string) => {
    const parsed: StationFilterValue =
      newValue === 'all' ? 'all' : parseInt(newValue, 10);
    onChange(parsed);
  };

  const stringValue = typeof value === 'number' ? value.toString() : value;

  return (
    <div className={className}>
      {showLabel && (
        <Label htmlFor="station-filter" className="mb-2 inline-block">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span>Station</span>
          </div>
        </Label>
      )}
      <Select value={stringValue} onValueChange={handleChange}>
        <SelectTrigger
          id="station-filter"
          className="w-full"
          aria-label="Select station filter"
        >
          <SelectValue placeholder="Select station" />
        </SelectTrigger>
        <SelectContent>
          {stations.map((station) => {
            const stationValue = typeof station.id === 'number' ? station.id.toString() : station.id;
            return (
              <SelectItem key={stationValue} value={stationValue}>
                {station.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
