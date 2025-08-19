import { useState, useEffect } from "react";
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
import { CalendarIcon, Edit } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Scenario as ScenarioModel } from "@/api/generated/models/Scenario";

const scenarioEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.date(),
  durationDays: z.number().min(1, "Duration is required"),
  initialCount: z.number().min(1, "Initial count is required"),
  initialWeight: z.number().optional().nullable(),
  genotype: z.string().min(1, "Genotype is required"),
  supplier: z.string().min(1, "Supplier is required"),
  tgcModelId: z.number().optional(),
  fcrModelId: z.number().optional(),
  mortalityModelId: z.number().optional(),
  batchId: z.number().optional().nullable(),
  biologicalConstraintsId: z.number().optional().nullable(),
  temperatureProfileId: z.number().optional(),
  status: z.string().optional(),
});

type ScenarioEditData = z.infer<typeof scenarioEditSchema>;

interface ScenarioEditDialogProps {
  scenario: ScenarioModel;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function ScenarioEditDialog({ scenario, children, onSuccess }: ScenarioEditDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ScenarioEditData>({
    resolver: zodResolver(scenarioEditSchema),
    defaultValues: {
      name: scenario.name,
      durationDays: scenario.duration_days,
      initialCount: scenario.initial_count,
      initialWeight: scenario.initial_weight ?? null,
      genotype: scenario.genotype,
      supplier: scenario.supplier,
      startDate: new Date(scenario.start_date),
    },
  });

  // Reset form when scenario changes
  useEffect(() => {
    form.reset({
      name: scenario.name,
      durationDays: scenario.duration_days,
      initialCount: scenario.initial_count,
      initialWeight: scenario.initial_weight ?? null,
      genotype: scenario.genotype,
      supplier: scenario.supplier,
      startDate: new Date(scenario.start_date),
    });
  }, [scenario, form]);

  // Fetch available models
  const { data: tgcModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario/tgc-models/"],
    enabled: open,
  });

  const { data: fcrModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario/fcr-models/"],
    enabled: open,
  });

  const { data: mortalityModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario/mortality-models/"],
    enabled: open,
  });

  const { data: temperatureProfiles } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario/temperature-profiles/"],
    enabled: open,
  });

  const updateScenarioMutation = useMutation({
    mutationFn: async (data: ScenarioEditData) => {
      const payload: Partial<ScenarioModel> = {
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
        // @ts-expect-error backend may expose this soon
        temperature_profile: data.temperatureProfileId,
      };
      return apiRequest("PUT", `/api/v1/scenario/scenarios/${scenario.scenario_id}/`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/scenarios/"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard/kpis"] });
      toast({
        title: "Scenario Updated",
        description: "Your scenario has been updated successfully.",
      });
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update scenario. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ScenarioEditData) => {
    updateScenarioMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Scenario
          </DialogTitle>
          <DialogDescription>
            Update scenario parameters. Note: Running or completed scenarios cannot be modified.
          </DialogDescription>
        </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
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

                {/* Model Selection */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Model Configuration</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tgcModelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TGC Model</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || undefined}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select TGC model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tgcModels?.results?.map((model) => (
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

                    <FormField
                      control={form.control}
                      name="fcrModelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FCR Model</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || undefined}>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mortalityModelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mortality Model</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || undefined}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select mortality model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mortalityModels?.results?.map((model) => (
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

                    <FormField
                      control={form.control}
                      name="temperatureProfileId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature Profile</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || undefined}>
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
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateScenarioMutation.isPending}>
                  {updateScenarioMutation.isPending ? "Updating..." : "Update Scenario"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
      </DialogContent>
    </Dialog>
  );
}
