import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Heart, 
  FileText, 
  Microscope,
  Ruler,
  Stethoscope,
  Beaker,
  Pill,
  TestTube,
  Syringe,
  BookOpen,
  Plus,
  Edit,
  Eye,
  Trash2,
  Info,
  TrendingUp,
  AlertTriangle,
  Activity
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCount, formatPercentage } from "@/lib/formatFallback";
import { 
  useJournalEntries, 
  useHealthSamplingEvents, 
  useHealthLabSamples, 
  useTreatments,
  useSampleTypes,
  useVaccinationTypes,
  useLiceCounts,
  useHealthParameters
} from "@/features/health/api";
import { useGrowthSamples } from "@/features/batch-management/api";
import { JournalEntryForm } from "@/features/health/components/JournalEntryForm";
import { HealthSamplingEventForm } from "@/features/health/components/HealthSamplingEventForm";
import { HealthLabSampleForm } from "@/features/health/components/HealthLabSampleForm";
import { TreatmentForm } from "@/features/health/components/TreatmentForm";
import { SampleTypeForm } from "@/features/health/components/SampleTypeForm";
import { VaccinationTypeForm } from "@/features/health/components/VaccinationTypeForm";
import { HealthParameterForm } from "@/features/health/components/HealthParameterForm";
import { HealthAssessmentForm } from "@/features/health/components/HealthAssessmentForm";
import type { 
  JournalEntry, 
  HealthSamplingEvent, 
  HealthLabSample, 
  Treatment,
  SampleType,
  VaccinationType 
} from "@/api/generated";

type DialogType = 'journalEntry' | 'samplingEvent' | 'healthAssessment' | 'labSample' | 'treatment' | 'sampleType' | 'vaccinationType' | 'healthParameter' | null;

interface DialogState {
  type: DialogType;
  mode: 'create' | 'edit';
  data?: any;
}

