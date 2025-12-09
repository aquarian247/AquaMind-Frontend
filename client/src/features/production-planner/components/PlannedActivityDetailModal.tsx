/**
 * Planned Activity Detail Modal
 *
 * Displays full details of a planned activity with action buttons.
 * Shows completion info, linked workflows, and audit trail.
 */

import { format } from 'date-fns';
import { Link } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useMarkActivityCompleted } from '../api/api';
import {
  getActivityTypeBadgeVariant,
  getStatusBadgeVariant,
  canMarkCompleted,
  canSpawnWorkflow,
} from '../utils/activityHelpers';
import { useToast } from '@/hooks/use-toast';
import type { PlannedActivity } from '../types';

interface PlannedActivityDetailModalProps {
  activity: PlannedActivity | null;
  onClose: () => void;
  onEdit?: () => void;
  onSpawnWorkflow?: () => void;
}

export function PlannedActivityDetailModal({
  activity,
  onClose,
  onEdit,
  onSpawnWorkflow,
}: PlannedActivityDetailModalProps) {
  const { toast } = useToast();
  const markCompletedMutation = useMarkActivityCompleted();

  if (!activity) return null;

  const handleMarkCompleted = async () => {
    try {
      await markCompletedMutation.mutateAsync(activity.id);
      toast({
        title: 'Activity Completed',
        description: 'The activity has been marked as completed.',
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to mark activity as completed',
        variant: 'destructive',
      });
    }
  };

  const showActionButtons = activity.status !== 'COMPLETED' && activity.status !== 'CANCELLED';

  return (
    <Dialog open={!!activity} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <Badge variant={getActivityTypeBadgeVariant(activity.activity_type)}>
              {activity.activity_type_display}
            </Badge>
            <span>for {activity.batch_number}</span>
            {activity.is_overdue && (
              <Badge variant="destructive">OVERDUE</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Core Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground text-xs">Due Date</Label>
              <p className="text-lg font-semibold mt-1">
                {format(new Date(activity.due_date), 'MMMM dd, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(activity.due_date), 'EEEE')}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Status</Label>
              <div className="mt-1">
                <Badge variant={getStatusBadgeVariant(activity)}>
                  {activity.status_display}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Container</Label>
              <p className="text-lg mt-1">
                {activity.container_name || (
                  <span className="text-muted-foreground italic text-sm">Not specified</span>
                )}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Scenario</Label>
              <p className="text-lg mt-1">{activity.scenario_name}</p>
            </div>
          </div>

          {/* Notes */}
          {activity.notes && (
            <div>
              <Label className="text-muted-foreground text-xs">Notes</Label>
              <div className="mt-2 p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{activity.notes}</p>
              </div>
            </div>
          )}

          {/* Completion Info */}
          {activity.status === 'COMPLETED' && activity.completed_at && (
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
              <Label className="text-muted-foreground text-xs">Completed</Label>
              <p className="mt-2 text-sm">
                <strong>{activity.completed_by_name}</strong> marked this activity as completed on{' '}
                <strong>{format(new Date(activity.completed_at), 'MMMM dd, yyyy HH:mm')}</strong>
              </p>
            </div>
          )}

          {/* Transfer Workflow Link */}
          {activity.transfer_workflow && (
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <Label className="text-muted-foreground text-xs">Linked Transfer Workflow</Label>
              <p className="mt-2 text-sm">
                This activity is linked to Transfer Workflow{' '}
                <Link href={`/transfer-workflows/${activity.transfer_workflow}`}>
                  <span className="text-primary underline hover:text-primary/80 cursor-pointer">
                    #{activity.transfer_workflow}
                  </span>
                </Link>
              </p>
            </div>
          )}

          {/* Audit Trail */}
          <div className="border-t pt-4">
            <Label className="text-muted-foreground text-xs">Audit Information</Label>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>Created:</strong> {format(new Date(activity.created_at), 'MMMM dd, yyyy HH:mm')} by{' '}
                {activity.created_by_name}
              </p>
              <p>
                <strong>Last Updated:</strong> {format(new Date(activity.updated_at), 'MMMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:mr-auto">
            Close
          </Button>
          {showActionButtons && (
            <>
              {onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  Edit
                </Button>
              )}
              {canSpawnWorkflow(activity) && onSpawnWorkflow && (
                <Button variant="secondary" onClick={onSpawnWorkflow}>
                  Create Workflow
                </Button>
              )}
              {canMarkCompleted(activity) && (
                <Button
                  onClick={handleMarkCompleted}
                  disabled={markCompletedMutation.isPending}
                >
                  {markCompletedMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Mark as Completed
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

