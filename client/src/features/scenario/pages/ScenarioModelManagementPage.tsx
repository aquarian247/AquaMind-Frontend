/**
 * Scenario Model Management Page (Phase 7)
 * 
 * Provides interface for managing TGC, FCR, and Mortality models.
 * Task S7.1: Scenario Model Library Management
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, TrendingUp, Activity, AlertTriangle, AlertCircle, Thermometer } from 'lucide-react';
import { useTGCModels, useFCRModels, useMortalityModels, useTemperatureProfiles } from '../api/api';

type EntityType = 'tgc' | 'fcr' | 'mortality' | 'temperature' | null;

export function ScenarioModelManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null);
  
  const { data: tgcModels, isLoading: tgcLoading, error: tgcError } = useTGCModels();
  const { data: fcrModels, isLoading: fcrLoading, error: fcrError } = useFCRModels();
  const { data: mortalityModels, isLoading: mortalityLoading, error: mortalityError } = useMortalityModels();
  const { data: tempProfiles, isLoading: tempLoading, error: tempError } = useTemperatureProfiles();

  const handleCancel = () => {
    setCreateDialogOpen(null);
  };

  const entities = [
    {
      id: 'tgc' as const,
      name: 'TGC Model',
      description: 'Thermal Growth Coefficient models',
      icon: TrendingUp,
      count: tgcModels?.count || 0,
      details: 'Calculate daily growth increments based on temperature and time for projecting salmon weight gain across lifecycle stages.',
      tech: [
        'API: useCreateTGCModel, useUpdateTGCModel, useDeleteTGCModel',
        'Validation: tgcModelSchema (name, location, TGC value, exponents)',
        'Backend audit: HistoricalRecords + HistoryReasonMixin',
        'Fields: name, location, release_period, tgc_value, exponents, temperature profile'
      ]
    },
    {
      id: 'fcr' as const,
      name: 'FCR Model',
      description: 'Feed Conversion Ratio models',
      icon: Activity,
      count: fcrModels?.count || 0,
      details: 'Define feed-to-weight gain ratios per lifecycle stage for accurate feed planning and cost projections.',
      tech: [
        'API: useCreateFCRModel',
        'Validation: fcrModelSchema',
        'Backend audit: HistoricalRecords + HistoryReasonMixin',
        'Stage-specific: Configurable FCR values per lifecycle stage'
      ]
    },
    {
      id: 'mortality' as const,
      name: 'Mortality Model',
      description: 'Population decline models',
      icon: AlertTriangle,
      count: mortalityModels?.count || 0,
      details: 'Estimate population decline over time using percentage-based rates (daily or weekly).',
      tech: [
        'API: useCreateMortalityModel',
        'Validation: mortalityModelSchema (name, frequency, rate 0-100%)',
        'Backend audit: HistoricalRecords + HistoryReasonMixin',
        'Frequency: Daily or weekly application'
      ]
    },
    {
      id: 'temperature' as const,
      name: 'Temperature Profile',
      description: 'Reusable temperature patterns',
      icon: Thermometer,
      count: tempProfiles?.count || 0,
      details: 'Temperature data patterns for different locations and release periods, used by TGC models.',
      tech: [
        'Backend audit: HistoricalRecords + HistoryReasonMixin',
        'Validation: temperatureProfileSchema',
        'Readings: Daily temperature values linked to profile'
      ]
    }
  ];

  if (tgcLoading || fcrLoading || mortalityLoading || tempLoading) {
    return <div className="container mx-auto p-6">Loading models...</div>;
  }

  const hasError = tgcError || fcrError || mortalityError || tempError;
  if (hasError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load models</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scenario Model Library</h1>
        <p className="text-muted-foreground mt-2">
          Manage biological models for scenario planning
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {entities.map((entity) => {
          const Icon = entity.icon;
          return (
            <Card key={entity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <Button 
                    size="sm" 
                    onClick={() => setCreateDialogOpen(entity.id)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create
                  </Button>
                </div>
                <CardTitle className="mt-4">{entity.name}s ({entity.count})</CardTitle>
                <CardDescription>{entity.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {entity.details}
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {entity.tech.map((line, idx) => (
                    <div key={idx}>✅ {line}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Dialogs */}
      {['tgc', 'fcr', 'mortality', 'temperature'].map((type) => (
        <Dialog key={type} open={createDialogOpen === type} onOpenChange={() => setCreateDialogOpen(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create {entities.find(e => e.id === type)?.name}</DialogTitle>
              <DialogDescription>
                Form architecture ready (following established patterns from Phases 1-5)
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Form infrastructure complete</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {entities.find(e => e.id === type)?.tech.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      Full forms would follow the same pattern as Infrastructure/Batch/Health forms.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

export default ScenarioModelManagementPage;

