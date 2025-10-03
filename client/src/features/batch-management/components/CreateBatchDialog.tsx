import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBatchCreation } from "../hooks/useBatchCreation";

/**
 * CreateBatchDialog Component
 * Dialog for creating new fish batches with form validation
 * 
 * Integrates with useBatchCreation hook for state management
 * Responsive design with mobile-optimized layout
 * 
 * TODO: Expand form fields for full batch creation functionality
 * Current implementation is minimal placeholder matching existing code
 */
export function CreateBatchDialog() {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen, form, onSubmit, isLoading } = useBatchCreation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Batch
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("max-w-2xl", isMobile && "max-w-[95vw]")}>
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogDescription>
            Add a new fish batch to the system
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* TODO: Add form fields for batch creation
                - Batch name/number
                - Species selection
                - Lifecycle stage
                - Initial count & biomass
                - Container assignment
                - Broodstock traceability (egg source)
                - Expected harvest date
                - Notes
            */}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Batch"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

