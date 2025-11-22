/**
 * Add Creation Actions Dialog - Multi-row form for adding egg delivery actions.
 * 
 * Features:
 * - Dynamic row addition/removal
 * - Timeline-aware container selection (shows availability on delivery date)
 * - No source container (eggs from external)
 * - Field: egg_count_planned (not transferred_count)
 * - Field: expected_delivery_date (not execution_date)
 * - Rich container labels with availability indicators
 */

import { useState } from 'react';
import { Plus, Trash2, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import type { BatchCreationWorkflow } from '../api';
import { useCreateCreationAction } from '../api';
import { useContainerAvailability, getAvailabilityIcon } from '../../workflows/hooks/useContainerAvailability';

// ============================================================================
// Types
// ============================================================================

interface ActionRow {
  id: string;
  destContainerId?: number;
  eggCountPlanned?: number;
  expectedDeliveryDate?: Date;
}

interface AddCreationActionsDialogProps {
  workflow: BatchCreationWorkflow;
  geographyId: number; // Must be provided by caller
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function AddCreationActionsDialog({
  workflow,
  geographyId,
  open,
  onClose,
  onSuccess,
}: AddCreationActionsDialogProps) {
  const [rows, setRows] = useState<ActionRow[]>([
    { id: crypto.randomUUID(), expectedDeliveryDate: new Date() },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const createAction = useCreateCreationAction();

  // Track selected delivery dates to fetch container availability
  const deliveryDates = rows
    .map((row) => row.expectedDeliveryDate)
    .filter((date): date is Date => date !== undefined);

  // For simplicity, use the earliest delivery date for container availability query
  // In production, you might want to fetch for each unique date
  const earliestDeliveryDate = deliveryDates.length > 0
    ? format(deliveryDates.sort((a, b) => a.getTime() - b.getTime())[0], 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');

  // Fetch container availability with timeline awareness
  const { data: containerAvailability, isLoading: loadingContainers } = useContainerAvailability({
    geography: geographyId,
    deliveryDate: earliestDeliveryDate,
    containerType: 'TRAY', // Usually eggs go into trays/incubation containers
    enabled: open && !!geographyId,
  });

  const containers = containerAvailability?.results || [];

  const addRow = () => {
    setRows([...rows, { id: crypto.randomUUID(), expectedDeliveryDate: new Date() }]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) {
      toast({
        title: 'Cannot Remove',
        description: 'At least one action is required',
        variant: 'destructive',
      });
      return;
    }
    setRows(rows.filter((row) => row.id !== id));
    // Clear errors for this row
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`${id}-`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const updateRow = (id: string, field: keyof ActionRow, value: any) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );

    // Clear error for this field
    const errorKey = `${id}-${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validateRows = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    rows.forEach((row) => {
      // Required fields
      if (!row.destContainerId) {
        newErrors[`${row.id}-destContainerId`] = 'Destination container required';
        isValid = false;
      }
      if (!row.eggCountPlanned || row.eggCountPlanned <= 0) {
        newErrors[`${row.id}-eggCountPlanned`] = 'Egg count must be > 0';
        isValid = false;
      }
      if (!row.expectedDeliveryDate) {
        newErrors[`${row.id}-expectedDeliveryDate`] = 'Delivery date required';
        isValid = false;
      }

      // Check if selected container has CONFLICT status
      const selectedContainer = containers.find((c) => c.id === row.destContainerId);
      if (selectedContainer && selectedContainer.availability_status === 'CONFLICT') {
        newErrors[`${row.id}-destContainerId`] = 'Container has a conflict on this date';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateRows()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create all actions sequentially
      for (const [index, row] of rows.entries()) {
        console.log(`[AddCreationActions] Creating action ${index + 1}/${rows.length}`);
        
        const actionPayload = {
          workflow: workflow.id,
          dest_container: row.destContainerId!,
          egg_count_planned: row.eggCountPlanned!,
          expected_delivery_date: format(row.expectedDeliveryDate!, 'yyyy-MM-dd'),
          status: 'PENDING' as const,
        };

        await createAction.mutateAsync(actionPayload as any);
        console.log(`[AddCreationActions] Created action ${index + 1}`);
      }

      toast({
        title: 'Actions Added',
        description: `Successfully added ${rows.length} delivery action(s)`,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating actions:', error);
      
      let errorMessage = 'Failed to create actions';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.body) {
          errorMessage = JSON.stringify(apiError.body);
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }

      toast({
        title: 'Error Creating Actions',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Calculate summary stats
  const totalEggs = rows.reduce((sum, row) => sum + (row.eggCountPlanned || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Delivery Actions</DialogTitle>
          <DialogDescription>
            Workflow: {workflow.workflow_number} • {workflow.batch_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Add egg delivery actions. Each row represents one delivery to a container.
              Container availability is checked based on the delivery date.
            </AlertDescription>
          </Alert>

          {/* Actions Table */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left text-sm font-medium">#</th>
                  <th className="p-2 text-left text-sm font-medium">Destination Container *</th>
                  <th className="p-2 text-left text-sm font-medium">Egg Count *</th>
                  <th className="p-2 text-left text-sm font-medium">Expected Delivery Date *</th>
                  <th className="p-2 text-center text-sm font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  // Get container availability for this row's delivery date
                  const rowDeliveryDate = row.expectedDeliveryDate
                    ? format(row.expectedDeliveryDate, 'yyyy-MM-dd')
                    : earliestDeliveryDate;

                  return (
                    <tr key={row.id} className="border-t">
                      <td className="p-2 text-sm font-medium">{index + 1}</td>
                      
                      {/* Dest Container with availability indicators */}
                      <td className="p-2">
                        <Select
                          value={row.destContainerId?.toString() || ''}
                          onValueChange={(value) =>
                            updateRow(row.id, 'destContainerId', parseInt(value))
                          }
                        >
                          <SelectTrigger
                            className={errors[`${row.id}-destContainerId`] ? 'border-red-500' : ''}
                          >
                            <SelectValue placeholder="Select container..." />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingContainers ? (
                              <SelectItem value="loading" disabled>
                                Loading containers...
                              </SelectItem>
                            ) : containers.length > 0 ? (
                              containers.map((container) => {
                                const icon = getAvailabilityIcon(container.availability_status);
                                const isDisabled = container.availability_status === 'CONFLICT';
                                
                                return (
                                  <SelectItem
                                    key={container.id}
                                    value={container.id.toString()}
                                    disabled={isDisabled}
                                  >
                                    {icon} {container.name} - {container.availability_message}
                                  </SelectItem>
                                );
                              })
                            ) : (
                              <SelectItem value="none" disabled>
                                No containers available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {errors[`${row.id}-destContainerId`] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors[`${row.id}-destContainerId`]}
                          </p>
                        )}
                      </td>

                      {/* Egg Count */}
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={row.eggCountPlanned || ''}
                          onChange={(e) =>
                            updateRow(row.id, 'eggCountPlanned', parseInt(e.target.value) || 0)
                          }
                          placeholder="10000"
                          className={errors[`${row.id}-eggCountPlanned`] ? 'border-red-500' : ''}
                        />
                        {errors[`${row.id}-eggCountPlanned`] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors[`${row.id}-eggCountPlanned`]}
                          </p>
                        )}
                      </td>

                      {/* Expected Delivery Date */}
                      <td className="p-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !row.expectedDeliveryDate && 'text-muted-foreground',
                                errors[`${row.id}-expectedDeliveryDate`] && 'border-red-500'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {row.expectedDeliveryDate ? (
                                format(row.expectedDeliveryDate, 'PPP')
                              ) : (
                                <span>Pick date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={row.expectedDeliveryDate}
                              onSelect={(date) =>
                                updateRow(row.id, 'expectedDeliveryDate', date)
                              }
                              disabled={(date) => date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors[`${row.id}-expectedDeliveryDate`] && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors[`${row.id}-expectedDeliveryDate`]}
                          </p>
                        )}
                      </td>

                      {/* Remove Button */}
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(row.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <Button variant="outline" onClick={addRow} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>

          {/* Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Actions:</span>{' '}
                <span className="font-medium">{rows.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Eggs:</span>{' '}
                <span className="font-medium">{totalEggs.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Availability Legend */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-2">Container Availability:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-blue-700">Empty (Ready now)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span className="text-blue-700">Available (Will be empty by date)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span className="text-blue-700">Occupied (Can share space)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span className="text-blue-700">Conflict (Already scheduled)</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createAction.isPending}>
            {createAction.isPending ? 'Adding Actions...' : `Add ${rows.length} Action(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}











