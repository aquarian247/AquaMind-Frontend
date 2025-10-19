/**
 * KPICard Component
 * 
 * Displays a Key Performance Indicator with value, unit, trend indicator, and subtitle.
 * Integrates with Shadcn/ui Card components and uses formatFallback for honest data display.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatFallback } from '@/lib/formatFallback';
import type { KPIData, TrendDirection } from '../types';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export interface KPICardProps {
  data: KPIData;
  className?: string;
}

/**
 * Get trend icon component based on direction
 */
function getTrendIcon(direction: TrendDirection) {
  const iconClass = 'h-4 w-4';
  
  switch (direction) {
    case 'up':
      return <ArrowUp className={cn(iconClass, 'text-green-600')} aria-label="Trending up" />;
    case 'down':
      return <ArrowDown className={cn(iconClass, 'text-red-600')} aria-label="Trending down" />;
    case 'stable':
      return <Minus className={cn(iconClass, 'text-gray-600')} aria-label="Stable" />;
  }
}

/**
 * Get trend text color based on direction
 */
function getTrendColor(direction: TrendDirection): string {
  switch (direction) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
      return 'text-gray-600';
  }
}

/**
 * KPICard Component
 * 
 * @example
 * ```tsx
 * <KPICard
 *   data={{
 *     title: 'Total Biomass',
 *     value: 50000,
 *     unit: 'kg',
 *     trend: {
 *       direction: 'up',
 *       percentage: 12.5,
 *       period: 'vs last week'
 *     },
 *     subtitle: 'Across all facilities'
 *   }}
 * />
 * ```
 */
export function KPICard({ data, className }: KPICardProps) {
  const { title, value, unit, trend, subtitle } = data;

  // Format the main value with honest fallback
  const formattedValue = formatFallback(value, unit, {
    fallbackText: 'N/A',
    precision: 1,
  });

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Main KPI Value */}
          <div className="text-2xl font-bold" aria-label={`${title}: ${formattedValue}`}>
            {formattedValue}
          </div>

          {/* Trend Indicator (if present) */}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                getTrendColor(trend.direction)
              )}
              aria-label={`Trend: ${trend.direction} ${trend.percentage}% ${trend.period || ''}`}
            >
              {getTrendIcon(trend.direction)}
              <span>
                {formatFallback(trend.percentage, '%', { precision: 1 })}
              </span>
              {trend.period && (
                <span className="text-muted-foreground ml-1">{trend.period}</span>
              )}
            </div>
          )}

          {/* Subtitle (optional) */}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * KPICardSkeleton - Loading state for KPICard
 */
export function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardHeader className="pb-2">
        <div className="h-4 w-24 bg-muted rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="h-3 w-20 bg-muted rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

