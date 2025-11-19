/**
 * Execute Creation Action Dialog - Dialog for executing egg delivery actions.
 * 
 * Records delivery metrics:
 * - mortality_on_arrival (required)
 * - delivery_method (dropdown: TRANSPORT, HELICOPTER, BOAT, INTERNAL_TRANSFER)
 * - water_temp_on_arrival (decimal, °C)
 * - egg_quality_score (1-5 rating)
 * - execution_duration_minutes (integer)
 * - notes (textarea)
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Package,
  Thermometer,
  Star,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { useExecuteCreationAction } from '../api';
import type { CreationAction } from '../api';

// ============================================================================
// Form Schema
// ============================================================================

const executeCreationActionSchema = z.object({
  mortality_on_arrival: z.number().int().min(0, 'Mortality cannot be negative'),
  delivery_method: z.enum(['TRANSPORT', 'HELICOPTER', 'BOAT', 'INTERNAL_TRANSFER']).optional(),
  water_temp_on_arrival: z.number().min(-5).max(40).optional(),
  egg_quality_score: z.number().int().min(1).max(5).optional(),
  execution_duration_minutes: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

type ExecuteCreationActionFormData = z.infer<typeof executeCreationActionSchema>;

// ============================================================================
// Component
// ============================================================================

interface ExecuteCreationActionDialogProps {
  action: CreationAction;
  open: boolean;
  onClose: () => void;
}

export function ExecuteCreationActionDialog({
  action,
  open,
  onClose,
}: ExecuteCreationActionDialogProps) {
  const { toast } = useToast();
  const executeAction = useExecuteCreationAction();

  const form = useForm<ExecuteCreationActionFormData>({
    resolver: zodResolver(executeCreationActionSchema),
    defaultValues: {
      mortality_on_arrival: 0,
      delivery_method: undefined,
      water_temp_on_arrival: undefined,
      egg_quality_score: undefined,
      execution_duration_minutes: undefined,
      notes: '',
    },
  });

  const handleExecute = async (data: ExecuteCreationActionFormData) => {
    try {
      const payload = {
        mortality_on_arrival: data.mortality_on_arrival,
        delivery_method: data.delivery_method,
        water_temp_on_arrival: data.water_temp_on_arrival,
        egg_quality_score: data.egg_quality_score,
        execution_duration_minutes: data.execution_duration_minutes,
        notes: data.notes || '',
      };
      
      console.log('[ExecuteCreationAction] Submitting execution data:', payload);
      
      await executeAction.mutateAsync({
        actionId: action.id,
        data: payload,
      });

      toast({
        title: 'Delivery executed successfully',
        description: `Action #${action.action_number} completed`,
      });

      form.reset();
      onClose();
    } catch (error) {
      console.error('[ExecuteCreationAction] Execution failed:', error);
      
      // Extract detailed error message
      let errorMessage = 'Unknown error';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.body) {
          console.error('[ExecuteCreationAction] API error body:', apiError.body);
          errorMessage = JSON.stringify(apiError.body);
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      toast({
        title: 'Failed to execute delivery',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Calculate actual eggs received
  const mortalityOnArrival = form.watch('mortality_on_arrival') || 0;
  const eggsActuallyReceived = action.egg_count_planned - mortalityOnArrival;
  const mortalityRate = action.egg_count_planned > 0
    ? ((mortalityOnArrival / action.egg_count_planned) * 100).toFixed(2)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Execute Delivery Action #{action.action_number}</DialogTitle>
          <DialogDescription>
            Workflow: {action.workflow} • Expected: {action.expected_delivery_date}
          </DialogDescription>
        </DialogHeader>

        {/* Delivery Overview */}
        <div className="grid grid-cols-1 gap-4 py-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Destination Container</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-semibold">
                {action.dest_container_name}
              </p>
              <p className="text-sm text-muted-foreground">
                Type: {action.dest_container_type}
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            Planned delivery: <strong>{action.egg_count_planned.toLocaleString()}</strong> eggs
          </AlertDescription>
        </Alert>

        {/* Execution Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleExecute)} className="space-y-4">
            <FormField
              control={form.control}
              name="mortality_on_arrival"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dead on Arrival (DOA) *
                    <span className="ml-1 text-xs text-muted-foreground">(egg count)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of eggs dead on arrival (default: 0)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show calculated values */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">Calculated Values</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Planned:</span>{' '}
                  <span className="font-medium">{action.egg_count_planned.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">DOA:</span>{' '}
                  <span className="font-medium text-red-600">{mortalityOnArrival.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Actual Received:</span>{' '}
                  <span className="font-medium text-green-600">{eggsActuallyReceived.toLocaleString()}</span>
                </div>
              </div>
              {mortalityOnArrival > 0 && (
                <p className="text-xs text-muted-foreground">
                  Mortality rate: {mortalityRate}%
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="delivery_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TRANSPORT">Transport (Truck)</SelectItem>
                      <SelectItem value="HELICOPTER">Helicopter</SelectItem>
                      <SelectItem value="BOAT">Boat</SelectItem>
                      <SelectItem value="INTERNAL_TRANSFER">Internal Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    How were the eggs delivered?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="water_temp_on_arrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Thermometer className="inline h-3 w-3 mr-1" />
                      Water Temp (°C)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="8.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Water temperature on arrival
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="egg_quality_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Star className="inline h-3 w-3 mr-1" />
                      Quality Score (1-5)
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rate quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Poor</SelectItem>
                        <SelectItem value="2">2 - Fair</SelectItem>
                        <SelectItem value="3">3 - Good</SelectItem>
                        <SelectItem value="4">4 - Very Good</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Visual quality assessment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="execution_duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    How long did the delivery process take?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Eggs in good condition, water quality acceptable..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mortalityOnArrival > action.egg_count_planned * 0.1 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <strong className="text-amber-900">High Mortality Warning</strong>
                  <p className="text-xs text-amber-700 mt-1">
                    DOA mortality is {mortalityRate}% of planned eggs. Consider documenting the cause in notes.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={executeAction.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={executeAction.isPending}
              >
                {executeAction.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Execute Delivery
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}







