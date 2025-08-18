import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Scenario } from "@/api/generated/models/Scenario";

/* -------------------------------------------------------------------------- */
/*                               Form Zod Schema                              */
/* -------------------------------------------------------------------------- */
const scenarioFormSchema = z.object({
  // Required
  name: z.string().min(1, "Name is required"),
  startDate: z.date(),
  durationDays: z.number().min(1, "Duration is required"),
  initialCount: z.number().min(1, "Initial count is required"),
  genotype: z.string().min(1, "Genotype is required"),
  supplier: z.string().min(1, "Supplier is required"),

  // Optional / nullable fields
  initialWeight: z.number().optional().nullable(),
  tgcModelId: z.number().optional(),
  fcrModelId: z.number().optional(),
  mortalityModelId: z.number().optional(),
  batchId: z.number().optional().nullable(),
  biologicalConstraintsId: z.number().optional().nullable(),
  temperatureProfileId: z.number().optional(),
  status: z.string().optional(),
});

type ScenarioFormData = z.infer<typeof scenarioFormSchema>;

interface TgcModel {
  id: number;
  name: string;
  location: string;
  releasePeriod: string;
  tgcValue: string;
}

interface FcrModel {
  id: number;
  name: string;
  description: string;
}

interface MortalityModel {
  id: number;
  name: string;
  frequency: string;
  description: string;
}

interface TemperatureProfile {
  id: number;
  name: string;
  createdAt: string;
}

