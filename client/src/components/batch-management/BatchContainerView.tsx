import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Fish, Thermometer } from "lucide-react";
import { api } from "@/lib/api";
import { ApiService } from "@/api/generated";
import type { Batch } from "@/api/generated/models/Batch";
import type { Container } from "@/api/generated/models/Container";
import type { EnvironmentalReading } from "@/api/generated/models/EnvironmentalReading";

interface BatchContainerViewProps {
  selectedBatch?: Batch;
}

export function BatchContainerView({ selectedBatch }: BatchContainerViewProps) {
  // Simplified: Just show containers for the selected batch - no filters needed

  // Fetch containers - need to handle pagination or filter by assignment container IDs
  const { data: containersData } = useQuery({
    queryKey: ["infrastructure/containers", selectedBatch?.id],
    queryFn: async () => {
      if (!selectedBatch?.id) return [];
      
      // First get assignments to know which containers we need
      const assignmentsResponse = await ApiService.apiV1BatchContainerAssignmentsList(
        undefined, undefined, undefined,
        selectedBatch.id,
        undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        true // isActive
      );
      
      const containerIds = (assignmentsResponse.results || []).map(a => 
        typeof a.container === 'number' ? a.container : a.container?.id
      ).filter((id): id is number => id !== undefined);
      
      if (containerIds.length === 0) return [];
      
      // Fetch ALL containers (handle pagination) since container__in filter not available
      let allContainers: any[] = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore && page < 100) { // Safety limit
        const containersResponse = await ApiService.apiV1InfrastructureContainersList(
          undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
          page // page number
        );
        
        allContainers = allContainers.concat(containersResponse.results || []);
        hasMore = !!containersResponse.next;
        page++;
      }
      
      // Filter to only containers assigned to this batch
      return allContainers.filter(c => containerIds.includes(c.id));
    },
    enabled: !!selectedBatch?.id,
  });

  const { data: environmentalData } = useQuery({
    queryKey: ["environmental/readings"],
    queryFn: async () => {
      const response = await ApiService.apiV1EnvironmentalReadingsList();
      return response.results || [];
    },
  });

  // Fetch container assignments for this batch to get actual container IDs
  const { data: assignmentsData } = useQuery({
    queryKey: ["batch/container-assignments", selectedBatch?.id],
    queryFn: async () => {
      if (!selectedBatch?.id) return [];
      const response = await ApiService.apiV1BatchContainerAssignmentsList(
        undefined, // assignmentDate
        undefined, // assignmentDateAfter
        undefined, // assignmentDateBefore
        selectedBatch.id, // batch - CORRECT position!
        undefined, // batchIn
        undefined, // batchNumber
        undefined, // biomassMax
        undefined, // biomassMin
        undefined, // container
        undefined, // containerIn
        undefined, // containerName
        undefined, // containerType
        true       // isActive - only active assignments
      );
      return response.results || [];
    },
    enabled: !!selectedBatch?.id,
  });

  const containers = containersData || [];
  const environmentalReadings = environmentalData || [];
  const assignments = assignmentsData || [];

  // DEBUG: Log what we have
  console.log('BatchContainerView Debug:', {
    selectedBatchId: selectedBatch?.id,
    assignmentsCount: assignments.length,
    containersCount: containers.length,
    firstAssignment: assignments[0],
    assignmentSample: assignments.slice(0, 2)
  });

  // Get current environmental conditions for containers
  const getContainerEnvironmentalData = (containerId: number) => {
    const containerReadings = environmentalReadings.filter((reading: EnvironmentalReading) => 
      reading.container === containerId
    ).slice(0, 3);
    
    return containerReadings;
  };

  // Get containers from active assignments (not from batch.active_containers which might be stale)
  const assignedContainerIds = assignments.map(a => 
    typeof a.container === 'number' ? a.container : a.container?.id
  ).filter((id): id is number => id !== undefined);
  
  console.log('Container IDs from assignments:', assignedContainerIds);
  console.log('Container IDs in containers list:', containers.map(c => c.id).slice(0, 20));
  
  const batchContainers = containers.filter(c => assignedContainerIds.includes(c.id));
  
  console.log('Batch containers found:', batchContainers.length, batchContainers.slice(0, 2));

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Container Assignments</h3>
          <p className="text-sm text-muted-foreground">
            Containers currently assigned to {selectedBatch.batch_number}
          </p>
        </div>
        <Badge variant="outline">
          {batchContainers.length} container{batchContainers.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Container Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batchContainers.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No containers assigned to this batch yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          batchContainers.map((container) => {
          const environmentalData = getContainerEnvironmentalData(container.id);

          return (
            <Card key={container.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{container.name}</CardTitle>
                  <Badge variant="default">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {container.container_type_name} • Capacity: {container.max_biomass_kg} kg
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Batch Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Fish className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Batch: {selectedBatch.batch_number}</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Population: {selectedBatch.calculated_population_count?.toLocaleString() || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Biomass: {selectedBatch.calculated_biomass_kg ? `${Number(selectedBatch.calculated_biomass_kg).toFixed(1)} kg` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Environmental Conditions */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Environmental</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {environmentalData.length > 0 ? (
                      environmentalData.map((reading: EnvironmentalReading, index: number) => (
                        <p key={index} className="text-xs">
                          {reading.value} {reading.parameter === 1 ? "°C" : reading.parameter === 2 ? "mg/L" : "pH"}
                        </p>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No recent readings</p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement container details modal
                    console.log('View container details for:', container.id);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })
        )}
      </div>

      {/* Summary Stats */}
      {batchContainers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Container Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{batchContainers.length}</div>
                <div className="text-sm text-muted-foreground">Total Containers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {batchContainers.filter(c => c.name.toLowerCase().includes("pen") || c.name.toLowerCase().includes("cage")).length}
                </div>
                <div className="text-sm text-muted-foreground">Sea Pens/Cages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {batchContainers.filter(c => c.name.toLowerCase().includes("tank")).length}
                </div>
                <div className="text-sm text-muted-foreground">Tanks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
