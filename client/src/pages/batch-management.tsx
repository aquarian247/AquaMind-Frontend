import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, Fish, Plus, MapPin, TrendingUp, Activity, AlertTriangle, Heart, Users, BarChart3, Container as ContainerIcon, Search, Filter, Clock, Target, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Batch } from "@/api/generated/models/Batch";
import type { Species } from "@/api/generated/models/Species";
import type { LifeCycleStage } from "@/api/generated/models/LifeCycleStage";
import type { Container } from "@/api/generated/models/Container";
import type { BreedingPair } from "@/api/generated/models/BreedingPair";
import type { EggSupplier } from "@/api/generated/models/EggSupplier";
import { BatchContainerView } from "@/components/batch-management/BatchContainerView";
import { BatchHealthView } from "@/components/batch-management/BatchHealthView";
import { BatchAnalyticsView } from "@/components/batch-management/BatchAnalyticsView";
import { BatchFeedHistoryView } from "@/components/batch-management/BatchFeedHistoryView";

// Define InsertBatch type based on Batch type for creating new batches
type InsertBatch = {
  name: string;
  species: number;
  startDate: string;
  initialCount: number;
  initialBiomassKg: string;
  currentCount: number;
  currentBiomassKg: string;
  container?: number;
  stage?: number;
  status: string;
  expectedHarvestDate?: string;
  notes?: string;
  eggSource: 'internal' | 'external';
  broodstockPairId?: number;
  eggSupplierId?: number;
  eggBatchNumber?: string;
  eggProductionDate?: string;
};

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

interface ExtendedBatch {
  // Core fields from Django API
  id: number;
  batch_number: string;
  species: number;
  species_name?: string;
  lifecycle_stage?: number;
  status: string;
  batch_type?: string;
  start_date: string;
  expected_end_date?: string;
  actual_end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  population_count?: number;
  biomass_kg?: number;
  
  // Calculated fields from Django API
  calculated_population_count?: number;
  calculated_biomass_kg?: string;
  current_lifecycle_stage?: {
    id: number;
    name: string;
  };
  expected_harvest_date?: string;
  egg_source?: string;
  
  // Frontend-calculated fields
  fcr?: number;
  survivalRate?: number;
  avgWeight?: number;
  daysActive?: number;
  containerCount?: number;
  healthStatus?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  mortalityRate?: number;
  biomassGrowthRate?: number;
  
