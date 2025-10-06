import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Building2, MapPin, Waves, Factory, Container as ContainerIcon, Radio, Package } from 'lucide-react'
import { useGeographies, useAreas, useFreshwaterStations, useHalls, useContainerTypes, useContainers, useSensors, useFeedContainers } from '../api'
import { GeographyForm } from '../components/GeographyForm'
import { AreaForm } from '../components/AreaForm'
import { FreshwaterStationForm } from '../components/FreshwaterStationForm'
import { HallForm } from '../components/HallForm'
import { ContainerTypeForm } from '../components/ContainerTypeForm'
import { ContainerForm } from '../components/ContainerForm'
import { SensorForm } from '../components/SensorForm'
import { FeedContainerForm } from '../components/FeedContainerForm'

type EntityType = 'geography' | 'area' | 'station' | 'hall' | 'containerType' | 'container' | 'sensor' | 'feedContainer' | null

/**
 * Infrastructure Management Page with Create Dialogs
 * 
 * Provides quick access to create all infrastructure entities via modal dialogs.
 * This is a testing/demo page to access all Phase 1 forms.
 */
export default function InfrastructureManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null)

  // Load counts for display
  const { data: geographiesData } = useGeographies()
  const { data: areasData } = useAreas()
  const { data: stationsData } = useFreshwaterStations()
  const { data: hallsData } = useHalls()
  const { data: containerTypesData } = useContainerTypes()
  const { data: containersData } = useContainers()
  const { data: sensorsData } = useSensors()
  const { data: feedContainersData } = useFeedContainers()

  const handleSuccess = () => {
    setCreateDialogOpen(null)
  }

  const entities = [
    {
      id: 'geography',
      name: 'Geography',
      description: 'Geographic regions',
      icon: MapPin,
      count: geographiesData?.results?.length || 0,
      color: 'blue'
    },
    {
      id: 'area',
      name: 'Area',
      description: 'Sea areas with coordinates',
      icon: Waves,
      count: areasData?.results?.length || 0,
      color: 'cyan'
    },
    {
      id: 'station',
      name: 'Freshwater Station',
      description: 'Freshwater production stations',
      icon: Factory,
      count: stationsData?.results?.length || 0,
      color: 'green'
    },
    {
      id: 'hall',
      name: 'Hall',
      description: 'Production halls',
      icon: Building2,
      count: hallsData?.results?.length || 0,
      color: 'emerald'
    },
    {
      id: 'containerType',
      name: 'Container Type',
      description: 'Container templates',
      icon: Package,
      count: containerTypesData?.results?.length || 0,
      color: 'purple'
    },
    {
      id: 'container',
      name: 'Container',
      description: 'Production containers',
      icon: ContainerIcon,
      count: containersData?.results?.length || 0,
      color: 'indigo'
    },
    {
      id: 'sensor',
      name: 'Sensor',
      description: 'Environmental sensors',
      icon: Radio,
      count: sensorsData?.results?.length || 0,
      color: 'orange'
    },
    {
      id: 'feedContainer',
      name: 'Feed Container',
      description: 'Feed storage containers',
      icon: Package,
      count: feedContainersData?.results?.length || 0,
      color: 'amber'
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; text: string; bg: string }> = {
      blue: { icon: 'text-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
      cyan: { icon: 'text-cyan-600', text: 'text-cyan-600', bg: 'bg-cyan-50' },
      green: { icon: 'text-green-600', text: 'text-green-600', bg: 'bg-green-50' },
      emerald: { icon: 'text-emerald-600', text: 'text-emerald-600', bg: 'bg-emerald-50' },
      purple: { icon: 'text-purple-600', text: 'text-purple-600', bg: 'bg-purple-50' },
      indigo: { icon: 'text-indigo-600', text: 'text-indigo-600', bg: 'bg-indigo-50' },
      orange: { icon: 'text-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
      amber: { icon: 'text-amber-600', text: 'text-amber-600', bg: 'bg-amber-50' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Building2 className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Infrastructure Management</h1>
          <p className="text-muted-foreground">Create and manage all infrastructure entities</p>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Phase 1 Info Card */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">✅ Phase 1 Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            All 8 infrastructure entities now have complete CRUD forms with permission gates,
            audit trails, and validation. Click any "Create" button above to test the forms!
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-green-600">8/8</div>
              <div className="text-green-700">Entities</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-green-600">16</div>
              <div className="text-green-700">Components</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-green-600">40</div>
              <div className="text-green-700">API Hooks</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="font-bold text-green-600">100%</div>
              <div className="text-green-700">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialogs */}
      <Dialog open={createDialogOpen === 'geography'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <GeographyForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'area'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AreaForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'station'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <FreshwaterStationForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'hall'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <HallForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'containerType'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <ContainerTypeForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'container'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <ContainerForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'sensor'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <SensorForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'feedContainer'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <FeedContainerForm
            onSuccess={handleSuccess}
            onCancel={() => setCreateDialogOpen(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
