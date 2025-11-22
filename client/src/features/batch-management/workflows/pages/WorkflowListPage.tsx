/**
 * Workflow List Page - Shows all transfer workflows with filtering.
 * 
 * Features:
 * - Filterable table of workflows
 * - Status badges
 * - Progress indicators
 * - Navigation to detail page
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowRightLeft,
  Calendar,
  CheckCircle,
  FileText,
  Loader2,
  Plus,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ApiService } from '@/api/generated';
import { useWorkflows } from '../api';
import type { WorkflowFilters } from '../api';
import {
  formatDate,
  formatPercentage,
  getWorkflowStatusConfig,
  type WorkflowStatus,
} from '../utils';
import { useQuery } from '@tanstack/react-query';
import { CreateWorkflowWizard } from '../components/CreateWorkflowWizard';

export function WorkflowListPage() {
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<WorkflowFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error } = useWorkflows({ ...filters, page: currentPage });
  
  // Fetch batches for dropdown (ALL pages - only 144 batches)
  const { data: batchesData } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      let allBatches: any[] = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore && page <= 10) {
        const response = await ApiService.apiV1BatchBatchesList(
          undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, page
        );
        allBatches = [...allBatches, ...(response.results || [])];
        hasMore = response.next !== null;
        page++;
      }
      
      return { results: allBatches };
    },
  });

  const updateFilter = (key: keyof WorkflowFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    // Reset to page 1 when filters change to avoid empty results
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transfer Workflows</h1>
          <p className="text-muted-foreground">
            Manage multi-step batch transfer operations
          </p>
        </div>
        <div className="flex gap-2">
          <CreateWorkflowWizard>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </CreateWorkflowWizard>
          <Button variant="outline" onClick={() => navigate('/batches')}>
            <FileText className="mr-2 h-4 w-4" />
            View Batches
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || 'ALL'}
                onValueChange={(v) => updateFilter('status', v === 'ALL' ? undefined : v)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PLANNED">Planned</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workflow_type">Workflow Type</Label>
              <Select
                value={filters.workflow_type || 'ALL'}
                onValueChange={(v) => updateFilter('workflow_type', v === 'ALL' ? undefined : v)}
              >
                <SelectTrigger id="workflow_type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="LIFECYCLE_TRANSITION">
                    Lifecycle Transition
                  </SelectItem>
                  <SelectItem value="CONTAINER_REDISTRIBUTION">
                    Container Redistribution
                  </SelectItem>
                  <SelectItem value="EMERGENCY_CASCADE">
                    Emergency Cascade
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batch">Batch</Label>
              <Select
                value={filters.batch?.toString() || 'ALL'}
                onValueChange={(v) => updateFilter('batch', v === 'ALL' ? undefined : parseInt(v))}
              >
                <SelectTrigger id="batch">
                  <SelectValue placeholder="All batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Batches</SelectItem>
                  {batchesData?.results?.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.batch_number} - {batch.species_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Workflows
            {data?.count !== undefined && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({data.count} total)
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Click any workflow to view details and execute actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center p-12">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold">Failed to load workflows</p>
              <p className="text-sm text-muted-foreground mt-2">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          ) : !data?.results?.length ? (
            <div className="text-center p-12">
              <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No workflows found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a transfer workflow to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow #</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.results.map((workflow) => (
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
                    <TableCell>{workflow.batch_number}</TableCell>
                    <TableCell className="text-sm">
                      {workflow.workflow_type_display}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={workflow.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[200px]">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {workflow.actions_completed} / {workflow.total_actions_planned}
                          </span>
                          <span className="font-medium">
                            {formatPercentage(workflow.completion_percentage)}
                          </span>
                        </div>
                        <Progress 
                          value={parseFloat(workflow.completion_percentage)} 
                          className="h-2"
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
          
          {/* Pagination Controls */}
          {data && data.count > 20 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * 20 + 1, data.count)} to {Math.min(currentPage * 20, data.count)} of {data.count} workflows
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 px-3">
                  Page {currentPage} of {Math.ceil(data.count / 20)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!data.next}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// StatusBadge Component (inline for now, can extract to shared later)
// ============================================================================

function StatusBadge({ status }: { status?: WorkflowStatus }) {
  const config = getWorkflowStatusConfig(status);
  
  const icons = {
    DRAFT: FileText,
    PLANNED: Calendar,
    IN_PROGRESS: Loader2,
    COMPLETED: CheckCircle,
    CANCELLED: XCircle,
  };
  
  const Icon = status ? icons[status] : FileText;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

