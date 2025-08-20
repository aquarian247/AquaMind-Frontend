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
import { ArrowLeft, ArrowRight, Scale, Plus, Trash2, Info, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { api } from "@/lib/api";

// FCR Stage Schema
const fcrStageSchema = z.object({
  stage: z.number().min(1, "Stage is required"),
  fcrValue: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0.5 && Number(val) <= 2.0, 
      "FCR value must be between 0.5 and 2.0"),
  durationDays: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 500, 
      "Duration must be between 1 and 500 days"),
});

// FCR Model Form Schema with validation based on PRD requirements
const fcrModelFormSchema = z.object({
  name: z.string().min(1, "Model name is required").max(100, "Name too long"),
  description: z.string().optional(),
  stages: z.array(fcrStageSchema).min(1, "At least one stage is required"),
});

type FcrModelFormData = z.infer<typeof fcrModelFormSchema>;

interface Stage {
  id: number;
  name: string;
  description: string;
  minWeightG: string;
  maxWeightG: string;
  typicalDurationDays: number;
}

interface FcrModelCreationDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

// Default FCR values based on PRD specifications
const DEFAULT_STAGES = [
  { stage: 1, name: "Fry", fcrValue: "0.8", durationDays: "90", description: "First feeding stage" },
  { stage: 2, name: "Parr", fcrValue: "1.0", durationDays: "100", description: "Juvenile freshwater stage" },
  { stage: 3, name: "Smolt", fcrValue: "1.0", durationDays: "100", description: "Pre-sea transfer stage" },
  { stage: 4, name: "Post-Smolt", fcrValue: "1.1", durationDays: "60", description: "Early sea stage transition" },
  { stage: 5, name: "Adult", fcrValue: "1.2", durationDays: "400", description: "Growing to harvest weight" },
];

