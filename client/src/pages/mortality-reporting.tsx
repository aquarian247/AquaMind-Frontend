
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { PermissionGuard } from "@/components/rbac/PermissionGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { MortalityReason } from "@/api/generated";

const mortalityReportSchema = z.object({
  farmSiteId: z.number().min(1, "Please select a farm site"),
  penId: z.string().min(1, "Please select a pen"),
  mortalityCount: z.number().min(1, "Count must be at least 1"),
  primaryCause: z.number().min(1, "Please select a cause"),
  secondaryCause: z.number().optional().nullable(),
  notes: z.string().optional(),
  reportDate: z.string().min(1, "Date is required"),
}).refine((data) => {
  if (data.secondaryCause == null) {
    return true;
  }
  return data.secondaryCause !== data.primaryCause;
}, {
  path: ["secondaryCause"],
  message: "Secondary cause must differ from primary cause.",
});

type MortalityReportForm = z.infer<typeof mortalityReportSchema>;

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
      secondaryCause: null,
    },
  });

  // Fetch farm sites
  const { data: farmSites, isLoading: farmSitesLoading } = useQuery({
    queryKey: ["farm-sites"],
    queryFn: () => api.getFarmSites(),
  });

  // Fetch pens for selected farm site
  const { data: pens, isLoading: pensLoading } = useQuery({
    queryKey: ["farm-sites", selectedFarmSite, "pens"],
    queryFn: () => api.getPensByFarmSite(selectedFarmSite!),
    enabled: !!selectedFarmSite,
  });

  // Fetch mortality reasons from backend
  const { data: mortalityReasons, isLoading: mortalityReasonsLoading } = useQuery({
    queryKey: ["mortality-reasons"],
    queryFn: () => api.health.getMortalityReasons(),
  });

  type MortalityReasonWithParent = MortalityReason & { parent?: number | null };

  const mortalityReasonList = (mortalityReasons ?? []) as MortalityReasonWithParent[];
  const hasHierarchy = mortalityReasonList.some((reason) => reason.parent != null);
  const selectedPrimaryCause = form.watch("primaryCause");

  const mortalityReasonById = useMemo(() => {
    return new Map(mortalityReasonList.map((reason) => [reason.id, reason.name]));
  }, [mortalityReasonList]);

  const primaryReasons = useMemo(() => {
    if (!hasHierarchy) {
      return mortalityReasonList;
    }
    return mortalityReasonList.filter((reason) => reason.parent == null);
  }, [hasHierarchy, mortalityReasonList]);

  const secondaryReasons = useMemo(() => {
    if (!selectedPrimaryCause) {
      return [];
    }
    if (!hasHierarchy) {
      return mortalityReasonList.filter((reason) => reason.id !== selectedPrimaryCause);
    }
    return mortalityReasonList.filter(
      (reason) => reason.parent === selectedPrimaryCause
    );
  }, [hasHierarchy, mortalityReasonList, selectedPrimaryCause]);

  // Submit mortality report
  const submitMortality = useMutation({
    mutationFn: async (data: MortalityReportForm) => {
      // Create a health record with mortality data
      const primaryName = mortalityReasonById.get(data.primaryCause);
      const secondaryName = data.secondaryCause != null
        ? mortalityReasonById.get(data.secondaryCause)
        : null;
      const notesParts = [
        primaryName ? `Primary cause: ${primaryName}` : null,
        secondaryName ? `Secondary cause: ${secondaryName}` : null,
        data.notes ? `Notes: ${data.notes}` : null,
      ].filter(Boolean);

      const healthRecord = {
        batch: 1, // Would normally get this from the selected pen
        checkDate: data.reportDate,
        veterinarian: "Field Worker",
        healthStatus: "poor",
        mortalityCount: data.mortalityCount,
        notes: notesParts.join(". "),
      };
      
      // Use the typed helper from the unified API client.
      return api.health.createHealthRecord(healthRecord);
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Mortality report has been recorded successfully.",
      });
      form.reset({
        mortalityCount: 1,
        reportDate: new Date().toISOString().split('T')[0],
        secondaryCause: null,
      });
      setSelectedFarmSite(null);
      queryClient.invalidateQueries({ queryKey: ["health/records"] });
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
    <PermissionGuard require="health" resource="Mortality Report">
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
                          farmSites?.map((site: FarmSite) => (
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
                          pens?.map((pen: Pen) => (
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
                    <Select
                      onValueChange={(value) => {
                        const parsed = Number(value);
                        field.onChange(parsed);
                        form.setValue("secondaryCause", null);
                      }}
                      value={field.value ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary cause" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mortalityReasonsLoading ? (
                          <div className="p-2">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ) : (
                          primaryReasons.map((reason) => (
                            <SelectItem key={reason.id} value={reason.id.toString()}>
                              {reason.name}
                            </SelectItem>
                          ))
                        )}
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
                    <Select
                      onValueChange={(value) => {
                        if (value === "none") {
                          field.onChange(null);
                          return;
                        }
                        field.onChange(Number(value));
                      }}
                      value={field.value === null ? "none" : field.value ? field.value.toString() : ""}
                      disabled={!selectedPrimaryCause}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary cause" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {mortalityReasonsLoading ? (
                          <div className="p-2">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ) : (
                          secondaryReasons.map((reason) => (
                            <SelectItem key={reason.id} value={reason.id.toString()}>
                              {reason.name}
                            </SelectItem>
                          ))
                        )}
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

      {/* 
        NOTE: Today's Summary section removed - hardcoded placeholder values replaced with honest fallback.
        
        Production Implementation:
        TODO: Backend team should implement /api/v1/health/mortality-summary/ endpoint with:
          - Reports count for today (with date filter)
          - Last report timestamp
          - Daily mortality totals
          
        Once endpoint is available:
        1. Add useQuery hook to fetch daily summary
        2. Display actual counts and timestamps
        3. Re-enable this section with real data
      */}
      </div>
    </PermissionGuard>
  );
}
