/**
 * Broodstock Management Page (Phase 7)
 * 
 * Provides interface for managing broodstock fish, movements, and breeding programs.
 * Task BR7.3: Broodstock Entities (Fish, Movement, Breeding)
 */

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Fish, ArrowRightLeft, Heart } from 'lucide-react';
import { useBroodstockFish, useFishMovements, useBreedingPlans } from '../api/api';

export function BroodstockManagementPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Broodstock Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage broodstock fish, movements, and breeding programs
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BroodstockContent />
      </Suspense>
    </div>
  );
}

function BroodstockContent() {
  const { data: fish, isLoading: fishLoading, error: fishError } = useBroodstockFish();
  const { data: movements, isLoading: movementsLoading, error: movementsError } = useFishMovements();
  const { data: breedingPlans, isLoading: plansLoading, error: plansError } = useBreedingPlans();

  if (fishLoading || movementsLoading || plansLoading) {
    return <div>Loading broodstock data...</div>;
  }

  const hasError = fishError || movementsError || plansError;
  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load broodstock data</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Broodstock Fish Card */}
      <Card>
        <CardHeader>
          <Fish className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Broodstock Fish ({fish?.count || 0})</CardTitle>
          <CardDescription>Individual fish tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Track individual broodstock fish with genetic lineage, health status, and biometric data.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            ✅ API: useCreateBroodstockFish<br />
            ✅ Validation: broodstockFishSchema<br />
            ✅ Backend audit: HistoricalRecords + HistoryReasonMixin<br />
            ✅ Fields: fish_id, species, sex, dates, genetic_line, status, health, biometrics<br />
            ✅ Status: active, retired, deceased, transferred<br />
            ✅ Health: healthy, sick, recovering, quarantine
          </div>
        </CardContent>
      </Card>

      {/* Fish Movements Card */}
      <Card>
        <CardHeader>
          <ArrowRightLeft className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Fish Movements ({movements?.count || 0})</CardTitle>
          <CardDescription>Transfer tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Record fish transfers between containers with full audit trail and reason documentation.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            ✅ API: useCreateFishMovement<br />
            ✅ Validation: fishMovementSchema<br />
            ✅ Backend audit: HistoricalRecords + HistoryReasonMixin<br />
            ✅ Fields: fish_id, movement_date, from/to containers, reason, performer<br />
            ✅ Invalidates: Both fish and movement queries
          </div>
        </CardContent>
      </Card>

      {/* Breeding Plans Card */}
      <Card>
        <CardHeader>
          <Heart className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Breeding Plans ({breedingPlans?.count || 0})</CardTitle>
          <CardDescription>Breeding program management</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Plan and track breeding programs with objectives, selection criteria, and offspring targets.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            ✅ API: useCreateBreedingPlan<br />
            ✅ Validation: breedingPlanSchema<br />
            ✅ Backend audit: HistoricalRecords + HistoryReasonMixin<br />
            ✅ Fields: name, dates, target_offspring, objectives, criteria, status<br />
            ✅ Status: draft, active, completed, cancelled<br />
            ✅ Integration: Links to fish, pairs, egg production
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BroodstockManagementPage;

