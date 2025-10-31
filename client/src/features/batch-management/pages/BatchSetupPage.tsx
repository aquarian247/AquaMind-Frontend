import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Fish, TrendingUp, ArrowRightLeft, LineChart, Skull } from 'lucide-react'
import { useBatches, useLifecycleStages, useGrowthSamples, useMortalityEvents } from '../api'
import { BatchForm } from '../components/BatchForm'
import { BatchCreationForm } from '../components/BatchCreationForm'
import { LifecycleStageForm } from '../components/LifecycleStageForm'
import { MortalityEventForm } from '../components/MortalityEventForm'

type EntityType = 'batch' | 'lifecycleStage' | 'mortalityEvent' | null

/**
 * Batch Setup Page with Create Dialogs
 * 
 * Provides quick access to create Batches and LifeCycleStages via modal dialogs.
 * Similar to InfrastructureManagementPage but for batch domain entities.
 * 
 * Features:
 * - Create new batches with full form
 * - Create new lifecycle stages with species selection
 * - Display current counts
 * - Modal dialogs for forms
 */
export default function BatchSetupPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null)

  // Load counts for display
  const { data: batchesData } = useBatches()
  const { data: stagesData } = useLifecycleStages()
  const { data: mortalityEventsData } = useMortalityEvents()

  const handleSuccess = () => {
    setCreateDialogOpen(null)
  }

  const handleCancel = () => {
    setCreateDialogOpen(null)
  }

  const entities = [
    {
      id: 'batch' as const,
      name: 'Batch',
      description: 'Fish batch with lifecycle tracking and container assignments',
      icon: Fish,
      count: batchesData?.results?.length || 0,
      color: 'blue'
    },
    {
      id: 'lifecycleStage' as const,
      name: 'Lifecycle Stage',
      description: 'Batch lifecycle stage definition',
      icon: TrendingUp,
      count: stagesData?.results?.length || 0,
      color: 'green'
    },
    {
      id: 'mortalityEvent' as const,
      name: 'Mortality Event',
      description: 'Record mortality occurrences',
      icon: Skull,
      count: mortalityEventsData?.results?.length || 0,
      color: 'red'
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; text: string; bg: string }> = {
      blue: { icon: 'text-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
      green: { icon: 'text-green-600', text: 'text-green-600', bg: 'bg-green-50' },
      purple: { icon: 'text-purple-600', text: 'text-purple-600', bg: 'bg-purple-50' },
      orange: { icon: 'text-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
      teal: { icon: 'text-teal-600', text: 'text-teal-600', bg: 'bg-teal-50' },
      red: { icon: 'text-red-600', text: 'text-red-600', bg: 'bg-red-50' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Fish className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Batch Setup</h1>
          <p className="text-muted-foreground">Create and manage batches and lifecycle stages</p>
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

      {/* Batch Create Dialog - NEW: Uses BatchCreationForm with inline assignments */}
      <Dialog open={createDialogOpen === 'batch'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Batch with Container Assignments</DialogTitle>
            <DialogDescription>Create a new Egg & Alevin batch and assign it to containers in one step</DialogDescription>
          </DialogHeader>
          <BatchCreationForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Lifecycle Stage Create Dialog */}
      <Dialog open={createDialogOpen === 'lifecycleStage'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Lifecycle Stage</DialogTitle>
            <DialogDescription>Define a new lifecycle stage for tracking batch progression</DialogDescription>
          </DialogHeader>
          <LifecycleStageForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Mortality Event Create Dialog */}
      <Dialog open={createDialogOpen === 'mortalityEvent'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Record Mortality Event</DialogTitle>
            <DialogDescription>Record fish mortalities for batch tracking</DialogDescription>
          </DialogHeader>
          <MortalityEventForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Info Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Batch Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Batches</h3>
            <p className="text-sm text-muted-foreground">
              Batches represent groups of fish tracked throughout their lifecycle. When creating a batch:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 mt-1">
              <li>Unique batch number for identification</li>
              <li>Always starts at Egg & Alevin lifecycle stage</li>
              <li>Assign to one or more Egg & Alevin trays immediately</li>
              <li>Real-time population and biomass totals</li>
              <li>Atomic creation - all assignments succeed or none</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Lifecycle Stages</h3>
            <p className="text-sm text-muted-foreground">
              Lifecycle stages define the progression phases for a species. Each stage includes:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 mt-1">
              <li>Species-specific stage definitions</li>
              <li>Sequential ordering (Egg&Alevin → Fry → Parr → Smolt → Post-Smolt → Adult)</li>
              <li>Expected weight and length ranges</li>
              <li>Used for batch tracking and reporting</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Growth Samples & Mortality</h3>
            <p className="text-sm text-muted-foreground">
              Track batch health and development:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-2 mt-1">
              <li>Growth samples: Record weight and length measurements</li>
              <li>Mortality events: Track fish losses and causes</li>
              <li>Linked to specific containers and batches</li>
              <li>Used for performance analysis and FCR calculations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
