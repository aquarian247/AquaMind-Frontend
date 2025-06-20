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
import type { Batch, InsertBatch, Species, Stage, Container, BroodstockPair, EggSupplier } from "@shared/schema";
import { BatchContainerView } from "@/components/batch-management/BatchContainerView";

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

interface ExtendedBatch extends Batch {
  speciesName?: string;
  stageName?: string;
  containerName?: string;
  fcr?: number;
  survivalRate?: number;
  avgWeight?: number;
  daysActive?: number;
  containerCount?: number;
  healthStatus?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  mortalityRate?: number;
  biomassGrowthRate?: number;
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
      return response.json();
    },
  });

  // Fetch data
  const { data: batches = [], isLoading: batchesLoading } = useQuery<ExtendedBatch[]>({
    queryKey: ["/api/batches", selectedGeography],
    queryFn: async () => {
      const url = selectedGeography !== "all" 
        ? `/api/batches?geography=${selectedGeography}`
        : "/api/batches";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch batches");
      return response.json();
    },
  });

  const { data: species = [] } = useQuery<Species[]>({
    queryKey: ["/api/species"],
  });

  const { data: stages = [] } = useQuery<Stage[]>({
    queryKey: ["/api/stages"],
  });

  const { data: containers = [] } = useQuery<Container[]>({
    queryKey: ["/api/containers"],
  });

  const { data: broodstockPairs = [] } = useQuery<BroodstockPair[]>({
    queryKey: ["/api/broodstock-pairs"],
  });

  const { data: eggSuppliers = [] } = useQuery<EggSupplier[]>({
    queryKey: ["/api/egg-suppliers"],
  });

  // Create batch mutation
  const createBatchMutation = useMutation({
    mutationFn: async (data: InsertBatch) => {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create batch");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
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
    const activeBatches = batches.filter(b => b.status === 'active');
    const totalFishCount = activeBatches.reduce((sum, b) => sum + b.currentCount, 0);
    const totalBiomass = activeBatches.reduce((sum, b) => {
      const biomass = typeof b.currentBiomassKg === 'string' ? parseFloat(b.currentBiomassKg) : b.currentBiomassKg;
      return sum + biomass;
    }, 0);

    const avgSurvivalRate = activeBatches.length > 0 ? 
      activeBatches.reduce((sum, b) => {
        const rate = b.initialCount > 0 ? (b.currentCount / b.initialCount) * 100 : 0;
        return sum + rate;
      }, 0) / activeBatches.length : 0;

    const batchesWithCriticalHealth = activeBatches.filter(b => {
      const survivalRate = b.initialCount > 0 ? (b.currentCount / b.initialCount) * 100 : 0;
      return survivalRate < 85; // Consider <85% survival as requiring attention
    }).length;

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
    const survivalRate = batch.initialCount > 0 ? (batch.currentCount / batch.initialCount) * 100 : 0;
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
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.speciesName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    const matchesStage = stageFilter === "all" || batch.stageName === stageFilter;
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
                                    {pair.pairName} (♂{pair.maleFishId} × ♀{pair.femaleFishId})
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
                                    {supplier.name} ({supplier.country})
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
              const daysActive = calculateDaysActive(batch.startDate);
              const survivalRate = batch.initialCount > 0 ? (batch.currentCount / batch.initialCount) * 100 : 0;
              const healthStatus = getHealthStatus(batch);
              const currentBiomass = typeof batch.currentBiomassKg === 'string' ? parseFloat(batch.currentBiomassKg) : batch.currentBiomassKg;
              const avgWeight = batch.currentCount > 0 ? (currentBiomass * 1000) / batch.currentCount : 0;
              const stageProgress = getStageProgress(batch.stageName, daysActive);

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
                            <h3 className="text-xl font-semibold">{batch.name}</h3>
                            <Badge variant="secondary">{batch.status}</Badge>
                            <Badge className={getHealthStatusColor(healthStatus)}>
                              {healthStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{batch.speciesName || "Unknown Species"}</span>
                            <span>•</span>
                            <span>{daysActive} days active</span>
                            <span>•</span>
                            <span>Started {format(new Date(batch.startDate), "MMM dd, yyyy")}</span>
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
                          <span className="font-medium">Lifecycle Stage: {batch.stageName || "Not set"}</span>
                          <span className="text-muted-foreground">{stageProgress.toFixed(1)}% through stage</span>
                        </div>
                        <div className="flex space-x-1">
                          {getLifecycleStages().map((stage, index) => {
                            const stages = getLifecycleStages();
                            const currentStageIndex = stages.findIndex(s => 
                              batch.stageName?.toLowerCase().includes(s.name.toLowerCase()) ||
                              (s.name === "Egg" && batch.stageName?.toLowerCase().includes("alevin"))
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
                            {batch.currentCount.toLocaleString()}
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
          <BatchContainerView selectedBatch={selectedBatch} />
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Journal</CardTitle>
              <CardDescription>
                Health events and medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Medical journal entries will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed">
          <Card>
            <CardHeader>
              <CardTitle>Feed History</CardTitle>
              <CardDescription>
                Feeding events and feed conversion data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Feed history and FCR data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Batch Analytics</CardTitle>
              <CardDescription>
                Performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics and performance charts will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}