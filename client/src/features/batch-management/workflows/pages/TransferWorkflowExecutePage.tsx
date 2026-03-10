import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Play,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

import {
  useCancelWorkflow,
  useCompleteDynamicWorkflow,
  useCompleteTransferHandoff,
  usePlanWorkflow,
  useStartTransferHandoff,
  useWorkflow,
  useWorkflowExecutionContext,
} from '../api';
import { formatBiomass, formatCount, formatDate } from '../utils';

const LEG_LABELS: Record<string, string> = {
  STATION_TO_VESSEL: 'Station -> Vessel',
  STATION_TO_TRUCK: 'Station -> Truck',
  TRUCK_TO_VESSEL: 'Truck -> Vessel',
  VESSEL_TO_RING: 'Vessel -> Ring',
};

const LEG_SOURCE_CATEGORY: Record<string, string> = {
  STATION_TO_VESSEL: 'station',
  STATION_TO_TRUCK: 'station',
  TRUCK_TO_VESSEL: 'truck',
  VESSEL_TO_RING: 'vessel',
};

const LEG_DEST_CATEGORY: Record<string, string> = {
  STATION_TO_VESSEL: 'vessel',
  STATION_TO_TRUCK: 'truck',
  TRUCK_TO_VESSEL: 'vessel',
  VESSEL_TO_RING: 'ring',
};

type ManualReadingsForm = {
  oxygen: string;
  temperature: string;
  co2: string;
};

const EMPTY_MANUAL_READINGS: ManualReadingsForm = {
  oxygen: '',
  temperature: '',
  co2: '',
};

function formatLeg(legType: string) {
  return LEG_LABELS[legType] || legType;
}

