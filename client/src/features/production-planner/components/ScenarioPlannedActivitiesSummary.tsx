/**
 * Scenario Planned Activities Summary
 *
 * Summary section for Scenario Detail page showing activity counts
 * and recent activities. Links to full Production Planner.
 */

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { ApiService } from '@/api/generated';
import {
  getActivityTypeBadgeVariant,
  getStatusBadgeVariant,
  isActivityOverdue,
  sortActivitiesByDueDate,
} from '../utils/activityHelpers';
import type { PlannedActivity } from '../types';

interface ScenarioPlannedActivitiesSummaryProps {
  scenarioId: number;
  scenarioName?: string;
}

export function ScenarioPlannedActivitiesSummary({
  scenarioId,
  scenarioName,
}: ScenarioPlannedActivitiesSummaryProps) {
  // Fetch activities for this scenario
  // Note: API returns array directly (not paginated), but generated type is incorrect
  const { data: activitiesResponse, isLoading } = useQuery({
    queryKey: ['planned-activities', 'scenario', scenarioId],
    queryFn: async () =>
      await ApiService.apiV1ScenarioScenariosPlannedActivitiesRetrieve(scenarioId) as unknown as PlannedActivity[],
    enabled: !!scenarioId,
  });

  const allActivities = (activitiesResponse as PlannedActivity[]) || [];

  // Calculate summary stats
  const stats = useMemo(() => {
    return {
      total: allActivities.length,
      pending: allActivities.filter((a) => a.status === 'PENDING').length,
      inProgress: allActivities.filter((a) => a.status === 'IN_PROGRESS').length,
      overdue: allActivities.filter((a) => isActivityOverdue(a)).length,
      completed: allActivities.filter((a) => a.status === 'COMPLETED').length,
    };
  }, [allActivities]);

  // Get recent activities (last 5, sorted by due date)
  const recentActivities = useMemo(() => {
    return sortActivitiesByDueDate(allActivities).slice(0, 5);
  }, [allActivities]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planned Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planned Activities
          </CardTitle>
          <Link href="/production-planner">
            <Button variant="outline" size="sm">
              View Full Planner
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-accent">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>

        {/* Recent Activities */}
        {recentActivities.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Recent Activities</h4>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge variant={getActivityTypeBadgeVariant(activity.activity_type)} className="flex-shrink-0">
                      {activity.activity_type_display}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.batch_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.due_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isActivityOverdue(activity) && (
                      <Badge variant="destructive" className="text-xs">
                        OVERDUE
                      </Badge>
                    )}
                    <Badge variant={getStatusBadgeVariant(activity)}>
                      {activity.status_display}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activities planned for this scenario yet.</p>
            <Link href="/production-planner">
              <Button variant="outline" size="sm" className="mt-3">
                Create First Activity
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

