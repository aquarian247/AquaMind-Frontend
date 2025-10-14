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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Biological Constraints Form Schema
const biologicalConstraintsFormSchema = z.object({
  name: z.string().min(1, "Constraint set name is required").max(100, "Name too long"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type BiologicalConstraintsFormData = z.infer<typeof biologicalConstraintsFormSchema>;

interface BiologicalConstraintsCreationDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

/**
 * Biological Constraints Creation Dialog
 * 
 * Phase 7 - Basic implementation for creating biological constraint sets.
 * 
 * PRD Reference: Section 3.3.1 - Configurable Biological Parameters
 * Allows defining named sets of biological rules (e.g., "Bakkafrost Standard", "Conservative")
 * with stage-specific weight ranges, temperature ranges, and freshwater limits.
 * 
 * Future Enhancement: Stage constraint configuration UI for detailed rules
 * (currently stage constraints can be added via admin or API after constraint set creation)
 */
export function BiologicalConstraintsCreationDialog({ 
  children, 
  onSuccess 
}: BiologicalConstraintsCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BiologicalConstraintsFormData>({
    resolver: zodResolver(biologicalConstraintsFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const createConstraintsMutation = useMutation({
    mutationFn: async (data: BiologicalConstraintsFormData) => {
      return apiRequest({
        url: "/api/v1/scenario/biological-constraints/",
        method: "POST",
        body: {
          name: data.name,
          description: data.description || "",
          is_active: data.isActive,
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Biological Constraints Created",
        description: "Constraint set has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/scenario/biological-constraints/"] });
      queryClient.invalidateQueries({ queryKey: ["scenario"] });
      form.reset();
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create biological constraints",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: BiologicalConstraintsFormData) => {
    createConstraintsMutation.mutate(data);
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
            <Shield className="h-5 w-5 text-primary" />
            Create Biological Constraint Set
          </DialogTitle>
          <DialogDescription>
            Define a named set of biological rules for lifecycle stages.
            Examples: "Bakkafrost Standard" (300g+ smolt target), "Conservative" (traditional limits).
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Basic Implementation</strong>: Creates constraint set name and description.
            <br />
            <strong>Stage Constraints</strong>: After creation, add stage-specific weight ranges,
            temperature ranges, and freshwater limits via admin interface or API.
            <br />
            <strong>PRD Reference</strong>: Section 3.3.1 - No hardcoded limits, all parameters database-configurable.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constraint Set Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 'Bakkafrost Standard', 'Conservative', 'Experimental'" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Unique name for this biological constraint set
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
                      placeholder="Describe this constraint set and its purpose..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description of this constraint set
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Whether this constraint set is currently active and available for use in scenarios
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

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={createConstraintsMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createConstraintsMutation.isPending}
              >
                {createConstraintsMutation.isPending ? "Creating..." : "Create Constraint Set"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

