import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useLifecycleStages } from '@/features/batch-management/api';
import { useSpawnWorkflow } from '../api/api';
import { useToast } from '@/hooks/use-toast';
import type { PlannedActivity } from '../types';

interface SpawnWorkflowDialogProps {
  activity: PlannedActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SpawnWorkflowDialog({
  activity,
  isOpen,
  onClose,
  onSuccess,
}: SpawnWorkflowDialogProps) {
  const { toast } = useToast();
  const spawnWorkflowMutation = useSpawnWorkflow();
  const { data: lifecycleStagesResponse, isLoading: isLoadingStages } = useLifecycleStages({
    ordering: 'order', // Ensure stages are ordered
  });

  const [sourceStageId, setSourceStageId] = useState<string>('');
  const [destStageId, setDestStageId] = useState<string>('');

  const lifecycleStages = lifecycleStagesResponse?.results || [];

  const handleSubmit = async () => {
    if (!activity || !sourceStageId || !destStageId) return;

    try {
      await spawnWorkflowMutation.mutateAsync({
        id: activity.id,
        data: {
          workflow_type: 'LIFECYCLE_TRANSITION',
          source_lifecycle_stage: Number(sourceStageId),
          dest_lifecycle_stage: Number(destStageId),
        },
      });

      toast({
        title: 'Workflow Spawned',
        description: 'Transfer workflow has been successfully created.',
      });

      onSuccess?.();
      onClose();
      setSourceStageId('');
      setDestStageId('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to spawn workflow',
        variant: 'destructive',
      });
    }
  };

  const isPending = spawnWorkflowMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Spawn Transfer Workflow</DialogTitle>
          <DialogDescription>
            Create a lifecycle transition workflow for this planned transfer.
            This will link the activity to the new workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Source Stage */}
          <div className="grid gap-2">
            <Label htmlFor="source-stage">Source Lifecycle Stage</Label>
            <Select
              value={sourceStageId}
              onValueChange={setSourceStageId}
              disabled={isLoadingStages || isPending}
            >
              <SelectTrigger id="source-stage">
                <SelectValue placeholder="Select current stage..." />
              </SelectTrigger>
              <SelectContent>
                {lifecycleStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id.toString()}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Stage */}
          <div className="grid gap-2">
            <Label htmlFor="dest-stage">Destination Lifecycle Stage</Label>
            <Select
              value={destStageId}
              onValueChange={setDestStageId}
              disabled={isLoadingStages || isPending}
            >
              <SelectTrigger id="dest-stage">
                <SelectValue placeholder="Select target stage..." />
              </SelectTrigger>
              <SelectContent>
                {lifecycleStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id.toString()}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!sourceStageId || !destStageId || isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}





