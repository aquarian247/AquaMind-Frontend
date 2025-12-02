/**
 * Production Planner KPI Dashboard
 *
 * Displays 4 key metrics: Upcoming, Overdue, This Month, Completed
 * Clicking a card filters the timeline view
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { calculateActivityKPIs } from '../utils/activityHelpers';
import type { PlannedActivity, ActivityFilters } from '../types';

interface ProductionPlannerKPIDashboardProps {
  activities: PlannedActivity[];
  onFilterChange?: (filters: Partial<ActivityFilters>) => void;
}

export function ProductionPlannerKPIDashboard({
  activities,
  onFilterChange,
}: ProductionPlannerKPIDashboardProps) {
  const kpis = useMemo(() => calculateActivityKPIs(activities), [activities]);

  const handleCardClick = (filterType: 'upcoming' | 'overdue' | 'thisMonth' | 'completed') => {
    if (!onFilterChange) return;

    switch (filterType) {
      case 'upcoming':
        // Show PENDING activities due in next 7 days
        onFilterChange({
          statuses: ['PENDING'],
          showOverdueOnly: false,
        });
        break;
      case 'overdue':
        // Show overdue activities (PENDING + past due)
        onFilterChange({
          statuses: ['PENDING'],
          showOverdueOnly: true,
        });
        break;
      case 'thisMonth':
        // Show non-completed activities due this month
        onFilterChange({
          statuses: ['PENDING', 'IN_PROGRESS'],
          showOverdueOnly: false,
        });
        break;
      case 'completed':
        // Show completed activities
        onFilterChange({
          statuses: ['COMPLETED'],
          showOverdueOnly: false,
        });
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Upcoming (Next 7 Days) */}
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow hover:border-primary"
        onClick={() => handleCardClick('upcoming')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Upcoming (Next 7 Days)
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{kpis.upcoming}</div>
          <p className="text-xs text-muted-foreground mt-1">Pending activities</p>
        </CardContent>
      </Card>

      {/* Overdue */}
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow hover:border-destructive"
        onClick={() => handleCardClick('overdue')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overdue
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">{kpis.overdue}</div>
          <p className="text-xs text-muted-foreground mt-1">Past due date</p>
        </CardContent>
      </Card>

      {/* This Month */}
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow hover:border-secondary"
        onClick={() => handleCardClick('thisMonth')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            This Month
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary">{kpis.thisMonth}</div>
          <p className="text-xs text-muted-foreground mt-1">Due this month</p>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow hover:border-accent"
        onClick={() => handleCardClick('completed')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Completed
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">{kpis.completed}</div>
          <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
        </CardContent>
      </Card>
    </div>
  );
}

