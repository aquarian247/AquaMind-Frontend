import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Fish, Thermometer, Ruler } from "lucide-react";
import { api } from "@/lib/api";
import { ApiService } from "@/api/generated";
import type { Batch } from "@/api/generated/models/Batch";
import type { Container } from "@/api/generated/models/Container";
import type { EnvironmentalReading } from "@/api/generated/models/EnvironmentalReading";
import { GrowthSampleForm } from "@/features/batch-management/components/GrowthSampleForm";

interface BatchContainerViewProps {
  selectedBatch?: Batch;
}

export function BatchContainerView({ selectedBatch }: BatchContainerViewProps) {
  // State for growth sample dialog
  const [growthSampleDialogOpen, setGrowthSampleDialogOpen] = useState(false)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null)

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
          // assignment.container is nested object with container details
          const containerName = typeof assignment.container === 'object' && assignment.container 
            ? (assignment.container as any).name || `Container ${assignment.container}`
            : `Container ${assignment.container}`;
          const containerType = typeof assignment.container === 'object' && assignment.container
            ? (assignment.container as any).container_type_name || 'Unknown'
            : 'Unknown';

          return (
            <Card key={assignment.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{containerName}</CardTitle>
                  <Badge variant="default">Active</Badge>
                </div>
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
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      console.log('View assignment details:', assignment.id);
                    }}
                  >
                    View Details
                  </Button>
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
