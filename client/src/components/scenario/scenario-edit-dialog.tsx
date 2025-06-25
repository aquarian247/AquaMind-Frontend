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
import { insertScenarioSchema } from "@shared/schema";

const scenarioEditSchema = insertScenarioSchema.extend({
  startDate: z.date(),
  tgcModelId: z.number().optional(),
  fcrModelId: z.number().optional(),
  mortalityModelId: z.number().optional(),
  temperatureProfileId: z.number().optional(),
});

type ScenarioEditData = z.infer<typeof scenarioEditSchema>;

interface Scenario {
  id: number;
  name: string;
  description: string;
  status: "draft" | "running" | "completed" | "failed";
  durationDays: number;
  initialCount: number;
  initialWeight: string;
  genotype: string;
  supplier: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ScenarioEditDialogProps {
  scenario: Scenario;
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
      description: scenario.description,
      durationDays: scenario.durationDays,
      initialCount: scenario.initialCount,
      initialWeight: scenario.initialWeight,
      genotype: scenario.genotype,
      supplier: scenario.supplier,
      status: scenario.status,
      startDate: new Date(scenario.startDate),
    },
  });

  // Reset form when scenario changes
  useEffect(() => {
    form.reset({
      name: scenario.name,
      description: scenario.description,
      durationDays: scenario.durationDays,
      initialCount: scenario.initialCount,
      initialWeight: scenario.initialWeight,
      genotype: scenario.genotype,
      supplier: scenario.supplier,
      status: scenario.status,
      startDate: new Date(scenario.startDate),
    });
  }, [scenario, form]);

  // Fetch available models
  const { data: tgcModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario-planning/tgc-models/"],
    enabled: open,
  });

  const { data: fcrModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario-planning/fcr-models/"],
    enabled: open,
  });

  const { data: mortalityModels } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario-planning/mortality-models/"],
    enabled: open,
  });

  const { data: temperatureProfiles } = useQuery<{results: any[]}>({
    queryKey: ["/api/v1/scenario-planning/temperature-profiles/"],
    enabled: open,
  });

  const updateScenarioMutation = useMutation({
    mutationFn: async (data: ScenarioEditData) => {
      const payload = {
        ...data,
        startDate: data.startDate.toISOString().split('T')[0],
      };
      return apiRequest(`/api/v1/scenario-planning/scenarios/${scenario.id}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario-planning/scenarios/"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario-planning/dashboard/kpis/"] });
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

  // Prevent editing if scenario is running or completed
  const isEditable = scenario.status === 'draft' || scenario.status === 'failed';

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

        {!isEditable ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              This scenario cannot be edited because it is {scenario.status}. 
              You can duplicate it to create a new editable version.
            </p>
          </div>
        ) : (
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
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the scenario objectives and parameters"
                          className="min-h-[80px]"
                          {...field} 
                        />
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
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
        )}
      </DialogContent>
    </Dialog>
  );
}