interface ScenarioCreationDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function ScenarioCreationDialog({ children, onSuccess }: ScenarioCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ScenarioFormData>({
    resolver: zodResolver(scenarioFormSchema),
    defaultValues: {
      name: "",
      durationDays: 540, // Default 18 months
      initialCount: 100000,
      initialWeight: 50,
      genotype: "AquaGen",
      supplier: "Benchmark Genetics",
      status: "draft",
      startDate: new Date(),
    },
  });

  // Fetch available models
  const { data: tgcModels } = useQuery<{results: TgcModel[]}>({
    queryKey: ["/api/v1/scenario/tgc-models/"],
    enabled: open,
  });

  const { data: fcrModels } = useQuery<{results: FcrModel[]}>({
    queryKey: ["/api/v1/scenario/fcr-models/"],
    enabled: open,
  });

  const { data: mortalityModels } = useQuery<{results: MortalityModel[]}>({
    queryKey: ["/api/v1/scenario/mortality-models/"],
    enabled: open,
  });

  const { data: temperatureProfiles } = useQuery<{results: TemperatureProfile[]}>({
    queryKey: ["/api/v1/scenario/temperature-profiles/"],
    enabled: open,
  });

  const createScenarioMutation = useMutation({
    mutationFn: async (data: ScenarioFormData) => {
      /* ------------------------------------------------------------------ */
      /*                Transform camelCase form data -> snake_case         */
      /* ------------------------------------------------------------------ */
      const payload: Partial<Scenario> = {
        name: data.name,
        start_date: data.startDate.toISOString().split("T")[0],
        duration_days: data.durationDays,
        initial_count: data.initialCount,
        initial_weight: data.initialWeight ?? null,
        genotype: data.genotype,
        supplier: data.supplier,
        tgc_model: data.tgcModelId,
        fcr_model: data.fcrModelId,
        mortality_model: data.mortalityModelId,
        batch: data.batchId ?? null,
        biological_constraints: data.biologicalConstraintsId ?? null,
        // Temperature profile is part of the TGC model; keep as optional extension
        // @ts-expect-error openapi client may not yet expose this field
        temperature_profile: data.temperatureProfileId,
        // Status field may be optional in API
        // @ts-ignore - allow draft status until backend enforces default
        status: data.status,
      };

      return apiRequest("POST", "/api/v1/scenario/scenarios/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/dashboard/kpis/"] });
      toast({
        title: "Scenario Created",
        description: "Your scenario has been created successfully.",
      });
      setOpen(false);
      setCurrentStep(1);
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create scenario. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ScenarioFormData) => {
    createScenarioMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter scenario name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
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
                              "w-full pl-3 text-left font-normal",
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
                            date < new Date() || date < new Date("1900-01-01")
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
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="30" 
                        max="1000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Typical salmon cycle: 540 days (18 months)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initialCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Fish Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1000" 
                        max="10000000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Weight (grams)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0.1" 
                        max="5000"
                        step="0.1"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genotype"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genotype</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genotype" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AquaGen">AquaGen</SelectItem>
                        <SelectItem value="SalmoBreed">SalmoBreed</SelectItem>
                        <SelectItem value="Benchmark">Benchmark</SelectItem>
                        <SelectItem value="Landcatch">Landcatch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Benchmark Genetics">Benchmark Genetics</SelectItem>
                        <SelectItem value="AquaGen">AquaGen</SelectItem>
                        <SelectItem value="SalmoBreed">SalmoBreed</SelectItem>
                        <SelectItem value="Landcatch Natural Selection">Landcatch Natural Selection</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">TGC Model</h4>
              <FormField
                control={form.control}
                name="tgcModelId"
                render={({ field }) => (
                  <FormItem>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString() || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select TGC model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tgcModels?.results?.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name} - {model.location} ({model.releasePeriod})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">FCR Model</h4>
              <FormField
                control={form.control}
                name="fcrModelId"
                render={({ field }) => (
                  <FormItem>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString() || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select FCR model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fcrModels?.results?.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Mortality Model</h4>
              <FormField
                control={form.control}
                name="mortalityModelId"
                render={({ field }) => (
                  <FormItem>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString() || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mortality model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mortalityModels?.results?.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.name} ({model.frequency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Temperature Profile</h4>
              <FormField
                control={form.control}
                name="temperatureProfileId"
                render={({ field }) => (
                  <FormItem>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString() || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select temperature profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {temperatureProfiles?.results?.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id.toString()}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 4:
        const formData = form.getValues();
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Review Scenario Configuration</h4>
            
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium">{formData.durationDays} days</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">{formData.startDate ? format(formData.startDate, "PPP") : "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary">{formData.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Initial Conditions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Fish Count:</span>
                    <p className="font-medium">{formData.initialCount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Initial Weight:</span>
                    <p className="font-medium">{formData.initialWeight}g</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Genotype:</span>
                    <p className="font-medium">{formData.genotype}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Supplier:</span>
                    <p className="font-medium">{formData.supplier}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Selected Models</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TGC Model:</span>
                    <span className="font-medium">
                      {formData.tgcModelId ? 
                        tgcModels?.results?.find(m => m.id === formData.tgcModelId)?.name || "Selected" : 
                        "None selected"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FCR Model:</span>
                    <span className="font-medium">
                      {formData.fcrModelId ? 
                        fcrModels?.results?.find(m => m.id === formData.fcrModelId)?.name || "Selected" : 
                        "None selected"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mortality Model:</span>
                    <span className="font-medium">
                      {formData.mortalityModelId ? 
                        mortalityModels?.results?.find(m => m.id === formData.mortalityModelId)?.name || "Selected" : 
                        "None selected"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature Profile:</span>
                    <span className="font-medium">
                      {formData.temperatureProfileId ? 
                        temperatureProfiles?.results?.find(p => p.id === formData.temperatureProfileId)?.name || "Selected" : 
                        "None selected"
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Information";
      case 2: return "Initial Conditions";
      case 3: return "Model Selection";
      case 4: return "Review & Create";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Scenario</DialogTitle>
          <DialogDescription>
            Step {currentStep} of 4: {getStepTitle()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={cn(
                        "w-12 h-1 mx-2",
                        step < currentStep ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {renderStepContent()}

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {currentStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={createScenarioMutation.isPending}>
                    {createScenarioMutation.isPending ? "Creating..." : "Create Scenario"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
