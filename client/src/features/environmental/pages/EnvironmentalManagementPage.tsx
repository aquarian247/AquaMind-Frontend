import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Gauge, Sun } from 'lucide-react'
import { useEnvironmentalParameters, usePhotoperiodData } from '../api'
import { EnvironmentalParameterForm } from '../components/EnvironmentalParameterForm'
import { PhotoperiodDataForm } from '../components/PhotoperiodDataForm'

type EntityType = 'parameter' | 'photoperiod' | null

/**
 * Environmental Management Page with Create Dialogs
 * 
 * Provides quick access to create all environmental entities via modal dialogs.
 * This is a testing/demo page to access all Phase 5 forms.
 */
export default function EnvironmentalManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null)

  // Load counts for display
  const { data: parametersData } = useEnvironmentalParameters()
  const { data: photoperiodData } = usePhotoperiodData()

  const handleSuccess = () => {
    setCreateDialogOpen(null)
  }

  const entities = [
    {
      id: 'parameter',
      name: 'Environmental Parameter',
      description: 'Define environmental monitoring parameters',
      count: parametersData?.count ?? 0,
      icon: Gauge,
      color: 'green',
    },
    {
      id: 'photoperiod',
      name: 'Photoperiod Data',
      description: 'Record photoperiod and light intensity data',
      count: photoperiodData?.count ?? 0,
      icon: Sun,
      color: 'yellow',
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { icon: string; text: string; bg: string }> = {
      green: { icon: 'text-green-600', text: 'text-green-600', bg: 'bg-green-50' },
      yellow: { icon: 'text-yellow-600', text: 'text-yellow-600', bg: 'bg-yellow-50' },
    }
    return colorMap[color] || colorMap.green
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Gauge className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold">Environmental Management</h1>
          <p className="text-muted-foreground">Create and manage environmental monitoring entities</p>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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

      {/* Phase 5 Info Card */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-green-900">
            Phase 5: Environmental Domain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700">
            This page provides quick access to all environmental forms for testing and data entry.
            Create environmental parameters and photoperiod data records.
          </p>
        </CardContent>
      </Card>

      {/* Create Dialogs */}
      <Dialog open={createDialogOpen === 'parameter'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Environmental Parameter</DialogTitle>
            <DialogDescription>Form for creating a new environmental parameter</DialogDescription>
          </DialogHeader>
          <EnvironmentalParameterForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'photoperiod'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Photoperiod Data</DialogTitle>
            <DialogDescription>Form for creating new photoperiod data</DialogDescription>
          </DialogHeader>
          <PhotoperiodDataForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
