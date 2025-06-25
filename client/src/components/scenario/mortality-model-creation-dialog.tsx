import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, TrendingDown, Plus, Trash2, Info, AlertTriangle, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Mortality Stage Override Schema
const mortalityStageSchema = z.object({
  lifecycleStage: z.string().min(1, "Lifecycle stage is required"),
  dailyRatePercent: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 5, 
      "Daily rate must be between 0% and 5%"),
  weeklyRatePercent: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 25, 
      "Weekly rate must be between 0% and 25%"),
});

// Mortality Model Form Schema with validation based on PRD requirements
const mortalityModelFormSchema = z.object({
  name: z.string().min(1, "Model name is required").max(100, "Name too long"),
  frequency: z.enum(["daily", "weekly"], { required_error: "Frequency is required" }),
  rate: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 10, 
      "Rate must be between 0% and 10%"),
  description: z.string().optional(),
  useStageOverrides: z.boolean().default(false),
  stageOverrides: z.array(mortalityStageSchema).optional(),
});

type MortalityModelFormData = z.infer<typeof mortalityModelFormSchema>;

interface MortalityModelCreationDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

// Default lifecycle stages based on salmon farming
const LIFECYCLE_STAGES = [
  { value: "fry", label: "Fry", description: "Early freshwater stage" },
  { value: "parr", label: "Parr", description: "Juvenile freshwater stage" },
  { value: "smolt", label: "Smolt", description: "Pre-sea transfer stage" },
  { value: "post_smolt", label: "Post-Smolt", description: "Early sea stage" },
  { value: "adult", label: "Adult", description: "Growing to harvest" },
];

// Preset mortality models
const MORTALITY_PRESETS = {
  low: {
    name: "Low Mortality",
    daily: 0.02,
    weekly: 0.14,
    description: "Conservative mortality rates for optimal conditions",
    stageOverrides: [
      { lifecycleStage: "fry", dailyRatePercent: "0.05", weeklyRatePercent: "0.35" },
      { lifecycleStage: "parr", dailyRatePercent: "0.03", weeklyRatePercent: "0.21" },
      { lifecycleStage: "smolt", dailyRatePercent: "0.02", weeklyRatePercent: "0.14" },
      { lifecycleStage: "post_smolt", dailyRatePercent: "0.015", weeklyRatePercent: "0.105" },
      { lifecycleStage: "adult", dailyRatePercent: "0.01", weeklyRatePercent: "0.07" },
    ]
  },
  standard: {
    name: "Standard Mortality",
    daily: 0.05,
    weekly: 0.35,
    description: "Typical mortality rates based on industry averages",
    stageOverrides: [
      { lifecycleStage: "fry", dailyRatePercent: "0.08", weeklyRatePercent: "0.56" },
      { lifecycleStage: "parr", dailyRatePercent: "0.06", weeklyRatePercent: "0.42" },
      { lifecycleStage: "smolt", dailyRatePercent: "0.05", weeklyRatePercent: "0.35" },
      { lifecycleStage: "post_smolt", dailyRatePercent: "0.04", weeklyRatePercent: "0.28" },
      { lifecycleStage: "adult", dailyRatePercent: "0.03", weeklyRatePercent: "0.21" },
    ]
  },
  high: {
    name: "High Mortality",
    daily: 0.08,
    weekly: 0.56,
    description: "Conservative planning with higher mortality assumptions",
    stageOverrides: [
      { lifecycleStage: "fry", dailyRatePercent: "0.12", weeklyRatePercent: "0.84" },
      { lifecycleStage: "parr", dailyRatePercent: "0.10", weeklyRatePercent: "0.70" },
      { lifecycleStage: "smolt", dailyRatePercent: "0.08", weeklyRatePercent: "0.56" },
      { lifecycleStage: "post_smolt", dailyRatePercent: "0.06", weeklyRatePercent: "0.42" },
      { lifecycleStage: "adult", dailyRatePercent: "0.05", weeklyRatePercent: "0.35" },
    ]
  }
};

