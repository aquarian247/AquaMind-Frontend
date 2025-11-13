/**
 * Create Batch Creation Wizard - Multi-step dialog for creating batch creation workflows.
 * 
 * 3-step wizard:
 * Step 1: Basic information (batch, total eggs, planned dates)
 * Step 2: Egg source selection (internal egg production OR external supplier)
 * Step 3: Review & Create
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
  Calendar as CalendarIcon,
  DollarSign,
  Package,
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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { ApiService } from '@/api/generated';
import { useCreateCreationWorkflow } from '../api';

// ============================================================================
// Form Schema
// ============================================================================

const batchCreationFormSchema = z.object({
  batch_number: z.string().min(1, 'Batch number is required'),
  species: z.number().int().positive('Species is required'),
  lifecycle_stage: z.number().int().positive('Lifecycle stage is required'),
  total_eggs_planned: z.number().int().positive('Total eggs must be > 0'),
  planned_start_date: z.date(),
  planned_completion_date: z.date().optional(),
  egg_source_type: z.enum(['INTERNAL', 'EXTERNAL']),
  // Internal source fields
  egg_production: z.number().int().positive().optional(),
  // External source fields
  external_supplier: z.number().int().positive().optional(),
  external_supplier_batch_number: z.string().optional(),
  external_cost_per_thousand: z.number().positive().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    // If INTERNAL, must have egg_production
    if (data.egg_source_type === 'INTERNAL') {
      return !!data.egg_production;
    }
    // If EXTERNAL, must have external_supplier
    if (data.egg_source_type === 'EXTERNAL') {
      return !!data.external_supplier;
    }
    return true;
  },
  {
    message: 'Please select an egg source',
    path: ['egg_source_type'],
  }
);

type BatchCreationFormData = z.infer<typeof batchCreationFormSchema>;

// ============================================================================
// Component
// ============================================================================

interface CreateBatchCreationWizardProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateBatchCreationWizard({
  children,
  onSuccess,
}: CreateBatchCreationWizardProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BatchCreationFormData>({
    resolver: zodResolver(batchCreationFormSchema),
    defaultValues: {
      batch_number: '',
      species: undefined,
      lifecycle_stage: undefined,
      total_eggs_planned: undefined,
      planned_start_date: new Date(),
      planned_completion_date: undefined,
      egg_source_type: 'INTERNAL',
      egg_production: undefined,
      external_supplier: undefined,
      external_supplier_batch_number: '',
      external_cost_per_thousand: undefined,
      notes: '',
    },
  });

  // Fetch reference data
  const { data: speciesData } = useQuery({
    queryKey: ['species'],
    queryFn: () => ApiService.apiV1BatchSpeciesList(),
    enabled: open,
  });

  const { data: lifecycleStagesData } = useQuery({
    queryKey: ['lifecycle-stages'],
    queryFn: () => ApiService.apiV1BatchLifecycleStagesList(),
    enabled: open,
  });

  const { data: eggProductionsData } = useQuery({
    queryKey: ['egg-productions'],
    queryFn: () => ApiService.apiV1BroodstockEggProductionsList(),
    enabled: open && form.watch('egg_source_type') === 'INTERNAL',
  });

  const { data: suppliersData } = useQuery({
    queryKey: ['egg-suppliers'],
    queryFn: () => ApiService.apiV1BroodstockEggSuppliersList(),
    enabled: open && form.watch('egg_source_type') === 'EXTERNAL',
  });

  const createWorkflow = useCreateCreationWorkflow();

  const onSubmit = async (data: BatchCreationFormData) => {
    try {
      const payload = {
        batch_number: data.batch_number,
        species: data.species,
        lifecycle_stage: data.lifecycle_stage,
        total_eggs_planned: data.total_eggs_planned,
        planned_start_date: format(data.planned_start_date, 'yyyy-MM-dd'),
        planned_completion_date: data.planned_completion_date
          ? format(data.planned_completion_date, 'yyyy-MM-dd')
          : undefined,
        egg_source_type: data.egg_source_type,
        egg_production: data.egg_source_type === 'INTERNAL' ? data.egg_production : undefined,
        external_supplier: data.egg_source_type === 'EXTERNAL' ? data.external_supplier : undefined,
        external_supplier_batch_number: data.egg_source_type === 'EXTERNAL' ? data.external_supplier_batch_number : undefined,
        external_cost_per_thousand: data.egg_source_type === 'EXTERNAL' ? data.external_cost_per_thousand : undefined,
        notes: data.notes || '',
      };

      console.log('Creating batch creation workflow with payload:', payload);
      const result = await createWorkflow.mutateAsync(payload as any);
      console.log('Workflow created:', result);

      toast({
        title: 'Workflow Created',
        description: 'Batch creation workflow created successfully. Add delivery actions to continue.',
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
    let fieldsToValidate: (keyof BatchCreationFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['batch_number', 'species', 'lifecycle_stage', 'total_eggs_planned', 'planned_start_date'];
      const isValid = await form.trigger(fieldsToValidate);
      if (isValid && currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 2) {
      // Validate egg source fields
      const sourceType = form.watch('egg_source_type');
      if (sourceType === 'INTERNAL') {
        fieldsToValidate = ['egg_production'];
      } else {
        fieldsToValidate = ['external_supplier'];
      }
      const isValid = await form.trigger(fieldsToValidate);
      if (isValid && currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const eggSourceType = form.watch('egg_source_type');
    const selectedEggProduction = form.watch('egg_production');
    const eggProductionDetails = eggProductionsData?.results?.find((ep: any) => ep.id === selectedEggProduction);

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., BATCH-2026-001" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for this batch
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Species *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {speciesData?.results?.map((species) => (
                          <SelectItem key={species.id} value={species.id.toString()}>
                            {species.name} ({species.scientific_name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lifecycle_stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lifecycle Stage *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lifecycleStagesData?.results?.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id.toString()}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Usually "Egg" or "Eyed Egg"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="total_eggs_planned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Eggs Planned *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="100000"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of eggs expected across all deliveries
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
                      When all eggs are expected to be delivered
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
              name="egg_source_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Egg Source Type *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="INTERNAL"
                          id="internal"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="internal"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <Package className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">Internal Production</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            From own broodstock
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="EXTERNAL"
                          id="external"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="external"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          <DollarSign className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">External Supplier</span>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            Purchased from supplier
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {eggSourceType === 'INTERNAL' && (
              <>
                <FormField
                  control={form.control}
                  name="egg_production"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Egg Production Event *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString() ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select egg production..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eggProductionsData?.results?.map((ep: any) => (
                            <SelectItem key={ep.id} value={ep.id.toString()}>
                              {ep.production_date} - {ep.female_parent_id} × {ep.male_parent_id} 
                              ({ep.total_eggs?.toLocaleString()} eggs)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the broodstock egg production event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {eggProductionDetails && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Package className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <strong className="text-blue-900">Selected Production</strong>
                      <p className="text-xs text-blue-700 mt-1">
                        Date: {eggProductionDetails.production_date} • 
                        Total Eggs: {(eggProductionDetails as any).total_eggs?.toLocaleString() || 'N/A'} •
                        Quality Score: {(eggProductionDetails as any).quality_score || 'N/A'}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {eggSourceType === 'EXTERNAL' && (
              <>
                <FormField
                  control={form.control}
                  name="external_supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString() ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliersData?.results?.map((supplier: any) => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="external_supplier_batch_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Batch Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SUP-2026-A123" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Reference number from supplier (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="external_cost_per_thousand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per 1000 Eggs (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="25.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Unit cost for financial tracking (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        );

      case 3:
        // Review step
        const reviewData = form.getValues();
        const selectedSpecies = speciesData?.results?.find((s) => s.id === reviewData.species);
        const selectedStage = lifecycleStagesData?.results?.find((s) => s.id === reviewData.lifecycle_stage);
        const selectedSupplier = suppliersData?.results?.find((s: any) => s.id === reviewData.external_supplier);

        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Batch Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch Number:</span>
                  <span className="font-medium">{reviewData.batch_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Species:</span>
                  <span className="font-medium">{selectedSpecies?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lifecycle Stage:</span>
                  <span className="font-medium">{selectedStage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Eggs Planned:</span>
                  <span className="font-medium">{reviewData.total_eggs_planned?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{format(reviewData.planned_start_date, 'PPP')}</span>
                </div>
                {reviewData.planned_completion_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion Date:</span>
                    <span className="font-medium">{format(reviewData.planned_completion_date, 'PPP')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Egg Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source Type:</span>
                  <Badge variant={reviewData.egg_source_type === 'INTERNAL' ? 'default' : 'secondary'}>
                    {reviewData.egg_source_type === 'INTERNAL' ? 'Internal Production' : 'External Supplier'}
                  </Badge>
                </div>
                {reviewData.egg_source_type === 'INTERNAL' && reviewData.egg_production && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Production Event:</span>
                    <span className="font-medium">ID {reviewData.egg_production}</span>
                  </div>
                )}
                {reviewData.egg_source_type === 'EXTERNAL' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-medium">{selectedSupplier?.name || 'N/A'}</span>
                    </div>
                    {reviewData.external_supplier_batch_number && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Supplier Batch:</span>
                        <span className="font-medium">{reviewData.external_supplier_batch_number}</span>
                      </div>
                    )}
                    {reviewData.external_cost_per_thousand && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost per 1000:</span>
                        <span className="font-medium">€{reviewData.external_cost_per_thousand.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {reviewData.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{reviewData.notes}</p>
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about this batch creation workflow..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                After creating the workflow, you'll need to add delivery actions specifying 
                which containers will receive the eggs and when.
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
        return 'Egg Source Selection';
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
          <DialogTitle>Create Batch Creation Workflow</DialogTitle>
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
                    <Package className="h-4 w-4 mr-2" />
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



