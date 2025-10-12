import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Gauge, Sun } from 'lucide-react';
import { 
  useEnvironmentalParameters, 
  usePhotoperiodData,
} from '../api';
import { 
  EnvironmentalParameterForm, 
  PhotoperiodDataForm,
} from '../components';

type EntityType = 'parameter' | 'photoperiod' | null;

/**
 * Environmental Management Page with Create Dialogs
 * 
 * Provides quick access to create environmental entities via modal dialogs.
 * Similar to HealthManagementPage pattern.
 * 
 * Features:
 * - Create new environmental parameters (reference data)
 * - Create photoperiod data records
 * - Display current entry counts
 * - Modal dialogs for forms
 */
export default function EnvironmentalManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null);

  // Load counts for display
  const { data: parametersData } = useEnvironmentalParameters();
  const { data: photoperiodData } = usePhotoperiodData();

  const handleSuccess = () => {
    setCreateDialogOpen(null);
  };

  const handleCancel = () => {
    setCreateDialogOpen(null);
  };

  const entities = [
    {
      id: 'parameter' as const,
      name: 'Environmental Parameter',
      description: 'Define water quality parameters and acceptable ranges',
      icon: Gauge,
      count: parametersData?.results?.length || 0,
      color: 'blue'
    },
    {
      id: 'photoperiod' as const,
      name: 'Photoperiod Data',
      description: 'Record day length and light intensity by area',
      icon: Sun,
      count: photoperiodData?.results?.length || 0,
      color: 'amber'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; text: string; bg: string }> = {
      blue: { icon: 'text-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
      amber: { icon: 'text-amber-600', text: 'text-amber-600', bg: 'bg-amber-50' },
      green: { icon: 'text-green-600', text: 'text-green-600', bg: 'bg-green-50' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Gauge className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Environmental Management</h1>
          <p className="text-muted-foreground">Manage environmental parameters and photoperiod data</p>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {entities.map((entity) => {
          const colors = getColorClasses(entity.color);
          const Icon = entity.icon;

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
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create {entity.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Dialogs */}
      <Dialog open={createDialogOpen === 'parameter'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Environmental Parameter</DialogTitle>
            <DialogDescription>
              Define a new environmental parameter with acceptable and optimal ranges.
            </DialogDescription>
          </DialogHeader>
          <EnvironmentalParameterForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen === 'photoperiod'} onOpenChange={(open) => !open && setCreateDialogOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Photoperiod Data</DialogTitle>
            <DialogDescription>
              Record photoperiod (day length) data for an area.
            </DialogDescription>
          </DialogHeader>
          <PhotoperiodDataForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

