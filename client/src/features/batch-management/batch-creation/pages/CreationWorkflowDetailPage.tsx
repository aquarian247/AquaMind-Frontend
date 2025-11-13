/**
 * Creation Workflow Detail Page
 * 
 * Shows workflow details, progress, and actions.
 */
import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Package, AlertCircle, Plus, Play, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

import { ApiService } from '@/api/generated';
import { useCreationWorkflow, useCreationActions, usePlanCreationWorkflow, useCancelCreationWorkflow } from '../api';
import type { CreationAction } from '../api';
import { AddCreationActionsDialog } from '../components/AddCreationActionsDialog';
import { ExecuteCreationActionDialog } from '../components/ExecuteCreationActionDialog';

export function CreationWorkflowDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const workflowId = params.id ? parseInt(params.id) : undefined;
  
  const { data: workflow, isLoading, refetch } = useCreationWorkflow(workflowId);
  const { data: actionsData, refetch: refetchActions } = useCreationActions(workflowId);
  
  const [addActionsDialogOpen, setAddActionsDialogOpen] = useState(false);
  const [executeActionDialogOpen, setExecuteActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<CreationAction | null>(null);
  const [geographyId, setGeographyId] = useState<number | null>(null);
  
  const actions = actionsData?.results || [];
  
  const planWorkflow = usePlanCreationWorkflow();
  const cancelWorkflow = useCancelCreationWorkflow();
  
  // Fetch batch to get geography
  const { data: batchData } = useQuery({
    queryKey: ['batch', workflow?.batch],
    queryFn: async () => {
      if (!workflow?.batch) return null;
      const result = await ApiService.apiV1BatchBatchesRetrieve(workflow.batch);
      // Extract geography from batch (may be in various field names)
      const geo = (result as any)?.geography || (result as any)?.geography_id || (result as any)?.current_geography || (result as any)?.current_geography_id;
      if (geo) {
        setGeographyId(geo);
      }
      return result;
    },
    enabled: !!workflow?.batch,
  });
  
  const handlePlanWorkflow = async () => {
    if (!workflowId) return;
    
    try {
      await planWorkflow.mutateAsync(workflowId);
      toast({
        title: 'Workflow Planned',
        description: 'The workflow has been scheduled successfully',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Failed to Plan Workflow',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  const handleCancelWorkflow = async () => {
    if (!workflowId) return;
    
    const reason = window.prompt('Enter cancellation reason:');
    if (!reason) return;
    
    try {
      await cancelWorkflow.mutateAsync({ workflowId, reason });
      toast({
        title: 'Workflow Cancelled',
        description: 'The workflow has been cancelled',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Failed to Cancel Workflow',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };
  
  const handleExecuteAction = (action: CreationAction) => {
    setSelectedAction(action);
    setExecuteActionDialogOpen(true);
  };
  
  const handleActionSuccess = () => {
    refetch();
    refetchActions();
  };
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!workflow) {
    return <div className="p-8 text-center">Workflow not found</div>;
  }
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'secondary';
      case 'PLANNED': return 'default';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'destructive';
      default: return 'secondary';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/batch-creation-workflows')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{workflow.workflow_number}</h1>
              <Badge variant={getStatusBadgeVariant(workflow.status)}>
                {workflow.status_display}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Batch {workflow.batch_number} • {workflow.species_name} ({workflow.lifecycle_stage_name})
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {workflow.status === 'DRAFT' && actions.length > 0 && (
            <Button onClick={handlePlanWorkflow} disabled={planWorkflow.isPending}>
              <Play className="mr-2 h-4 w-4" />
              {planWorkflow.isPending ? 'Planning...' : 'Plan Workflow'}
            </Button>
          )}
          {(workflow.status === 'DRAFT' || workflow.status === 'PLANNED') && (
            <Button variant="destructive" onClick={handleCancelWorkflow} disabled={cancelWorkflow.isPending}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Actions Completed</span>
                <span className="text-sm">
                  {workflow.actions_completed} / {workflow.total_actions} ({workflow.progress_percentage}%)
                </span>
              </div>
              <Progress value={parseFloat(workflow.progress_percentage)} />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Total Eggs</span>
                </div>
                <p className="text-xl font-semibold">
                  {workflow.total_eggs_received.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {workflow.total_eggs_planned.toLocaleString()} planned
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">DOA Mortality</span>
                </div>
                <p className="text-xl font-semibold">
                  {workflow.total_mortality_on_arrival.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {workflow.total_eggs_planned > 0 
                    ? ((workflow.total_mortality_on_arrival / workflow.total_eggs_planned) * 100).toFixed(2)
                    : 0}%
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Planned Start</span>
                </div>
                <p className="text-xl font-semibold">{workflow.planned_start_date}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Actual Start</span>
                </div>
                <p className="text-xl font-semibold">{workflow.actual_start_date || '—'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Source Info */}
      <Card>
        <CardHeader>
          <CardTitle>Egg Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Source Type</span>
              <p className="font-medium">{workflow.egg_source_display}</p>
            </div>
            {workflow.external_cost_per_thousand && (
              <div>
                <span className="text-sm text-muted-foreground">Cost per 1000 Eggs</span>
                <p className="font-medium">€{parseFloat(workflow.external_cost_per_thousand).toFixed(2)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Delivery Actions</CardTitle>
              <CardDescription>Individual egg deliveries to containers</CardDescription>
            </div>
            {workflow.status === 'DRAFT' && (
              <Button 
                size="sm" 
                onClick={() => setAddActionsDialogOpen(true)}
                disabled={!geographyId}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Actions
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No actions planned for this workflow. Add delivery actions to specify containers and dates.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">Container</th>
                    <th className="pb-2 font-medium">Eggs Planned</th>
                    <th className="pb-2 font-medium">Eggs Received</th>
                    <th className="pb-2 font-medium">DOA</th>
                    <th className="pb-2 font-medium">Delivery Date</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((action: any) => (
                    <tr key={action.id} className="border-b">
                      <td className="py-3">{action.action_number}</td>
                      <td className="py-3">
                        <div className="text-sm">{action.dest_container_name}</div>
                        <div className="text-xs text-muted-foreground">{action.dest_container_type}</div>
                      </td>
                      <td className="py-3">{action.egg_count_planned.toLocaleString()}</td>
                      <td className="py-3">{action.egg_count_actual?.toLocaleString() || '—'}</td>
                      <td className="py-3">
                        {action.mortality_on_arrival !== null && action.mortality_on_arrival !== undefined 
                          ? action.mortality_on_arrival.toLocaleString() 
                          : '—'}
                        {action.mortality_rate_percentage && (
                          <div className="text-xs text-muted-foreground">
                            ({action.mortality_rate_percentage}%)
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="text-sm">{action.actual_delivery_date || action.expected_delivery_date}</div>
                        {action.actual_delivery_date && action.actual_delivery_date !== action.expected_delivery_date && (
                          <div className="text-xs text-muted-foreground">Expected: {action.expected_delivery_date}</div>
                        )}
                        {action.days_since_expected && action.days_since_expected > 0 && (
                          <div className="text-xs text-amber-600">
                            {action.days_since_expected} days late
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge variant={action.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {action.status_display}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {action.status === 'PENDING' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExecuteAction(action)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Execute
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      {geographyId && (
        <AddCreationActionsDialog
          workflow={workflow}
          geographyId={geographyId}
          open={addActionsDialogOpen}
          onClose={() => setAddActionsDialogOpen(false)}
          onSuccess={handleActionSuccess}
        />
      )}
      
      {selectedAction && (
        <ExecuteCreationActionDialog
          action={selectedAction}
          open={executeActionDialogOpen}
          onClose={() => {
            setExecuteActionDialogOpen(false);
            setSelectedAction(null);
          }}
        />
      )}
    </div>
  );
}

