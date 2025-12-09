/**
 * Production Planner Page
 *
 * Main page for operational scheduling. Displays KPI dashboard, filters,
 * and timeline of planned activities grouped by batch.
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2, LayoutList, Calendar, FileText, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { apiRequest } from '@/lib/queryClient';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';
import { ProductionPlannerKPIDashboard } from '../components/ProductionPlannerKPIDashboard';
import { PlannedActivityFilters } from '../components/PlannedActivityFilters';
import { ProductionPlannerTimeline } from '../components/ProductionPlannerTimeline';
import { ProductionPlannerGanttView } from '../components/ProductionPlannerGanttView';
import { PlannedActivityDetailModal } from '../components/PlannedActivityDetailModal';
import { PlannedActivityForm } from '../components/PlannedActivityForm';
import { SpawnWorkflowDialog } from '../components/SpawnWorkflowDialog';
import { filterActivities } from '../utils/activityHelpers';
import { useUser } from '@/contexts/UserContext';
import type { ActivityFilters, PlannedActivity } from '../types';

export function ProductionPlannerPage() {
  const { isViewer } = useUser();
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list');
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
  const [isSpawnWorkflowDialogOpen, setIsSpawnWorkflowDialogOpen] = useState(false);
  const [activityToSpawnWorkflow, setActivityToSpawnWorkflow] = useState<PlannedActivity | null>(null);

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
  // Note: Using apiRequest with ?all=true because the backend filters scenarios by creator
  // unless all=true is passed. The generated client doesn't support query params for this endpoint.
  const { data: activitiesResponse, isLoading: activitiesLoading } = useQuery({
    queryKey: ['planned-activities', 'scenario', selectedScenarioId],
    queryFn: async () => {
      if (!selectedScenarioId) return [];
      const response = await apiRequest(
        'GET',
        `/api/v1/scenario/scenarios/${selectedScenarioId}/planned-activities/?all=true`
      );
      return await response.json() as PlannedActivity[];
    },
    enabled: !!selectedScenarioId,
  });

  const allActivities = (activitiesResponse as PlannedActivity[]) || [];

  // Fetch all ACTIVE batches for filter dropdown (uses pagination - ~59 batches across ~3 pages)
  const { data: batches = [] } = useQuery({
    queryKey: ['batches', 'active', 'all'],
    queryFn: async () => {
      const allBatches: Array<{ id: number; batch_number: string }> = [];
      let page = 1;
      let hasMore = true;
      const maxPages = 10;

      while (hasMore && page <= maxPages) {
        const response = await ApiService.apiV1BatchBatchesList(
          undefined, // batchNumber
          undefined, // batchNumberIcontains
          undefined, // batchType
          undefined, // batchTypeIn
          undefined, // biomassMax
          undefined, // biomassMin
          undefined, // endDateAfter
          undefined, // endDateBefore
          undefined, // lifecycleStage
          undefined, // lifecycleStageIn
          undefined, // ordering
          page,      // page
          undefined, // populationMax
          undefined, // populationMin
          undefined, // search
          undefined, // species
          undefined, // speciesIn
          undefined, // startDateAfter
          undefined, // startDateBefore
          'ACTIVE'   // status - only ACTIVE batches have planned activities
        );
        allBatches.push(...(response.results || []).map(b => ({ id: b.id, batch_number: b.batch_number })));
        hasMore = !!response.next;
        page++;
      }
      return allBatches;
    },
  });

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

          {/* Manage Templates Link */}
          {canCreateActivities && (
            <Link href="/activity-templates">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </Link>
          )}

          {/* Variance Report Link */}
          <Link href="/variance-report">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Variance Report
            </Button>
          </Link>

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

          {/* Filters & View Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <PlannedActivityFilters
              filters={filters}
              onFilterChange={setFilters}
              batches={batches}
            />
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as 'list' | 'gantt')}
              className="bg-muted p-1 rounded-lg"
            >
              <ToggleGroupItem value="list" aria-label="List View" className="h-8 px-3">
                <LayoutList className="h-4 w-4 mr-2" />
                List
              </ToggleGroupItem>
              <ToggleGroupItem value="gantt" aria-label="Gantt View" className="h-8 px-3">
                <Calendar className="h-4 w-4 mr-2" />
                Gantt
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Activities Loading */}
          {activitiesLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Timeline / Gantt View */}
          {!activitiesLoading && (
            viewMode === 'list' ? (
              <ProductionPlannerTimeline
                activities={filteredActivities}
                onActivityClick={handleActivityClick}
                onCreateActivity={canCreateActivities ? handleCreateActivity : undefined}
              />
            ) : (
              <ProductionPlannerGanttView
                activities={filteredActivities}
                onActivityClick={handleActivityClick}
                onCreateActivity={canCreateActivities ? handleCreateActivity : undefined}
              />
            )
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
          setActivityToSpawnWorkflow(selectedActivity);
          setIsSpawnWorkflowDialogOpen(true);
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
            // Don't clear selectedActivity here to allow returning to Detail Modal on cancel
          }}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setSelectedActivity(null); // Close everything on success
          }}
        />
      )}

      {/* Spawn Workflow Dialog */}
      <SpawnWorkflowDialog
        activity={activityToSpawnWorkflow}
        isOpen={isSpawnWorkflowDialogOpen}
        onClose={() => {
          setIsSpawnWorkflowDialogOpen(false);
          setActivityToSpawnWorkflow(null);
        }}
        onSuccess={() => {
          setSelectedActivity(null); // Close detail modal after spawning workflow
        }}
      />
      </div>
    </PermissionGuard>
  );
}

