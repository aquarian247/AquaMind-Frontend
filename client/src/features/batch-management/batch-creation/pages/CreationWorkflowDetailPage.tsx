/**
 * Creation Workflow Detail Page
 * 
 * Shows workflow details, progress, and actions.
 */
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Calendar, Package, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useCreationWorkflow, useCreationActions } from '../api';

export function CreationWorkflowDetailPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const workflowId = params.id ? parseInt(params.id) : undefined;
  
  const { data: workflow, isLoading } = useCreationWorkflow(workflowId);
  const { data: actionsData } = useCreationActions(workflowId);
  
  const actions = actionsData?.results || [];
  
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
              <Button size="sm">
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
                No actions planned for this workflow
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
                      <td className="py-3">{action.mortality_on_arrival?.toLocaleString() || '—'}</td>
                      <td className="py-3">
                        <div className="text-sm">{action.actual_delivery_date || action.expected_delivery_date}</div>
                        {action.actual_delivery_date && action.actual_delivery_date !== action.expected_delivery_date && (
                          <div className="text-xs text-muted-foreground">Expected: {action.expected_delivery_date}</div>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge variant={action.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {action.status_display}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

