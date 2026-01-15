/**
 * Growth Analysis Chart
 * 
 * Main chart component displaying three data series:
 * - Growth Samples (blue scatter points)
 * - Scenario Projection (green line)
 * - Actual Daily States (orange line with markers)
 * 
 * Uses Recharts for rendering. Custom tooltip shows provenance data.
 * 
 * Issue: #112 - Phase 7
 */

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ProvenanceTooltip } from './ProvenanceTooltip';
import type { GrowthAnalysisData, GrowthSample, ActualDailyState, LiveProjectionPoint } from '../../api/growth-assimilation';

interface SeriesVisibility {
  samples: boolean;
  scenario: boolean;
  actual: boolean;
  liveProjection: boolean;
}

interface GrowthAnalysisChartProps {
  data: GrowthAnalysisData;
  seriesVisibility: SeriesVisibility;
  selectedAssignmentId?: number;
  liveProjections?: LiveProjectionPoint[];
}

interface ChartDataPoint {
  day: number;
  date: string;
  // Growth Sample
  sampleWeight?: number;
  sampleSize?: number;
  sampleCount?: number;  // Number of samples aggregated for this day
  // Scenario Projection
  scenarioWeight?: number;
  scenarioPopulation?: number;
  // Actual Daily State
  actualWeight?: number;
  actualPopulation?: number;
  actualBiomass?: number;
  anchorType?: string | null;
  sources?: any;
  confidenceScores?: any;
  assignmentId?: number;
  containerName?: string;
  containerCount?: number;  // Number of containers aggregated for this day
  // Live Forward Projection
  liveProjectionWeight?: number;
  liveProjectionPopulation?: number;
}

