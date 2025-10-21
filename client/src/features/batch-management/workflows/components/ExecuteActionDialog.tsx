/**
 * Execute Action Dialog - Mobile-optimized dialog for executing transfer actions.
 * 
 * Designed for ship crew to quickly execute transfers with minimal friction.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Thermometer,
  Wind,
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

import { useAction, useExecuteAction } from '../api';
import { executeActionSchema, type ExecuteActionFormData } from '../schemas';
import { formatBiomass, formatCount } from '../utils';

interface ExecuteActionDialogProps {
  actionId: number;
  open: boolean;
  onClose: () => void;
}

export function ExecuteActionDialog({
  actionId,
  open,
  onClose,
}: ExecuteActionDialogProps) {
  const { toast } = useToast();
  const { data: action, isLoading } = useAction(actionId);
  const executeAction = useExecuteAction();

  const form = useForm<ExecuteActionFormData>({
    resolver: zodResolver(executeActionSchema),
    defaultValues: {
      mortality_during_transfer: 0,
      transfer_method: undefined,
      water_temp_c: '',
      oxygen_level: '',
      execution_duration_minutes: undefined,
      notes: '',
    },
  });

  const handleExecute = async (data: ExecuteActionFormData) => {
    try {
      await executeAction.mutateAsync({
        id: actionId,
        data: {
          mortality_during_transfer: data.mortality_during_transfer,
          transfer_method: data.transfer_method,
          water_temp_c: data.water_temp_c || undefined,
          oxygen_level: data.oxygen_level || undefined,
          execution_duration_minutes: data.execution_duration_minutes || undefined,
          notes: data.notes || '',
        },
      });

      toast({
        title: 'Transfer executed successfully',
        description: `Action #${action?.action_number} completed`,
      });

      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to execute transfer',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  if (isLoading || !action) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const sourceInfo = action.source_assignment_info as any;
  const destInfo = action.dest_assignment_info as any;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Execute Transfer Action #{action.action_number}</DialogTitle>
          <DialogDescription>
            Workflow: {action.workflow_number}
          </DialogDescription>
        </DialogHeader>

        {/* Transfer Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">From</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-semibold">
                {sourceInfo?.container_name || `Container #${action.source_assignment}`}
              </p>
              <p className="text-sm text-muted-foreground">
                Current: {formatCount(sourceInfo?.population_count || action.source_population_before)}
              </p>
              <p className="text-sm text-muted-foreground">
                Biomass: {formatBiomass(sourceInfo?.biomass_kg || '0')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-semibold">
                {destInfo?.container_name || `Container #${action.dest_assignment}`}
              </p>
              <p className="text-sm text-muted-foreground">
                Current: {formatCount(destInfo?.population_count || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                Capacity: {formatCount(destInfo?.capacity || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center py-2">
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Transferring <strong>{formatCount(action.transferred_count)}</strong> fish (
            {formatBiomass(action.transferred_biomass_kg)})
          </AlertDescription>
        </Alert>

        {/* Execution Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleExecute)} className="space-y-4">
            <FormField
              control={form.control}
              name="mortality_during_transfer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mortality During Transfer
                    <span className="ml-1 text-xs text-muted-foreground">(fish count)</span>
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
                    Number of fish lost during transfer (default: 0)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transfer_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transfer method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NET">Net Transfer</SelectItem>
                      <SelectItem value="PUMP">Pump Transfer</SelectItem>
                      <SelectItem value="GRAVITY">Gravity Transfer</SelectItem>
                      <SelectItem value="MANUAL">Manual Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="water_temp_c"
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
                        placeholder="12.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="oxygen_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Wind className="inline h-3 w-3 mr-1" />
                      O₂ Level (mg/L)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="9.2"
                        {...field}
                      />
                    </FormControl>
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
                      placeholder="45"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    How long did the transfer take?
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
                      placeholder="Conditions good, fish acclimating well..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Execute Transfer
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

