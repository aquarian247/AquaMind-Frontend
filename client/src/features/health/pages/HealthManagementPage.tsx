import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Heart, Syringe, FlaskConical, FileText, Activity, Pill, TestTube } from 'lucide-react'
import { 
  useSampleTypes, 
  useVaccinationTypes, 
  useJournalEntries, 
  useHealthSamplingEvents, 
  useHealthLabSamples, 
  useTreatments 
} from '../api'
import { SampleTypeForm } from '../components/SampleTypeForm'
import { VaccinationTypeForm } from '../components/VaccinationTypeForm'
import { JournalEntryForm } from '../components/JournalEntryForm'
import { HealthSamplingEventForm } from '../components/HealthSamplingEventForm'
import { HealthLabSampleForm } from '../components/HealthLabSampleForm'
import { TreatmentForm } from '../components/TreatmentForm'

type EntityType = 'sampleType' | 'vaccinationType' | 'journalEntry' | 'samplingEvent' | 'labSample' | 'treatment' | null

/**
 * Health Management Page with Create Dialogs
 * 
 * Provides quick access to create all health entities via modal dialogs.
 * This is a testing/demo page to access all Phase 4 forms.
 */
export default function HealthManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null)

  // Load counts for display
  const { data: sampleTypesData } = useSampleTypes()
  const { data: vaccinationTypesData } = useVaccinationTypes()
  const { data: journalEntriesData } = useJournalEntries()
  const { data: samplingEventsData } = useHealthSamplingEvents()
  const { data: labSamplesData } = useHealthLabSamples()
  const { data: treatmentsData } = useTreatments()

  const handleSuccess = () => {
    setCreateDialogOpen(null)
  }

  const entities = [
    {
      id: 'sampleType',
      name: 'Sample Type',
      description: 'Define types of health samples',
      count: sampleTypesData?.count ?? 0,
      icon: TestTube,
      color: 'blue',
    },
    {
      id: 'vaccinationType',
      name: 'Vaccination Type',
      description: 'Manage vaccination types and manufacturers',
      count: vaccinationTypesData?.count ?? 0,
      icon: Syringe,
      color: 'green',
    },
    {
      id: 'journalEntry',
      name: 'Journal Entry',
      description: 'Record health observations and events',
      count: journalEntriesData?.count ?? 0,
      icon: FileText,
      color: 'purple',
    },
    {
      id: 'samplingEvent',
      name: 'Sampling Event',
      description: 'Create health sampling events',
      count: samplingEventsData?.count ?? 0,
      icon: Activity,
      color: 'orange',
    },
    {
      id: 'labSample',
      name: 'Lab Sample',
      description: 'Track lab samples and results',
      count: labSamplesData?.count ?? 0,
      icon: FlaskConical,
      color: 'teal',
    },
    {
      id: 'treatment',
      name: 'Treatment',
      description: 'Record treatments and medications',
      count: treatmentsData?.count ?? 0,
      icon: Pill,
      color: 'red',
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { icon: string; text: string; bg: string }> = {
      blue: { icon: 'text-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
      green: { icon: 'text-green-600', text: 'text-green-600', bg: 'bg-green-50' },
      purple: { icon: 'text-purple-600', text: 'text-purple-600', bg: 'bg-purple-50' },
      orange: { icon: 'text-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
      teal: { icon: 'text-teal-600', text: 'text-teal-600', bg: 'bg-teal-50' },
      red: { icon: 'text-red-600', text: 'text-red-600', bg: 'bg-red-50' },
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Heart className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-2xl font-bold">Health Management</h1>
          <p className="text-muted-foreground">Create and manage all health entities</p>
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
                <p className="text-sm text-muted-foreground mb-3">{entity.description}</p>
                <Button
                  onClick={() => setCreateDialogOpen(entity.id as EntityType)}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create {entity.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Phase 4 Info Card */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-red-900">
            Phase 4: Health Domain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">
            This page provides quick access to all health forms for testing and data entry.
            Create sample types, vaccination types, journal entries, sampling events, lab samples, and treatments.
          </p>
        </CardContent>
      </Card>

      {/* Create Dialogs */}
      <Dialog open={createDialogOpen === 'sampleType'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Sample Type</DialogTitle>
            <DialogDescription>Form for creating a new sample type</DialogDescription>
          </DialogHeader>
          <SampleTypeForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'vaccinationType'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Vaccination Type</DialogTitle>
            <DialogDescription>Form for creating a new vaccination type</DialogDescription>
          </DialogHeader>
          <VaccinationTypeForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'journalEntry'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Journal Entry</DialogTitle>
            <DialogDescription>Form for creating a new journal entry</DialogDescription>
          </DialogHeader>
          <JournalEntryForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'samplingEvent'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Sampling Event</DialogTitle>
            <DialogDescription>Form for creating a new sampling event</DialogDescription>
          </DialogHeader>
          <HealthSamplingEventForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'labSample'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Lab Sample</DialogTitle>
            <DialogDescription>Form for creating a new lab sample</DialogDescription>
          </DialogHeader>
          <HealthLabSampleForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'treatment'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Treatment</DialogTitle>
            <DialogDescription>Form for creating a new treatment</DialogDescription>
          </DialogHeader>
          <TreatmentForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
