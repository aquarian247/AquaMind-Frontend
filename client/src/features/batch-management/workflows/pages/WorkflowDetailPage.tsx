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
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Play,
  XCircle,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useWorkflow, useActions, useCancelWorkflow } from '../api';
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

  const { data: workflow, isLoading, error } = useWorkflow(workflowId);
  const { data: actionsData } = useActions({ workflow: workflowId });
  const cancelWorkflow = useCancelWorkflow();

  const [selectedActionId, setSelectedActionId] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
          <CardTitle>Transfer Actions</CardTitle>
          <CardDescription>
            Individual container-to-container movements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No actions planned for this workflow
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
                      {action.source_assignment_info?.container_name || `#${action.source_assignment}`}
                    </TableCell>
                    <TableCell className="text-sm">
                      {action.dest_assignment_info?.container_name || `#${action.dest_assignment}`}
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

      {/* Execute Action Dialog */}
      {selectedActionId && (
        <ExecuteActionDialog
          actionId={selectedActionId}
          open={!!selectedActionId}
          onClose={() => setSelectedActionId(null)}
        />
      )}
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

