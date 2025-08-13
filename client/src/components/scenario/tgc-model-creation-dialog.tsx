import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { ArrowLeft, ArrowRight, TrendingUp, Thermometer, Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// TGC Model Form Schema with validation based on PRD requirements
const tgcModelFormSchema = z.object({
  name: z.string().min(1, "Model name is required").max(100, "Name too long"),
  location: z.string().min(1, "Location is required"),
  releasePeriod: z.string().min(1, "Release period is required"),
  tgcValue: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 2.0 && Number(val) <= 3.0, 
      "TGC value must be between 2.0 and 3.0"),
  exponentN: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0.5 && Number(val) <= 2.0, 
      "Temperature exponent (n) must be between 0.5 and 2.0"),
  exponentM: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0.1 && Number(val) <= 0.5, 
      "Weight exponent (m) must be between 0.1 and 0.5"),
  profileId: z.number().min(1, "Temperature profile is required"),
  description: z.string().optional(),
});

type TgcModelFormData = z.infer<typeof tgcModelFormSchema>;

interface TemperatureProfile {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface TgcModelCreationDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function TgcModelCreationDialog({ children, onSuccess }: TgcModelCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TgcModelFormData>({
    resolver: zodResolver(tgcModelFormSchema),
    defaultValues: {
      name: "",
      location: "",
      releasePeriod: "",
      tgcValue: "2.5",
      exponentN: "1.0",
      exponentM: "0.333",
      description: "",
    },
  });

  // Fetch temperature profiles
  const { data: temperatureProfiles } = useQuery<{results: TemperatureProfile[]}>({
    queryKey: ["/api/v1/scenario/temperature-profiles/"],
    enabled: open,
  });

  const createTgcModelMutation = useMutation({
    mutationFn: async (data: TgcModelFormData) => {
      const payload = {
        name: data.name,
        location: data.location,
        releasePeriod: data.releasePeriod,
        tgcValue: data.tgcValue,
        exponentN: data.exponentN,
        exponentM: data.exponentM,
        profileId: data.profileId,
      };

      return apiRequest(
        "POST",
        "/api/v1/scenario/tgc-models/",
        payload,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/tgc-models/"] });
      toast({
        title: "Success",
        description: "TGC model created successfully",
      });
      setOpen(false);
      setCurrentStep(1);
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create TGC model",
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

  const onSubmit = (data: TgcModelFormData) => {
    createTgcModelMutation.mutate(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <TrendingUp className="h-5 w-5" />
              Basic Model Information
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Faroe Islands Spring Release TGC" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descriptive name for the TGC model including location and release period
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="faroe-islands">Faroe Islands</SelectItem>
                          <SelectItem value="scotland-west">Scotland - West Coast</SelectItem>
                          <SelectItem value="scotland-east">Scotland - East Coast</SelectItem>
                          <SelectItem value="scotland-highlands">Scotland - Highlands</SelectItem>
                          <SelectItem value="scotland-islands">Scotland - Islands</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releasePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Period *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="january">January Release</SelectItem>
                          <SelectItem value="february">February Release</SelectItem>
                          <SelectItem value="march">March Release</SelectItem>
                          <SelectItem value="april">April Release</SelectItem>
                          <SelectItem value="may">May Release</SelectItem>
                          <SelectItem value="june">June Release</SelectItem>
                          <SelectItem value="july">July Release</SelectItem>
                          <SelectItem value="august">August Release</SelectItem>
                          <SelectItem value="september">September Release</SelectItem>
                          <SelectItem value="october">October Release</SelectItem>
                          <SelectItem value="november">November Release</SelectItem>
                          <SelectItem value="december">December Release</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional description of model purpose and parameters..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Additional context about this TGC model
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Calculator className="h-5 w-5" />
              Growth Parameters
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4" />
                  TGC Formula
                </CardTitle>
                <CardDescription>
                  Daily Growth = TGC × (Temperature)^n × (Current Weight)^m
                </CardDescription>
              </CardHeader>
            </Card>

            <FormField
              control={form.control}
              name="tgcValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TGC Value (2.0 - 3.0) *</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="2.0" 
                        max="3.0" 
                        placeholder="2.5"
                        {...field}
                      />
                      <Slider
                        value={[parseFloat(field.value) || 2.5]}
                        onValueChange={(value) => field.onChange(value[0].toString())}
                        max={3.0}
                        min={2.0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>2.0 (Slower growth)</span>
                        <span>3.0 (Faster growth)</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Thermal Growth Coefficient - typically 2.0-3.0 for Atlantic salmon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exponentN"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature Exponent (n) *</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          type="number" 
                          step="0.1" 
                          min="0.5" 
                          max="2.0" 
                          placeholder="1.0"
                          {...field}
                        />
                        <Slider
                          value={[parseFloat(field.value) || 1.0]}
                          onValueChange={(value) => field.onChange(value[0].toString())}
                          max={2.0}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Usually 1.0 for linear temperature response
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exponentM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight Exponent (m) *</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0.1" 
                          max="0.5" 
                          placeholder="0.333"
                          {...field}
                        />
                        <Slider
                          value={[parseFloat(field.value) || 0.333]}
                          onValueChange={(value) => field.onChange(value[0].toString())}
                          max={0.5}
                          min={0.1}
                          step={0.001}
                          className="w-full"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Usually 0.333 (cube root) for metabolic scaling
                    </FormDescription>
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
            <div className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Thermometer className="h-5 w-5" />
              Temperature Profile
            </div>

            <FormField
              control={form.control}
              name="profileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature Profile *</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select temperature profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {temperatureProfiles?.results?.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id.toString()}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Historical or projected temperature data for growth calculations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {temperatureProfiles?.results?.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    No temperature profiles available. You'll need to create a temperature profile first.
                  </p>
                  <Button variant="outline" size="sm">
                    Create Temperature Profile
                  </Button>
                </CardContent>
              </Card>
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
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{form.watch("location") || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Release Period:</span>
                    <p className="font-medium">{form.watch("releasePeriod") || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">TGC Value:</span>
                    <p className="font-medium">{form.watch("tgcValue") || "2.5"}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Formula: Daily Growth = {form.watch("tgcValue") || "2.5"} × (Temperature)^{form.watch("exponentN") || "1.0"} × (Weight)^{form.watch("exponentM") || "0.333"}
                  </p>
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
      case 2: return "Growth Parameters";
      case 3: return "Temperature Profile";
      default: return "";
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return form.watch("name") && form.watch("location") && form.watch("releasePeriod");
      case 2:
        return form.watch("tgcValue") && form.watch("exponentN") && form.watch("exponentM");
      case 3:
        return form.watch("profileId");
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
          <DialogTitle>Create TGC Model</DialogTitle>
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
                    disabled={createTgcModelMutation.isPending || !isStepValid()}
                  >
                    {createTgcModelMutation.isPending ? "Creating..." : "Create TGC Model"}
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
