import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Microscope, Beaker, Syringe, TestTube, Pill } from 'lucide-react'
import { 
  useJournalEntries, 
  useHealthSamplingEvents, 
  useHealthLabSamples,
  useTreatments,
  useSampleTypes,
  useVaccinationTypes,
} from '../api'
import { 
  JournalEntryForm, 
  HealthSamplingEventForm,
  HealthLabSampleForm,
  TreatmentForm,
  SampleTypeForm,
  VaccinationTypeForm,
} from '../components'

type EntityType = 'journalEntry' | 'samplingEvent' | 'labSample' | 'treatment' | 'sampleType' | 'vaccinationType' | null

/**
 * Health Management Page with Create Dialogs
 * 
 * Provides quick access to create JournalEntry entities via modal dialogs.
 * Similar to InventoryManagementPage but for health domain entities.
 * 
 * Features:
 * - Create new journal entries for health observations
 * - Display current entry counts
 * - Modal dialogs for forms
 */
export default function HealthManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null)

  // Load counts for display
  const { data: journalEntriesData } = useJournalEntries()
  const { data: samplingEventsData } = useHealthSamplingEvents()
  const { data: labSamplesData } = useHealthLabSamples()
  const { data: treatmentsData } = useTreatments()
  const { data: sampleTypesData } = useSampleTypes()
  const { data: vaccinationTypesData } = useVaccinationTypes()

  const handleSuccess = () => {
    setCreateDialogOpen(null)
  }

  const handleCancel = () => {
    setCreateDialogOpen(null)
  }

  const entities = [
    {
      id: 'journalEntry' as const,
      name: 'Journal Entry',
      description: 'Record health observations, issues, and treatments',
      icon: FileText,
      count: journalEntriesData?.results?.length || 0,
      color: 'blue'
    },
    {
      id: 'samplingEvent' as const,
      name: 'Sampling Event',
      description: 'Conduct health sampling with fish measurements',
      icon: Microscope,
      count: samplingEventsData?.results?.length || 0,
      color: 'green'
    },
    {
      id: 'labSample' as const,
      name: 'Lab Sample',
      description: 'Track laboratory samples and test results',
      icon: Beaker,
      count: labSamplesData?.results?.length || 0,
      color: 'purple'
    },
    {
      id: 'treatment' as const,
      name: 'Treatment',
      description: 'Record treatments and medical interventions',
      icon: Pill,
      count: treatmentsData?.results?.length || 0,
      color: 'orange'
    },
    {
      id: 'sampleType' as const,
      name: 'Sample Type',
      description: 'Define types of laboratory samples',
      icon: TestTube,
      count: sampleTypesData?.results?.length || 0,
      color: 'cyan'
    },
    {
      id: 'vaccinationType' as const,
      name: 'Vaccination Type',
      description: 'Define vaccination types and manufacturers',
      icon: Syringe,
      count: vaccinationTypesData?.results?.length || 0,
      color: 'pink'
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; text: string; bg: string }> = {
      blue: { icon: 'text-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
      green: { icon: 'text-green-600', text: 'text-green-600', bg: 'bg-green-50' },
      purple: { icon: 'text-purple-600', text: 'text-purple-600', bg: 'bg-purple-50' },
      orange: { icon: 'text-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
      cyan: { icon: 'text-cyan-600', text: 'text-cyan-600', bg: 'bg-cyan-50' },
      pink: { icon: 'text-pink-600', text: 'text-pink-600', bg: 'bg-pink-50' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Health Management</h1>
          <p className="text-muted-foreground">Create and manage health journal entries</p>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => {
          const colors = getColorClasses(entity.color)
          const Icon = entity.icon

          return (
            <Card key={entity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {entity.count}
                  </div>
                </div>
                <CardTitle className="text-base">{entity.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{entity.description}</p>
                <Button
                  onClick={() => setCreateDialogOpen(entity.id)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create {entity.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Create Journal Entry Dialog */}
      <Dialog open={createDialogOpen === 'journalEntry'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Journal Entry</DialogTitle>
            <DialogDescription>Record a new health observation, issue, or treatment</DialogDescription>
          </DialogHeader>
          <JournalEntryForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Create Health Sampling Event Dialog */}
      <Dialog open={createDialogOpen === 'samplingEvent'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Health Sampling Event</DialogTitle>
            <DialogDescription>Record health sampling event with individual fish measurements</DialogDescription>
          </DialogHeader>
          <HealthSamplingEventForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Create Lab Sample Dialog */}
      <Dialog open={createDialogOpen === 'labSample'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Record Lab Sample</DialogTitle>
            <DialogDescription>Record a laboratory sample for testing and analysis</DialogDescription>
          </DialogHeader>
          <HealthLabSampleForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Create Treatment Dialog */}
      <Dialog open={createDialogOpen === 'treatment'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Record Treatment</DialogTitle>
            <DialogDescription>Record a treatment administered to a batch</DialogDescription>
          </DialogHeader>
          <TreatmentForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Create Sample Type Dialog */}
      <Dialog open={createDialogOpen === 'sampleType'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Sample Type</DialogTitle>
            <DialogDescription>Define a new type of laboratory sample</DialogDescription>
          </DialogHeader>
          <SampleTypeForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Create Vaccination Type Dialog */}
      <Dialog open={createDialogOpen === 'vaccinationType'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Vaccination Type</DialogTitle>
            <DialogDescription>Define a new vaccination type for treatments</DialogDescription>
          </DialogHeader>
          <VaccinationTypeForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

