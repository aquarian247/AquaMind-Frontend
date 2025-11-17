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
}

export function ProvenanceTooltip({ active, payload, label }: ProvenanceTooltipProps) {
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
    anchorType,
    sources,
    confidenceScores,
    containerCount,
    sampleCount,
  } = data;
  
  return (
    <div className="bg-background border border-border shadow-lg rounded-lg p-4 max-w-xs">
      {/* Header */}
      <div className="border-b border-border pb-2 mb-2">
        <p className="font-semibold text-sm">{date}</p>
        <p className="text-xs text-muted-foreground">
          Day {day}
          {containerCount > 1 && ` • ${containerCount} containers`}
          {sampleCount > 1 && ` • ${sampleCount} samples`}
        </p>
      </div>
      
      {/* Values */}
      <div className="space-y-2">
        {scenarioWeight !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Scenario</span>
            </div>
            <span className="font-medium text-sm">{scenarioWeight.toFixed(1)}g</span>
          </div>
        )}
        
        {actualWeight !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">Actual</span>
            </div>
            <span className="font-medium text-sm">{actualWeight.toFixed(1)}g</span>
          </div>
        )}
        
        {sampleWeight !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Sample</span>
            </div>
            <span className="font-medium text-sm">{sampleWeight.toFixed(1)}g</span>
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

