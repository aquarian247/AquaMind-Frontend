/**
 * Provenance Tooltip
 * 
 * Custom Recharts tooltip showing data sources and confidence scores.
 * Displays date, values, and provenance information.
 * 
 * Issue: #112 - Phase 7
 */

import React from 'react';
import { formatSource, formatConfidence } from '../../api/growth-assimilation';

interface ProvenanceTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number;
  /**
   * When series have different granularities (e.g. weekly scenario vs daily live projections),
   * the hovered day may not have an exact value for all series. We pass sparse series points
   * so the tooltip can show the nearest available value (clearly labeled).
   */
  sparseSeries?: {
    scenario?: Array<{ day: number; date?: string; weight_g: number }>;
    actual?: Array<{ day: number; date?: string; weight_g: number }>;
    sample?: Array<{ day: number; date?: string; weight_g: number }>;
    live?: Array<{ day: number; date?: string; weight_g: number }>;
  };
  batchStartDate?: string; // YYYY-MM-DD
}

export function ProvenanceTooltip({
  active,
  payload,
  label,
  sparseSeries,
  batchStartDate,
}: ProvenanceTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  // Extract data from payload
  const data = payload[0]?.payload;
  if (!data) return null;
  
  const {
    date,
    day,
    sampleWeight,
    scenarioWeight,
    actualWeight,
    liveProjectionWeight,
    anchorType,
    sources,
    confidenceScores,
    containerCount,
    sampleCount,
  } = data;

  const tooltipDay: number | undefined = typeof label === 'number' ? label : day;

  const displayDate = (() => {
    if (typeof date === 'string' && date.length > 0) return date;
    if (!batchStartDate || tooltipDay === undefined) return '';
    // Avoid timezone drift by doing date math in UTC.
    const base = new Date(`${batchStartDate}T00:00:00Z`);
    base.setUTCDate(base.getUTCDate() + (tooltipDay - 1));
    return base.toISOString().slice(0, 10); // YYYY-MM-DD
  })();

  const formatWeight = (g: number) => {
    if (!isFinite(g)) return '—';
    if (Math.abs(g) >= 1000) return `${(g / 1000).toFixed(2)}kg`;
    return `${g.toFixed(1)}g`;
  };

  const findNearest = (
    points: Array<{ day: number; date?: string; weight_g: number }> | undefined,
    targetDay: number | undefined
  ): { point?: { day: number; date?: string; weight_g: number }; isExact: boolean } => {
    if (!points || points.length === 0 || targetDay === undefined) return { isExact: false };
    // points are expected sorted by day asc
    let lo = 0;
    let hi = points.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const midDay = points[mid].day;
      if (midDay === targetDay) return { point: points[mid], isExact: true };
      if (midDay < targetDay) lo = mid + 1;
      else hi = mid - 1;
    }
    // hi is last < targetDay, lo is first > targetDay
    const lower = hi >= 0 ? points[hi] : undefined;
    const upper = lo < points.length ? points[lo] : undefined;
    if (!lower) return { point: upper, isExact: false };
    if (!upper) return { point: lower, isExact: false };
    return {
      point:
        Math.abs(targetDay - lower.day) <= Math.abs(upper.day - targetDay) ? lower : upper,
      isExact: false,
    };
  };

  // Use exact hovered-point values first; fall back to nearest sparse-series values
  const nearestScenario = findNearest(
    sparseSeries?.scenario,
    tooltipDay
  );
  const nearestLive = findNearest(
    sparseSeries?.live,
    tooltipDay
  );

  const scenarioWeightToShow =
    scenarioWeight !== undefined ? { value: scenarioWeight, isExact: true } :
    nearestScenario.point ? { value: nearestScenario.point.weight_g, isExact: nearestScenario.isExact } :
    undefined;

  const liveWeightToShow =
    liveProjectionWeight !== undefined ? { value: liveProjectionWeight, isExact: true } :
    nearestLive.point ? { value: nearestLive.point.weight_g, isExact: nearestLive.isExact } :
    undefined;
  
  return (
    <div className="bg-background border border-border shadow-lg rounded-lg p-4 max-w-xs">
      {/* Header */}
      <div className="border-b border-border pb-2 mb-2">
        <p className="font-semibold text-sm">{displayDate || '—'}</p>
        <p className="text-xs text-muted-foreground">
          Day {tooltipDay ?? '—'}
          {containerCount > 1 && ` • ${containerCount} containers`}
          {sampleCount > 1 && ` • ${sampleCount} samples`}
        </p>
      </div>
      
      {/* Values */}
      <div className="space-y-2">
        {scenarioWeightToShow && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">
                Scenario{scenarioWeightToShow.isExact ? '' : ' (nearest)'}
              </span>
            </div>
            <span className="font-medium text-sm">{formatWeight(scenarioWeightToShow.value)}</span>
          </div>
        )}
        
        {liveWeightToShow && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm">
                Live{liveWeightToShow.isExact ? '' : ' (nearest)'}
              </span>
            </div>
            <span className="font-medium text-sm">{formatWeight(liveWeightToShow.value)}</span>
          </div>
        )}
        
        {actualWeight !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">Actual</span>
            </div>
            <span className="font-medium text-sm">{formatWeight(actualWeight)}</span>
          </div>
        )}
        
        {sampleWeight !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Sample</span>
            </div>
            <span className="font-medium text-sm">{formatWeight(sampleWeight)}</span>
          </div>
        )}
      </div>
      
      {/* Anchor Type */}
      {anchorType && (
        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <p className="text-xs font-medium">
              Anchor: {formatSource(anchorType)}
            </p>
          </div>
        </div>
      )}
      
      {/* Data Sources & Confidence */}
      {sources && confidenceScores && (
        <div className="mt-3 pt-2 border-t border-border space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Data Sources</p>
          
          <div className="space-y-1.5 text-xs">
            {/* Temperature */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground">Temp:</span>
                <span className="font-medium">{formatSource(sources.temp)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${confidenceScores.temp * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground">{(confidenceScores.temp * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            {/* Mortality */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground">Mortality:</span>
                <span className="font-medium">{formatSource(sources.mortality)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${confidenceScores.mortality * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground">{(confidenceScores.mortality * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            {/* Feed */}
            {sources.feed && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">Feed:</span>
                  <span className="font-medium">{formatSource(sources.feed)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${confidenceScores.feed * 100}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground">{(confidenceScores.feed * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
            
            {/* Weight */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-medium">{formatSource(sources.weight)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      confidenceScores.weight >= 0.9 ? 'bg-green-500' :
                      confidenceScores.weight >= 0.6 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${confidenceScores.weight * 100}%` }}
                  />
                </div>
                <span className="text-muted-foreground">{(confidenceScores.weight * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground italic mt-2">
            Confidence: {formatConfidence(confidenceScores.weight || 0)}
          </p>
        </div>
      )}
    </div>
  );
}