export function FcrModelCreationDialog({ children, onSuccess }: FcrModelCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FcrModelFormData>({
    resolver: zodResolver(fcrModelFormSchema),
    defaultValues: {
      name: "",
      description: "",
      stages: DEFAULT_STAGES.map(stage => ({
        stage: stage.stage,
        fcrValue: stage.fcrValue,
        durationDays: stage.durationDays,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  // Fetch available lifecycle stages
  const { data: availableStages = [] } = useQuery<Stage[]>({
    queryKey: ["batch/lifecycle-stages"],
    queryFn: async () => {
      const res = await api.batch.getLifecycleStages();
      const items = res.results || [];
      return items.map((s: any) => ({
        id: s.id,
        name: s.name || "",
        description: s.description || "",
        // Map numeric/string mixes to consistently typed strings for weights
        minWeightG: String(s.min_weight_g ?? "0"),
        maxWeightG: String(s.max_weight_g ?? "0"),
        // Ensure typicalDurationDays is a number
        typicalDurationDays:
          typeof s.typical_duration_days === "number"
            ? s.typical_duration_days
            : parseInt(String(s.typical_duration_days || 0), 10),
      })) as Stage[];
    },
    enabled: open,
  });

  const createFcrModelMutation = useMutation({
    mutationFn: async (data: FcrModelFormData) => {
      return apiRequest(
        "POST",
        "/api/v1/scenario/fcr-models/",
        {
          name: data.name,
          description: data.description,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/fcr-models/"] });
      toast({
        title: "Success",
        description: "FCR model created successfully",
      });
      setOpen(false);
      setCurrentStep(1);
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create FCR model",
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

  const onSubmit = (data: FcrModelFormData) => {
    createFcrModelMutation.mutate(data);
  };

  const addStage = () => {
    const nextStageNumber = Math.max(...fields.map(f => f.stage), 0) + 1;
    append({
      stage: nextStageNumber,
      fcrValue: "1.0",
      durationDays: "90",
    });
  };

  const loadPreset = (presetType: string) => {
    let presetStages;
    switch (presetType) {
      case "standard":
        presetStages = DEFAULT_STAGES;
        break;
      case "efficient":
        presetStages = [
          { stage: 1, name: "Fry", fcrValue: "0.7", durationDays: "90", description: "Efficient fry feeding" },
          { stage: 2, name: "Parr", fcrValue: "0.9", durationDays: "100", description: "Optimized parr nutrition" },
          { stage: 3, name: "Smolt", fcrValue: "0.9", durationDays: "100", description: "Premium smolt feed" },
          { stage: 4, name: "Post-Smolt", fcrValue: "1.0", durationDays: "60", description: "High-efficiency transition" },
          { stage: 5, name: "Adult", fcrValue: "1.1", durationDays: "400", description: "Premium adult feed" },
        ];
        break;
      case "conservative":
        presetStages = [
          { stage: 1, name: "Fry", fcrValue: "0.9", durationDays: "100", description: "Conservative fry feeding" },
          { stage: 2, name: "Parr", fcrValue: "1.1", durationDays: "110", description: "Extended parr period" },
          { stage: 3, name: "Smolt", fcrValue: "1.1", durationDays: "110", description: "Gradual smolt development" },
          { stage: 4, name: "Post-Smolt", fcrValue: "1.2", durationDays: "70", description: "Conservative transition" },
          { stage: 5, name: "Adult", fcrValue: "1.3", durationDays: "420", description: "Standard adult feeding" },
        ];
        break;
      default:
        return;
    }

    form.setValue("stages", presetStages.map(stage => ({
      stage: stage.stage,
      fcrValue: stage.fcrValue,
      durationDays: stage.durationDays,
    })));
  };

  const getStageName = (stageId: number) => {
    const stageName = DEFAULT_STAGES.find(s => s.stage === stageId)?.name;
    return stageName || `Stage ${stageId}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Scale className="h-5 w-5" />
              Basic Model Information
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Standard Atlantic Salmon FCR" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descriptive name for the FCR model
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
                      placeholder="Optional description of FCR model purpose and feeding strategy..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional context about this FCR model's intended use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4" />
                  FCR Model Templates
                </CardTitle>
                <CardDescription>
                  Start with a preset configuration based on common feeding strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadPreset("standard")}
                  >
                    Standard FCR
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadPreset("efficient")}
                  >
                    High Efficiency
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadPreset("conservative")}
                  >
                    Conservative
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  These presets can be customized in the next step
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Scale className="h-5 w-5" />
                Stage Configuration
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStage}>
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4" />
                  FCR Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Typical FCR Ranges:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Fry: 0.7 - 0.9</li>
                      <li>• Parr: 0.8 - 1.0</li>
                      <li>• Smolt: 1.0 - 1.2</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">&nbsp;</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Post-Smolt: 1.1 - 1.3</li>
                      <li>• Adult: 1.2 - 1.5</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge variant="outline">
                          {getStageName(field.stage)}
                        </Badge>
                        Stage {field.stage}
                      </CardTitle>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`stages.${index}.fcrValue`}
                        render={({ field: fcrField }) => (
                          <FormItem>
                            <FormLabel>FCR Value *</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Input 
                                  type="number" 
                                  step="0.1" 
                                  min="0.5" 
                                  max="2.0" 
                                  placeholder="1.0"
                                  {...fcrField}
                                />
                                <Slider
                                  value={[parseFloat(fcrField.value) || 1.0]}
                                  onValueChange={(value) => fcrField.onChange(value[0].toString())}
                                  max={2.0}
                                  min={0.5}
                                  step={0.1}
                                  className="w-full"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`stages.${index}.durationDays`}
                        render={({ field: durationField }) => (
                          <FormItem>
                            <FormLabel>Duration (Days) *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="500" 
                                placeholder="90"
                                {...durationField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        const totalDays = fields.reduce((sum, stage) => sum + parseInt(stage.durationDays || "0"), 0);
        const avgFcr = fields.reduce((sum, stage) => sum + parseFloat(stage.fcrValue || "0"), 0) / fields.length;

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Scale className="h-5 w-5" />
              Review & Validation
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Model Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{form.watch("name") || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Stages:</span>
                    <p className="font-medium">{fields.length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Duration:</span>
                    <p className="font-medium">{totalDays} days ({Math.round(totalDays / 30)} months)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average FCR:</span>
                    <p className="font-medium">{avgFcr.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Stage Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fields.map((stage, index) => (
                    <div key={stage.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {getStageName(stage.stage)}
                        </Badge>
                        <span className="text-sm font-medium">FCR: {stage.fcrValue}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stage.durationDays} days
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {avgFcr > 1.4 && (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-800">
                      High average FCR detected ({avgFcr.toFixed(2)}). Consider reviewing stage values for efficiency.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Information";
      case 2: return "Stage Configuration"; 
      case 3: return "Review & Validation";
      default: return "";
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return form.watch("name");
      case 2:
        return fields.length > 0 && fields.every(stage => 
          stage.fcrValue && stage.durationDays && 
          !isNaN(parseFloat(stage.fcrValue)) && !isNaN(parseInt(stage.durationDays))
        );
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create FCR Model</DialogTitle>
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
                    disabled={createFcrModelMutation.isPending || !isStepValid()}
                  >
                    {createFcrModelMutation.isPending ? "Creating..." : "Create FCR Model"}
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
