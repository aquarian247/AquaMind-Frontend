import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Fish, Thermometer, Ruler } from "lucide-react";
import { api } from "@/lib/api";
import { ApiService } from "@/api/generated";
import type { Batch } from "@/api/generated/models/Batch";
import type { Container as InfrastructureContainer } from "@/api/generated/models/Container";
import type { Hall as InfrastructureHall } from "@/api/generated/models/Hall";
import type { Area as InfrastructureArea } from "@/api/generated/models/Area";
import { GrowthSampleForm } from "@/features/batch-management/components/GrowthSampleForm";

interface BatchContainerViewProps {
  selectedBatch?: Batch;
  onOpenInsights?: (selection: {
    assignmentId: number;
    containerId: number;
    containerName: string;
  }) => void;
}

type ContainerDetailsById = Record<number, InfrastructureContainer>;
type HallDetailsById = Record<number, InfrastructureHall>;
type AreaDetailsById = Record<number, InfrastructureArea>;

function parseNumericId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function getAssignmentContainerId(assignment: any): number | null {
  return (
    parseNumericId(assignment?.container?.id) ??
    parseNumericId(assignment?.container_id) ??
    parseNumericId(assignment?.container)
  );
}

function getParentContainerPath(
  container: InfrastructureContainer,
  containersById: ContainerDetailsById
): string[] {
  const parentNames: string[] = [];
  const seen = new Set<number>([container.id]);
  let parentId = container.parent_container;

  while (typeof parentId === "number") {
    if (seen.has(parentId)) break;
    seen.add(parentId);

    const parentContainer = containersById[parentId];

    if (!parentContainer) {
      if (parentNames.length === 0 && container.parent_container_name) {
        parentNames.unshift(container.parent_container_name);
      }
      break;
    }

    parentNames.unshift(parentContainer.name);
    parentId = parentContainer.parent_container;
  }

  return parentNames;
}

function buildContainerLocationPath({
  containerId,
  containerName,
  containersById,
  hallsById,
  areasById,
}: {
  containerId: number | null;
  containerName: string;
  containersById: ContainerDetailsById;
  hallsById: HallDetailsById;
  areasById: AreaDetailsById;
}): string | null {
  if (!containerId) return null;

  const detailedContainer = containersById[containerId];
  if (!detailedContainer) return null;

  const parentNames = getParentContainerPath(detailedContainer, containersById);

  let rawPath: Array<string | null | undefined> = [containerName];

  if (typeof detailedContainer.hall === "number") {
    const hall = hallsById[detailedContainer.hall];
    const stationName = hall?.freshwater_station_name;
    const hallName = detailedContainer.hall_name ?? hall?.name;

    rawPath = [stationName, hallName, ...parentNames, containerName];
  } else if (typeof detailedContainer.area === "number") {
    const area = areasById[detailedContainer.area];
    const areaGroupName = area?.area_group_name;
    const areaName = detailedContainer.area_name ?? area?.name;

    rawPath = [areaGroupName, areaName, ...parentNames, containerName];
  } else if (detailedContainer.carrier_name) {
    rawPath = [detailedContainer.carrier_name, ...parentNames, containerName];
  } else if (parentNames.length > 0) {
    rawPath = [...parentNames, containerName];
  }

  const compactPath = rawPath
    .map((segment) => (typeof segment === "string" ? segment.trim() : ""))
    .filter((segment) => segment.length > 0);

  if (compactPath.length === 0) return null;

  const dedupedPath = compactPath.filter(
    (segment, index) => index === 0 || segment !== compactPath[index - 1]
  );

  return dedupedPath.join(" • ");
}