export default function Health() {
  const [dialogState, setDialogState] = useState<DialogState>({ type: null, mode: 'create' });
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();

  // Fetch real data from backend
  const { data: journalEntriesData } = useJournalEntries({ page: 1 });
  const { data: samplingEventsData } = useHealthSamplingEvents({ page: 1 });
  const { data: growthSamplesData } = useGrowthSamples({});  // For Measurements tab (read-only)
  const { data: labSamplesData } = useHealthLabSamples({ page: 1 });
  const { data: treatmentsData } = useTreatments({ page: 1 });
  const { data: sampleTypesData } = useSampleTypes({ page: 1 });
  const { data: vaccinationTypesData } = useVaccinationTypes({ page: 1 });
  const { data: liceCountsData } = useLiceCounts({ page: 1 });
  const { data: healthParametersData } = useHealthParameters({ page: 1 });

  const openCreateDialog = (type: DialogType) => {
    setDialogState({ type, mode: 'create', data: undefined });
  };

  const openEditDialog = (type: DialogType, data: any) => {
    setDialogState({ type, mode: 'edit', data });
  };

  const closeDialog = () => {
    setDialogState({ type: null, mode: 'create', data: undefined });
  };

  const handleSuccess = () => {
    closeDialog();
  };

  // Calculate summary metrics from real data
  const totalJournalEntries = journalEntriesData?.count || 0;
  const totalSamplingEvents = samplingEventsData?.count || 0;
  const totalLabSamples = labSamplesData?.count || 0;
  const totalTreatments = treatmentsData?.count || 0;
  const totalLiceCounts = liceCountsData?.count || 0;

  // Calculate average lice count from real data
  const avgLicePerFish = liceCountsData?.results?.length 
    ? liceCountsData.results.reduce((sum: number, lc: any) => {
        const fishSampled = lc.fish_sampled || 1;
        const totalLice = (lc.adult_female_count || 0) + (lc.adult_male_count || 0) + (lc.juvenile_count || 0);
        return sum + (totalLice / fishSampled);
      }, 0) / liceCountsData.results.length
    : 0;

  // Get recent entries for quick view
  const recentJournalEntries = journalEntriesData?.results?.slice(0, 5) || [];
  const recentTreatments = treatmentsData?.results?.slice(0, 5) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold">Health Management</h1>
            <p className="text-muted-foreground">
              Comprehensive aquaculture health monitoring and compliance
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCount(totalJournalEntries)}</div>
            <p className="text-xs text-muted-foreground">
              Health observations recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Measurements</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCount(totalSamplingEvents)}</div>
            <p className="text-xs text-muted-foreground">
              Weight & length tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCount(totalTreatments)}</div>
            <p className="text-xs text-muted-foreground">
              Medical interventions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lice/Fish</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgLicePerFish.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {formatCount(totalLiceCounts)} recent counts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for high lice count */}
      {avgLicePerFish > 0.5 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <CardTitle>Elevated Lice Levels Detected</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Average lice count ({avgLicePerFish.toFixed(2)} per fish) exceeds recommended threshold. 
              Consider scheduling treatments or sampling events.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="journal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="journal">
            <FileText className="h-4 w-4 mr-2" />
            {!isMobile && "Journal"}
          </TabsTrigger>
          <TabsTrigger value="measurements">
            <Ruler className="h-4 w-4 mr-2" />
            {!isMobile && "Measurements"}
          </TabsTrigger>
          <TabsTrigger value="assessments">
            <Stethoscope className="h-4 w-4 mr-2" />
            {!isMobile && "Assessments"}
          </TabsTrigger>
          <TabsTrigger value="lab">
            <Beaker className="h-4 w-4 mr-2" />
            {!isMobile && "Lab"}
          </TabsTrigger>
          <TabsTrigger value="treatments">
            <Pill className="h-4 w-4 mr-2" />
            {!isMobile && "Treatments"}
          </TabsTrigger>
          <TabsTrigger value="reference">
            <BookOpen className="h-4 w-4 mr-2" />
            {!isMobile && "Reference"}
          </TabsTrigger>
        </TabsList>

        {/* Journal Entries Tab */}
        <TabsContent value="journal" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Health Journal Entries</h2>
              <p className="text-sm text-muted-foreground">
                Record observations, issues, and actions for batches
              </p>
            </div>
            <Button onClick={() => openCreateDialog('journalEntry')}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Entries ({formatCount(totalJournalEntries)} total)</CardTitle>
              <CardDescription>Latest health observations and issues</CardDescription>
            </CardHeader>
            <CardContent>
              {recentJournalEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No journal entries found</p>
                  <p className="text-sm mt-2">Create your first entry to start tracking health observations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJournalEntries.map((entry: JournalEntry) => (
                    <div key={entry.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={entry.category === 'issue' ? 'destructive' : 'default'}>
                            {entry.category}
                          </Badge>
                          <Badge variant="outline">{entry.severity}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Batch {entry.batch}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">{entry.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.entry_date ? new Date(entry.entry_date).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog('journalEntry', entry)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Measurements Tab (Read-Only View) */}
        <TabsContent value="measurements" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Growth Measurements (View Only)</h2>
              <p className="text-sm text-muted-foreground">
                View growth samples recorded by operators on batch detail pages
              </p>
            </div>
            {/* NO "New Measurement" button - this is read-only for veterinarians */}
          </div>

          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Growth samples are created on the Batch Detail page 
              by operators. This view is for veterinarian reference only.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Growth Samples ({formatCount(growthSamplesData?.count || 0)} total)</CardTitle>
              <CardDescription>Operator-recorded growth measurements with individual fish data</CardDescription>
            </CardHeader>
            <CardContent>
              {!growthSamplesData?.results || growthSamplesData.results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Ruler className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No growth samples found</p>
                  <p className="text-sm mt-2">Growth samples are recorded by operators on the Batch Detail page</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {growthSamplesData.results.slice(0, 10).map((sample) => (
                    <div key={sample.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">
                            {sample.sample_size} fish sampled
                          </Badge>
                          {sample.avg_weight_g && (
                            <Badge variant="outline">
                              Avg: {Number(sample.avg_weight_g).toFixed(2)}g
                            </Badge>
                          )}
                          {sample.avg_length_cm && (
                            <Badge variant="outline">
                              {Number(sample.avg_length_cm).toFixed(2)}cm
                            </Badge>
                          )}
                          {sample.condition_factor && (
                            <Badge variant="outline">
                              K: {Number(sample.condition_factor).toFixed(2)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {(sample.assignment_details as any)?.batch?.batch_number || `Assignment ${sample.assignment}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {sample.sample_date ? new Date(sample.sample_date).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/batch/growth-samples/${sample.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Assessments Tab (NEW) */}
        <TabsContent value="assessments" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Health Assessments</h2>
              <p className="text-sm text-muted-foreground">
                Veterinary health parameter scoring (gill condition, fin condition, etc.)
              </p>
            </div>
            <Button onClick={() => openCreateDialog('healthAssessment')}>
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>

          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Health assessments use the same underlying data as growth measurements 
              but focus on veterinary parameter scoring rather than weight/length tracking. 
              Configure health parameters in the Reference tab before creating assessments.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Health Assessments ({formatCount(totalSamplingEvents)} total)</CardTitle>
              <CardDescription>Veterinary parameter scoring for fish health evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              {!samplingEventsData?.results || samplingEventsData.results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No health assessments found</p>
                  <p className="text-sm mt-2">Create a health assessment to record veterinary parameter scores</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {samplingEventsData.results.slice(0, 5).map((event: HealthSamplingEvent) => (
                    <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {event.number_of_fish_sampled} fish assessed
                          </span>
                          <Badge variant="outline">
                            {event.sampling_date ? new Date(event.sampling_date).toLocaleDateString() : 'No date'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Assignment {event.assignment}
                        </p>
                        {event.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/health/assessments/${event.id}`)}
                          title="View assessment details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // TODO: Implement delete functionality
                            // For now, assessments should be deleted and recreated rather than edited
                            // due to complexity of editing nested parameter scores
                            alert('Delete functionality coming soon. For now, use Django Admin to delete assessments.')
                          }}
                          title="Delete assessment"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lab Samples Tab */}
        <TabsContent value="lab" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Laboratory Samples</h2>
              <p className="text-sm text-muted-foreground">
                Track lab tests and external analysis results
              </p>
            </div>
            <Button onClick={() => openCreateDialog('labSample')}>
              <Plus className="h-4 w-4 mr-2" />
              New Lab Sample
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lab Samples ({formatCount(totalLabSamples)} total)</CardTitle>
              <CardDescription>External laboratory tests and results</CardDescription>
            </CardHeader>
            <CardContent>
              {!labSamplesData?.results || labSamplesData.results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Beaker className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No lab samples found</p>
                  <p className="text-sm mt-2">Record lab samples to track external test results</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {labSamplesData.results.slice(0, 5).map((sample: HealthLabSample) => (
                    <div key={sample.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>Sample Type {sample.sample_type}</Badge>
                          {sample.lab_reference_id && (
                            <span className="text-sm text-muted-foreground">
                              Ref: {sample.lab_reference_id}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">
                          {sample.findings_summary || 'Awaiting results'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sampled: {new Date(sample.sample_date).toLocaleDateString()}
                          {sample.date_results_received && (
                            <> • Results: {new Date(sample.date_results_received as string).toLocaleDateString()}</>
                          )}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog('labSample', sample)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab */}
        <TabsContent value="treatments" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Treatments</h2>
              <p className="text-sm text-muted-foreground">
                Medical interventions and vaccinations
              </p>
            </div>
            <Button onClick={() => openCreateDialog('treatment')}>
              <Plus className="h-4 w-4 mr-2" />
              New Treatment
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Treatments ({formatCount(totalTreatments)} total)</CardTitle>
              <CardDescription>Medications, vaccinations, and interventions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTreatments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No treatments found</p>
                  <p className="text-sm mt-2">Record treatments to track medical interventions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTreatments.map((treatment: Treatment) => (
                    <div key={treatment.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{treatment.treatment_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Batch {treatment.batch}
                          </span>
                        </div>
                        <p className="text-sm">{treatment.description}</p>
                        {treatment.withholding_period_days && treatment.withholding_period_days > 0 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Withholding period: {treatment.withholding_period_days} days
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(treatment.treatment_date as string).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog('treatment', treatment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Data Tab (Combined: Sample Types, Health Parameters, Vaccination Types) */}
        <TabsContent value="reference" className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Reference Data</h2>
            <p className="text-sm text-muted-foreground">
              Configure reference data for health monitoring
            </p>
          </div>

          <Accordion type="multiple" className="space-y-4">
            {/* Sample Types Section */}
            <AccordionItem value="sample-types">
              <AccordionTrigger className="text-lg font-semibold">
                Laboratory Sample Types ({formatCount(sampleTypesData?.count || 0)})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => openCreateDialog('sampleType')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Sample Type
                    </Button>
                  </div>
                  {!sampleTypesData?.results || sampleTypesData.results.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sample types configured</p>
                      <p className="text-sm mt-2">Add sample types to categorize lab samples</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sampleTypesData.results.map((type: SampleType) => (
                        <div key={type.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent">
                          <div className="flex-1">
                            <p className="font-medium">{type.name}</p>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog('sampleType', type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Health Parameters Section */}
            <AccordionItem value="health-parameters">
              <AccordionTrigger className="text-lg font-semibold">
                Health Parameters ({formatCount(healthParametersData?.count || 0)})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => openCreateDialog('healthParameter')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Parameter
                    </Button>
                  </div>
                  {!healthParametersData?.results || healthParametersData.results.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No health parameters configured</p>
                      <p className="text-sm mt-2">Add health parameters for veterinary assessments</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {healthParametersData.results.map((param: any) => (
                        <div key={param.id} className="p-3 border rounded-lg hover:bg-accent">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium">{param.name}</p>
                              <p className="text-sm text-muted-foreground">{param.description}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Score range: {param.min_score}-{param.max_score} ({(param.max_score - param.min_score + 1)} levels)
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDialog('healthParameter', param)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          {param.score_definitions && param.score_definitions.length > 0 && (
                            <div className="mt-2 pl-4 border-l-2 border-muted space-y-1">
                              {param.score_definitions.map((def: any) => (
                                <p key={def.id} className="text-sm">
                                  <span className="font-medium">{def.score_value}:</span> {def.label} - {def.description}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Vaccination Types Section */}
            <AccordionItem value="vaccination-types">
              <AccordionTrigger className="text-lg font-semibold">
                Vaccination Types ({formatCount(vaccinationTypesData?.count || 0)})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => openCreateDialog('vaccinationType')} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Vaccination Type
                    </Button>
                  </div>
                  {!vaccinationTypesData?.results || vaccinationTypesData.results.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Syringe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No vaccination types configured</p>
                      <p className="text-sm mt-2">Add vaccination types to track immunizations</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {vaccinationTypesData.results.map((type: VaccinationType) => (
                        <div key={type.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent">
                          <div className="flex-1">
                            <p className="font-medium">{type.name}</p>
                            {type.manufacturer && (
                              <p className="text-sm text-muted-foreground">
                                Manufacturer: {type.manufacturer}
                              </p>
                            )}
                            {type.dosage && (
                              <p className="text-sm text-muted-foreground">
                                Dosage: {type.dosage}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog('vaccinationType', type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      {/* Dialogs for Create/Edit */}
      
      {/* Journal Entry Dialog */}
      <Dialog open={dialogState.type === 'journalEntry'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Journal Entry
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a journal entry
            </DialogDescription>
          </DialogHeader>
          <JournalEntryForm
            journalEntry={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Sampling Event Dialog (Growth Measurements) */}
      <Dialog open={dialogState.type === 'samplingEvent'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Growth Measurement
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a growth measurement event
            </DialogDescription>
          </DialogHeader>
          <HealthSamplingEventForm
            samplingEvent={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Health Assessment Dialog (Veterinary Parameter Scoring) */}
      <Dialog open={dialogState.type === 'healthAssessment'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Health Assessment
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a veterinary health assessment
            </DialogDescription>
          </DialogHeader>
          <HealthAssessmentForm
            samplingEvent={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Lab Sample Dialog */}
      <Dialog open={dialogState.type === 'labSample'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Lab Sample
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a lab sample
            </DialogDescription>
          </DialogHeader>
          <HealthLabSampleForm
            labSample={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Treatment Dialog */}
      <Dialog open={dialogState.type === 'treatment'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Treatment
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a treatment
            </DialogDescription>
          </DialogHeader>
          <TreatmentForm
            treatment={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Sample Type Dialog */}
      <Dialog open={dialogState.type === 'sampleType'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Sample Type
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a sample type
            </DialogDescription>
          </DialogHeader>
          <SampleTypeForm
            sampleType={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Vaccination Type Dialog */}
      <Dialog open={dialogState.type === 'vaccinationType'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Vaccination Type
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a vaccination type
            </DialogDescription>
          </DialogHeader>
          <VaccinationTypeForm
            vaccinationType={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Health Parameter Dialog */}
      <Dialog open={dialogState.type === 'healthParameter'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {dialogState.mode === 'edit' ? 'Edit' : 'Create'} Health Parameter
            </DialogTitle>
            <DialogDescription>
              Form for {dialogState.mode === 'edit' ? 'editing' : 'creating'} a health parameter
            </DialogDescription>
          </DialogHeader>
          <HealthParameterForm
            healthParameter={dialogState.data}
            onSuccess={handleSuccess}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
