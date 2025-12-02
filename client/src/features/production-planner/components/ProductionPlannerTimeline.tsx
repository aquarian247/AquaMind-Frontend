/**
 * Production Planner Timeline Component
 *
 * Displays activities grouped by batch with expandable sections.
 * Simple list-based view (not complex Gantt chart for initial implementation).
 */

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight, AlertCircle, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileActivityCard } from './MobileActivityCard';
import {
  groupActivitiesByBatch,
  sortActivitiesByDueDate,
  getActivityTypeBadgeVariant,
  getStatusBadgeVariant,
  isActivityOverdue,
} from '../utils/activityHelpers';
import type { PlannedActivity } from '../types';

interface ProductionPlannerTimelineProps {
  activities: PlannedActivity[];
  onActivityClick: (activity: PlannedActivity) => void;
  onCreateActivity?: () => void;
}

export function ProductionPlannerTimeline({
  activities,
  onActivityClick,
  onCreateActivity,
}: ProductionPlannerTimelineProps) {
  const [expandedBatches, setExpandedBatches] = useState<number[]>([]);
  const isMobile = useIsMobile();

  // Group and sort activities
  const batchGroups = useMemo(() => {
    const grouped = groupActivitiesByBatch(activities);
    // Sort activities within each batch by due date
    return grouped.map((group) => ({
      ...group,
      activities: sortActivitiesByDueDate(group.activities),
    }));
  }, [activities]);

  const toggleBatchExpansion = (batchId: number) => {
    setExpandedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const expandAll = () => {
    setExpandedBatches(batchGroups.map((g) => g.batchId));
  };

  const collapseAll = () => {
    setExpandedBatches([]);
  };

  if (activities.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Activities Planned</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first planned activity for this scenario.
        </p>
        {onCreateActivity && (
          <Button onClick={onCreateActivity}>
            <Plus className="h-4 w-4 mr-2" />
            Create Activity
          </Button>
        )}
      </Card>
    );
  }

  // Mobile simple list view (no batch grouping)
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Activities</h3>
            <Badge variant="outline">
              {activities.length}
            </Badge>
          </div>
        </div>

        {activities.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No Activities</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No activities match the current filters.
            </p>
            {onCreateActivity && (
              <Button onClick={onCreateActivity} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Activity
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-3">
            {sortActivitiesByDueDate(activities).map((activity) => (
              <MobileActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => onActivityClick(activity)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop batch-grouped view
  return (
    <div className="space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Timeline View</h3>
          <Badge variant="outline">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {/* Batch Groups */}
      <div className="space-y-3">
        {batchGroups.map((group) => {
          const isExpanded = expandedBatches.includes(group.batchId);
          const overdueCount = group.activities.filter((a) => isActivityOverdue(a)).length;

          return (
            <Card key={group.batchId} className="overflow-hidden">
              {/* Batch Header */}
              <div
                className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleBatchExpansion(group.batchId)}
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBatchExpansion(group.batchId);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <h4 className="font-semibold">{group.batchNumber}</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.activities.length} {group.activities.length === 1 ? 'activity' : 'activities'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {overdueCount > 0 && (
                    <Badge variant="destructive">
                      {overdueCount} overdue
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {group.activities.filter((a) => a.status === 'COMPLETED').length} completed
                  </Badge>
                </div>
              </div>

              {/* Activity List */}
              {isExpanded && (
                <div className="divide-y">
                  {group.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => onActivityClick(activity)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Activity Type */}
                        <div className="flex-shrink-0 w-32">
                          <Badge variant={getActivityTypeBadgeVariant(activity.activity_type)}>
                            {activity.activity_type_display}
                          </Badge>
                        </div>

                        {/* Due Date */}
                        <div className="flex-shrink-0 w-28">
                          <p className="text-sm font-medium">
                            {format(new Date(activity.due_date), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.due_date), 'EEEE')}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex-shrink-0 w-28">
                          <Badge variant={getStatusBadgeVariant(activity)}>
                            {activity.status_display}
                          </Badge>
                        </div>

                        {/* Notes */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">
                            {activity.notes || (
                              <span className="text-muted-foreground italic">No notes</span>
                            )}
                          </p>
                          {activity.container_name && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Container: {activity.container_name}
                            </p>
                          )}
                        </div>

                        {/* Indicators */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {isActivityOverdue(activity) && (
                            <div className="flex items-center gap-1 text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-xs font-medium">OVERDUE</span>
                            </div>
                          )}
                          {activity.transfer_workflow && (
                            <Badge variant="outline" className="text-xs">
                              Workflow Linked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

