import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Thermometer, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Temperature Profile Form Schema
const temperatureProfileFormSchema = z.object({
  name: z.string().min(1, "Profile name is required").max(255, "Name too long"),
});

type TemperatureProfileFormData = z.infer<typeof temperatureProfileFormSchema>;

interface TemperatureProfileCreationDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

/**
 * Temperature Profile Creation Dialog
 * 
 * Phase 7 - Basic implementation for creating temperature profiles.
 * Follows the pattern established by TGC/FCR/Mortality model dialogs.
 * 
 * PRD Reference: Section 3.3.1 - Temperature profiles are essential for TGC models
 * 
 * Future Enhancement: Multi-method data entry (CSV upload, date ranges, visual editor, formulas)
 * as specified in PRD section 3.3.1 "Multi-Method Data Entry System"
 */
export function TemperatureProfileCreationDialog({ 
  children, 
  onSuccess 
}: TemperatureProfileCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemperatureProfileFormData>({
    resolver: zodResolver(temperatureProfileFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: TemperatureProfileFormData) => {
      return apiRequest({
        url: "/api/v1/scenario/temperature-profiles/",
        method: "POST",
        body: {
          name: data.name,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Temperature Profile Created",
        description: "Temperature profile has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/temperature-profiles/"] });
      queryClient.invalidateQueries({ queryKey: ["scenario"] });
      form.reset();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create temperature profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: TemperatureProfileFormData) => {
    createProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Create Temperature Profile
          </DialogTitle>
          <DialogDescription>
            Create a reusable temperature pattern for TGC models. Temperature profiles define
            daily or weekly temperature values for specific locations and release periods.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Basic Implementation</strong>: Currently creates profile name only.
            <br />
            <strong>Coming Soon</strong>: Multi-method data entry including CSV upload, date ranges,
            visual editor, and formula-based patterns (PRD Section 3.3.1).
            <br />
            <strong>For Now</strong>: After creating the profile, temperature readings can be added
            via CSV upload endpoint or admin interface.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 'Faroe Islands Winter', 'Scotland April Release'" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Descriptive name for this temperature pattern (e.g., location + season)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={createProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? "Creating..." : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

