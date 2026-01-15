/**
 * Execute Action Dialog - Mobile-optimized dialog for executing transfer actions.
 * 
 * Designed for ship crew to quickly execute transfers with minimal friction.
 */

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
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
import { ApiService } from '@/api/generated';

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
  const [envValuesSource, setEnvValuesSource] = useState<Record<number, string>>({});
  const [envValuesDest, setEnvValuesDest] = useState<Record<number, string>>({});

  const { data: environmentalParameters } = useQuery({
    queryKey: ['environmental-parameters'],
    queryFn: async () => {
      let page = 1;
      const results: any[] = [];
      while (true) {
        const response = await ApiService.apiV1EnvironmentalParametersList(
          undefined, // name
          undefined, // nameIcontains
          undefined, // ordering
          page, // page
          undefined, // search
          undefined, // unit
        );
        results.push(...(response.results || []));
        if (!response.next) break;
        page += 1;
      }
      return results;
    },
  });

  const tempParameter = useMemo(() => {
    return (environmentalParameters || []).find((param: any) => {
      const name = (param.name || '').toLowerCase();
      return name.includes('temp');
    });
  }, [environmentalParameters]);

  const oxygenParameter = useMemo(() => {
    return (environmentalParameters || []).find((param: any) => {
      const name = (param.name || '').toLowerCase();
      return name.includes('oxygen') || name.includes('o2');
    });
  }, [environmentalParameters]);

  const allParameters = useMemo(() => {
    return (environmentalParameters || []).slice();
  }, [environmentalParameters]);

  const form = useForm<ExecuteActionFormData>({
    resolver: zodResolver(executeActionSchema),
    defaultValues: {
      mortality_during_transfer: undefined,
      transfer_method: undefined,
      water_temp_c: '',
      oxygen_level: '',
      execution_duration_minutes: undefined,
      notes: '',
    },
  });

  const handleExecute = async (data: ExecuteActionFormData) => {
    if (!action) {
      toast({
        title: 'Action unavailable',
        description: 'Please wait for the action details to load.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const tempValue = tempParameter?.id
        ? envValuesSource[tempParameter.id] ?? envValuesDest[tempParameter.id]
        : undefined;
      const oxygenValue = oxygenParameter?.id
        ? envValuesSource[oxygenParameter.id] ?? envValuesDest[oxygenParameter.id]
        : undefined;

      const payload = {
        mortality_during_transfer: data.mortality_during_transfer,
        transfer_method: data.transfer_method,
        water_temp_c: tempValue || undefined,
        oxygen_level: oxygenValue || undefined,
        execution_duration_minutes: data.execution_duration_minutes || undefined,
        notes: data.notes || '',
      };
      
      console.log('[ExecuteAction] Submitting execution data:', payload);
      
      await executeAction.mutateAsync({
        id: actionId,
        data: payload,
      });

      const sourceContainerId = sourceInfo?.container_id;
      const destContainerId = destInfo?.container_id;
      const sourceAssignmentId = action.source_assignment ?? undefined;
      const destAssignmentId = action.dest_assignment ?? undefined;
      const readingTime = new Date().toISOString();

      const buildEntries = (
        containerId: number | undefined,
        assignmentId: number | undefined,
        values: Record<number, string>
      ) => {
        if (!containerId) return [];
        return Object.entries(values)
          .filter(([, value]) => value !== '')
          .map(([paramId, value]) => ({
            parameter: Number(paramId),
            container: containerId,
            batch_container_assignment: assignmentId,
            reading_time: readingTime,
            value,
            is_manual: true,
          }));
      };

      const allEnvEntries = [
        ...buildEntries(sourceContainerId, sourceAssignmentId, envValuesSource),
        ...buildEntries(destContainerId, destAssignmentId, envValuesDest),
      ];

      if (allEnvEntries.length > 0) {
        await Promise.all(
          allEnvEntries.map((entry) =>
            ApiService.apiV1EnvironmentalReadingsCreate(entry as any)
          )
        );
      }

      toast({
        title: 'Transfer executed successfully',
        description: `Action #${action?.action_number} completed`,
      });

      form.reset();
      setEnvValuesSource({});
      setEnvValuesDest({});
      onClose();
    } catch (error) {
      console.error('[ExecuteAction] Execution failed:', error);
      
      // Extract detailed error message
      let errorMessage = 'Unknown error';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.body) {
          console.error('[ExecuteAction] API error body:', apiError.body);
          errorMessage = JSON.stringify(apiError.body);
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      toast({
        title: 'Failed to execute transfer',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (isLoading || !action) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Transfer Action...</DialogTitle>
            <DialogDescription>Please wait while we fetch the action details.</DialogDescription>
          </DialogHeader>
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
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                      }
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

            {allParameters.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Environmental Parameters</FormLabel>
                <FormDescription>
                  Enter values for source and destination containers.
                </FormDescription>
                <div className="hidden md:grid md:grid-cols-2 text-xs text-muted-foreground gap-4">
                  <span>Source</span>
                  <span>Destination</span>
                </div>
                <div className="space-y-3">
                  {allParameters.map((param: any) => (
                    <div key={param.id} className="space-y-2">
                      <FormLabel className="text-sm">
                        {param.name} ({param.unit})
                      </FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Source"
                              value={envValuesSource[param.id] ?? ''}
                              onChange={(e) =>
                                setEnvValuesSource((prev) => ({
                                  ...prev,
                                  [param.id]: e.target.value,
                                }))
                              }
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Destination"
                              value={envValuesDest[param.id] ?? ''}
                              onChange={(e) =>
                                setEnvValuesDest((prev) => ({
                                  ...prev,
                                  [param.id]: e.target.value,
                                }))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                      {param.description && (
                        <FormDescription>{param.description}</FormDescription>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                      }
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