export function BatchContainerView({ selectedBatch, onOpenInsights }: BatchContainerViewProps) {
  // State for growth sample dialog
  const [growthSampleDialogOpen, setGrowthSampleDialogOpen] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null)
  const [, navigate] = useLocation()

  // Simplified: Just show containers for the selected batch - no filters needed

  // Fetch container assignments for this batch (fetch ALL pages, try active first)
  const { data: assignmentsData } = useQuery({
    queryKey: ["batch/container-assignments", selectedBatch?.id, "all"],
    queryFn: async () => {
      if (!selectedBatch?.id) return [];
      
      // Helper function to fetch all pages
      const fetchAllPages = async (isActive?: boolean) => {
        let allAssignments: any[] = [];
        let page = 1;
        let hasMore = true;
        let previousPageCount = 0;
        const maxPages = 20;

        while (hasMore && page <= maxPages) {
          const response = await ApiService.apiV1BatchContainerAssignmentsList(
            undefined, // assignmentDate
            undefined, // assignmentDateAfter
            undefined, // assignmentDateBefore
            selectedBatch.id, // batch filter
            undefined, // batchIn
            undefined, // batchNumber
            undefined, // biomassMax
            undefined, // biomassMin
            undefined, // container
            undefined, // containerIn
            undefined, // containerName
            undefined, // containerType
            isActive,  // isActive filter
            undefined, // lifecycleStage
            undefined, // ordering
            page,      // current page
            undefined, // populationMax
            undefined, // populationMin
            undefined, // search
            undefined  // species
          );

          // Safety: ensure we're making progress
          const newCount = allAssignments.length + (response.results || []).length;
          if (newCount === previousPageCount) {
            console.error('Pagination loop stuck at page', page, 'with', newCount, 'assignments');
            break;
          }
          previousPageCount = newCount;

          allAssignments = [...allAssignments, ...(response.results || [])];

          // Check if there are more pages
          hasMore = !!response.next;
          page++;
        }

        console.debug('Fetched', allAssignments.length, 'assignments across', page - 1, 'pages');
        return { assignments: allAssignments, pages: page - 1 };
      };

      // Always fetch ONLY active assignments for the Containers tab
      // Historical assignments belong in the History tab
      const { assignments: activeAssignments, pages: activePages } = await fetchAllPages(true);
      
      console.log(`📦 Fetched ${activeAssignments.length} active container assignments for batch ${selectedBatch.id}`, {
        batchId: selectedBatch.id,
        batchNumber: selectedBatch.batch_number,
        activeAssignments: activeAssignments.length,
        pagesFetched: activePages,
        sampleAssignment: activeAssignments[0],
      });
      
      return activeAssignments;
    },
    enabled: !!selectedBatch?.id,
  });

  const assignments = assignmentsData || [];

  const assignmentContainerIds = useMemo(() => {
    if (!assignments || assignments.length === 0) return [];

    const ids = assignments
      .map((assignment: any) => getAssignmentContainerId(assignment))
      .filter((id: number | null): id is number => id !== null);

    return Array.from(new Set(ids)).sort((a, b) => a - b);
  }, [assignments]);

  const { data: containerDetailsById = {} } = useQuery<ContainerDetailsById>({
    queryKey: ["batch/container-view/containers/by-id", assignmentContainerIds],
    queryFn: async () => {
      const byId: ContainerDetailsById = {};
      const fetchedIds = new Set<number>();
      let idsToFetch = [...assignmentContainerIds];

      while (idsToFetch.length > 0) {
        const currentBatchIds = Array.from(new Set(idsToFetch)).filter(
          (id) => !fetchedIds.has(id)
        );
        if (currentBatchIds.length === 0) break;

        const containers = await Promise.all(
          currentBatchIds.map(async (containerId) => {
            try {
              return await ApiService.apiV1InfrastructureContainersRetrieve(containerId);
            } catch (error) {
              console.warn(`Failed to fetch container ${containerId}`, error);
              return null;
            }
          })
        );

        const nextParentIds: number[] = [];

        for (const container of containers) {
          if (!container) continue;

          byId[container.id] = container;
          fetchedIds.add(container.id);

          if (
            typeof container.parent_container === "number" &&
            !fetchedIds.has(container.parent_container)
          ) {
            nextParentIds.push(container.parent_container);
          }
        }

        idsToFetch = nextParentIds;
      }

      return byId;
    },
    enabled: assignmentContainerIds.length > 0,
  });

  const hallIds = useMemo(() => {
    const ids = Object.values(containerDetailsById)
      .map((container) => container.hall)
      .filter((id): id is number => typeof id === "number");

    return Array.from(new Set(ids)).sort((a, b) => a - b);
  }, [containerDetailsById]);

  const areaIds = useMemo(() => {
    const ids = Object.values(containerDetailsById)
      .map((container) => container.area)
      .filter((id): id is number => typeof id === "number");

    return Array.from(new Set(ids)).sort((a, b) => a - b);
  }, [containerDetailsById]);

  const { data: hallDetailsById = {} } = useQuery<HallDetailsById>({
    queryKey: ["batch/container-view/halls/by-id", hallIds],
    queryFn: async () => {
      const byId: HallDetailsById = {};
      const halls = await Promise.all(
        hallIds.map(async (hallId) => {
          try {
            return await ApiService.apiV1InfrastructureHallsRetrieve(hallId);
          } catch (error) {
            console.warn(`Failed to fetch hall ${hallId}`, error);
            return null;
          }
        })
      );

      for (const hall of halls) {
        if (!hall) continue;
        byId[hall.id] = hall;
      }

      return byId;
    },
    enabled: hallIds.length > 0,
  });

  const { data: areaDetailsById = {} } = useQuery<AreaDetailsById>({
    queryKey: ["batch/container-view/areas/by-id", areaIds],
    queryFn: async () => {
      const byId: AreaDetailsById = {};
      const areas = await Promise.all(
        areaIds.map(async (areaId) => {
          try {
            return await ApiService.apiV1InfrastructureAreasRetrieve(areaId);
          } catch (error) {
            console.warn(`Failed to fetch area ${areaId}`, error);
            return null;
          }
        })
      );

      for (const area of areas) {
        if (!area) continue;
        byId[area.id] = area;
      }

      return byId;
    },
    enabled: areaIds.length > 0,
  });

  if (!selectedBatch) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Select a batch to view its container assignments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Batch Header */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fish className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedBatch.batch_number}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedBatch.species_name || "Unknown Species"} • {selectedBatch.status}
                  {(selectedBatch as any).current_lifecycle_stage?.name && 
                    ` • ${(selectedBatch as any).current_lifecycle_stage.name}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Active Containers</div>
                <div className="text-2xl font-bold text-primary">{assignments.length}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Grid - Shows active assignments directly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Containers</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This batch has no active container assignments.
                {selectedBatch?.status === 'COMPLETED' && (
                  <span className="block mt-3 text-sm">
                    This batch has been <strong>completed</strong>. View the <strong>History</strong> tab to see all past container assignments and lifecycle progression.
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => {
          const containerId = getAssignmentContainerId(assignment);

          // assignment.container is nested object with container details
          const containerName = typeof assignment.container === 'object' && assignment.container 
            ? (assignment.container as any).name || `Container ${containerId || assignment.container}`
            : `Container ${containerId || assignment.container}`;
          const containerType = typeof assignment.container === 'object' && assignment.container
            ? (assignment.container as any).container_type_name || 'Unknown'
            : 'Unknown';
          const locationPath = buildContainerLocationPath({
            containerId,
            containerName,
            containersById: containerDetailsById,
            hallsById: hallDetailsById,
            areasById: areaDetailsById,
          });

          return (
            <Card key={assignment.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg truncate" title={containerName}>
                      {containerName}
                    </CardTitle>
                  </div>
                  <Badge variant="default" className="shrink-0">Active</Badge>
                </div>
                {locationPath && (
                  <p className="text-sm text-muted-foreground flex items-start gap-1 mt-1 min-w-0 leading-snug">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="min-w-0 break-words" title={locationPath}>
                      {locationPath}
                    </span>
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {containerType} • Assigned {assignment.assignment_date ? new Date(assignment.assignment_date).toLocaleDateString() : 'Unknown'}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Assignment Data - The real metrics for this batch in this container */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Fish className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Assignment Metrics</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Population: {assignment.population_count?.toLocaleString() || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Biomass: {assignment.biomass_kg ? `${Number(assignment.biomass_kg).toFixed(1)} kg` : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg Weight: {assignment.avg_weight_g ? `${Number(assignment.avg_weight_g).toFixed(1)} g` : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stage: {(assignment as any).lifecycle_stage_name || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant={onOpenInsights ? "default" : "outline"}
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      if (containerId) {
                        if (onOpenInsights) {
                          onOpenInsights({
                            assignmentId: assignment.id,
                            containerId: Number(containerId),
                            containerName,
                          });
                        } else {
                          navigate(`/infrastructure/containers/${containerId}`);
                        }
                      }
                    }}
                  >
                    {onOpenInsights ? "Open Insights" : "View Details"}
                  </Button>
                  {onOpenInsights && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        if (containerId) {
                          navigate(`/infrastructure/containers/${containerId}`);
                        }
                      }}
                    >
                      Infrastructure
                    </Button>
                  )}
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedAssignmentId(assignment.id);
                      setGrowthSampleDialogOpen(true);
                    }}
                  >
                    <Ruler className="h-4 w-4 mr-2" />
                    Record Growth
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
        )}
      </div>

      {/* Summary Stats */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{assignments.length}</div>
                <div className="text-sm text-muted-foreground">Active Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {assignments.reduce((sum, a) => sum + (a.population_count || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Population</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {assignments.reduce((sum, a) => sum + (Number(a.biomass_kg) || 0), 0).toFixed(1)} kg
                </div>
                <div className="text-sm text-muted-foreground">Total Biomass</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Sample Dialog */}
      <Dialog open={growthSampleDialogOpen} onOpenChange={setGrowthSampleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Growth Sample</DialogTitle>
            <DialogDescription>
              Enter individual fish measurements. Aggregates will be calculated automatically.
            </DialogDescription>
          </DialogHeader>
          {selectedAssignmentId && (
            <GrowthSampleForm
              assignmentId={selectedAssignmentId}
              onSuccess={() => {
                setGrowthSampleDialogOpen(false);
                setSelectedAssignmentId(null);
              }}
              onCancel={() => {
                setGrowthSampleDialogOpen(false);
                setSelectedAssignmentId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
