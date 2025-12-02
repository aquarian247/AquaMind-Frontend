/**
 * Planned Activity Form
 *
 * Form for creating and editing planned activities.
 * Uses React Hook Form + Zod for validation.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import { useCreatePlannedActivity, useUpdatePlannedActivity } from '../api/api';
import { getActivityTypeOptions } from '../utils/activityHelpers';
import { useToast } from '@/hooks/use-toast';
import type { PlannedActivity, ActivityFormData } from '../types';

// Simplified date input component (use shadcn date-picker in production)
import { Input } from '@/components/ui/input';

const plannedActivitySchema = z.object({
  scenario: z.number(),
  batch: z.number({ required_error: 'Batch is required' }),
  activity_type: z.enum(
    [
      'VACCINATION',
      'TREATMENT',
      'CULL',
      'SALE',
      'FEED_CHANGE',
      'TRANSFER',
      'MAINTENANCE',
      'SAMPLING',
      'OTHER',
    ],
    { required_error: 'Activity type is required' }
  ),
  due_date: z.string().min(1, 'Due date is required'), // ISO date string
  container: z.number().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof plannedActivitySchema>;

interface PlannedActivityFormProps {
  scenarioId: number;
  activity?: PlannedActivity;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PlannedActivityForm({
  scenarioId,
  activity,
  isOpen,
  onClose,
  onSuccess,
}: PlannedActivityFormProps) {
  const { toast } = useToast();
  const createMutation = useCreatePlannedActivity();
  const updateMutation = useUpdatePlannedActivity();

  const isEditMode = !!activity;

  // Fetch batches for dropdown
  const { data: batchesResponse, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: () => ApiService.apiV1BatchBatchesList(),
  });

  const batches = batchesResponse?.results || [];

  // Fetch containers for dropdown
  const { data: containersResponse, isLoading: containersLoading } = useQuery({
    queryKey: ['containers'],
    queryFn: () => ApiService.apiV1InfrastructureContainersList(),
  });

  const containers = containersResponse?.results || [];

  const activityTypeOptions = getActivityTypeOptions();

  const form = useForm<FormData>({
    resolver: zodResolver(plannedActivitySchema),
    defaultValues: activity
      ? {
          scenario: activity.scenario,
          batch: activity.batch,
          activity_type: activity.activity_type,
          due_date: activity.due_date, // Already ISO format from API
          container: activity.container || undefined,
          notes: activity.notes || '',
        }
      : {
          scenario: scenarioId,
          batch: undefined,
          activity_type: undefined,
          due_date: format(new Date(), 'yyyy-MM-dd'),
          container: undefined,
          notes: '',
        },
  });

  // Reset form when activity changes or modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        scenario: data.scenario,
        batch: data.batch,
        activity_type: data.activity_type,
        due_date: data.due_date,
        container: data.container || null,
        notes: data.notes || null,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: activity.id,
          data: payload as any,
        });
        toast({
          title: 'Activity Updated',
          description: 'The planned activity has been updated successfully.',
        });
      } else {
        await createMutation.mutateAsync(payload as any);
        toast({
          title: 'Activity Created',
          description: 'The planned activity has been created successfully.',
        });
      }

      form.reset();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.error ||
          `Failed to ${isEditMode ? 'update' : 'create'} activity`,
        variant: 'destructive',
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit' : 'Create'} Planned Activity
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Batch Selection */}
            <FormField
              control={form.control}
              name="batch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Batch <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      disabled={batchesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch..." />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id.toString()}>
                            {batch.batch_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Activity Type Selection */}
            <FormField
              control={form.control}
              name="activity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Activity Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Due Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Container Selection (Optional) */}
            <FormField
              control={form.control}
              name="container"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === '_none_' ? undefined : Number(value))
                      }
                      value={field.value?.toString() || '_none_'}
                      disabled={containersLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select container..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">None</SelectItem>
                        {containers.map((container) => (
                          <SelectItem
                            key={container.id}
                            value={container.id.toString()}
                          >
                            {container.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any relevant notes or context..."
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Update' : 'Create'} Activity
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

