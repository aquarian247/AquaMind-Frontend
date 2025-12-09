/**
 * Batch Planned Activities Tab
 *
 * Displays planned activities for a specific batch across all scenarios.
 * Integrated into the Batch Detail page as a tab.
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ApiService } from '@/api/generated';
import { MobileActivityCard } from './MobileActivityCard';
import { PlannedActivityDetailModal } from './PlannedActivityDetailModal';
import { PlannedActivityForm } from './PlannedActivityForm';
import {
  getActivityTypeBadgeVariant,
  getStatusBadgeVariant,
  isActivityOverdue,
} from '../utils/activityHelpers';
import type { PlannedActivity } from '../types';

interface BatchPlannedActivitiesTabProps {
  batchId: number;
  batchNumber?: string;
}

export function BatchPlannedActivitiesTab({
  batchId,
  batchNumber,
}: BatchPlannedActivitiesTabProps) {
  const isMobile = useIsMobile();
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<PlannedActivity | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch scenarios for filter
  const { data: scenariosResponse } = useQuery({
    queryKey: ['scenarios'],
    queryFn: () => ApiService.apiV1ScenarioScenariosList(),
  });

  const scenarios = scenariosResponse?.results || [];

  // Fetch activities for this batch
  // Note: API returns array directly (not paginated), but generated type is incorrect
  const { data: activitiesResponse, isLoading: activitiesLoading } = useQuery({
    queryKey: ['planned-activities', 'batch', batchId, selectedScenarioId],
    queryFn: async () => {
      return await ApiService.apiV1BatchBatchesPlannedActivitiesRetrieve(batchId) as unknown as PlannedActivity[];
    },
    enabled: !!batchId,
  });

  let allActivities = (activitiesResponse as PlannedActivity[]) || [];

  // Filter by scenario if selected
  if (selectedScenarioId) {
    allActivities = allActivities.filter((a) => a.scenario === selectedScenarioId);
  }

  const handleActivityClick = (activity: PlannedActivity) => {
    setSelectedActivity(activity);
  };

  return (
    <div className="space-y-4">
      {/* Header with filters and actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Planned Activities</h3>
          <p className="text-sm text-muted-foreground">
            {batchNumber ? `Activities for ${batchNumber}` : 'Batch activities across scenarios'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Scenario Filter */}
          <Select
            value={selectedScenarioId?.toString() || 'all'}
            onValueChange={(value) => setSelectedScenarioId(value === 'all' ? null : Number(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Scenarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scenarios</SelectItem>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.scenario_id} value={scenario.scenario_id.toString()}>
                  {scenario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Create Activity Button */}
          {selectedScenarioId && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {activitiesLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State - No Scenario Selected */}
      {!activitiesLoading && !selectedScenarioId && allActivities.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-semibold mb-2">No Activities Planned</h4>
          <p className="text-muted-foreground mb-4">
            Select a scenario above to view or create planned activities for this batch.
          </p>
        </Card>
      )}

      {/* Empty State - Scenario Selected but No Activities */}
      {!activitiesLoading && selectedScenarioId && allActivities.length === 0 && (
        <Card className="p-12 text-center">
          <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-semibold mb-2">No Activities Yet</h4>
          <p className="text-muted-foreground mb-4">
            No activities have been planned for this batch in the selected scenario.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Activity
          </Button>
        </Card>
      )}

      {/* Activities List/Table */}
      {!activitiesLoading && allActivities.length > 0 && (
        isMobile ? (
          <div className="space-y-3">
            {allActivities.map((activity) => (
              <MobileActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => handleActivityClick(activity)}
              />
            ))}
          </div>
        ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                {!selectedScenarioId && <TableHead>Scenario</TableHead>}
                <TableHead>Container</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allActivities.map((activity) => (
                <TableRow
                  key={activity.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleActivityClick(activity)}
                >
                  <TableCell>
                    <Badge variant={getActivityTypeBadgeVariant(activity.activity_type)}>
                      {activity.activity_type_display}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{format(new Date(activity.due_date), 'MMM dd, yyyy')}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(activity.due_date), 'EEEE')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(activity)}>
                        {activity.status_display}
                      </Badge>
                      {isActivityOverdue(activity) && (
                        <Badge variant="destructive" className="text-xs">
                          OVERDUE
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {!selectedScenarioId && (
                    <TableCell>
                      <span className="text-sm">{activity.scenario_name}</span>
                    </TableCell>
                  )}
                  <TableCell>
                    <span className="text-sm">
                      {activity.container_name || (
                        <span className="text-muted-foreground italic">Not specified</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm truncate max-w-[200px] block">
                      {activity.notes || (
                        <span className="text-muted-foreground italic">No notes</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityClick(activity);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        )
      )}

      {/* Detail Modal */}
      <PlannedActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onEdit={() => {
          setIsCreateModalOpen(true);
        }}
        onSpawnWorkflow={() => {
          // TODO: Implement spawn workflow
          console.log('Spawn workflow for activity:', selectedActivity?.id);
        }}
      />

      {/* Create/Edit Form */}
      {selectedScenarioId && (
        <PlannedActivityForm
          scenarioId={selectedScenarioId}
          activity={isCreateModalOpen && selectedActivity ? selectedActivity : undefined}
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedActivity(null);
          }}
          onSuccess={() => {
            // Queries will auto-refresh
          }}
        />
      )}
    </div>
  );
}

