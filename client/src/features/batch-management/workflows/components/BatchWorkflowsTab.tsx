/**
 * Batch Workflows Tab - Shows transfer workflows for a specific batch.
 * 
 * Displayed on the batch detail page.
 * Allows creating new workflows and viewing existing ones.
 */

import { ArrowRightLeft, CheckCircle, Clock, Plus, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useWorkflows } from '../api';
import { formatDate, formatPercentage, getWorkflowStatusConfig, type WorkflowStatus } from '../utils';

interface BatchWorkflowsTabProps {
  batchId: number;
  batchNumber: string;
}

export function BatchWorkflowsTab({ batchId, batchNumber }: BatchWorkflowsTabProps) {
  const [, navigate] = useLocation();
  const { data, isLoading } = useWorkflows({ batch: batchId });

  const workflows = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transfer Workflows</CardTitle>
              <CardDescription>
                Multi-step transfer operations for {batchNumber}
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/transfer-workflows')} disabled>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading workflows...
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-12">
              <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No Transfer Workflows</p>
              <p className="text-sm text-muted-foreground mb-4">
                This batch has no transfer workflows yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Note: Transfer workflow creation wizard coming soon. For now, use the Transfer Workflows page in the sidebar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow) => (
                  <TableRow
                    key={workflow.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/transfer-workflows/${workflow.id}`)}
                  >
                    <TableCell className="font-medium">
                      {workflow.workflow_number}
                      {workflow.is_intercompany && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          IC
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {workflow.workflow_type_display}
                    </TableCell>
                    <TableCell>
                      <WorkflowStatusBadge status={workflow.status as WorkflowStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[150px]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {workflow.actions_completed}/{workflow.total_actions_planned}
                          </span>
                          <span className="font-medium">
                            {formatPercentage(workflow.completion_percentage)}
                          </span>
                        </div>
                        <Progress 
                          value={parseFloat(workflow.completion_percentage)} 
                          className="h-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(workflow.actual_start_date || workflow.planned_start_date)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/transfer-workflows/${workflow.id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {workflows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Workflows"
            value={workflows.length.toString()}
            icon={ArrowRightLeft}
          />
          <StatCard
            label="In Progress"
            value={workflows.filter(w => w.status === 'IN_PROGRESS').length.toString()}
            icon={Clock}
            valueColor="text-amber-600"
          />
          <StatCard
            label="Completed"
            value={workflows.filter(w => w.status === 'COMPLETED').length.toString()}
            icon={CheckCircle}
            valueColor="text-green-600"
          />
          <StatCard
            label="Intercompany"
            value={workflows.filter(w => w.is_intercompany).length.toString()}
            icon={ArrowRightLeft}
          />
        </div>
      )}
    </div>
  );
}

// Helper components
function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const config = getWorkflowStatusConfig(status);
  const icons = {
    DRAFT: ArrowRightLeft,
    PLANNED: Clock,
    IN_PROGRESS: Clock,
    COMPLETED: CheckCircle,
    CANCELLED: XCircle,
  };
  const Icon = icons[status] || ArrowRightLeft;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit text-xs">
      <Icon className="h-3 w-3" />
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