export function TransferWorkflowExecutePage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { hasTransportExecutionAccess } = useUser();
  const { toast } = useToast();
  const workflowId = params.id ? Number(params.id) : undefined;

  const { data: workflow, isLoading: workflowLoading } = useWorkflow(workflowId);
  const { data: executionContext, isLoading: contextLoading } =
    useWorkflowExecutionContext(workflowId);

  const startHandoff = useStartTransferHandoff(workflowId);
  const completeHandoff = useCompleteTransferHandoff(workflowId);
  const completeWorkflow = useCompleteDynamicWorkflow();
  const cancelWorkflow = useCancelWorkflow();
  const planWorkflow = usePlanWorkflow();

  const [selectedLegType, setSelectedLegType] = useState<string>('');
  const [sourceAssignmentId, setSourceAssignmentId] = useState<string>('');
  const [destContainerId, setDestContainerId] = useState<string>('');
  const [plannedCount, setPlannedCount] = useState('');
  const [plannedBiomass, setPlannedBiomass] = useState('');
  const [transferMethod, setTransferMethod] = useState<string>('');
  const [allowMixed, setAllowMixed] = useState(false);
  const [startNotes, setStartNotes] = useState('');
  const [allowOverride, setAllowOverride] = useState(false);
  const [overrideNote, setOverrideNote] = useState('');
  const [sourceManualReadings, setSourceManualReadings] = useState<ManualReadingsForm>(
    EMPTY_MANUAL_READINGS
  );
  const [destManualReadings, setDestManualReadings] = useState<ManualReadingsForm>(
    EMPTY_MANUAL_READINGS
  );
  const [snapshotSummary, setSnapshotSummary] = useState<any>(null);

  const [selectedInProgressActionId, setSelectedInProgressActionId] = useState<string>('');
  const [actualCount, setActualCount] = useState('');
  const [actualBiomass, setActualBiomass] = useState('');
  const [mortality, setMortality] = useState('0');
  const [completeNotes, setCompleteNotes] = useState('');
  const [completionNote, setCompletionNote] = useState('');

  const isLoading = workflowLoading || contextLoading;
  const isReadOnly = !hasTransportExecutionAccess;
  const inProgressActions = executionContext?.in_progress_actions || [];
  const recentActions = executionContext?.recent_actions || [];
  const canStartTransfer = workflow?.status === 'PLANNED' || workflow?.status === 'IN_PROGRESS';

  useEffect(() => {
    if (!selectedLegType && executionContext?.allowed_leg_types?.length) {
      setSelectedLegType(executionContext.allowed_leg_types[0]);
    }
  }, [executionContext?.allowed_leg_types, selectedLegType]);

  useEffect(() => {
    if (!selectedInProgressActionId && inProgressActions.length > 0) {
      setSelectedInProgressActionId(String(inProgressActions[0].id));
    }
    if (inProgressActions.length === 0) {
      setSelectedInProgressActionId('');
    }
  }, [inProgressActions, selectedInProgressActionId]);

  const sourceOptions = useMemo(() => {
    if (!executionContext || !selectedLegType) return [];
    const category = LEG_SOURCE_CATEGORY[selectedLegType];
    return executionContext.sources?.[category] || [];
  }, [executionContext, selectedLegType]);

  const destOptions = useMemo(() => {
    if (!executionContext || !selectedLegType) return [];
    const category = LEG_DEST_CATEGORY[selectedLegType];
    return executionContext.destinations?.[category] || [];
  }, [executionContext, selectedLegType]);

  const selectedInProgressAction = inProgressActions.find(
    (action: any) => String(action.id) === selectedInProgressActionId
  );

  const buildManualReadingsPayload = (values: ManualReadingsForm) => {
    const payload: Record<string, string> = {};
    if (values.oxygen.trim() !== '') payload.oxygen = values.oxygen.trim();
    if (values.temperature.trim() !== '') payload.temperature = values.temperature.trim();
    if (values.co2.trim() !== '') payload.co2 = values.co2.trim();
    return Object.keys(payload).length > 0 ? payload : undefined;
  };

  const handleStartTransfer = async () => {
    if (!canStartTransfer) {
      toast({
        title: 'Workflow not approved',
        description: 'Approve the workflow first to enable transfer execution.',
        variant: 'destructive',
      });
      return;
    }
    if (!workflowId || !selectedLegType || !sourceAssignmentId || !destContainerId) {
      toast({
        title: 'Missing fields',
        description: 'Leg, source, and destination are required.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const result = await startHandoff.mutateAsync({
        leg_type: selectedLegType,
        source_assignment_id: Number(sourceAssignmentId),
        dest_container_id: Number(destContainerId),
        planned_transferred_count: Number(plannedCount),
        planned_transferred_biomass_kg: plannedBiomass,
        transfer_method: transferMethod || undefined,
        allow_mixed: allowMixed,
        notes: startNotes,
        allow_compliance_override: allowOverride,
        compliance_override_note: overrideNote,
        source_manual_readings: buildManualReadingsPayload(sourceManualReadings),
        dest_manual_readings: buildManualReadingsPayload(destManualReadings),
      });
      setSnapshotSummary(result.snapshot_summary);
      setSourceAssignmentId('');
      setDestContainerId('');
      setPlannedCount('');
      setPlannedBiomass('');
      setTransferMethod('');
      setAllowMixed(false);
      setStartNotes('');
      setAllowOverride(false);
      setOverrideNote('');
      setSourceManualReadings(EMPTY_MANUAL_READINGS);
      setDestManualReadings(EMPTY_MANUAL_READINGS);
      toast({
        title: 'Transfer started',
        description: `Action #${result.action?.action_number} is now IN_PROGRESS.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to start transfer',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteTransfer = async () => {
    if (!selectedInProgressAction) return;
    try {
      await completeHandoff.mutateAsync({
        actionId: selectedInProgressAction.id,
        payload: {
          transferred_count: Number(actualCount),
          transferred_biomass_kg: actualBiomass,
          mortality_during_transfer: Number(mortality || 0),
          notes: completeNotes,
        },
      });
      setActualCount('');
      setActualBiomass('');
      setMortality('0');
      setCompleteNotes('');
      toast({
        title: 'Transfer completed',
        description: `Action #${selectedInProgressAction.action_number} is completed.`,
      });
    } catch (error) {
      toast({
        title: 'Failed to complete transfer',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteWorkflow = async () => {
    if (!workflowId) return;
    try {
      await completeWorkflow.mutateAsync({
        id: workflowId,
        completion_note: completionNote,
      });
      toast({
        title: 'Workflow completed',
        description: 'Dynamic workflow explicitly marked as COMPLETED.',
      });
      navigate(`/transfer-workflows/${workflowId}`);
    } catch (error) {
      toast({
        title: 'Failed to complete workflow',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleApproveWorkflow = async () => {
    if (!workflowId) return;
    try {
      await planWorkflow.mutateAsync(workflowId);
      toast({
        title: 'Workflow approved',
        description: 'Workflow moved to PLANNED. You can now start transfers.',
      });
    } catch (error) {
      toast({
        title: 'Failed to approve workflow',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCancelWorkflow = async () => {
    if (!workflowId) return;
    try {
      await cancelWorkflow.mutateAsync({
        id: workflowId,
        reason: 'Cancelled from execution page',
      });
      toast({
        title: 'Workflow cancelled',
        description: 'Workflow has been cancelled.',
      });
      navigate('/transfer-workflows');
    } catch (error) {
      toast({
        title: 'Failed to cancel workflow',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workflow || !executionContext) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Workflow execution context is unavailable.</AlertDescription>
      </Alert>
    );
  }

  if (!workflow.is_dynamic_execution) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p>This execution page is available only for dynamic transfer workflows.</p>
          <Button onClick={() => navigate(`/transfer-workflows/${workflow.id}`)}>
            Back to Workflow
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/transfer-workflows/${workflow.id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" data-testid="execute-page-heading">
              {workflow.workflow_number} Execution
            </h1>
            <p className="text-muted-foreground">
              Route: {(workflow as any).dynamic_route_mode || 'N/A'} • Status: {workflow.status}
            </p>
          </div>
        </div>
        {isReadOnly ? (
          <Badge variant="outline">Read Only</Badge>
        ) : (
          <Badge variant="secondary">Transport Operator</Badge>
        )}
      </div>

      {isReadOnly && (
        <Alert>
          <AlertDescription>
            You can view progress and compliance records, but only transport roles can start or complete transfers.
          </AlertDescription>
        </Alert>
      )}

      {workflow.status === 'DRAFT' && (
        <Alert>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>
              Workflow is in DRAFT. Review metadata and approve before execution starts.
            </span>
            <Button
              size="sm"
              onClick={handleApproveWorkflow}
              disabled={isReadOnly || planWorkflow.isPending}
            >
              {planWorkflow.isPending ? 'Approving...' : 'Approve Workflow'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Workflow Metadata</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Batch</p>
            <p className="font-medium">{(workflow as any).batch_number || workflow.batch}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Source Stage</p>
            <p className="font-medium">{(workflow as any).source_stage_name || workflow.source_lifecycle_stage}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Destination Stage</p>
            <p className="font-medium">{(workflow as any).dest_stage_name || workflow.dest_lifecycle_stage || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Planned Start</p>
            <p className="font-medium">{formatDate((workflow as any).planned_start_date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Route Mode</p>
            <p className="font-medium">{(workflow as any).dynamic_route_mode || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Estimated Count</p>
            <p className="font-medium">{(workflow as any).estimated_total_count || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Estimated Biomass (kg)</p>
            <p className="font-medium">{(workflow as any).estimated_total_biomass_kg || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{workflow.status}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Executed Count</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCount(executionContext.progress.total_transferred_count || 0)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Executed Biomass</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatBiomass(executionContext.progress.total_biomass_kg || '0')}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {executionContext.progress.completion_percentage || '0'}%
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Run multiple trucks/handoffs by repeating this cycle: Start Transfer, then Complete Transfer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Leg Type</Label>
              <Select
                value={selectedLegType}
                onValueChange={setSelectedLegType}
                disabled={isReadOnly}
              >
                <SelectTrigger data-testid="start-leg-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {executionContext.allowed_leg_types.map((legType: string) => (
                    <SelectItem key={legType} value={legType}>
                      {formatLeg(legType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Source</Label>
              <Select
                value={sourceAssignmentId}
                onValueChange={setSourceAssignmentId}
                disabled={isReadOnly}
              >
                <SelectTrigger data-testid="start-source-assignment">
                  <SelectValue placeholder="Select source assignment" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((assignment: any) => (
                    <SelectItem key={assignment.id} value={String(assignment.id)}>
                      {assignment.container?.name} ({formatCount(assignment.population_count)} fish)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Destination</Label>
              <Select
                value={destContainerId}
                onValueChange={setDestContainerId}
                disabled={isReadOnly}
              >
                <SelectTrigger data-testid="start-dest-container">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destOptions.map((container: any) => (
                    <SelectItem key={container.id} value={String(container.id)}>
                      {container.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label>Planned Count</Label>
              <Input
                type="number"
                min="1"
                value={plannedCount}
                onChange={(event) => setPlannedCount(event.target.value)}
                disabled={isReadOnly}
                data-testid="start-planned-count"
              />
            </div>
            <div>
              <Label>Planned Biomass (kg)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={plannedBiomass}
                onChange={(event) => setPlannedBiomass(event.target.value)}
                disabled={isReadOnly}
                data-testid="start-planned-biomass"
              />
            </div>
            <div>
              <Label>Transfer Method</Label>
              <Select
                value={transferMethod}
                onValueChange={setTransferMethod}
                disabled={isReadOnly}
              >
                <SelectTrigger data-testid="start-transfer-method">
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NET">NET</SelectItem>
                  <SelectItem value="PUMP">PUMP</SelectItem>
                  <SelectItem value="GRAVITY">GRAVITY</SelectItem>
                  <SelectItem value="MANUAL">MANUAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 pb-2">
              <Checkbox
                id="allow-mixed"
                checked={allowMixed}
                onCheckedChange={(checked) => setAllowMixed(checked === true)}
                disabled={isReadOnly}
              />
              <Label htmlFor="allow-mixed">Allow Mixed</Label>
            </div>
          </div>

          <Textarea
            placeholder="Start notes"
            value={startNotes}
            onChange={(event) => setStartNotes(event.target.value)}
            disabled={isReadOnly}
            data-testid="start-notes"
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="allow-override"
                checked={allowOverride}
                onCheckedChange={(checked) => setAllowOverride(checked === true)}
                disabled={isReadOnly}
              />
              <Label htmlFor="allow-override">Use compliance override (privileged)</Label>
            </div>
            {allowOverride && (
              <Textarea
                placeholder="Compliance override note (required)"
                value={overrideNote}
                onChange={(event) => setOverrideNote(event.target.value)}
                disabled={isReadOnly}
                data-testid="start-override-note"
              />
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Manual environmental readings at start (source and destination). Use when AVEVA values are unavailable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border p-3 space-y-2">
                <p className="text-sm font-medium">Source readings</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>O2</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={sourceManualReadings.oxygen}
                      onChange={(event) =>
                        setSourceManualReadings((prev) => ({
                          ...prev,
                          oxygen: event.target.value,
                        }))
                      }
                      disabled={isReadOnly}
                      data-testid="start-source-oxygen"
                    />
                  </div>
                  <div>
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={sourceManualReadings.temperature}
                      onChange={(event) =>
                        setSourceManualReadings((prev) => ({
                          ...prev,
                          temperature: event.target.value,
                        }))
                      }
                      disabled={isReadOnly}
                      data-testid="start-source-temperature"
                    />
                  </div>
                  <div>
                    <Label>CO2</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={sourceManualReadings.co2}
                      onChange={(event) =>
                        setSourceManualReadings((prev) => ({
                          ...prev,
                          co2: event.target.value,
                        }))
                      }
                      disabled={isReadOnly}
                      data-testid="start-source-co2"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded border p-3 space-y-2">
                <p className="text-sm font-medium">Destination readings</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>O2</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={destManualReadings.oxygen}
                      onChange={(event) =>
                        setDestManualReadings((prev) => ({
                          ...prev,
                          oxygen: event.target.value,
                        }))
                      }
                      disabled={isReadOnly}
                      data-testid="start-dest-oxygen"
                    />
                  </div>
                  <div>
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={destManualReadings.temperature}
                      onChange={(event) =>
                        setDestManualReadings((prev) => ({
                          ...prev,
                          temperature: event.target.value,
                        }))
                      }
                      disabled={isReadOnly}
                      data-testid="start-dest-temperature"
                    />
                  </div>
                  <div>
                    <Label>CO2</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={destManualReadings.co2}
                      onChange={(event) =>
                        setDestManualReadings((prev) => ({
                          ...prev,
                          co2: event.target.value,
                        }))
                      }
                      disabled={isReadOnly}
                      data-testid="start-dest-co2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartTransfer}
            disabled={isReadOnly || startHandoff.isPending || !canStartTransfer}
            data-testid="start-transfer-button"
          >
            {startHandoff.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Transfer
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {snapshotSummary && (
        <Card data-testid="start-snapshot-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Start Snapshot Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Status: {snapshotSummary.status}</p>
            <p>Policy: {snapshotSummary.policy}</p>
            <p>Captured readings: {snapshotSummary.created_count}</p>
            <p>Manual readings used: {snapshotSummary.manual_input_count || 0}</p>
            <p>Missing value count: {snapshotSummary.missing_value_count}</p>
            {snapshotSummary.override_applied && (
              <p className="text-amber-700">Override note: {snapshotSummary.override_note}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Complete Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {inProgressActions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No IN_PROGRESS handoffs.</p>
          ) : (
            <>
              <Select
                value={selectedInProgressActionId}
                onValueChange={setSelectedInProgressActionId}
                disabled={isReadOnly}
              >
                <SelectTrigger data-testid="complete-action-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inProgressActions.map((action: any) => (
                    <SelectItem key={action.id} value={String(action.id)}>
                      #{action.action_number} {formatLeg(action.leg_type)} •{' '}
                      {action.source_container?.name} to {action.dest_container?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedInProgressAction && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Actual Count</Label>
                      <Input
                        type="number"
                        min="1"
                        value={actualCount}
                        onChange={(event) => setActualCount(event.target.value)}
                        disabled={isReadOnly}
                        data-testid="complete-actual-count"
                      />
                    </div>
                    <div>
                      <Label>Actual Biomass (kg)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={actualBiomass}
                        onChange={(event) => setActualBiomass(event.target.value)}
                        disabled={isReadOnly}
                        data-testid="complete-actual-biomass"
                      />
                    </div>
                    <div>
                      <Label>Mortality</Label>
                      <Input
                        type="number"
                        min="0"
                        value={mortality}
                        onChange={(event) => setMortality(event.target.value)}
                        disabled={isReadOnly}
                        data-testid="complete-mortality"
                      />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Completion notes"
                    value={completeNotes}
                    onChange={(event) => setCompleteNotes(event.target.value)}
                    disabled={isReadOnly}
                    data-testid="complete-notes"
                  />
                  <Button
                    onClick={handleCompleteTransfer}
                    disabled={isReadOnly || completeHandoff.isPending}
                    data-testid="complete-transfer-button"
                  >
                    {completeHandoff.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete Transfer
                      </>
                    )}
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Handoffs</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No handoffs yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActions.map((action: any) => (
                <div key={action.id} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      #{action.action_number} {formatLeg(action.leg_type)}
                    </div>
                    <Badge variant={action.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {action.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.source_container?.name} to {action.dest_container?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCount(action.transferred_count)} •{' '}
                    {formatBiomass(action.transferred_biomass_kg)} •{' '}
                    {action.executed_at ? formatDate(action.executed_at) : 'Not completed'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Completion note (optional)"
            value={completionNote}
            onChange={(event) => setCompletionNote(event.target.value)}
            disabled={isReadOnly}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleCompleteWorkflow}
              disabled={isReadOnly || completeWorkflow.isPending}
            >
              Complete Workflow
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelWorkflow}
              disabled={isReadOnly || cancelWorkflow.isPending}
            >
              Cancel Workflow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