  // Legacy fields for compatibility
  name?: string; // Maps to batch_number
  initialCount?: number;
  speciesName?: string;
  stageName?: string;
  containerName?: string;
}

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

  // Geography data
  const { data: geographiesData } = useQuery({
    queryKey: ["/api/v1/infrastructure/geographies/"],
    queryFn: async () => {
      const response = await fetch("/api/v1/infrastructure/geographies/");
      if (!response.ok) throw new Error("Failed to fetch geographies");
      const data = await response.json();
      return data;
    },
  });

  // Fetch data
  const { data: batches = [], isLoading: batchesLoading } = useQuery<ExtendedBatch[]>({
    queryKey: ["/api/v1/batch/batches/", selectedGeography],
    queryFn: async () => {
      const url = selectedGeography !== "all" 
        ? `/api/v1/batch/batches/?geography=${selectedGeography}`
        : "/api/v1/batch/batches/";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch batches");
      const data = await response.json();
      return data.results || [];
    },
  });

  const { data: species = [] } = useQuery<Species[]>({
    queryKey: ["/api/v1/batch/species/"],
    queryFn: async () => {
      const response = await fetch("/api/v1/batch/species/");
      if (!response.ok) throw new Error("Failed to fetch species");
      const data = await response.json();
      return data.results || [];
    }
  });

  const { data: stages = [] } = useQuery<LifeCycleStage[]>({
    queryKey: ["/api/v1/batch/lifecycle-stages/"],
    queryFn: async () => {
      const response = await fetch("/api/v1/batch/lifecycle-stages/");
      if (!response.ok) throw new Error("Failed to fetch lifecycle stages");
      const data = await response.json();
      return data.results || [];
    }
  });

  const { data: containers = [] } = useQuery<Container[]>({
    queryKey: ["/api/v1/infrastructure/containers/"],
    queryFn: async () => {
      const response = await fetch("/api/v1/infrastructure/containers/");
      if (!response.ok) throw new Error("Failed to fetch containers");
      const data = await response.json();
      return data.results || [];
    }
  });

  const { data: broodstockPairs = [] } = useQuery<BreedingPair[]>({
    queryKey: ["/api/v1/broodstock/pairs/"],
    queryFn: async () => {
      const response = await fetch("/api/v1/broodstock/pairs/");
      if (!response.ok) throw new Error("Failed to fetch broodstock pairs");
      const data = await response.json();
      return data.results || [];
    }
  });

  const { data: eggSuppliers = [] } = useQuery<EggSupplier[]>({
    queryKey: ["/api/v1/broodstock/egg-suppliers/"],
    queryFn: async () => {
      const response = await fetch("/api/v1/broodstock/egg-suppliers/");
      if (!response.ok) throw new Error("Failed to fetch egg suppliers");
      const data = await response.json();
      return data.results || [];
    }
  });

  // Create batch mutation
  const createBatchMutation = useMutation({
    mutationFn: async (data: InsertBatch) => {
      const response = await fetch("/api/v1/batch/batches/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create batch");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/batch/batches/"] });
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

  // Calculate KPIs from batches
  const calculateKPIs = (): BatchKPIs => {
    const activeBatches = batches.filter(b => b.status === 'ACTIVE');
    const totalFishCount = activeBatches.reduce((sum, b) => sum + (b.calculated_population_count || 0), 0);
    const totalBiomass = activeBatches.reduce((sum, b) => {
      const biomass = typeof b.calculated_biomass_kg === 'string' ? parseFloat(b.calculated_biomass_kg) : (b.calculated_biomass_kg || 0);
      return sum + biomass;
    }, 0);

    const avgSurvivalRate = activeBatches.length > 0 ? 
      // We don't have initialCount from the API, so assume 100 % survival for KPI placeholder
      activeBatches.reduce((sum) => {
        const rate = 100;
        return sum + rate;
      }, 0) / activeBatches.length : 0;

    // Without initial population we can't accurately flag "critical" survival,
    // so default to zero batches requiring attention.
    const batchesWithCriticalHealth = 0;

    return {
      totalActiveBatches: activeBatches.length,
      averageHealthScore: avgSurvivalRate,
      totalFishCount,
      averageSurvivalRate: avgSurvivalRate,
      batchesRequiringAttention: batchesWithCriticalHealth,
      avgGrowthRate: 15.2, // Mock data
      totalBiomass,
      averageFCR: 1.2, // Mock data
    };
  };

  const kpis = calculateKPIs();

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
      <div className="container mx-auto p-3 lg:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Batch Management</h1>
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
    <div className="container mx-auto p-3 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Batch Management</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage fish batches through their lifecycle
          </p>
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
        </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., BATCH-2024-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Species</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {species.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lifecycle Stage</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stages.map((s) => (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="initialCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Fish Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="50000" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="initialBiomassKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Biomass (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="1000.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Broodstock Traceability Section */}
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-sm">Egg Source & Traceability</h4>

                  <FormField
                    control={form.control}
                    name="eggSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Egg Source</FormLabel>
                        <Select 
                          onValueChange={(value: "internal" | "external") => {
                            field.onChange(value);
                            setSelectedEggSource(value);
                            // Reset related fields when changing source type
                            if (value === "internal") {
                              form.setValue("eggSupplierId", undefined);
                              form.setValue("eggBatchNumber", undefined);
                            } else {
                              form.setValue("broodstockPairId", undefined);
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select egg source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="internal">Internal Broodstock</SelectItem>
                            <SelectItem value="external">External Supplier</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedEggSource === "internal" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="broodstockPairId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Broodstock Pair</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select broodstock pair" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {broodstockPairs.map((pair) => (
                                  <SelectItem key={pair.id} value={pair.id.toString()}>
                                    {pair.id} (♂{pair.male_fish_display} × ♀{pair.female_fish_display})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eggProductionDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Egg Production Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick production date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {selectedEggSource === "external" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="eggSupplierId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Egg Supplier</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {eggSuppliers.map((supplier) => (
                                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                        {supplier.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eggBatchNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier Batch Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., AGN-2024-E0127" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

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

      {/* KPI Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
                <p className="text-2xl font-bold">{kpis.totalActiveBatches}</p>
                <p className="text-xs text-muted-foreground mt-1">Currently in production</p>
              </div>
              <Fish className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fish Count</p>
                <p className="text-2xl font-bold">{kpis.totalFishCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Across all batches</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Survival Rate</p>
                <p className="text-2xl font-bold">{kpis.averageSurvivalRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Overall health indicator</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold">{kpis.batchesRequiringAttention}</p>
                <p className="text-xs text-muted-foreground mt-1">Batches requiring review</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs - Desktop horizontal, Mobile dropdown */}
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
            <TabsTrigger value="medical">Medical Journal</TabsTrigger>
            <TabsTrigger value="feed">Feed History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="harvested">Harvested</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.name}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Batch Cards */}
          <div className="space-y-4">
            {filteredBatches.map((batch: ExtendedBatch) => {
              const daysActive = calculateDaysActive(batch.start_date);
              // Placeholder – assume 100 % survival until backend provides initialCount
              const survivalRate = 100;
              const healthStatus = getHealthStatus(batch);
              const currentBiomass = typeof batch.calculated_biomass_kg === 'string' ? parseFloat(batch.calculated_biomass_kg) : (batch.calculated_biomass_kg || 0);
          // Handle possible undefined population count safely
          const populationCount = batch.calculated_population_count ?? 0;
          const avgWeight = populationCount > 0 ? (currentBiomass * 1000) / populationCount : 0;
              const stageProgress = getStageProgress(batch.current_lifecycle_stage?.name, daysActive);

              return (
                <Card 
                  key={batch.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-l-4",
                    healthStatus === 'excellent' && "border-l-green-500",
                    healthStatus === 'good' && "border-l-blue-500",
                    healthStatus === 'fair' && "border-l-yellow-500",
                    healthStatus === 'poor' && "border-l-orange-500",
                    healthStatus === 'critical' && "border-l-red-500",
                    selectedBatch?.id === batch.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedBatch(batch)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold">{batch.batch_number}</h3>
                            <Badge variant="secondary">{batch.status}</Badge>
                            <Badge className={getHealthStatusColor(healthStatus)}>
                              {healthStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{batch.species_name || "Unknown Species"}</span>
                            <span>•</span>
                            <span>{daysActive} days active</span>
                            <span>•</span>
                            <span>Started {format(new Date(batch.start_date), "MMM dd, yyyy")}</span>
                          </div>
                        </div>

                        <Link href={`/batch-details/${batch.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />View Details
                          </Button>
                        </Link>
                      </div>

                      {/* Lifecycle Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Lifecycle Stage: {batch.current_lifecycle_stage?.name || "Not set"}</span>
                          <span className="text-muted-foreground">{stageProgress.toFixed(1)}% through stage</span>
                        </div>
                        <div className="flex space-x-1">
                          {getLifecycleStages().map((stage, index) => {
                            const stages = getLifecycleStages();
                            const currentStageIndex = stages.findIndex(s => 
                              batch.current_lifecycle_stage?.name?.toLowerCase().includes(s.name.toLowerCase()) ||
                              (s.name === "Egg" && batch.current_lifecycle_stage?.name?.toLowerCase().includes("alevin"))
                            );
                            const isCurrentStage = currentStageIndex === index;
                            const isCompleted = currentStageIndex > index;

                            return (
                              <div key={stage.name} className="flex-1 space-y-1">
                                <div className={cn(
                                  "h-3 rounded-full relative overflow-hidden",
                                  "bg-gray-200"
                                )}>
                                  {isCompleted && (
                                    <div className="absolute inset-0 bg-green-400 rounded-full" />
                                  )}
                                  {isCurrentStage && (
                                    <div 
                                      className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        getProgressColor(stageProgress)
                                      )}
                                      style={{ width: `${stageProgress}%` }}
                                    />
                                  )}
                                </div>
                                <div className="text-xs text-center truncate px-1">{stage.name}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {(batch.calculated_population_count ?? 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Fish Count</div>
                        </div>

                        <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {currentBiomass.toFixed(1)}kg
                          </div>
                          <div className="text-xs text-muted-foreground">Biomass</div>
                        </div>

                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {survivalRate.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Survival</div>
                        </div>

                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {avgWeight.toFixed(0)}g
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Weight</div>
                        </div>
                      </div>

                      {/* Container Distribution Indicator */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ContainerIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">Container Distribution</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            {/* Mock container status indicators */}
                            <div className="w-3 h-3 rounded-full bg-green-500" title="Healthy container" />
                            <div className="w-3 h-3 rounded-full bg-green-500" title="Healthy container" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" title="Warning container" />
                          </div>
                          <span className="text-sm text-muted-foreground">3 containers</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="containers">
          {/* Convert `null` → `undefined` to satisfy the component's prop type */}
          <BatchContainerView
            selectedBatch={
              selectedBatch ? mapExtendedToBatch(selectedBatch) : undefined
            }
          />
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
                  Select a batch from the&nbsp;overview list to view its medical
                  journal.
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
                  Select a batch from the&nbsp;overview list to view its feed
                  history.
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
                  Select a batch from the&nbsp;overview list to view analytics.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
