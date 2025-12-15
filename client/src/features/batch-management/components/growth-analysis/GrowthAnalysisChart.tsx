/**
 * Growth Analysis Chart
 * 
 * Main chart component displaying four data series:
 * - Growth Samples (blue scatter points)
 * - Scenario Projection (green line)
 * - Actual Daily States (orange line with markers)
 * - Live Forward Projection (purple dashed line) - NEW
 * 
 * The 4th series shows predictive trajectory from current state,
 * using temperature bias computed from recent sensor data.
 * 
 * Uses Recharts for rendering. Custom tooltip shows provenance data.
 * 
 * Issue: #112 - Phase 7
 * Issue: Live Forward Projection Feature
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
import type { 
  GrowthAnalysisData, 
  GrowthSample, 
  ActualDailyState,
  LiveForwardProjectionData,
  LiveProjectionProvenance,
} from '../../api/growth-assimilation';

export interface SeriesVisibility {
  samples: boolean;
  scenario: boolean;
  actual: boolean;
  liveProjection: boolean;
}

interface GrowthAnalysisChartProps {
  data: GrowthAnalysisData;
  seriesVisibility: SeriesVisibility;
  selectedAssignmentId?: number;
  liveProjections?: LiveForwardProjectionData[];
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
  // Live Forward Projection (new 4th series)
  liveProjectionWeight?: number;
  liveProjectionPopulation?: number;
  liveProjectionBiomass?: number;
  liveProjectionTemp?: number;
  liveProjectionProvenance?: LiveProjectionProvenance;
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
      
      // Create a map of assignment_id -> departure_date (as string to avoid timezone issues)
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
        // Compare strings directly (both are YYYY-MM-DD format from API)
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
    
    // Add live forward projections (4th series - purple dashed)
    if (seriesVisibility.liveProjection && liveProjections && liveProjections.length > 0) {
      // Aggregate projections across all assignments
      const projectionsByDay = new Map<number, {
        weights: number[];
        populations: number[];
        biomass: number[];
        temps: number[];
        provenance: LiveProjectionProvenance | null;
      }>();
      
      liveProjections.forEach((projData) => {
        // Filter by assignment if selected
        if (selectedAssignmentId && projData.assignment_id !== selectedAssignmentId) {
          return;
        }
        
        projData.projections.forEach((proj) => {
          if (!projectionsByDay.has(proj.day_number)) {
            projectionsByDay.set(proj.day_number, {
              weights: [],
              populations: [],
              biomass: [],
              temps: [],
              provenance: projData.provenance,
            });
          }
          const dayData = projectionsByDay.get(proj.day_number)!;
          dayData.weights.push(proj.projected_weight_g);
          dayData.populations.push(proj.projected_population);
          dayData.biomass.push(proj.projected_biomass_kg);
          dayData.temps.push(proj.temperature_used_c);
        });
      });
      
      // Add aggregated projections to chart data
      projectionsByDay.forEach((dayData, dayNumber) => {
        const existing = dataByDay.get(dayNumber) || {
          day: dayNumber,
          date: '', // Will be computed from projection date
        };
        
        // Population-weighted average for weight
        const totalPop = dayData.populations.reduce((a, b) => a + b, 0);
        const weightedWeight = totalPop > 0
          ? dayData.weights.reduce((sum, w, i) => 
              sum + w * dayData.populations[i], 0) / totalPop
          : dayData.weights.reduce((a, b) => a + b, 0) / dayData.weights.length;
        
        const totalBiomass = dayData.biomass.reduce((a, b) => a + b, 0);
        const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
        
        dataByDay.set(dayNumber, {
          ...existing,
          liveProjectionWeight: weightedWeight,
          liveProjectionPopulation: totalPop,
          liveProjectionBiomass: totalBiomass,
          liveProjectionTemp: avgTemp,
          liveProjectionProvenance: dayData.provenance ?? undefined,
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
            domain={['dataMin', 'dataMax']}
            label={{ value: 'Days', position: 'insideBottom', offset: -10 }}
            className="text-xs"
          />
          
          <YAxis
            label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }}
            className="text-xs"
          />
          
          <Tooltip
            content={<ProvenanceTooltip />}
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
          
          {/* Live Forward Projection Line (Purple Dashed) - NEW */}
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
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Chart Legend Explanation */}
      <div className="text-xs text-muted-foreground space-y-1 pl-4 border-l-2 border-muted">
        <p>• <span className="font-medium text-blue-500">Growth Samples</span>: Measured weights from sampling events</p>
        <p>• <span className="font-medium text-green-500">Scenario Projection</span>: Planned growth based on TGC model</p>
        <p>• <span className="font-medium text-orange-500">Actual Daily State</span>: Reality-based assimilation from measurements + models</p>
        <p>• <span className="font-medium text-purple-500">Live Projection</span>: Forward projection from current state with temperature bias</p>
        <p>• <span className="font-medium">Anchor Points</span> (circles with dots): Growth samples, transfers, or vaccinations that reset weight calculations</p>
      </div>
      
      {/* Live Projection Provenance Info */}
      {seriesVisibility.liveProjection && liveProjections && liveProjections.length > 0 && (
        <div className="text-xs bg-purple-50 dark:bg-purple-950/30 p-3 rounded-md border border-purple-200 dark:border-purple-800">
          <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">
            📊 Live Projection Provenance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-muted-foreground">
            <div>
              <span className="font-medium">Profile:</span>{' '}
              {liveProjections[0]?.provenance?.temp_profile_name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Temp Bias:</span>{' '}
              {liveProjections[0]?.provenance?.temp_bias_c?.toFixed(2) || '0.00'}°C
            </div>
            <div>
              <span className="font-medium">Bias Window:</span>{' '}
              {liveProjections[0]?.provenance?.temp_bias_window_days || 14} days
            </div>
            <div>
              <span className="font-medium">TGC:</span>{' '}
              {liveProjections[0]?.provenance?.tgc_value?.toFixed(4) || 'N/A'}
            </div>
          </div>
          <p className="mt-1 text-muted-foreground/70">
            Computed: {liveProjections[0]?.computed_date || 'Unknown'}
          </p>
        </div>
      )}
    </div>
  );
}

