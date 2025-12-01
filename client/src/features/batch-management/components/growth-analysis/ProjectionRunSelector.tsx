/**
 * Projection Run Selector Component
 * 
 * Allows users to select and pin specific projection runs to batches.
 * Provides version control for scenario projections, ensuring re-running
 * projections doesn't affect existing batch analysis.
 * 
 * Related: ProjectionRun Implementation Plan
 */

import React from 'react';
import { Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useScenarioProjectionRuns } from '@/features/scenario/api/api';
import { usePinProjectionRun } from '../../api/growth-assimilation';
import { formatDistanceToNow } from 'date-fns';

interface ProjectionRunSelectorProps {
  batchId: number;
  currentRunId?: number;
  scenarioId: number;
  onRunChange?: (runId: number) => void;
}

export function ProjectionRunSelector({
  batchId,
  currentRunId,
  scenarioId,
  onRunChange,
}: ProjectionRunSelectorProps) {
  const { data: runs, isLoading } = useScenarioProjectionRuns(scenarioId);
  const pinMutation = usePinProjectionRun(batchId);
  
  const handleSelect = (runIdStr: string) => {
    const runId = parseInt(runIdStr, 10);
    pinMutation.mutate(
      { projection_run_id: runId },
      { 
        onSuccess: () => {
          onRunChange?.(runId);
        }
      }
    );
  };
  
  if (isLoading) {
    return <div className="animate-pulse h-10 bg-muted rounded" />;
  }
  
  if (!runs || runs.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No projection runs available. Run projections for this scenario first.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="projection-run">Projection Run</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Each time projections are calculated, a new "run" is created.
                Switch between runs to compare how projections have changed,
                or use an older baseline for variance analysis.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select
        value={currentRunId?.toString()}
        onValueChange={handleSelect}
        disabled={pinMutation.isPending}
      >
        <SelectTrigger id="projection-run" className="w-full">
          <SelectValue placeholder="Select projection run" />
        </SelectTrigger>
        <SelectContent>
          {runs.map((run: any) => (
            <SelectItem key={run.run_id} value={run.run_id.toString()}>
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium">Run #{run.run_number}</span>
                {run.label && (
                  <Badge variant="outline" className="text-xs">
                    {run.label}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatDistanceToNow(new Date(run.run_date), { addSuffix: true })}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {currentRunId && runs && (
        <p className="text-xs text-muted-foreground">
          {runs.find((r: any) => r.run_id === currentRunId)?.pinned_batch_count || 0} batch(es) 
          using this run
        </p>
      )}
    </div>
  );
}





