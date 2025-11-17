/**
 * Growth Analysis Tab Content
 * 
 * Main orchestrator for the Growth Analysis feature.
 * Displays three-panel layout with controls, chart, and container drilldown.
 * 
 * Issue: #112 - Phase 7
 */

import React, { useState, useMemo } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  useCombinedGrowthData,
  determineGranularity,
  type GrowthDataOptions,
} from '../../api/growth-assimilation';
import { DataVisualizationControls } from './DataVisualizationControls';
import { GrowthAnalysisChart } from './GrowthAnalysisChart';
import { ContainerDrilldown } from './ContainerDrilldown';
import { VarianceAnalysis } from './VarianceAnalysis';

interface GrowthAnalysisTabContentProps {
  batchId: number;
}

interface SeriesVisibility {
  samples: boolean;
  scenario: boolean;
  actual: boolean;
}

export function GrowthAnalysisTabContent({ batchId }: GrowthAnalysisTabContentProps) {
  // ============================================================================
  // State Management
  // ============================================================================
  
  const [seriesVisibility, setSeriesVisibility] = useState<SeriesVisibility>({
    samples: true,
    scenario: true,
    actual: true,
  });
  
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | undefined>();
  const [granularity, setGranularity] = useState<'daily' | 'weekly'>('daily');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  
  // ============================================================================
  // API Query
  // ============================================================================
  
  const queryOptions = useMemo<GrowthDataOptions>(() => {
    const opts: GrowthDataOptions = {
      granularity,
      assignmentId: selectedAssignmentId,
    };
    
    if (dateRange.start) {
      opts.startDate = dateRange.start.toISOString().split('T')[0];
    }
    if (dateRange.end) {
      opts.endDate = dateRange.end.toISOString().split('T')[0];
    }
    
    return opts;
  }, [granularity, selectedAssignmentId, dateRange]);
  
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useCombinedGrowthData(batchId, queryOptions);
  
  // ============================================================================
  // Auto-adjust granularity for long date ranges
  // ============================================================================
  
  React.useEffect(() => {
    if (data && data.date_range) {
      const start = new Date(data.date_range.start);
      const end = new Date(data.date_range.end);
      const suggestedGranularity = determineGranularity(start, end);
      
      if (suggestedGranularity === 'weekly' && granularity === 'daily') {
        // Auto-switch to weekly for performance
        setGranularity('weekly');
      }
    }
  }, [data, granularity]);
  
  // ============================================================================
  // Event Handlers
  // ============================================================================
  
  const handleSeriesToggle = (series: keyof SeriesVisibility) => {
    setSeriesVisibility((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };
  
  const handleContainerSelect = (assignmentId: number | undefined) => {
    setSelectedAssignmentId(assignmentId);
  };
  
  const handleDateRangeChange = (start?: Date, end?: Date) => {
    setDateRange({ start, end });
  };
  
  const handleGranularityChange = (newGranularity: 'daily' | 'weekly') => {
    setGranularity(newGranularity);
  };
  
  // ============================================================================
  // Loading State
  // ============================================================================
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading growth analysis data...</p>
        </div>
      </div>
    );
  }
  
  // ============================================================================
  // Error States
  // ============================================================================
  
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const is403 = errorMessage.includes('403') || errorMessage.includes('Forbidden');
    const is404 = errorMessage.includes('404') || errorMessage.includes('not found');
    
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {is403 ? 'Access Denied' : is404 ? 'Batch Not Found' : 'Error Loading Data'}
        </AlertTitle>
        <AlertDescription>
          {is403 ? (
            <>
              You don't have permission to view this batch. 
              This batch may be outside your assigned geography or areas.
              Contact your manager if you believe this is an error.
            </>
          ) : is404 ? (
            <>
              The requested batch could not be found. It may have been deleted or you may not have access to it.
            </>
          ) : (
            <>
              {errorMessage}
              <div className="mt-4">
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            </>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  // ============================================================================
  // Empty States
  // ============================================================================
  
  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          No growth data is available for this batch.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!data.scenario) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Scenario Pinned</AlertTitle>
        <AlertDescription>
          This batch doesn't have a scenario pinned yet. Pin a scenario to see growth projections and variance analysis.
          <div className="mt-4">
            <Button onClick={() => {/* TODO: Open scenario selector */}} size="sm">
              Pin Scenario
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (data.growth_samples.length === 0 && data.actual_daily_states.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Growth Data Yet</AlertTitle>
        <AlertDescription>
          No growth samples or daily states have been recorded for this batch. 
          Record growth samples to start tracking actual performance.
        </AlertDescription>
      </Alert>
    );
  }
  
  // ============================================================================
  // Main Three-Panel Layout
  // ============================================================================
  
  return (
    <div className="space-y-6">
      {/* Batch Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Batch Growth Analysis</h2>
          <p className="text-muted-foreground">
            {data.batch_number} • {data.species} • {data.lifecycle_stage}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            data.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
          }`}>
            {data.status}
          </span>
        </div>
      </div>
      
      {/* Three-Panel Layout */}
      <div className="grid grid-cols-[280px_1fr_300px] gap-6">
        {/* Left Panel: Controls */}
        <Card className="p-4 h-fit">
          <DataVisualizationControls
            batchId={batchId}
            scenario={data.scenario}
            seriesVisibility={seriesVisibility}
            granularity={granularity}
            onSeriesToggle={handleSeriesToggle}
            onGranularityChange={handleGranularityChange}
            onDateRangeChange={handleDateRangeChange}
          />
        </Card>
        
        {/* Center Panel: Chart + Variance */}
        <div className="space-y-6">
          <Card className="p-6">
            <GrowthAnalysisChart
              data={data}
              seriesVisibility={seriesVisibility}
              selectedAssignmentId={selectedAssignmentId}
            />
          </Card>
          
          <VarianceAnalysis
            actualDailyStates={data.actual_daily_states}
            scenarioProjection={data.scenario_projection}
          />
        </div>
        
        {/* Right Panel: Container Drilldown */}
        <Card className="p-4 h-fit">
          <ContainerDrilldown
            assignments={data.container_assignments}
            selectedAssignmentId={selectedAssignmentId}
            onSelectAssignment={handleContainerSelect}
          />
        </Card>
      </div>
    </div>
  );
}

