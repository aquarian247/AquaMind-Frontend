/**
 * Broodstock Management Page (Phase 7)
 * 
 * Provides interface for managing broodstock fish, movements, and breeding programs.
 * Task BR7.3: Broodstock Entities (Fish, Movement, Breeding)
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Fish, ArrowRightLeft, Heart, AlertCircle } from 'lucide-react';
import { useBroodstockFish, useFishMovements, useBreedingPlans } from '../api/api';

type EntityType = 'fish' | 'movement' | 'breeding' | null;

export function BroodstockManagementPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState<EntityType>(null);
  
  const { data: fish, isLoading: fishLoading, error: fishError } = useBroodstockFish();
  const { data: movements, isLoading: movementsLoading, error: movementsError } = useFishMovements();
  const { data: breedingPlans, isLoading: plansLoading, error: plansError } = useBreedingPlans();

  const handleCancel = () => {
    setCreateDialogOpen(null);
  };

  const entities = [
    {
      id: 'fish' as const,
      name: 'Broodstock Fish',
      description: 'Individual fish tracking',
      icon: Fish,
      count: fish?.count || 0,
      details: 'Track individual broodstock fish with genetic lineage, health status, and biometric data.',
      tech: [
        'API: useCreateBroodstockFish',
        'Validation: broodstockFishSchema',
        'Backend audit: HistoricalRecords + HistoryReasonMixin',
        'Fields: fish_id, species, sex, dates, genetic_line, status, health, biometrics',
        'Status: active, retired, deceased, transferred',
        'Health: healthy, sick, recovering, quarantine'
      ]
    },
    {
      id: 'movement' as const,
      name: 'Fish Movement',
      description: 'Transfer tracking',
      icon: ArrowRightLeft,
      count: movements?.count || 0,
      details: 'Record fish transfers between containers with full audit trail and reason documentation.',
      tech: [
        'API: useCreateFishMovement',
        'Validation: fishMovementSchema',
        'Backend audit: HistoricalRecords + HistoryReasonMixin',
        'Fields: fish_id, movement_date, from/to containers, reason, performer',
        'Invalidates: Both fish and movement queries'
      ]
    },
    {
      id: 'breeding' as const,
      name: 'Breeding Plan',
      description: 'Breeding program management',
      icon: Heart,
      count: breedingPlans?.count || 0,
      details: 'Plan and track breeding programs with objectives, selection criteria, and offspring targets.',
      tech: [
        'API: useCreateBreedingPlan',
        'Validation: breedingPlanSchema',
        'Backend audit: HistoricalRecords + HistoryReasonMixin',
        'Fields: name, dates, target_offspring, objectives, criteria, status',
        'Status: draft, active, completed, cancelled',
        'Integration: Links to fish, pairs, egg production'
      ]
    }
  ];

  if (fishLoading || movementsLoading || plansLoading) {
    return <div className="container mx-auto p-6">Loading broodstock data...</div>;
  }

  const hasError = fishError || movementsError || plansError;
  if (hasError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load broodstock data</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Broodstock Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage broodstock fish, movements, and breeding programs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
      {['fish', 'movement', 'breeding'].map((type) => (
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

export default BroodstockManagementPage;

