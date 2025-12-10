/**
 * Projection Preview Tooltip Component
 *
 * Displays scenario-based rationale for a planned activity's due date.
 * Shows projected weight, population, and scenario context on hover.
 *
 * Phase 8.5: UI polish feature to increase transparency of planning decisions.
 */

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2, Info, Scale, Users } from 'lucide-react';
import { useProjectionPreview } from '../api/api';
import { format } from 'date-fns';

interface ProjectionPreviewTooltipProps {
  /** The ID of the planned activity */
  activityId: number;
  /** Child element that triggers the tooltip on hover */
  children: React.ReactNode;
  /** Optional className for styling the wrapper */
  className?: string;
}

/**
 * A tooltip that fetches and displays projection preview data on hover.
 *
 * @example
 * <ProjectionPreviewTooltip activityId={123}>
 *   <span>Activity Name</span>
 * </ProjectionPreviewTooltip>
 */
export function ProjectionPreviewTooltip({
  activityId,
  children,
  className,
}: ProjectionPreviewTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only fetch when tooltip is open
  const { data, isLoading, error } = useProjectionPreview(activityId, isOpen);

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <span className={className}>{children}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3" side="top" align="center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading projection...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive">
              <Info className="h-4 w-4" />
              <span>Unable to load projection</span>
            </div>
          ) : data ? (
            <div className="space-y-2">
              {/* Header: Scenario name */}
              <div className="font-semibold text-sm border-b pb-1">
                {data.scenario_name}
              </div>

              {/* Date info */}
              <div className="text-xs text-muted-foreground">
                Due: {format(new Date(data.due_date), 'MMM d, yyyy')}
                {data.day_number && <span className="ml-2">(Day {data.day_number})</span>}
              </div>

              {/* Projected metrics */}
              <div className="space-y-1">
                {data.projected_weight_g !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Scale className="h-3.5 w-3.5 text-blue-500" />
                    <span>
                      Projected:{' '}
                      <span className="font-medium">
                        {data.projected_weight_g.toFixed(1)}g
                      </span>
                    </span>
                  </div>
                )}
                {data.projected_population !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3.5 w-3.5 text-green-500" />
                    <span>
                      Population:{' '}
                      <span className="font-medium">
                        {data.projected_population.toLocaleString()}
                      </span>
                    </span>
                  </div>
                )}
                {data.projected_biomass_kg !== null && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="ml-5">
                      Biomass: {data.projected_biomass_kg.toFixed(1)} kg
                    </span>
                  </div>
                )}
              </div>

              {/* Rationale */}
              <div className="text-xs text-muted-foreground italic pt-1 border-t">
                {data.rationale}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No projection data</div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * A simpler info icon variant that can be placed next to activity names
 */
export function ProjectionPreviewIcon({ activityId }: { activityId: number }) {
  return (
    <ProjectionPreviewTooltip activityId={activityId}>
      <button
        type="button"
        className="inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted transition-colors"
      >
        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
      </button>
    </ProjectionPreviewTooltip>
  );
}

export default ProjectionPreviewTooltip;

