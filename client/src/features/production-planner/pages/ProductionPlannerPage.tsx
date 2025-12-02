/**
 * Production Planner Page
 *
 * Main page for operational scheduling. Displays KPI dashboard, filters,
 * and timeline of planned activities grouped by batch.
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { ProductionPlannerKPIDashboard } from '../components/ProductionPlannerKPIDashboard';
import { PlannedActivityFilters } from '../components/PlannedActivityFilters';
import { ProductionPlannerTimeline } from '../components/ProductionPlannerTimeline';
import { PlannedActivityDetailModal } from '../components/PlannedActivityDetailModal';
import { PlannedActivityForm } from '../components/PlannedActivityForm';
import { filterActivities } from '../utils/activityHelpers';
import { useUser } from '@/contexts/UserContext';
import type { ActivityFilters, PlannedActivity } from '../types';

export function ProductionPlannerPage() {
  const { isViewer } = useUser();
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
  const [filters, setFilters] = useState<ActivityFilters>({
    activityTypes: [],
    statuses: [],
    batches: [],
    dateRange: { start: null, end: null },
    showOverdueOnly: false,
  });
  const [selectedActivity, setSelectedActivity] = useState<PlannedActivity | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch scenarios for dropdown
  // Using same pattern as Scenario Planning page
  const { data: scenariosResponse, isLoading: scenariosLoading } = useQuery({
    queryKey: ['scenario:scenarios', { search: '', status: 'all' }],
    queryFn: () => ApiService.apiV1ScenarioScenariosList(
      true,  // all=true - show all scenarios, not just user's own
      undefined,  // createdBy
      undefined,  // ordering
      undefined,  // page
      undefined,  // search
      undefined,  // startDate (used for status filtering)
      undefined   // tgcModelLocation
    ),
  });

  const scenarios = scenariosResponse?.results || [];

  // Auto-select first scenario if none selected
  if (!selectedScenarioId && scenarios.length > 0 && !scenariosLoading) {
    setSelectedScenarioId(scenarios[0].scenario_id);
  }

  // Fetch activities for selected scenario
  // Note: API returns array directly (not paginated), but generated type is incorrect
  const { data: activitiesResponse, isLoading: activitiesLoading } = useQuery({
    queryKey: ['planned-activities', 'scenario', selectedScenarioId],
    queryFn: async () => {
      if (!selectedScenarioId) return [];
      return await ApiService.apiV1ScenarioScenariosPlannedActivitiesRetrieve(selectedScenarioId) as unknown as PlannedActivity[];
    },
    enabled: !!selectedScenarioId,
  });

  const allActivities = (activitiesResponse as PlannedActivity[]) || [];

  // Fetch batches for filter dropdown
  const { data: batchesResponse } = useQuery({
    queryKey: ['batches'],
    queryFn: () => ApiService.apiV1BatchBatchesList(),
  });

  const batches = batchesResponse?.results || [];

  // Apply filters to activities
  const filteredActivities = useMemo(() => {
    return filterActivities(allActivities, filters);
  }, [allActivities, filters]);

  const handleFilterChange = (newFilters: Partial<ActivityFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleActivityClick = (activity: PlannedActivity) => {
    setSelectedActivity(activity);
    // TODO: Open detail modal
  };

  const handleCreateActivity = () => {
    setIsCreateModalOpen(true);
    // TODO: Open create modal
  };

  const canCreateActivities = !isViewer;

  return (
    <PermissionGuard require="operational" resource="Production Planner">
      <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Planner</h1>
          <p className="text-muted-foreground mt-1">
            Plan and track operational activities across scenarios
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Scenario Selector */}
          <Select
            value={selectedScenarioId?.toString()}
            onValueChange={(value) => setSelectedScenarioId(Number(value))}
            disabled={scenariosLoading}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select scenario..." />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem
                  key={scenario.scenario_id}
                  value={scenario.scenario_id.toString()}
                >
                  {scenario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Create Activity Button */}
          {canCreateActivities && (
            <Button onClick={handleCreateActivity} disabled={!selectedScenarioId}>
              <Plus className="h-4 w-4 mr-2" />
              Create Activity
            </Button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {scenariosLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* No Scenario Selected */}
      {!scenariosLoading && !selectedScenarioId && scenarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No scenarios available. Create a scenario first to start planning activities.
          </p>
        </div>
      )}

      {/* Main Content */}
      {!scenariosLoading && selectedScenarioId && (
        <>
          {/* KPI Dashboard */}
          <ProductionPlannerKPIDashboard
            activities={allActivities}
            onFilterChange={handleFilterChange}
          />

          {/* Filters */}
          <PlannedActivityFilters
            filters={filters}
            onFilterChange={setFilters}
            batches={batches}
          />

          {/* Activities Loading */}
          {activitiesLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Timeline View */}
          {!activitiesLoading && (
            <ProductionPlannerTimeline
              activities={filteredActivities}
              onActivityClick={handleActivityClick}
              onCreateActivity={canCreateActivities ? handleCreateActivity : undefined}
            />
          )}

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
            <div>
              Showing {filteredActivities.length} of {allActivities.length} activities
            </div>
            <div>
              {filteredActivities.filter((a) => a.is_overdue).length} overdue activities
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      <PlannedActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onEdit={() => {
          setIsCreateModalOpen(true);
          // Activity form will handle edit mode via selectedActivity
        }}
        onSpawnWorkflow={() => {
          // TODO: Implement spawn workflow dialog
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
            // Queries will auto-refresh via invalidation
          }}
        />
      )}
      </div>
    </PermissionGuard>
  );
}

