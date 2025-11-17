/**
 * Variance Analysis
 * 
 * Bottom section showing variance metrics between actual and scenario projection.
 * Displays Current, Average, and Maximum variance with alert banner.
 * 
 * Issue: #112 - Phase 7
 */

import React, { useMemo } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ActualDailyState, ScenarioProjectionDay } from '../../api/growth-assimilation';

interface VarianceAnalysisProps {
  actualDailyStates: ActualDailyState[];
  scenarioProjection: ScenarioProjectionDay[];
}

interface VarianceMetrics {
  current: { grams: number; percent: number; date: string } | null;
  average: { grams: number; percent: number } | null;
  maximum: { grams: number; percent: number; date: string } | null;
}

export function VarianceAnalysis({
  actualDailyStates,
  scenarioProjection,
}: VarianceAnalysisProps) {
  
  // ============================================================================
  // Calculate Variance Metrics
  // ============================================================================
  
  const metrics = useMemo<VarianceMetrics>(() => {
    if (actualDailyStates.length === 0 || scenarioProjection.length === 0) {
      return { current: null, average: null, maximum: null };
    }
    
    // Create a map of date -> scenario weight
    const scenarioByDate = new Map<string, number>();
    scenarioProjection.forEach((proj) => {
      scenarioByDate.set(proj.date, proj.avg_weight_g);
    });
    
    // Calculate variances for each actual state
    const variances: Array<{ grams: number; percent: number; date: string }> = [];
    
    actualDailyStates.forEach((state) => {
      const scenarioWeight = scenarioByDate.get(state.date);
      if (scenarioWeight !== undefined) {
        const grams = state.avg_weight_g - scenarioWeight;
        const percent = (grams / scenarioWeight) * 100;
        variances.push({ grams, percent, date: state.date });
      }
    });
    
    if (variances.length === 0) {
      return { current: null, average: null, maximum: null };
    }
    
    // Current (most recent)
    const current = variances[variances.length - 1];
    
    // Average
    const avgGrams = variances.reduce((sum, v) => sum + v.grams, 0) / variances.length;
    const avgPercent = variances.reduce((sum, v) => sum + v.percent, 0) / variances.length;
    const average = { grams: avgGrams, percent: avgPercent };
    
    // Maximum (by absolute value)
    const maximum = variances.reduce((max, v) => {
      return Math.abs(v.grams) > Math.abs(max.grams) ? v : max;
    }, variances[0]);
    
    return { current, average, maximum };
  }, [actualDailyStates, scenarioProjection]);
  
  // ============================================================================
  // Format Functions
  // ============================================================================
  
  const formatVariance = (grams: number, percent: number) => {
    const sign = grams >= 0 ? '+' : '';
    return {
      grams: `${sign}${grams.toFixed(1)}g`,
      percent: `${sign}${percent.toFixed(1)}%`,
    };
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  if (!metrics.current) {
    return null; // No variance data available
  }
  
  const isUnderperforming = metrics.current.grams < 0;
  const isSignificant = Math.abs(metrics.current.percent) > 5; // More than 5% variance
  
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Variance Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Comparing actual performance against scenario projections
            </p>
          </div>
          
          {/* Variance Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {/* Current Variance */}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Current Variance
              </p>
              <div className="flex items-center gap-2">
                {isUnderperforming ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
                <div>
                  <p className={`text-2xl font-bold ${
                    isUnderperforming ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {formatVariance(metrics.current.grams, metrics.current.percent).grams}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatVariance(metrics.current.grams, metrics.current.percent).percent}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Average Variance */}
            {metrics.average && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Average Variance
                </p>
                <div>
                  <p className="text-2xl font-bold">
                    {formatVariance(metrics.average.grams, metrics.average.percent).grams}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatVariance(metrics.average.grams, metrics.average.percent).percent}
                  </p>
                </div>
              </div>
            )}
            
            {/* Maximum Variance */}
            {metrics.maximum && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Maximum Variance
                </p>
                <div>
                  <p className={`text-2xl font-bold ${
                    metrics.maximum.grams < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {formatVariance(metrics.maximum.grams, metrics.maximum.percent).grams}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    on {formatDate(metrics.maximum.date)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Alert Banner for Significant Variance */}
      {isSignificant && (
        <Alert variant={isUnderperforming ? 'destructive' : 'default'}>
          <AlertDescription>
            {isUnderperforming ? (
              <>
                ⚠️ <strong>Batch is underperforming</strong> compared to projection. 
                The current weight is {Math.abs(metrics.current.percent).toFixed(1)}% below the scenario projection.
              </>
            ) : (
              <>
                ✅ <strong>Batch is outperforming</strong> the projection. 
                The current weight is {metrics.current.percent.toFixed(1)}% above the scenario projection.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

