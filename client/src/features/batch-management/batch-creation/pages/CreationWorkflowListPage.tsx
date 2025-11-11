/**
 * Creation Workflow List Page
 * 
 * Displays table of batch creation workflows with filtering.
 */
import { useState } from 'react';
import { useNavigate } from 'wouter';
import { Plus, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { useCreationWorkflows } from '../api';

export function CreationWorkflowListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [eggSourceFilter, setEggSourceFilter] = useState<string>('');
  
  const { data, isLoading } = useCreationWorkflows({
    status: statusFilter || undefined,
    egg_source_type: eggSourceFilter || undefined,
  });
  
  const workflows = data?.results || [];
  
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
        <div>
          <h1 className="text-3xl font-bold">Batch Creation Workflows</h1>
          <p className="text-muted-foreground">Manage egg delivery and batch creation operations</p>
        </div>
        <Button onClick={() => navigate('/batch-creation-workflows/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PLANNED">Planned</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Egg Source</label>
              <Select value={eggSourceFilter} onValueChange={setEggSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sources</SelectItem>
                  <SelectItem value="INTERNAL">Internal Broodstock</SelectItem>
                  <SelectItem value="EXTERNAL">External Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>
                {workflows.length} workflow{workflows.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No workflows found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2 font-medium">Workflow #</th>
                    <th className="pb-2 font-medium">Batch</th>
                    <th className="pb-2 font-medium">Species</th>
                    <th className="pb-2 font-medium">Source</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Progress</th>
                    <th className="pb-2 font-medium">Eggs</th>
                    <th className="pb-2 font-medium">Started</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map((workflow: any) => (
                    <tr key={workflow.id} className="border-b hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/batch-creation-workflows/${workflow.id}`)}>
                      <td className="py-3">{workflow.workflow_number}</td>
                      <td className="py-3">
                        <div className="text-sm">{workflow.batch_number}</div>
                        <div className="text-xs text-muted-foreground">{workflow.lifecycle_stage_name}</div>
                      </td>
                      <td className="py-3">{workflow.species_name}</td>
                      <td className="py-3">
                        <Badge variant={workflow.egg_source_type === 'INTERNAL' ? 'default' : 'secondary'}>
                          {workflow.egg_source_display}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={getStatusBadgeVariant(workflow.status)}>
                          {workflow.status_display}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="space-y-1">
                          <div className="text-sm">
                            {workflow.actions_completed} / {workflow.total_actions}
                          </div>
                          <Progress value={parseFloat(workflow.progress_percentage)} className="h-1" />
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-sm">{workflow.total_eggs_received.toLocaleString()} / {workflow.total_eggs_planned.toLocaleString()}</div>
                        {workflow.total_mortality_on_arrival > 0 && (
                          <div className="text-xs text-muted-foreground">
                            DOA: {workflow.total_mortality_on_arrival.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="py-3">{workflow.actual_start_date || '—'}</td>
                      <td className="py-3">
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/batch-creation-workflows/${workflow.id}`);
                        }}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
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

