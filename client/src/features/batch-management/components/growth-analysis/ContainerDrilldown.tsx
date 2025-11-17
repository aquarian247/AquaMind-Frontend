/**
 * Container Drilldown
 * 
 * Right panel showing list of container assignments.
 * Click to filter chart to a specific container.
 * 
 * Issue: #112 - Phase 7
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ContainerAssignment } from '../../api/growth-assimilation';

interface ContainerDrilldownProps {
  assignments: ContainerAssignment[];
  selectedAssignmentId?: number;
  onSelectAssignment: (assignmentId: number | undefined) => void;
}

export function ContainerDrilldown({
  assignments,
  selectedAssignmentId,
  onSelectAssignment,
}: ContainerDrilldownProps) {
  
  // ============================================================================
  // Format Date
  // ============================================================================
  
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // ============================================================================
  // Handle Selection
  // ============================================================================
  
  const handleSelect = (assignmentId: number) => {
    // Toggle selection
    if (selectedAssignmentId === assignmentId) {
      onSelectAssignment(undefined); // Deselect
    } else {
      onSelectAssignment(assignmentId);
    }
  };
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-sm">Container Drilldown</h3>
        <p className="text-xs text-muted-foreground mt-1">
          View growth data for individual containers
        </p>
      </div>
      
      {/* All Containers Button */}
      {selectedAssignmentId && (
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onSelectAssignment(undefined)}
        >
          Show All Containers
        </Button>
      )}
      
      {/* Container List */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          Active Containers ({assignments.length})
        </Label>
        
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No container assignments
            </p>
          ) : (
            assignments.map((assignment) => (
              <button
                key={assignment.id}
                onClick={() => handleSelect(assignment.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md transition-colors',
                  'hover:bg-accent',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  selectedAssignmentId === assignment.id && 'bg-accent border-l-4 border-primary'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {/* Container Name */}
                    <p className="font-medium text-sm truncate">
                      {assignment.container_name}
                    </p>
                    
                    {/* Container Type & Lifecycle Stage */}
                    <p className="text-xs text-muted-foreground">
                      {assignment.container_type} • {assignment.lifecycle_stage}
                    </p>
                    
                    {/* Arrival Date */}
                    <p className="text-xs text-muted-foreground mt-1">
                      Since {formatDate(assignment.arrival_date)}
                    </p>
                    
                    {/* Stats */}
                    <div className="mt-2 text-xs space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Population:</span>
                        <span className="font-medium">{assignment.population_count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Weight:</span>
                        <span className="font-medium">{assignment.avg_weight_g.toFixed(1)}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biomass:</span>
                        <span className="font-medium">{assignment.biomass_kg.toFixed(1)}kg</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chevron Icon */}
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground transition-transform',
                      selectedAssignmentId === assignment.id && 'rotate-90'
                    )}
                  />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      {/* Help Text */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
        <p className="font-medium mb-1">Click a container to:</p>
        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
          <li>Filter chart to that container only</li>
          <li>See container-specific growth data</li>
          <li>Compare against scenario projection</li>
        </ul>
      </div>
    </div>
  );
}

