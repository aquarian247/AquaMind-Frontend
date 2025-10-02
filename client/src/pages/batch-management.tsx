import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fish, Plus, BarChart3, Container, Stethoscope, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { BatchContainerView } from "@/components/batch-management/BatchContainerView";
import { BatchHealthView } from "@/components/batch-management/BatchHealthView";
import { BatchAnalyticsView } from "@/components/batch-management/BatchAnalyticsView";
import { BatchFeedHistoryView } from "@/components/batch-management/BatchFeedHistoryView";
import { BatchKPIs } from "@/features/batch/components/BatchKPIs";
import { BatchOverview } from "@/features/batch/components/BatchOverview";
import { useBatchData } from "@/features/batch/hooks/useBatchData";
import { useBatchKPIs } from "@/features/batch/hooks/useBatchKPIs";
import { mapExtendedToBatch } from "@/features/batch/types";
import type { InsertBatch, ExtendedBatch } from "@/features/batch/types";
import type { Batch } from "@/api/generated/models/Batch";


const batchFormSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  species: z.number().min(1, "Species is required"),
  startDate: z.date(),
  initialCount: z.number().min(1, "Initial count must be positive"),
  initialBiomassKg: z.number().min(0.01, "Initial biomass must be positive"),
  currentCount: z.number().min(0, "Current count cannot be negative"),
  currentBiomassKg: z.number().min(0, "Current biomass cannot be negative"),
  container: z.number().optional(),
  stage: z.number().optional(),
  status: z.enum(["active", "harvested", "transferred"]).default("active"),
  expectedHarvestDate: z.date().optional(),
  notes: z.string().optional(),
  // Broodstock traceability fields
  eggSource: z.enum(["internal", "external"]),
  broodstockPairId: z.number().optional(),
  eggSupplierId: z.number().optional(),
  eggBatchNumber: z.string().optional(),
  eggProductionDate: z.date().optional(),
}).refine((data) => {
  if (data.eggSource === "internal" && !data.broodstockPairId) {
    return false;
  }
  if (data.eggSource === "external" && (!data.eggSupplierId || !data.eggBatchNumber)) {
    return false;
  }
  return true;
}, {
  message: "Please provide required fields for the selected egg source",
  path: ["eggSource"],
});

type BatchFormData = z.infer<typeof batchFormSchema>;


interface BatchKPIs {
  totalActiveBatches: number;
  averageHealthScore: number;
  totalFishCount: number;
  averageSurvivalRate: number;
  batchesRequiringAttention: number;
  avgGrowthRate: number;
  totalBiomass: number;
  averageFCR: number;
}

interface ContainerDistribution {
  containerId: number;
  containerName: string;
  containerType: string;
  status: 'healthy' | 'warning' | 'critical';
  fishCount: number;
  biomassKg: number;
  lastUpdate: string;
}

