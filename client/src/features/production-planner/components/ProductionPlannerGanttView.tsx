import { useMemo } from 'react';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineGroup,
  TimelineItem,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/dist/style.css';
import moment from 'moment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { getActivityColor } from '../utils/activityHelpers';
import type { PlannedActivity } from '../types';

// Helper to get start of day
const startOfDay = (date: Date | string) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

// Helper to get end of day
const endOfDay = (date: Date | string) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

interface ProductionPlannerGanttViewProps {
  activities: PlannedActivity[];
  onActivityClick: (activity: PlannedActivity) => void;
  onCreateActivity?: () => void;
}

export function ProductionPlannerGanttView({
  activities,
  onActivityClick,
  onCreateActivity,
}: ProductionPlannerGanttViewProps) {
  // 1. Transform batches into Timeline Groups
  const groups = useMemo(() => {
    const batchMap = new Map<number, TimelineGroup>();

    activities.forEach((activity) => {
      if (!batchMap.has(activity.batch)) {
        batchMap.set(activity.batch, {
          id: activity.batch,
          title: activity.batch_number,
          // Can add rightTitle for extra info if needed
        });
      }
    });

    // Sort groups by title (batch number)
    return Array.from(batchMap.values()).sort((a, b) =>
      (a.title as string).localeCompare(b.title as string)
    );
  }, [activities]);

  // 2. Transform activities into Timeline Items
  const items = useMemo(() => {
    return activities.map((activity) => ({
      id: activity.id,
      group: activity.batch,
      title: activity.activity_type_display,
      start_time: startOfDay(activity.due_date),
      end_time: endOfDay(activity.due_date), // 1-day duration by default
      itemProps: {
        style: {
          background: getActivityColor(activity.activity_type),
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
      // Attach full activity object for click handler
      originalActivity: activity,
    }));
  }, [activities]);

  // 3. Determine default visible time range
  const defaultTimeStart = moment().add(-7, 'day');
  const defaultTimeEnd = moment().add(30, 'day');

  // Handle Item Click
  const handleItemSelect = (itemId: number, e: any, time: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item?.originalActivity) {
      onActivityClick(item.originalActivity);
    }
  };

  // Empty State
  if (activities.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-muted">
          <Calendar className="h-12 w-12 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-semibold mb-2">No Activities Planned</h4>
        <p className="text-muted-foreground mb-4">
          There are no planned activities to display in the Gantt chart.
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

  return (
    <Card className="overflow-hidden bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Vaccination
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Treatment
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-500"></span> Transfer
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> Sale
          </div>
          {/* Add legend for other types as needed */}
        </div>
      </div>
      
      <div className="production-planner-gantt">
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={defaultTimeStart}
          defaultTimeEnd={defaultTimeEnd}
          sidebarWidth={150}
          lineHeight={50}
          itemHeightRatio={0.75}
          canMove={false}
          canResize={false}
          canChangeGroup={false}
          onItemSelect={handleItemSelect}
          minZoom={24 * 60 * 60 * 1000} // Min zoom 1 day
          maxZoom={365 * 24 * 60 * 60 * 1000} // Max zoom 1 year
        >
          <TimelineHeaders className="bg-muted text-muted-foreground">
            <SidebarHeader>
              {({ getRootProps }) => {
                return (
                  <div {...getRootProps()} className="flex items-center px-4 font-medium border-r">
                    Batch
                  </div>
                );
              }}
            </SidebarHeader>
            <DateHeader unit="primaryHeader" />
            <DateHeader />
          </TimelineHeaders>
        </Timeline>
      </div>
      
      <style>{`
        .production-planner-gantt .rct-item {
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .production-planner-gantt .rct-date-header {
          background: transparent;
          color: inherit;
          border-right: 1px solid hsl(var(--border));
        }
        .production-planner-gantt .rct-header-root {
          background: hsl(var(--muted));
          border-bottom: 1px solid hsl(var(--border));
          color: hsl(var(--muted-foreground));
        }
        .production-planner-gantt .rct-sidebar-row {
          background: transparent;
          border-bottom: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          padding-left: 1rem;
        }
        .production-planner-gantt .rct-horizontal-lines .rct-hl-even,
        .production-planner-gantt .rct-horizontal-lines .rct-hl-odd {
          background: transparent;
          border-bottom: 1px solid hsl(var(--border));
        }
        .production-planner-gantt .rct-vertical-lines .rct-vl {
          border-left: 1px solid hsl(var(--border));
          opacity: 0.5;
        }
        .production-planner-gantt .rct-today {
          background: rgba(255, 255, 0, 0.1) !important;
        }
      `}</style>
    </Card>
  );
}

