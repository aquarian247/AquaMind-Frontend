/**
 * GeographyFilter Component
 * 
 * Dropdown filter for selecting geography (Global, Faroe Islands, Scotland, etc.)
 * Integrates with Shadcn/ui Select components.
 */

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import type { GeographyFilterValue, GeographyFilterOption } from '../types';

export interface GeographyFilterProps {
  value: GeographyFilterValue;
  onChange: (value: GeographyFilterValue) => void;
  geographies?: GeographyFilterOption[];
  showLabel?: boolean;
  className?: string;
}

/**
 * Default geography options (can be overridden with geographies prop)
 */
const DEFAULT_GEOGRAPHIES: GeographyFilterOption[] = [
  { id: 'global', name: 'Global' },
];

/**
 * GeographyFilter Component
 * 
 * @example
 * ```tsx
 * const [geography, setGeography] = useState<GeographyFilterValue>('global');
 * 
 * <GeographyFilter
 *   value={geography}
 *   onChange={setGeography}
 *   geographies={[
 *     { id: 'global', name: 'Global' },
 *     { id: 1, name: 'Faroe Islands' },
 *     { id: 2, name: 'Scotland' },
 *   ]}
 * />
 * ```
 */
export function GeographyFilter({
  value,
  onChange,
  geographies = DEFAULT_GEOGRAPHIES,
  showLabel = true,
  className,
}: GeographyFilterProps) {
  const handleChange = (newValue: string) => {
    // Parse value: if it's 'global', keep as string, otherwise parse as number
    const parsedValue: GeographyFilterValue =
      newValue === 'global' ? 'global' : parseInt(newValue, 10);
    onChange(parsedValue);
  };

  // Convert current value to string for Select component
  const stringValue = typeof value === 'number' ? value.toString() : value;

  return (
    <div className={className}>
      {showLabel && (
        <Label htmlFor="geography-filter" className="mb-2 inline-block">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Geography</span>
          </div>
        </Label>
      )}
      <Select value={stringValue} onValueChange={handleChange}>
        <SelectTrigger
          id="geography-filter"
          className="w-full"
          aria-label="Select geography filter"
        >
          <SelectValue placeholder="Select geography" />
        </SelectTrigger>
        <SelectContent>
          {geographies.map((geo) => {
            const geoValue = typeof geo.id === 'number' ? geo.id.toString() : geo.id;
            return (
              <SelectItem key={geoValue} value={geoValue}>
                {geo.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

