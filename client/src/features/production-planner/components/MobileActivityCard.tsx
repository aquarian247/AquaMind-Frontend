/**
 * Mobile Activity Card
 *
 * Mobile-optimized card layout for planned activities.
 * Used as alternative to timeline on small screens.
 */

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import {
  getActivityTypeBadgeVariant,
  getStatusBadgeVariant,
  isActivityOverdue,
} from '../utils/activityHelpers';
import type { PlannedActivity } from '../types';

interface MobileActivityCardProps {
  activity: PlannedActivity;
  onClick: () => void;
}

export function MobileActivityCard({ activity, onClick }: MobileActivityCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getActivityTypeBadgeVariant(activity.activity_type)}>
              {activity.activity_type_display}
            </Badge>
            {isActivityOverdue(activity) && (
              <Badge variant="destructive" className="text-xs">
                OVERDUE
              </Badge>
            )}
          </div>
          <Badge variant={getStatusBadgeVariant(activity)}>
            {activity.status_display}
          </Badge>
        </div>

        {/* Batch and Date */}
        <div className="space-y-1">
          <p className="text-sm font-semibold">{activity.batch_number}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(new Date(activity.due_date), 'MMM dd, yyyy')}</span>
            <span>•</span>
            <span>{format(new Date(activity.due_date), 'EEEE')}</span>
          </div>
        </div>

        {/* Notes Preview */}
        {activity.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">{activity.notes}</p>
        )}

        {/* Additional Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {activity.container_name && (
            <span>Container: {activity.container_name}</span>
          )}
          {activity.transfer_workflow && (
            <Badge variant="outline" className="text-xs">
              Workflow Linked
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

