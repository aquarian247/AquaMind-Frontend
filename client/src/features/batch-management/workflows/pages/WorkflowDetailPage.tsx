/**
 * Workflow Detail Page - Shows workflow progress and actions.
 * 
 * Features:
 * - Workflow header with status
 * - Progress tracking
 * - Action list with execution
 * - Timeline visualization
 * - Finance integration (if intercompany)
 */

import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Play,
  Plus,
  XCircle,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { useWorkflow, useActions, useCancelWorkflow, usePlanWorkflow } from '../api';
import { AddActionsDialog } from '../components/AddActionsDialog';
import { ExecuteActionDialog } from '../components/ExecuteActionDialog';
import { FinanceSummaryCard } from '../components/FinanceSummaryCard';
import {
  canCancelWorkflow,
  formatBiomass,
  formatCount,
  formatDate,
  formatDateRange,
  formatPercentage,
  getDaysBetween,
  getActionStatusConfig,
  getWorkflowStatusConfig,
  type ActionStatus,
  type WorkflowStatus,
} from '../utils';

export function WorkflowDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const workflowId = params.id ? parseInt(params.id) : undefined;
  const { toast } = useToast();

  const { data: workflow, isLoading, error } = useWorkflow(workflowId);
  const { data: actionsData } = useActions({ workflow: workflowId });
  const cancelWorkflow = useCancelWorkflow();
  const planWorkflow = usePlanWorkflow();

  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddActionsDialog, setShowAddActionsDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load workflow: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const actions = actionsData?.results || [];
  const statusConfig = getWorkflowStatusConfig(workflow.status as WorkflowStatus);
  
  const daysElapsed = getDaysBetween(
    workflow.actual_start_date || workflow.planned_start_date,
    new Date().toISOString()
  );
  
  const daysRemaining = getDaysBetween(
    new Date().toISOString(),
    workflow.planned_completion_date
  );

  const canAddActions = workflow.status === 'DRAFT';
  const canPlanWorkflow = workflow.status === 'DRAFT' && workflow.total_actions_planned > 0;

  const handlePlanWorkflow = async () => {
    try {
      await planWorkflow.mutateAsync(workflow.id);
      toast({
        title: 'Workflow Planned',
        description: 'Workflow is now ready for execution',
      });
    } catch (error) {
      console.error('Error planning workflow:', error);
      toast({
        title: 'Error Planning Workflow',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCancelWorkflow = async () => {
    // Validate reason is provided
    if (!cancelReason.trim()) {
      toast({
        title: 'Cancellation Reason Required',
        description: 'Please provide a reason for cancelling this workflow (required for compliance)',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await cancelWorkflow.mutateAsync({
        id: workflow.id,
        reason: cancelReason,
      });
      
      toast({
        title: 'Workflow Cancelled',
        description: 'The workflow has been cancelled successfully',
      });
      
      // Navigate back to list
      navigate('/transfer-workflows');
    } catch (error) {
      console.error('Error cancelling workflow:', error);
      
      let errorMessage = 'Failed to cancel workflow';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.body) {
          errorMessage = JSON.stringify(apiError.body);
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      toast({
        title: 'Error Cancelling Workflow',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setShowCancelDialog(false);
      setCancelReason('');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/transfer-workflows')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {workflow.workflow_number}
              </h1>
              <WorkflowStatusBadge status={workflow.status as WorkflowStatus} />
              {workflow.is_intercompany && (
                <Badge variant="outline">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Intercompany
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {workflow.batch_number} • {workflow.workflow_type_display}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {canPlanWorkflow && (
            <Button onClick={handlePlanWorkflow} disabled={planWorkflow.isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              {planWorkflow.isPending ? 'Planning...' : 'Plan Workflow'}
            </Button>
          )}
          {canCancelWorkflow(workflow) && (
            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Workflow
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Actions Completed</span>
              <span className="font-medium">
                {workflow.actions_completed} / {workflow.total_actions_planned}
                <span className="text-muted-foreground ml-2">
                  ({formatPercentage(workflow.completion_percentage)})
                </span>
              </span>
            </div>
            <Progress
              value={parseFloat(workflow.completion_percentage)}
              className="h-3"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <StatCard
              label="Total Transferred"
              value={formatCount(workflow.total_transferred_count)}
              icon={ArrowRightLeft}
            />
            <StatCard
              label="Total Biomass"
              value={formatBiomass(workflow.total_biomass_kg)}
              icon={ArrowRightLeft}
            />
            <StatCard
              label="Mortality"
              value={formatCount(workflow.total_mortality_count)}
              icon={XCircle}
              valueColor="text-red-600"
            />
            <StatCard
              label="Days Elapsed"
              value={daysElapsed !== null ? `${daysElapsed} days` : '—'}
              icon={Clock}
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Planned Start</Label>
              <p className="text-sm font-medium">{formatDate(workflow.planned_start_date)}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Actual Start</Label>
              <p className="text-sm font-medium">{formatDate(workflow.actual_start_date)}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Completion</Label>
              <p className="text-sm font-medium">
                {formatDate(workflow.actual_completion_date || workflow.planned_completion_date)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finance Summary (if intercompany) */}
      <FinanceSummaryCard workflow={workflow} />

      {/* Actions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transfer Actions</CardTitle>
              <CardDescription>
                Individual container-to-container movements
              </CardDescription>
            </div>
            {canAddActions && (
              <Button onClick={() => setShowAddActionsDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Actions
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground mb-4">
                No actions planned for this workflow
              </p>
              {canAddActions && (
                <Button onClick={() => setShowAddActionsDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Actions to Continue
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Biomass</TableHead>
                  <TableHead>Executed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell className="font-medium">
                      {action.action_number}
                    </TableCell>
                    <TableCell>
                      <ActionStatusBadge status={action.status as ActionStatus} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {(action as any).source_assignment_info?.container_name || `#${action.source_assignment}`}
                    </TableCell>
                    <TableCell className="text-sm">
                      {(action as any).dest_assignment_info?.container_name || `#${action.dest_assignment}`}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatCount(action.transferred_count)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatBiomass(action.transferred_biomass_kg)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(action.actual_execution_date)}
                    </TableCell>
                    <TableCell>
                      {action.status === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedActionId(action.id)}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Execute
                        </Button>
                      )}
                      {action.status === 'COMPLETED' && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Actions Dialog */}
      {showAddActionsDialog && (
        <AddActionsDialog
          workflow={workflow}
          open={showAddActionsDialog}
          onClose={() => setShowAddActionsDialog(false)}
          onSuccess={() => {
            setShowAddActionsDialog(false);
            // Refresh is automatic via React Query invalidation
          }}
        />
      )}

      {/* Execute Action Dialog */}
      {selectedActionId && (
        <ExecuteActionDialog
          actionId={selectedActionId}
          open={!!selectedActionId}
          onClose={() => setSelectedActionId(null)}
        />
      )}

      {/* Cancel Workflow Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Workflow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will cancel workflow <strong>{workflow.workflow_number}</strong>.
              {workflow.actions_completed > 0 && (
                <span className="block mt-2 text-amber-600">
                  <strong>Warning:</strong> {workflow.actions_completed} action(s) have already been completed.
                  Cancelling will not reverse these transfers.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="cancel-reason" className="text-sm font-medium">
              Reason for cancellation *
              <span className="text-xs text-muted-foreground ml-2 font-normal">
                (Required for compliance)
              </span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Enter reason for cancelling this workflow..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-2 min-h-[80px]"
              required
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCancelDialog(false);
              setCancelReason('');
            }}>
              Keep Workflow
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelWorkflow}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelWorkflow.isPending}
            >
              {cancelWorkflow.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Workflow
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const config = getWorkflowStatusConfig(status);
  
  return (
    <Badge variant={config.variant} className={`${config.bgColor} ${config.color}`}>
      {config.label}
    </Badge>
  );
}

function ActionStatusBadge({ status }: { status: ActionStatus }) {
  const config = getActionStatusConfig(status);
  
  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  valueColor?: string;
}

function StatCard({ label, value, icon: Icon, valueColor = 'text-foreground' }: StatCardProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}

