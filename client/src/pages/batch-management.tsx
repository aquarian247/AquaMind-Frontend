import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, Fish, Plus, MapPin, TrendingUp, Activity, AlertTriangle } from "lucide-react";
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
import type { Batch, InsertBatch, Species, Stage, Container } from "@shared/schema";

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
});

type BatchFormData = z.infer<typeof batchFormSchema>;

interface ExtendedBatch extends Batch {
  speciesName?: string;
  stageName?: string;
  containerName?: string;
  fcr?: number;
  survivalRate?: number;
  avgWeight?: number;
}

export default function BatchManagement() {
  const [selectedBatch, setSelectedBatch] = useState<ExtendedBatch | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch batches with extended information
  const { data: batches = [], isLoading: batchesLoading } = useQuery<ExtendedBatch[]>({
    queryKey: ["/api/batches"],
  });

  // Fetch reference data
  const { data: species = [] } = useQuery<Species[]>({
    queryKey: ["/api/species"],
  });

  const { data: stages = [] } = useQuery<Stage[]>({
    queryKey: ["/api/stages"],
  });

  const { data: containers = [] } = useQuery<Container[]>({
    queryKey: ["/api/containers"],
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
    },
  });

  const onSubmit = (data: BatchFormData) => {
    const insertData: InsertBatch = {
      ...data,
      startDate: data.startDate.toISOString().split('T')[0],
      expectedHarvestDate: data.expectedHarvestDate?.toISOString().split('T')[0],
      initialBiomassKg: data.initialBiomassKg.toString(),
      currentBiomassKg: data.currentBiomassKg.toString(),
    };
    createBatchMutation.mutate(insertData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "harvested": return "bg-blue-500";
      case "transferred": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStageProgress = (stageName?: string) => {
    const stages = ["Egg", "Fry", "Parr", "Smolt", "Post-Smolt", "Adult"];
    const currentIndex = stageName ? stages.indexOf(stageName) : 0;
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const calculateBatchMetrics = (batch: ExtendedBatch) => {
    const survivalRate = batch.initialCount > 0 ? (batch.currentCount / batch.initialCount) * 100 : 0;
    const currentBiomass = typeof batch.currentBiomassKg === 'string' ? parseFloat(batch.currentBiomassKg) : batch.currentBiomassKg;
    const initialBiomass = typeof batch.initialBiomassKg === 'string' ? parseFloat(batch.initialBiomassKg) : batch.initialBiomassKg;
    const avgWeight = batch.currentCount > 0 ? (currentBiomass * 1000) / batch.currentCount : 0;
    const growthRate = initialBiomass > 0 ? ((currentBiomass - initialBiomass) / initialBiomass) * 100 : 0;
    
    return { survivalRate, avgWeight, growthRate };
  };

  if (batchesLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Batch Management</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
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
    <div className="container mx-auto p-4 space-y-6">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Fish Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="48500" 
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
                    name="currentBiomassKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Biomass (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="2500.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="container"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container (Optional)</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select container" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {containers.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes about this batch..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

      {/* Batch Overview Cards */}
      <div className="grid gap-4">
        {batches.map((batch: ExtendedBatch) => {
          const metrics = calculateBatchMetrics(batch);
          
          return (
            <Card 
              key={batch.id} 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedBatch?.id === batch.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedBatch(batch)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-xl font-semibold">{batch.name}</h3>
                      <Badge className={getStatusColor(batch.status)}>
                        {batch.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Fish className="h-4 w-4 text-blue-500" />
                        <span className="text-muted-foreground">Species:</span>
                        <span>{batch.speciesName || "Unknown"}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-muted-foreground">Stage:</span>
                        <span>{batch.stageName || "Not set"}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="text-muted-foreground">Location:</span>
                        <span>{batch.containerName || "Unassigned"}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span className="text-muted-foreground">Started:</span>
                        <span>{new Date(batch.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center min-w-0 lg:min-w-[400px]">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {batch.currentCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Fish Count</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {parseFloat(batch.currentBiomassKg.toString()).toFixed(1)}kg
                      </div>
                      <div className="text-xs text-muted-foreground">Biomass</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {metrics.survivalRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Survival</div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {metrics.avgWeight.toFixed(0)}g
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Weight</div>
                    </div>
                  </div>
                </div>

                {/* Lifecycle Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Lifecycle Progress</span>
                    <span className="font-medium">{batch.stageName || "Not set"}</span>
                  </div>
                  <Progress value={getStageProgress(batch.stageName)} className="h-2" />
                </div>

                {/* Health Indicators */}
                {metrics.survivalRate < 90 && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Low survival rate - requires attention</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {batches.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Fish className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Batches Found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first fish batch
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Batch
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}