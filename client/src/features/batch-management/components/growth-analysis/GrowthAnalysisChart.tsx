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
import type { GrowthAnalysisData, GrowthSample, ActualDailyState } from '../../api/growth-assimilation';

interface SeriesVisibility {
  samples: boolean;
  scenario: boolean;
  actual: boolean;
}

interface GrowthAnalysisChartProps {
  data: GrowthAnalysisData;
  seriesVisibility: SeriesVisibility;
  selectedAssignmentId?: number;
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
}

export function GrowthAnalysisChart({
  data,
  seriesVisibility,
  selectedAssignmentId,
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
      const departingAssignments = new Map<number, Date>();
      data.container_assignments.forEach((assignment) => {
        if (assignment.departure_date) {
          departingAssignments.set(assignment.id, new Date(assignment.departure_date));
        }
      });
      
      data.actual_daily_states.forEach((state) => {
        // Filter by assignment if selected
        if (selectedAssignmentId && state.assignment_id !== selectedAssignmentId) {
          return;
        }
        
        // CRITICAL: Exclude departing assignments on their departure day
        // to prevent double-counting during transfers
        const departureDate = departingAssignments.get(state.assignment_id);
        if (departureDate) {
          // Compare dates using ISO strings (ignores time component)
          const stateDateStr = state.date; // Already ISO string from API
          const departureDateStr = departureDate.toISOString().split('T')[0];
          if (stateDateStr === departureDateStr) {
            // This is the last day for departing assignment - skip to avoid double-count
            return;
          }
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
        
        // Debug: Log transfer days and detect double-counting
        if ([90, 180, 270, 360, 450].includes(dayNumber)) {
          console.log(`Day ${dayNumber}: ${states.length} containers, ${totalPopulation.toLocaleString()} fish, ${batchAvgWeight.toFixed(1)}g avg`);
          if (totalPopulation > 6000000) {
            console.warn(`⚠️ Day ${dayNumber}: Population ${totalPopulation.toLocaleString()} seems double-counted! (Expected ~3M)`);
          }
        }
        
        // Sanity check: Catch absurd aggregations
        if (batchAvgWeight > 2500 || batchAvgWeight < 0) {
          console.warn(`⚠️ Day ${dayNumber}: Unusual weight ${batchAvgWeight.toFixed(1)}g (${states.length} containers)`, states);
        }
        
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
    
    // Convert map to array and sort by day
    return Array.from(dataByDay.values()).sort((a, b) => a.day - b.day);
  }, [
    data,
    seriesVisibility,
    selectedAssignmentId,
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
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Chart Legend Explanation */}
      <div className="text-xs text-muted-foreground space-y-1 pl-4 border-l-2 border-muted">
        <p>• <span className="font-medium">Growth Samples</span>: Measured weights from sampling events</p>
        <p>• <span className="font-medium">Scenario Projection</span>: Planned growth based on TGC model</p>
        <p>• <span className="font-medium">Actual Daily State</span>: Reality-based assimilation from measurements + models</p>
        <p>• <span className="font-medium">Anchor Points</span> (circles with dots): Growth samples, transfers, or vaccinations that reset weight calculations</p>
      </div>
    </div>
  );
}