export function GrowthAnalysisChart({
  data,
  seriesVisibility,
  selectedAssignmentId,
  liveProjections,
}: GrowthAnalysisChartProps) {
  
  // ============================================================================
  // Transform Data for Recharts
  // ============================================================================
  
  const chartData = useMemo<ChartDataPoint[]>(() => {
    // Create a map of day_number -> data
    const dataByDay = new Map<number, ChartDataPoint>();
    
    const batchStartDate = new Date(data.start_date);
    
    // Add growth samples
    if (seriesVisibility.samples) {
      // Group by day for batch-level aggregation
      const samplesByDay = new Map<number, GrowthSample[]>();
      
      data.growth_samples.forEach((sample) => {
        // Filter by assignment if selected
        if (selectedAssignmentId && sample.assignment_id !== selectedAssignmentId) {
          return;
        }
        
        const sampleDate = new Date(sample.date);
        const dayNumber = Math.floor((sampleDate.getTime() - batchStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        if (!samplesByDay.has(dayNumber)) {
          samplesByDay.set(dayNumber, []);
        }
        samplesByDay.get(dayNumber)!.push(sample);
      });
      
      // Aggregate each day to a single batch-level value
      samplesByDay.forEach((samples, dayNumber) => {
        const existing = dataByDay.get(dayNumber) || {
          day: dayNumber,
          date: samples[0].date,
        };
        
        // Simple average of all samples on that day
        const avgWeight = samples.reduce((sum, s) => sum + s.avg_weight_g, 0) / samples.length;
        const totalSampleSize = samples.reduce((sum, s) => sum + s.sample_size, 0);
        
        dataByDay.set(dayNumber, {
          ...existing,
          sampleWeight: avgWeight,
          sampleSize: totalSampleSize,
          sampleCount: samples.length,
        });
      });
    }
    
    // Add scenario projection
    if (seriesVisibility.scenario && data.scenario_projection) {
      data.scenario_projection.forEach((proj) => {
        const existing = dataByDay.get(proj.day_number) || {
          day: proj.day_number,
          date: proj.date,
        };
        
        dataByDay.set(proj.day_number, {
          ...existing,
          scenarioWeight: proj.avg_weight_g,
          scenarioPopulation: proj.population,
        });
      });
    }
    
    // Add actual daily states
    if (seriesVisibility.actual) {
      // Group by day for batch-level aggregation
      const statesByDay = new Map<number, ActualDailyState[]>();
      
      // Create a set of assignments to exclude (departing on their departure date)
      // IMPORTANT: Keep dates as strings (YYYY-MM-DD) - converting to Date causes timezone bugs
      const departingAssignments = new Map<number, string>();
      data.container_assignments.forEach((assignment) => {
        if (assignment.departure_date) {
          departingAssignments.set(assignment.id, assignment.departure_date);
        }
      });
      
      data.actual_daily_states.forEach((state) => {
        // Filter by assignment if selected
        if (selectedAssignmentId && state.assignment_id !== selectedAssignmentId) {
          return;
        }
        
        // CRITICAL: Exclude departing assignments on their departure day
        // to prevent double-counting during transfers
        // IMPORTANT: Keep dates as strings (YYYY-MM-DD) - converting to Date causes timezone bugs
        const departureDateStr = departingAssignments.get(state.assignment_id);
        if (departureDateStr && state.date === departureDateStr) {
          return;
        }
        
        if (!statesByDay.has(state.day_number)) {
          statesByDay.set(state.day_number, []);
        }
        statesByDay.get(state.day_number)!.push(state);
      });
      
      // Aggregate each day to a single batch-level value
      statesByDay.forEach((states, dayNumber) => {
        const existing = dataByDay.get(dayNumber) || {
          day: dayNumber,
          date: states[0].date,
        };
        
        // Calculate population-weighted average weight (batch-level)
        const totalPopulation = states.reduce((sum, s) => sum + s.population, 0);
        const weightedSum = states.reduce((sum, s) => sum + (s.population * s.avg_weight_g), 0);
        const batchAvgWeight = totalPopulation > 0 ? weightedSum / totalPopulation : 0;
        
        // Sum biomass and population across all containers
        const totalBiomass = states.reduce((sum, s) => sum + s.biomass_kg, 0);
        
        // Average confidence scores across containers
        const avgConfidence = {
          temp: states.reduce((sum, s) => sum + s.confidence_scores.temp, 0) / states.length,
          mortality: states.reduce((sum, s) => sum + s.confidence_scores.mortality, 0) / states.length,
          feed: states.reduce((sum, s) => sum + (s.confidence_scores.feed || 0), 0) / states.length,
          weight: states.reduce((sum, s) => sum + s.confidence_scores.weight, 0) / states.length,
        };
        
        // Use sources from first state (representative)
        const representativeSources = states[0].sources;
        
        // Mark as anchor if ANY container has an anchor
        const hasAnchor = states.some(s => s.anchor_type !== null);
        const anchorType = hasAnchor ? states.find(s => s.anchor_type)?.anchor_type : null;
        
        dataByDay.set(dayNumber, {
          ...existing,
          actualWeight: batchAvgWeight,
          actualPopulation: totalPopulation,
          actualBiomass: totalBiomass,
          anchorType: anchorType,
          sources: representativeSources,
          confidenceScores: avgConfidence,
          // Store container count for provenance
          containerCount: states.length,
        });
      });
    }
    
    // Add live forward projections
    if (seriesVisibility.liveProjection && liveProjections && liveProjections.length > 0) {
      liveProjections.forEach((proj) => {
        const existing = dataByDay.get(proj.day_number) || {
          day: proj.day_number,
          date: proj.projection_date || '',
        };
        
        dataByDay.set(proj.day_number, {
          ...existing,
          liveProjectionWeight: proj.projected_weight_g,
          liveProjectionPopulation: proj.projected_population,
        });
      });
    }
    
    // Convert map to array and sort by day
    return Array.from(dataByDay.values()).sort((a, b) => a.day - b.day);
  }, [
    data,
    seriesVisibility,
    selectedAssignmentId,
    liveProjections,
  ]);

  // ============================================================================
  // Sparse-series lookup (for tooltip when granularities differ)
  // ============================================================================

  const sparseSeries = useMemo(() => {
    const scenario = seriesVisibility.scenario
      ? (data.scenario_projection || [])
          .map((p) => ({ day: p.day_number, date: p.date, weight_g: p.avg_weight_g }))
          .sort((a, b) => a.day - b.day)
      : [];

    const live = seriesVisibility.liveProjection
      ? (liveProjections || [])
          .map((p) => ({ day: p.day_number, date: p.projection_date, weight_g: p.projected_weight_g }))
          .sort((a, b) => a.day - b.day)
      : [];

    return { scenario, live };
  }, [data.scenario_projection, liveProjections, seriesVisibility.liveProjection, seriesVisibility.scenario]);
  
  // ============================================================================
  // Calculate X-axis domain to include ALL data series (including future projections)
  // ============================================================================
  
  const xAxisDomain = useMemo<[number, number]>(() => {
    let minDay = Infinity;
    let maxDay = -Infinity;
    
    // Include scenario projection range (should extend to full scenario duration)
    if (data.scenario_projection && data.scenario_projection.length > 0) {
      const scenarioDays = data.scenario_projection.map(p => p.day_number);
      minDay = Math.min(minDay, ...scenarioDays);
      maxDay = Math.max(maxDay, ...scenarioDays);
    }
    
    // Include live projection range (extends into the future)
    if (liveProjections && liveProjections.length > 0) {
      const projDays = liveProjections.map(p => p.day_number);
      minDay = Math.min(minDay, ...projDays);
      maxDay = Math.max(maxDay, ...projDays);
    }
    
    // Include actual daily states range
    if (data.actual_daily_states && data.actual_daily_states.length > 0) {
      const actualDays = data.actual_daily_states.map(s => s.day_number);
      minDay = Math.min(minDay, ...actualDays);
      maxDay = Math.max(maxDay, ...actualDays);
    }
    
    // Include growth samples range
    if (data.growth_samples && data.growth_samples.length > 0) {
      const batchStartDate = new Date(data.start_date);
      data.growth_samples.forEach(sample => {
        const sampleDate = new Date(sample.date);
        const dayNumber = Math.floor((sampleDate.getTime() - batchStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        minDay = Math.min(minDay, dayNumber);
        maxDay = Math.max(maxDay, dayNumber);
      });
    }
    
    // Fallback if no data
    if (!isFinite(minDay)) minDay = 1;
    if (!isFinite(maxDay)) maxDay = 100;
    
    // Add small padding
    return [Math.max(1, minDay - 5), maxDay + 5];
  }, [data, liveProjections]);

  // ============================================================================
  // Empty State
  // ============================================================================
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        <div className="text-center">
          <p>No data to display</p>
          <p className="text-sm mt-2">Try enabling more data series or adjusting filters</p>
        </div>
      </div>
    );
  }
  
  // ============================================================================
  // Chart Rendering
  // ============================================================================
  
  // Check if projection exceeds typical harvest size
  const maxProjectedWeight = Math.max(...chartData.map(d => d.scenarioWeight || 0));
  const exceedsHarvestSize = maxProjectedWeight > 6000;
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Weight Growth Over Time</h3>
        <p className="text-sm text-muted-foreground">
          Comparing actual measurements, scenario projections, and growth samples
        </p>
        {exceedsHarvestSize && (
          <div className="mt-2 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 p-2 rounded">
            <span className="font-semibold">⚠️</span>
            <span>
              Scenario projection exceeds typical harvest size (6kg). Results beyond this point are theoretical.
              Atlantic salmon are typically harvested at 4-6kg for economic optimum.
            </span>
          </div>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          
          <XAxis
            dataKey="day"
            type="number"
            domain={xAxisDomain}
            label={{ value: 'Days', position: 'insideBottom', offset: -10 }}
            className="text-xs"
          />
          
          <YAxis
            label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }}
            className="text-xs"
          />
          
          <Tooltip
            content={(props: any) => (
              <ProvenanceTooltip
                {...props}
                sparseSeries={sparseSeries}
                batchStartDate={data.start_date}
              />
            )}
            cursor={{ strokeDasharray: '3 3' }}
          />
          
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="line"
          />
          
          {/* Scenario Projection Line (Green) */}
          {seriesVisibility.scenario && (
            <Line
              type="monotone"
              dataKey="scenarioWeight"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Scenario Projection"
              connectNulls
            />
          )}
          
          {/* Actual Daily State Line (Orange) */}
          {seriesVisibility.actual && (
            <Line
              type="monotone"
              dataKey="actualWeight"
              stroke="#f97316"
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload, index } = props;
                // Mark anchors with stars
                if (payload.anchorType) {
                  return (
                    <svg key={`anchor-${index}`} x={cx - 6} y={cy - 6} width={12} height={12}>
                      <circle cx={6} cy={6} r={5} fill="#f97316" stroke="#fff" strokeWidth={1} />
                      <circle cx={6} cy={6} r={2} fill="#fff" />
                    </svg>
                  );
                }
                return <circle key={`dot-${index}`} cx={cx} cy={cy} r={3} fill="#f97316" />;
              }}
              name="Actual Daily State"
              connectNulls
            />
          )}
          
          {/* Live Forward Projection Line (Purple) */}
          {seriesVisibility.liveProjection && (
            <Line
              type="monotone"
              dataKey="liveProjectionWeight"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              name="Live Projection"
              connectNulls
            />
          )}
          
          {/* Growth Samples Scatter (Blue) */}
          {seriesVisibility.samples && (
            <Scatter
              dataKey="sampleWeight"
              fill="#3b82f6"
              name="Growth Samples"
              shape={(props: any) => {
                const { cx, cy, index } = props;
                return (
                  <circle
                    key={`sample-${index}`}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="#3b82f6"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Chart Legend Explanation */}
      <div className="text-xs text-muted-foreground space-y-1 pl-4 border-l-2 border-muted">
        <p>• <span className="font-medium">Growth Samples</span>: Measured weights from sampling events</p>
        <p>• <span className="font-medium">Scenario Projection</span>: Planned growth based on TGC model</p>
        <p>• <span className="font-medium">Actual Daily State</span>: Reality-based assimilation from measurements + models</p>
        <p>• <span className="font-medium">Live Projection</span> (dashed purple): Forward projection from current actual state to harvest</p>
        <p>• <span className="font-medium">Anchor Points</span> (circles with dots): Growth samples, transfers, or vaccinations that reset weight calculations</p>
      </div>
    </div>
  );
}

