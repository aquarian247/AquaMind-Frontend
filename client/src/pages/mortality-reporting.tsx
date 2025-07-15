
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const mortalityReportSchema = z.object({
  farmSiteId: z.number().min(1, "Please select a farm site"),
  penId: z.string().min(1, "Please select a pen"),
  mortalityCount: z.number().min(1, "Count must be at least 1"),
  primaryCause: z.string().min(1, "Please select a cause"),
  secondaryCause: z.string().optional(),
  notes: z.string().optional(),
  reportDate: z.string().min(1, "Date is required"),
});

type MortalityReportForm = z.infer<typeof mortalityReportSchema>;

const MORTALITY_CAUSES = [
  { value: "disease", label: "Disease" },
  { value: "predation", label: "Predation" },
  { value: "wounds", label: "Physical Wounds" },
  { value: "parasites", label: "Parasites" },
  { value: "water_quality", label: "Water Quality" },
  { value: "starvation", label: "Starvation" },
  { value: "old_age", label: "Natural Death" },
  { value: "unknown", label: "Unknown" },
  { value: "handling", label: "Handling Stress" },
  { value: "equipment", label: "Equipment Related" },
];

export default function MortalityReporting() {
  /* ------------------------------------------------------------------
   * Local helpers – minimal shapes returned by /api endpoints we call
   * ------------------------------------------------------------------ */
  interface FarmSite {
    id: number;
    name: string;
    location: string;
  }

  interface Pen {
    id: number;
    name: string;
    capacity?: number | null;
  }

  const [selectedFarmSite, setSelectedFarmSite] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MortalityReportForm>({
    resolver: zodResolver(mortalityReportSchema),
    defaultValues: {
      mortalityCount: 1,
      reportDate: new Date().toISOString().split('T')[0],
    },
  });

  // Fetch farm sites
  const { data: farmSites, isLoading: farmSitesLoading } = useQuery({
    queryKey: ["/api/farm-sites"],
    queryFn: () => api.getFarmSites(),
  });

  // Fetch pens for selected farm site
  const { data: pens, isLoading: pensLoading } = useQuery({
    queryKey: ["/api/farm-sites", selectedFarmSite, "pens"],
    queryFn: () => api.getPensByFarmSite(selectedFarmSite!),
    enabled: !!selectedFarmSite,
  });

  // Submit mortality report
  const submitMortality = useMutation({
    mutationFn: async (data: MortalityReportForm) => {
      // Create a health record with mortality data
      const healthRecord = {
        batch: 1, // Would normally get this from the selected pen
        checkDate: data.reportDate,
        veterinarian: "Field Worker",
        healthStatus: "poor",
        mortalityCount: data.mortalityCount,
        notes: `Primary cause: ${data.primaryCause}${data.secondaryCause ? `, Secondary: ${data.secondaryCause}` : ''}${data.notes ? `. Notes: ${data.notes}` : ''}`,
      };
      
      const response = await fetch("/api/v1/health/records/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(healthRecord),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit mortality report");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Mortality report has been recorded successfully.",
      });
      form.reset({
        mortalityCount: 1,
        reportDate: new Date().toISOString().split('T')[0],
      });
      setSelectedFarmSite(null);
      queryClient.invalidateQueries({ queryKey: ["/api/v1/health/records/"] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit mortality report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MortalityReportForm) => {
    submitMortality.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Mortality Report</h1>
        <p className="text-gray-600 mt-2">Record daily fish mortality counts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-clipboard-list text-red-600"></i>
            Daily Mortality Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Date */}
              <FormField
                control={form.control}
                name="reportDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Farm Site Selection */}
              <FormField
                control={form.control}
                name="farmSiteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Site</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const siteId = parseInt(value);
                        field.onChange(siteId);
                        setSelectedFarmSite(siteId);
                        form.setValue("penId", ""); // Reset pen selection
                      }}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select farm site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {farmSitesLoading ? (
                          <div className="p-2">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ) : (
                          farmSites?.map((site) => (
                            <SelectItem key={site.id} value={site.id.toString()}>
                              {site.name} - {site.location}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pen Selection */}
              <FormField
                control={form.control}
                name="penId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sea Pen</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedFarmSite}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedFarmSite 
                              ? "Select farm site first" 
                              : "Select sea pen"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pensLoading ? (
                          <div className="p-2">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ) : (
                          pens?.map((pen) => (
                            <SelectItem key={pen.id} value={pen.id.toString()}>
                              {pen.name} - Capacity: {pen.capacity?.toLocaleString()}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mortality Count */}
              <FormField
                control={form.control}
                name="mortalityCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Dead Fish</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Primary Cause */}
              <FormField
                control={form.control}
                name="primaryCause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Cause of Death</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary cause" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MORTALITY_CAUSES.map((cause) => (
                          <SelectItem key={cause.value} value={cause.value}>
                            {cause.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Secondary Cause */}
              <FormField
                control={form.control}
                name="secondaryCause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Cause (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary cause" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {MORTALITY_CAUSES.map((cause) => (
                          <SelectItem key={cause.value} value={cause.value}>
                            {cause.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional observations or details..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={submitMortality.isPending}
              >
                {submitMortality.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Submit Mortality Report
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Badge variant="secondary">
              <i className="fas fa-fish mr-1"></i>
              0 Reports Today
            </Badge>
            <Badge variant="outline">
              <i className="fas fa-clock mr-1"></i>
              Last: --:--
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
