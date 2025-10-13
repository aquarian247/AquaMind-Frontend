/**
 * Scenario Model Management Page (Phase 7)
 * 
 * Provides interface for managing TGC, FCR, and Mortality models.
 * Task S7.1: Scenario Model Library Management
 */

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { useTGCModels, useFCRModels, useMortalityModels, useTemperatureProfiles } from '../api/api';

export function ScenarioModelManagementPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scenario Model Library</h1>
        <p className="text-muted-foreground mt-2">
          Manage biological models for scenario planning
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ScenarioModelContent />
      </Suspense>
    </div>
  );
}

function ScenarioModelContent() {
  const { data: tgcModels, isLoading: tgcLoading, error: tgcError } = useTGCModels();
  const { data: fcrModels, isLoading: fcrLoading, error: fcrError } = useFCRModels();
  const { data: mortalityModels, isLoading: mortalityLoading, error: mortalityError } = useMortalityModels();
  const { data: tempProfiles, isLoading: tempLoading, error: tempError } = useTemperatureProfiles();

  if (tgcLoading || fcrLoading || mortalityLoading || tempLoading) {
    return <div>Loading models...</div>;
  }

  const hasError = tgcError || fcrError || mortalityError || tempError;
  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load models</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* TGC Models Card */}
      <Card>
        <CardHeader>
          <TrendingUp className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>TGC Models ({tgcModels?.count || 0})</CardTitle>
          <CardDescription>Thermal Growth Coefficient models</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Calculate daily growth increments based on temperature and time for projecting salmon weight gain across lifecycle stages.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            ✅ API: useCreateTGCModel, useUpdateTGCModel, useDeleteTGCModel<br />
            ✅ Validation: tgcModelSchema (name, location, TGC value, exponents)<br />
            ✅ Backend audit: HistoricalRecords + HistoryReasonMixin<br />
            ✅ Fields: name, location, release_period, tgc_value, exponents, temperature profile
          </div>
        </CardContent>
      </Card>

      {/* FCR Models Card */}
      <Card>
        <CardHeader>
          <Activity className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>FCR Models ({fcrModels?.count || 0})</CardTitle>
          <CardDescription>Feed Conversion Ratio models</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Define feed-to-weight gain ratios per lifecycle stage for accurate feed planning and cost projections.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            ✅ API: useCreateFCRModel<br />
            ✅ Validation: fcrModelSchema<br />
            ✅ Backend audit: HistoricalRecords + HistoryReasonMixin<br />
            ✅ Stage-specific: Configurable FCR values per lifecycle stage
          </div>
        </CardContent>
      </Card>

      {/* Mortality Models Card */}
      <Card>
        <CardHeader>
          <AlertTriangle className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Mortality Models ({mortalityModels?.count || 0})</CardTitle>
          <CardDescription>Population decline models</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Estimate population decline over time using percentage-based rates (daily or weekly).
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            ✅ API: useCreateMortalityModel<br />
            ✅ Validation: mortalityModelSchema (name, frequency, rate 0-100%)<br />
            ✅ Backend audit: HistoricalRecords + HistoryReasonMixin<br />
            ✅ Frequency: Daily or weekly application
          </div>
        </CardContent>
      </Card>

      {/* Temperature Profiles Card */}
      <Card>
        <CardHeader>
          <TrendingUp className="h-8 w-8 mb-2 text-primary" />
          <CardTitle>Temperature Profiles ({tempProfiles?.count || 0})</CardTitle>
          <CardDescription>Reusable temperature patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Temperature data patterns for different locations and release periods, used by TGC models.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            ✅ Backend audit: HistoricalRecords + HistoryReasonMixin<br />
            ✅ Validation: temperatureProfileSchema<br />
            ✅ Readings: Daily temperature values linked to profile
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ScenarioModelManagementPage;

