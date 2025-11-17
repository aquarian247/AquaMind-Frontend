/**
 * Data Visualization Controls
 * 
 * Left panel with series toggles, granularity selector, and scenario management.
 * 
 * Issue: #112 - Phase 7
 */

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshDataButton } from './RefreshDataButton';
import type { ScenarioInfo } from '../../api/growth-assimilation';

interface SeriesVisibility {
  samples: boolean;
  scenario: boolean;
  actual: boolean;
}

interface DataVisualizationControlsProps {
  batchId: number;
  scenario: ScenarioInfo | null;
  seriesVisibility: SeriesVisibility;
  granularity: 'daily' | 'weekly';
  onSeriesToggle: (series: keyof SeriesVisibility) => void;
  onGranularityChange: (granularity: 'daily' | 'weekly') => void;
  onDateRangeChange?: (start?: Date, end?: Date) => void;
}

export function DataVisualizationControls({
  batchId,
  scenario,
  seriesVisibility,
  granularity,
  onSeriesToggle,
  onGranularityChange,
}: DataVisualizationControlsProps) {
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-sm">Data Visualization Controls</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Toggle data series and adjust granularity to explore growth patterns
        </p>
      </div>
      
      <Separator />
      
      {/* Data Series Toggles */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Data Series
        </Label>
        
        {/* Growth Samples */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="series-samples"
              checked={seriesVisibility.samples}
              onCheckedChange={() => onSeriesToggle('samples')}
            />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <Label htmlFor="series-samples" className="text-sm font-normal cursor-pointer">
                Growth Samples
              </Label>
            </div>
          </div>
        </div>
        
        {/* Scenario Projection */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="series-scenario"
              checked={seriesVisibility.scenario}
              onCheckedChange={() => onSeriesToggle('scenario')}
            />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <Label htmlFor="series-scenario" className="text-sm font-normal cursor-pointer">
                Scenario Projection
              </Label>
            </div>
          </div>
        </div>
        
        {/* Actual Daily State */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="series-actual"
              checked={seriesVisibility.actual}
              onCheckedChange={() => onSeriesToggle('actual')}
            />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <Label htmlFor="series-actual" className="text-sm font-normal cursor-pointer">
                Actual Daily State
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Granularity Selector */}
      <div className="space-y-2">
        <Label htmlFor="granularity" className="text-xs font-semibold uppercase text-muted-foreground">
          Granularity
        </Label>
        <Select value={granularity} onValueChange={(value) => onGranularityChange(value as 'daily' | 'weekly')}>
          <SelectTrigger id="granularity">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          {granularity === 'daily' 
            ? 'Full detail for each day' 
            : 'Aggregated weekly view for better performance'}
        </p>
      </div>
      
      <Separator />
      
      {/* Scenario Info */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Scenario
        </Label>
        {scenario ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">{scenario.name}</p>
            <p className="text-xs text-muted-foreground">
              {scenario.duration_days} days • {scenario.initial_count.toLocaleString()} fish • {scenario.initial_weight}g
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No scenario pinned</p>
        )}
      </div>
      
      <Separator />
      
      {/* Refresh Data Button (Manager+ only) */}
      <div>
        <RefreshDataButton batchId={batchId} />
      </div>
    </div>
  );
}

