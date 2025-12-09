/**
 * Activity Template Form
 *
 * Form for creating and editing activity templates.
 * Uses React Hook Form + Zod for validation.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/api/generated';
import {
  useCreateActivityTemplate,
  useUpdateActivityTemplate,
} from '../api/api';
import { getActivityTypeOptions } from '../utils/activityHelpers';
import { useToast } from '@/hooks/use-toast';
import type { ActivityTemplate } from '../types';

const activityTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  activity_type: z.enum(
    [
      'VACCINATION',
      'TREATMENT',
      'CULL',
      'HARVEST',
      'SALE',
      'FEED_CHANGE',
      'TRANSFER',
      'MAINTENANCE',
      'SAMPLING',
      'OTHER',
    ],
    { required_error: 'Activity type is required' }
  ),
  trigger_type: z.enum(
    ['DAY_OFFSET', 'WEIGHT_THRESHOLD', 'STAGE_TRANSITION'],
    { required_error: 'Trigger type is required' }
  ),
  day_offset: z.coerce.number().int().min(0).optional().nullable(),
  weight_threshold_g: z.string().optional().nullable(),
  target_lifecycle_stage: z.coerce.number().optional().nullable(),
  notes_template: z.string().max(2000, 'Notes too long').optional().nullable(),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof activityTemplateSchema>;

interface ActivityTemplateFormProps {
  template?: ActivityTemplate;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const triggerTypeOptions = [
  { value: 'DAY_OFFSET', label: 'Day Offset', description: 'Days after batch creation' },
  { value: 'WEIGHT_THRESHOLD', label: 'Weight Threshold', description: 'When fish reach target weight' },
  { value: 'STAGE_TRANSITION', label: 'Stage Transition', description: 'When batch enters lifecycle stage' },
];

export function ActivityTemplateForm({
  template,
  isOpen,
  onClose,
  onSuccess,
}: ActivityTemplateFormProps) {
  const { toast } = useToast();
  const createMutation = useCreateActivityTemplate();
  const updateMutation = useUpdateActivityTemplate();

  const isEditMode = !!template;

  // Fetch lifecycle stages for dropdown
  const { data: lifecycleStagesResponse, isLoading: stagesLoading } = useQuery({
    queryKey: ['lifecycle-stages'],
    queryFn: () => ApiService.apiV1BatchLifecycleStagesList(),
  });

  const lifecycleStages = lifecycleStagesResponse?.results || [];
  const activityTypeOptions = getActivityTypeOptions();

  const form = useForm<FormData>({
    resolver: zodResolver(activityTemplateSchema),
    defaultValues: template
      ? {
          name: template.name,
          description: template.description || '',
          activity_type: template.activity_type,
          trigger_type: template.trigger_type,
          day_offset: template.day_offset ?? undefined,
          weight_threshold_g: template.weight_threshold_g || '',
          target_lifecycle_stage: template.target_lifecycle_stage ?? undefined,
          notes_template: template.notes_template || '',
          is_active: template.is_active ?? true,
        }
      : {
          name: '',
          description: '',
          activity_type: undefined,
          trigger_type: 'DAY_OFFSET',
          day_offset: undefined,
          weight_threshold_g: '',
          target_lifecycle_stage: undefined,
          notes_template: '',
          is_active: true,
        },
  });

  const watchTriggerType = form.watch('trigger_type');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && template) {
      form.reset({
        name: template.name,
        description: template.description || '',
        activity_type: template.activity_type,
        trigger_type: template.trigger_type,
        day_offset: template.day_offset ?? undefined,
        weight_threshold_g: template.weight_threshold_g || '',
        target_lifecycle_stage: template.target_lifecycle_stage ?? undefined,
        notes_template: template.notes_template || '',
        is_active: template.is_active ?? true,
      });
    } else if (isOpen && !template) {
      form.reset({
        name: '',
        description: '',
        activity_type: undefined,
        trigger_type: 'DAY_OFFSET',
        day_offset: undefined,
        weight_threshold_g: '',
        target_lifecycle_stage: undefined,
        notes_template: '',
        is_active: true,
      });
    }
  }, [isOpen, template, form]);

  const onSubmit = async (data: FormData) => {
    try {
      // Build payload based on trigger type
      const payload: Partial<ActivityTemplate> = {
        name: data.name,
        description: data.description || null,
        activity_type: data.activity_type,
        trigger_type: data.trigger_type,
        notes_template: data.notes_template || null,
        is_active: data.is_active,
        // Clear unused trigger fields
        day_offset: data.trigger_type === 'DAY_OFFSET' ? data.day_offset : null,
        weight_threshold_g: data.trigger_type === 'WEIGHT_THRESHOLD' ? data.weight_threshold_g : null,
        target_lifecycle_stage: data.trigger_type === 'STAGE_TRANSITION' ? data.target_lifecycle_stage : null,
      };

      if (isEditMode && template) {
        await updateMutation.mutateAsync({
          id: template.id,
          data: payload,
        });
        toast({
          title: 'Template Updated',
          description: 'The activity template has been updated successfully.',
        });
      } else {
        await createMutation.mutateAsync(payload);
        toast({
          title: 'Template Created',
          description: 'The activity template has been created successfully.',
        });
      }

      form.reset();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.response?.data?.detail ||
          error.response?.data?.name?.[0] ||
          `Failed to ${isEditMode ? 'update' : 'create'} template`,
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
            {isEditMode ? 'Edit' : 'Create'} Activity Template
          </DialogTitle>
          <DialogDescription>
            Activity templates automatically generate planned activities when batches are created.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Basic Information
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Template Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Pre-Smolt Vaccination"
                      />
                    </FormControl>
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
                        {...field}
                        value={field.value || ''}
                        placeholder="Describe when and why this activity should be performed..."
                        rows={2}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            {/* Trigger Configuration Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Trigger Configuration
              </h3>

              <FormField
                control={form.control}
                name="trigger_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trigger Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Determines when the activity will be scheduled
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Day Offset (for DAY_OFFSET trigger) */}
              {watchTriggerType === 'DAY_OFFSET' && (
                <FormField
                  control={form.control}
                  name="day_offset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Day Offset <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g., 90"
                        />
                      </FormControl>
                      <FormDescription>
                        Days after batch creation when activity is due
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Weight Threshold (for WEIGHT_THRESHOLD trigger) */}
              {watchTriggerType === 'WEIGHT_THRESHOLD' && (
                <FormField
                  control={form.control}
                  name="weight_threshold_g"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Weight Threshold (grams) <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          {...field}
                          value={field.value || ''}
                          placeholder="e.g., 50.00"
                        />
                      </FormControl>
                      <FormDescription>
                        Average weight in grams when activity should be triggered
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Lifecycle Stage (for STAGE_TRANSITION trigger) */}
              {watchTriggerType === 'STAGE_TRANSITION' && (
                <FormField
                  control={form.control}
                  name="target_lifecycle_stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Target Lifecycle Stage <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString() || ''}
                          disabled={stagesLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select lifecycle stage..." />
                          </SelectTrigger>
                          <SelectContent>
                            {lifecycleStages.map((stage) => (
                              <SelectItem key={stage.id} value={stage.id.toString()}>
                                {stage.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Activity is triggered when batch enters this lifecycle stage
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Notes Template Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground border-b pb-2">
                Default Notes
              </h3>

              <FormField
                control={form.control}
                name="notes_template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes Template</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="Default notes that will be added to generated activities..."
                        rows={3}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      These notes will be pre-filled when activities are generated from this template
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Only active templates will generate activities for new batches
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
            </div>

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
                {isEditMode ? 'Update' : 'Create'} Template
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}




