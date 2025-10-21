/**
 * Create Workflow Wizard - Multi-step dialog for creating transfer workflows.
 * 
 * Follows app pattern: 3-step wizard with progress indicator.
 * Simplified version - actions added after workflow creation.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Calendar as CalendarIcon,
  DollarSign,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { ApiService } from '@/api/generated';
import { useCreateWorkflow } from '../api';

// ============================================================================
// Form Schema
// ============================================================================

const workflowFormSchema = z.object({
  batch: z.number().int().positive('Batch is required'),
  workflow_type: z.enum([
    'LIFECYCLE_TRANSITION',
    'CONTAINER_REDISTRIBUTION',
    'EMERGENCY_CASCADE',
    'PARTIAL_HARVEST',
  ]),
  source_lifecycle_stage: z.number().int().positive('Source stage is required'),
  dest_lifecycle_stage: z.number().int().positive().optional(),
  planned_start_date: z.date(),
  planned_completion_date: z.date().optional(),
  notes: z.string().optional(),
});

type WorkflowFormData = z.infer<typeof workflowFormSchema>;

// ============================================================================
// Component
// ============================================================================

interface CreateWorkflowWizardProps {
  batchId?: number;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateWorkflowWizard({
  batchId,
  children,
  onSuccess,
}: CreateWorkflowWizardProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      batch: batchId || undefined,
      workflow_type: 'LIFECYCLE_TRANSITION',
      source_lifecycle_stage: undefined,
      dest_lifecycle_stage: undefined,
      planned_start_date: new Date(),
      planned_completion_date: undefined,
      notes: '',
    },
  });

  // Fetch reference data
  const { data: batchesData } = useQuery({
    queryKey: ['batches'],
    queryFn: () => ApiService.apiV1BatchBatchesList(),
    enabled: open && !batchId,
  });

  const { data: lifecycleStagesData } = useQuery({
    queryKey: ['lifecycle-stages'],
    queryFn: () => ApiService.apiV1BatchLifecycleStagesList(),
    enabled: open,
  });

  const createWorkflow = useCreateWorkflow();

  const onSubmit = async (data: WorkflowFormData) => {
    try {
      const payload = {
        batch: data.batch,
        workflow_type: data.workflow_type,
        source_lifecycle_stage: data.source_lifecycle_stage,
        dest_lifecycle_stage: data.dest_lifecycle_stage || undefined,
        planned_start_date: format(data.planned_start_date, 'yyyy-MM-dd'),
        planned_completion_date: data.planned_completion_date
          ? format(data.planned_completion_date, 'yyyy-MM-dd')
          : undefined,
        notes: data.notes || '',
      };

      console.log('Creating workflow with payload:', payload);
      const result = await createWorkflow.mutateAsync(payload as any);
      console.log('Workflow created:', result);

      toast({
        title: 'Workflow Created',
        description: 'Transfer workflow created successfully. Add actions to continue.',
      });

      setOpen(false);
      setCurrentStep(1);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Workflow creation error:', error);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create workflow';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.body) {
          errorMessage = JSON.stringify(apiError.body);
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }
      
      toast({
        title: 'Error Creating Workflow',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const nextStep = async () => {
    // Validate current step fields before advancing
    let fieldsToValidate: (keyof WorkflowFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['batch', 'workflow_type', 'planned_start_date'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['source_lifecycle_stage'];
      if (form.watch('workflow_type') === 'LIFECYCLE_TRANSITION') {
        fieldsToValidate.push('dest_lifecycle_stage');
      }
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const workflowType = form.watch('workflow_type');

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {!batchId && (
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {batchesData?.results?.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id.toString()}>
                            {batch.batch_number} - {batch.species_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="workflow_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workflow type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LIFECYCLE_TRANSITION">
                        Lifecycle Stage Transition
                      </SelectItem>
                      <SelectItem value="CONTAINER_REDISTRIBUTION">
                        Container Redistribution
                      </SelectItem>
                      <SelectItem value="EMERGENCY_CASCADE">
                        Emergency Cascading Transfer
                      </SelectItem>
                      <SelectItem value="PARTIAL_HARVEST">
                        Partial Harvest Preparation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {workflowType === 'LIFECYCLE_TRANSITION' &&
                      'Transfer fish to next lifecycle stage (e.g., Post-Smolt → Adult)'}
                    {workflowType === 'CONTAINER_REDISTRIBUTION' &&
                      'Redistribute fish within same lifecycle stage'}
                    {workflowType === 'EMERGENCY_CASCADE' &&
                      'Multi-step emergency transfer operation'}
                    {workflowType === 'PARTIAL_HARVEST' &&
                      'Prepare fish for partial harvest'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="planned_start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Planned Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planned_completion_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Planned Completion</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Optional</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < (form.watch('planned_start_date') || new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs">
                      Optional target completion date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="source_lifecycle_stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Lifecycle Stage *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lifecycleStagesData?.results?.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id.toString()}>
                          {stage.name} (Order: {stage.order})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Current lifecycle stage of the fish</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {workflowType === 'LIFECYCLE_TRANSITION' && (
              <FormField
                control={form.control}
                name="dest_lifecycle_stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Lifecycle Stage *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lifecycleStagesData?.results
                          ?.filter((stage) => {
                            const sourceStage = lifecycleStagesData.results?.find(
                              (s) => s.id === form.watch('source_lifecycle_stage')
                            );
                            return sourceStage ? stage.order > sourceStage.order : true;
                          })
                          .map((stage) => (
                            <SelectItem key={stage.id} value={stage.id.toString()}>
                              {stage.name} (Order: {stage.order})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Next lifecycle stage (must be later than source)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {workflowType === 'LIFECYCLE_TRANSITION' && (
              <IntercompanyDetectionAlert
                sourceStageId={form.watch('source_lifecycle_stage')}
                destStageId={form.watch('dest_lifecycle_stage')}
                lifecycleStages={lifecycleStagesData?.results || []}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional notes about this transfer operation..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        const formData = form.getValues();
        const selectedBatch = batchesData?.results?.find(
          (b) => b.id === formData.batch
        );
        const sourceStage = lifecycleStagesData?.results?.find(
          (s) => s.id === formData.source_lifecycle_stage
        );
        const destStage = lifecycleStagesData?.results?.find(
          (s) => s.id === formData.dest_lifecycle_stage
        );

        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Review Workflow Configuration</h4>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workflow Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch:</span>
                  <span className="font-medium">
                    {selectedBatch?.batch_number || `Batch #${formData.batch}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">
                    {workflowType === 'LIFECYCLE_TRANSITION' && 'Lifecycle Transition'}
                    {workflowType === 'CONTAINER_REDISTRIBUTION' &&
                      'Container Redistribution'}
                    {workflowType === 'EMERGENCY_CASCADE' && 'Emergency Cascade'}
                    {workflowType === 'PARTIAL_HARVEST' && 'Partial Harvest'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source Stage:</span>
                  <span className="font-medium">{sourceStage?.name || 'Unknown'}</span>
                </div>
                {destStage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination Stage:</span>
                    <span className="font-medium">{destStage.name}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planned Start:</span>
                  <span className="font-medium">
                    {format(formData.planned_start_date, 'PPP')}
                  </span>
                </div>
                {formData.planned_completion_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Planned Completion:</span>
                    <span className="font-medium">
                      {format(formData.planned_completion_date, 'PPP')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Intercompany Detection */}
            {workflowType === 'LIFECYCLE_TRANSITION' &&
              sourceStage?.name === 'Post-Smolt' &&
              destStage?.name === 'Adult' && (
                <Alert className="border-amber-200 bg-amber-50">
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Intercompany Transfer Detected</strong>
                    <p className="text-xs mt-1">
                      This transfer crosses from Freshwater to Farming subsidiary. A
                      financial transaction will be created upon completion.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Next Step:</strong> After creating this workflow, you'll need to
                add transfer actions (container-to-container movements) before you can
                plan and execute it.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Basic Information';
      case 2:
        return 'Lifecycle Stages';
      case 3:
        return 'Review & Create';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Transfer Workflow</DialogTitle>
          <DialogDescription>
            Step {currentStep} of 3: {getStepTitle()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      step <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={cn(
                        'w-12 h-1 mx-2',
                        step < currentStep ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {renderStepContent()}

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={createWorkflow.isPending}>
                    {createWorkflow.isPending ? 'Creating...' : 'Create Workflow'}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

interface IntercompanyDetectionAlertProps {
  sourceStageId?: number;
  destStageId?: number;
  lifecycleStages: any[];
}

function IntercompanyDetectionAlert({
  sourceStageId,
  destStageId,
  lifecycleStages,
}: IntercompanyDetectionAlertProps) {
  const sourceStage = lifecycleStages.find((s) => s.id === sourceStageId);
  const destStage = lifecycleStages.find((s) => s.id === destStageId);

  // Detect Post-Smolt → Adult (intercompany)
  const isIntercompany =
    sourceStage?.name === 'Post-Smolt' && destStage?.name === 'Adult';

  if (!isIntercompany) return null;

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <DollarSign className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        <strong className="text-amber-900">Intercompany Transfer</strong>
        <p className="text-xs text-amber-700 mt-1">
          This transfer crosses from Freshwater to Farming subsidiary. A financial
          transaction will be automatically created when the workflow completes.
        </p>
      </AlertDescription>
    </Alert>
  );
}

