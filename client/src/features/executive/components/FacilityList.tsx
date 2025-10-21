/**
 * FacilityList Component
 * 
 * Table displaying facility-level summaries with health indicators.
 * Shows key metrics: biomass, weight, TGC, FCR, mortality, lice status.
 */

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FacilityHealthBadge, FacilityHealthDot } from './FacilityHealthBadge';
import { formatFallback, formatPercentage, formatCount } from '@/lib/formatFallback';
import type { FacilitySummary } from '../types';

export interface FacilityListProps {
  facilities: FacilitySummary[];
  isLoading?: boolean;
  className?: string;
}

/**
 * FacilityList Component
 * 
 * @example
 * ```tsx
 * <FacilityList facilities={facilities} isLoading={false} />
 * ```
 */
export function FacilityList({ facilities, isLoading, className }: FacilityListProps) {
  if (isLoading) {
    return <FacilityListSkeleton />;
  }

  if (facilities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No facilities available for the selected geography.
      </div>
    );
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Facility</TableHead>
            <TableHead className="text-right">Biomass (kg)</TableHead>
            <TableHead className="text-right">Avg Weight (g)</TableHead>
            <TableHead className="text-right">TGC</TableHead>
            <TableHead className="text-right">FCR</TableHead>
            <TableHead className="text-right">Mortality %</TableHead>
            <TableHead className="text-right">Mature Lice</TableHead>
            <TableHead>Lice Status</TableHead>
            <TableHead>Health</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow key={facility.id} className="hover:bg-muted/50">
              {/* Facility Name */}
              <TableCell className="font-medium">
                <div>
                  <div>{facility.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {facility.geography_name}
                  </div>
                </div>
              </TableCell>

              {/* Biomass */}
              <TableCell className="text-right">
                {formatFallback(facility.biomass_kg, 'kg', { precision: 0 })}
              </TableCell>

              {/* Average Weight */}
              <TableCell className="text-right">
                {formatFallback(facility.average_weight_g, 'g', { precision: 1 })}
              </TableCell>

              {/* TGC */}
              <TableCell className="text-right">
                {formatFallback(facility.tgc, '', { precision: 2 })}
              </TableCell>

              {/* FCR */}
              <TableCell className="text-right">
                {formatFallback(facility.fcr, '', { precision: 2 })}
              </TableCell>

              {/* Mortality % */}
              <TableCell className="text-right">
                {formatPercentage(facility.mortality_percentage, 2)}
              </TableCell>

              {/* Mature Lice */}
              <TableCell className="text-right">
                {formatFallback(facility.mature_lice_average, '', { precision: 2 })}
              </TableCell>

              {/* Lice Status Badge */}
              <TableCell>
                <FacilityHealthBadge level={facility.lice_alert_level} showIcon={false} />
              </TableCell>

              {/* Overall Health */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <FacilityHealthDot level={facility.health_status} />
                  <FacilityHealthBadge level={facility.health_status} showIcon={false} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * FacilityListSkeleton - Loading state for facility table
 */
export function FacilityListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`skeleton-row-${i}`} className="flex items-center gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-12 w-24" />
        </div>
      ))}
    </div>
  );
}