export default function BatchManagement() {
  const [selectedBatch, setSelectedBatch] = useState<ExtendedBatch | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedGeography, setSelectedGeography] = useState("all");
  const [selectedEggSource, setSelectedEggSource] = useState<"internal" | "external">("internal");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Custom hooks for data management
  const { batches, species, stages, containers, broodstockPairs, eggSuppliers, isLoading, batchesLoading } = useBatchData(selectedGeography);
  const { kpis } = useBatchKPIs(batches);

  // Geography data
  const { data: geographiesData } = useQuery({
    queryKey: ["infrastructure/geographies"],
    queryFn: () => api.infrastructure.getGeographies(),
  });

  // Create batch mutation
  const createBatchMutation = useMutation({
    mutationFn: async (data: InsertBatch) => api.batch.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch/batches"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Batch created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create batch",
        variant: "destructive",
      });
    },
  });

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      status: "active",
      startDate: new Date(),
      initialCount: 0,
      initialBiomassKg: 0,
      currentCount: 0,
      currentBiomassKg: 0,
      eggSource: "internal",
    },
  });

  const onSubmit = (data: BatchFormData) => {
    const insertData: InsertBatch = {
      ...data,
      startDate: data.startDate.toISOString().split('T')[0],
      expectedHarvestDate: data.expectedHarvestDate?.toISOString().split('T')[0],
      eggProductionDate: data.eggProductionDate?.toISOString().split('T')[0],
      initialBiomassKg: data.initialBiomassKg.toString(),
      currentBiomassKg: data.currentBiomassKg.toString(),
    };
    createBatchMutation.mutate(insertData);
  };


  const getHealthStatus = (batch: ExtendedBatch): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' => {
    // Placeholder logic – assume 100 % survival until initial population becomes available
    const survivalRate = 100;
    if (survivalRate >= 95) return 'excellent';
    if (survivalRate >= 90) return 'good';
    if (survivalRate >= 85) return 'fair';
    if (survivalRate >= 80) return 'poor';
    return 'critical';
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50 border-green-200";
      case "good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "fair": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "poor": return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getLifecycleStages = () => [
    { name: "Egg", duration: 100, color: "bg-yellow-400" },
    { name: "Fry", duration: 100, color: "bg-orange-400" },
    { name: "Parr", duration: 100, color: "bg-green-400" },
    { name: "Smolt", duration: 100, color: "bg-blue-400" },
    { name: "Post-Smolt", duration: 100, color: "bg-purple-400" },
    { name: "Adult", duration: 450, color: "bg-red-400" }
  ];

  const calculateDaysActive = (startDate: string) => {
    return Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStageProgress = (stageName?: string, daysActive?: number) => {
    if (!stageName || !daysActive) return 0;

    const stages = getLifecycleStages();
    const currentStageIndex = stages.findIndex(s => 
      stageName.toLowerCase().includes(s.name.toLowerCase())
    );

    if (currentStageIndex === -1) return 0;

    // Calculate cumulative days up to current stage
    const cumulativeDays = stages.slice(0, currentStageIndex).reduce((sum, stage) => sum + stage.duration, 0);
    const daysInCurrentStage = daysActive - cumulativeDays;
    const currentStageDuration = stages[currentStageIndex].duration;

    const progress = Math.min((daysInCurrentStage / currentStageDuration) * 100, 100);
    return Math.max(0, progress);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 60) return "bg-green-500";
    if (progress < 75) return "bg-yellow-500";
    if (progress < 90) return "bg-orange-500";
    return "bg-red-700";
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.species_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    const matchesStage = stageFilter === "all" || batch.current_lifecycle_stage?.name === stageFilter;
    return matchesSearch && matchesStatus && matchesStage;
  });

  if (batchesLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Batch Management</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
   * NOTE: BatchContainerView expects a Batch type from the generated API models.
   * We provide a lightweight mapper to convert the few fields that
   * BatchContainerView relies on (currently only the `id` – plus a handful
   * of required props on the `Batch` type).  This avoids an unsafe cast
   * while keeping the mapping logic in one place.
   * ------------------------------------------------------------------ */

  /**
   * Convert an ExtendedBatch (Django v1 API shape) to the minimal
   * Batch shape required by BatchContainerView.
   *
   * Only a subset of fields are mapped.  Any fields that are required
   * by the `Batch` type but are not yet available from the API are
   * filled with sensible fall-backs so the object satisfies the type
   * checker without affecting runtime behaviour of BatchContainerView.
   */
  const mapExtendedToBatch = (b: ExtendedBatch): Batch => ({
    id: b.id,
    batch_number: b.batch_number,
    /* Optional, but required (read-only) in generated Batch type */
    species_name: b.species_name ?? "",
    species: b.species,
    lifecycle_stage: b.lifecycle_stage ?? 0,
    status: (b.status as Batch["status"]) ?? "ACTIVE",
    batch_type: (b.batch_type as Batch["batch_type"]) ?? "STANDARD",
    start_date: b.start_date,
    expected_end_date: b.expected_end_date ?? null,
    notes: b.notes ?? "",

    /* read-only / calculated */
    created_at: b.created_at,
    updated_at: b.updated_at,
    calculated_population_count: b.calculated_population_count ?? 0,
    calculated_biomass_kg:
      typeof b.calculated_biomass_kg === "string"
        ? parseFloat(b.calculated_biomass_kg)
        : b.calculated_biomass_kg ?? 0,
    /* Derive average weight if not provided */
    calculated_avg_weight_g: (() => {
      if (typeof b.avgWeight === "number") return b.avgWeight;
      const pop = b.calculated_population_count ?? 0;
      const biomassKg =
        typeof b.calculated_biomass_kg === "string"
          ? parseFloat(b.calculated_biomass_kg)
          : b.calculated_biomass_kg ?? 0;
      return pop > 0 ? (biomassKg * 1000) / pop : 0;
    })(),
    current_lifecycle_stage: b.current_lifecycle_stage ?? null,
    days_in_production: b.daysActive ?? 0,
    active_containers: [], // placeholder – fetched separately
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Fish className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Batch Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage fish batches through their lifecycle
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={selectedGeography} onValueChange={setSelectedGeography}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Geography" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Geographies</SelectItem>
              {geographiesData?.results?.map((geo: any) => (
                <SelectItem key={geo.id} value={geo.name.toLowerCase().replace(' ', '-')}>
                  {geo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Batch Selector - Visible on detail tabs */}
          {activeTab !== "overview" && (
            <Select 
              value={selectedBatch?.id.toString() || ""} 
              onValueChange={(value) => {
                const batch = batches.find(b => b.id.toString() === value);
                if (batch) setSelectedBatch(batch);
              }}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a batch">
                  {selectedBatch ? (
                    <span className="flex items-center gap-2">
                      <Fish className="h-4 w-4" />
                      <span className="truncate">{selectedBatch.batch_number}</span>
                    </span>
                  ) : "Select a batch"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {batches.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No batches available</div>
                ) : (
                  batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span className="font-medium">{batch.batch_number}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {batch.current_lifecycle_stage_name || batch.lifecycle_stage_name || 'Unknown'}
                          </Badge>
                          <Badge 
                            variant={batch.status === 'ACTIVE' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {batch.status}
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Batch
              </Button>
            </DialogTrigger>
            <DialogContent className={cn("max-w-2xl", isMobile && "max-w-[95vw]")}>
              <DialogHeader>
                <DialogTitle>Create New Batch</DialogTitle>
                <DialogDescription>
                  Add a new fish batch to the system
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Form fields would go here - keeping minimal for now */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createBatchMutation.isPending}>
                      {createBatchMutation.isPending ? "Creating..." : "Create Batch"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <BatchKPIs kpis={kpis} isLoading={isLoading} />

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeTab === "overview" && "Overview"}
                  {activeTab === "containers" && "Containers"}
                  {activeTab === "medical" && "Medical Journal"}
                  {activeTab === "feed" && "Feed History"}
                  {activeTab === "analytics" && "Analytics"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="containers">Containers</SelectItem>
                <SelectItem value="medical">Medical Journal</SelectItem>
                <SelectItem value="feed">Feed History</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="containers">
              <Container className="w-4 h-4 mr-2" />
              Containers
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Stethoscope className="w-4 h-4 mr-2" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="feed">
              <TrendingUp className="w-4 h-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="overview">
          <BatchOverview
            batches={batches}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            stageFilter={stageFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            onStageFilterChange={setStageFilter}
            onBatchSelect={setSelectedBatch}
            selectedBatch={selectedBatch}
            isLoading={batchesLoading}
            stages={stages}
          />
        </TabsContent>

        <TabsContent value="containers">
          {selectedBatch ? (
            <BatchContainerView
              selectedBatch={mapExtendedToBatch(selectedBatch)}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a batch from the overview list to view its containers.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="medical">
          {selectedBatch ? (
            <BatchHealthView
              batchId={selectedBatch.id}
              batchName={selectedBatch.batch_number}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a batch from the overview list to view its medical journal.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="feed">
          {selectedBatch ? (
            <BatchFeedHistoryView
              batchId={selectedBatch.id}
              batchName={selectedBatch.batch_number}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a batch from the overview list to view its feed history.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {selectedBatch ? (
            <BatchAnalyticsView
              batchId={selectedBatch.id}
              batchName={selectedBatch.batch_number}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a batch from the overview list to view analytics.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