export function MortalityModelCreationDialog({ children, onSuccess }: MortalityModelCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MortalityModelFormData>({
    resolver: zodResolver(mortalityModelFormSchema),
    defaultValues: {
      name: "",
      frequency: "daily",
      rate: "0.05",
      description: "",
      useStageOverrides: false,
      stageOverrides: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "stageOverrides",
  });

  const createMortalityModelMutation = useMutation({
    mutationFn: async (data: MortalityModelFormData) => {
      return apiRequest("/api/v1/scenario-planning/mortality-models/", {
        method: "POST",
        body: {
          name: data.name,
          frequency: data.frequency,
          rate: parseFloat(data.rate) / 100, // Convert percentage to decimal
          description: data.description,
          stage_overrides: data.useStageOverrides ? data.stageOverrides?.map(override => ({
            lifecycle_stage: override.lifecycleStage,
            daily_rate_percent: parseFloat(override.dailyRatePercent),
            weekly_rate_percent: parseFloat(override.weeklyRatePercent),
          })) : [],
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario-planning/mortality-models/"] });
      toast({
        title: "Success",
        description: "Mortality model created successfully",
      });
      setOpen(false);
      setCurrentStep(1);
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create mortality model",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: MortalityModelFormData) => {
    createMortalityModelMutation.mutate(data);
  };

  const loadPreset = (presetType: keyof typeof MORTALITY_PRESETS) => {
    const preset = MORTALITY_PRESETS[presetType];
    const frequency = form.watch("frequency");
    
    form.setValue("name", preset.name);
    form.setValue("description", preset.description);
    form.setValue("rate", (frequency === "daily" ? preset.daily : preset.weekly).toString());
    
    if (preset.stageOverrides) {
      form.setValue("useStageOverrides", true);
      replace(preset.stageOverrides);
    }
  };

  const addStageOverride = () => {
    const availableStages = LIFECYCLE_STAGES.filter(stage => 
      !fields.some(field => field.lifecycleStage === stage.value)
    );
    
    if (availableStages.length > 0) {
      append({
        lifecycleStage: availableStages[0].value,
        dailyRatePercent: "0.05",
        weeklyRatePercent: "0.35",
      });
    }
  };

  const calculateAnnualRate = (rate: number, frequency: string) => {
    if (frequency === "daily") {
      return (1 - Math.pow(1 - rate / 100, 365)) * 100;
    } else {
      return (1 - Math.pow(1 - rate / 100, 52)) * 100;
    }
  };

  const renderStepContent = () => {
    const currentRate = parseFloat(form.watch("rate") || "0");
    const frequency = form.watch("frequency");
    const annualRate = calculateAnnualRate(currentRate, frequency);

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <TrendingDown className="h-5 w-5" />
              Basic Model Information
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Standard Mortality Model" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descriptive name for the mortality model
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional description of mortality model purpose and assumptions..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional context about this mortality model
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4" />
                  Mortality Model Presets
                </CardTitle>
                <CardDescription>
                  Start with industry-standard mortality rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadPreset("low")}
                  >
                    Low Mortality
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadPreset("standard")}
                  >
                    Standard
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadPreset("high")}
                  >
                    High/Conservative
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  These presets include stage-specific overrides and can be customized
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Calculator className="h-5 w-5" />
              Mortality Parameters
            </div>

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    How often mortality is calculated and applied
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Mortality Rate (%) *</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="10" 
                        placeholder="0.05"
                        {...field}
                      />
                      <Slider
                        value={[parseFloat(field.value) || 0]}
                        onValueChange={(value) => field.onChange(value[0].toString())}
                        max={10}
                        min={0}
                        step={0.01}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0% (No mortality)</span>
                        <span>10% (Very high)</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Base {frequency} mortality rate as a percentage
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mortality Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{frequency === "daily" ? "Daily" : "Weekly"} Rate:</span>
                    <p className="font-medium">{currentRate}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Effective Annual Rate:</span>
                    <p className="font-medium">{annualRate.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Example: Starting with 100,000 fish, after 1 year approximately {Math.round(100000 * (1 - annualRate/100)).toLocaleString()} would remain
                  </p>
                </div>
              </CardContent>
            </Card>

            {currentRate > 1 && frequency === "daily" && (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-800">
                      Daily mortality rate above 1% is very high. Consider reviewing the rate.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentRate > 7 && frequency === "weekly" && (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-800">
                      Weekly mortality rate above 7% is very high. Consider reviewing the rate.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <TrendingDown className="h-5 w-5" />
              Stage-Specific Overrides
            </div>

            <FormField
              control={form.control}
              name="useStageOverrides"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Use Stage-Specific Mortality Rates
                    </FormLabel>
                    <FormDescription>
                      Override base rate with different values for each lifecycle stage
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("useStageOverrides") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Lifecycle Stage Overrides</h4>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addStageOverride}
                    disabled={fields.length >= LIFECYCLE_STAGES.length}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stage
                  </Button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {fields.map((field, index) => {
                    const stageName = LIFECYCLE_STAGES.find(s => s.value === field.lifecycleStage)?.label || field.lifecycleStage;
                    
                    return (
                      <Card key={field.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Badge variant="outline">{stageName}</Badge>
                            </CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <FormField
                            control={form.control}
                            name={`stageOverrides.${index}.lifecycleStage`}
                            render={({ field: stageField }) => (
                              <FormItem>
                                <FormLabel>Lifecycle Stage</FormLabel>
                                <FormControl>
                                  <Select onValueChange={stageField.onChange} value={stageField.value}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {LIFECYCLE_STAGES.map((stage) => (
                                        <SelectItem 
                                          key={stage.value} 
                                          value={stage.value}
                                          disabled={fields.some((f, i) => i !== index && f.lifecycleStage === stage.value)}
                                        >
                                          {stage.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`stageOverrides.${index}.dailyRatePercent`}
                              render={({ field: dailyField }) => (
                                <FormItem>
                                  <FormLabel>Daily Rate (%)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01" 
                                      min="0" 
                                      max="5" 
                                      {...dailyField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stageOverrides.${index}.weeklyRatePercent`}
                              render={({ field: weeklyField }) => (
                                <FormItem>
                                  <FormLabel>Weekly Rate (%)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01" 
                                      min="0" 
                                      max="25" 
                                      {...weeklyField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {fields.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        No stage overrides configured. Add stages to customize mortality rates.
                      </p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addStageOverride}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Stage
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{form.watch("name") || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency:</span>
                    <p className="font-medium capitalize">{form.watch("frequency")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Base Rate:</span>
                    <p className="font-medium">{form.watch("rate")}% {form.watch("frequency")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stage Overrides:</span>
                    <p className="font-medium">{form.watch("useStageOverrides") ? fields.length : 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Information";
      case 2: return "Mortality Parameters";
      case 3: return "Stage Overrides";
      default: return "";
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return form.watch("name");
      case 2:
        return form.watch("frequency") && form.watch("rate");
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Mortality Model</DialogTitle>
          <DialogDescription>
            Step {currentStep} of 3: {getStepTitle()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep} disabled={!isStepValid()}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={createMortalityModelMutation.isPending || !isStepValid()}
                  >
                    {createMortalityModelMutation.isPending ? "Creating..." : "Create Mortality Model"}
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