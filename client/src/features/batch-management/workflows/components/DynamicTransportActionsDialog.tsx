/**
 * Dynamic transport action builder for station-to-sea workflows.
 *
 * This dialog models each handoff leg explicitly:
 * - Station -> Vessel
 * - Station -> Truck
 * - Truck -> Vessel
 * - Vessel -> Ring
 */

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

import { ApiService } from '@/api/generated';
import type { BatchTransferWorkflowDetail } from '@/api/generated';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import { useCreateAction } from '../api';
import { formatBiomass, formatCount } from '../utils';

type RouteMode = 'DIRECT_TO_VESSEL' | 'VIA_TRUCKS';
type LegType =
  | 'STATION_TO_VESSEL'
  | 'STATION_TO_TRUCK'
  | 'TRUCK_TO_VESSEL'
  | 'VESSEL_TO_RING';

interface DynamicLegRow {
  id: string;
  legType: LegType;
  sourceAssignmentId?: number;
  destContainerId?: number;
  destAssignmentId?: number;
  transferredCount?: number;
  transferredBiomassKg?: string;
  sourcePopulationBefore?: number;
  transferAll?: boolean;
  allowMixed?: boolean;
}

interface DynamicTransportActionsDialogProps {
  workflow: BatchTransferWorkflowDetail;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ROUTE_LEGS: Record<RouteMode, LegType[]> = {
  DIRECT_TO_VESSEL: ['STATION_TO_VESSEL', 'VESSEL_TO_RING'],
  VIA_TRUCKS: ['STATION_TO_TRUCK', 'TRUCK_TO_VESSEL', 'VESSEL_TO_RING'],
};

const LEG_LABELS: Record<LegType, string> = {
  STATION_TO_VESSEL: 'Station Tank -> Vessel Tank',
  STATION_TO_TRUCK: 'Station Tank -> Truck Tank',
  TRUCK_TO_VESSEL: 'Truck Tank -> Vessel Tank',
  VESSEL_TO_RING: 'Vessel Tank -> Sea Ring',
};

function getContainerCategory(container: any): 'station' | 'truck' | 'vessel' | 'ring' | 'unknown' {
  if (container?.carrier_type === 'TRUCK') return 'truck';
  if (container?.carrier_type === 'VESSEL') return 'vessel';
  if (container?.area) return 'ring';
  if (container?.hall) return 'station';
  return 'unknown';
}

function getLegSourceCategory(legType: LegType) {
  if (legType === 'STATION_TO_TRUCK' || legType === 'STATION_TO_VESSEL') return 'station';
  if (legType === 'TRUCK_TO_VESSEL') return 'truck';
  return 'vessel';
}

function getLegDestCategory(legType: LegType) {
  if (legType === 'STATION_TO_TRUCK') return 'truck';
  if (legType === 'STATION_TO_VESSEL' || legType === 'TRUCK_TO_VESSEL') return 'vessel';
  return 'ring';
}

function createDefaultRow(routeMode: RouteMode): DynamicLegRow {
  return {
    id: crypto.randomUUID(),
    legType: ROUTE_LEGS[routeMode][0],
    allowMixed: false,
  };
}

export function DynamicTransportActionsDialog({
  workflow,
  open,
  onClose,
  onSuccess,
}: DynamicTransportActionsDialogProps) {
  const { toast } = useToast();
  const createAction = useCreateAction();
  const [routeMode, setRouteMode] = useState<RouteMode>('DIRECT_TO_VESSEL');
  const [rows, setRows] = useState<DynamicLegRow[]>([createDefaultRow('DIRECT_TO_VESSEL')]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setRows([createDefaultRow(routeMode)]);
      setErrors({});
    }
  }, [open, routeMode]);

  const { data: allBatchAssignments } = useQuery({
    queryKey: ['transport-dialog-all-assignments', workflow.batch],
    queryFn: async () => {
      const results: any[] = [];
      let page = 1;
      while (true) {
        const response = await ApiService.apiV1BatchContainerAssignmentsList(
          undefined,
          undefined,
          undefined,
          workflow.batch,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          page,
          undefined,
          undefined,
          undefined,
          undefined
        );
        results.push(...(response.results || []));
        if (!response.next) break;
        page += 1;
      }
      return results;
    },
    enabled: open,
  });

  const { data: sourceAssignments } = useQuery({
    queryKey: ['transport-dialog-active-assignments', workflow.batch],
    queryFn: async () => {
      const results: any[] = [];
      let page = 1;
      while (true) {
        const response = await ApiService.apiV1BatchContainerAssignmentsList(
          undefined,
          undefined,
          undefined,
          workflow.batch,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          true,
          undefined,
          undefined,
          page,
          undefined,
          undefined,
          undefined,
          undefined
        );
        results.push(...(response.results || []));
        if (!response.next) break;
        page += 1;
      }
      return results;
    },
    enabled: open,
  });

  const sourceContainerIds = useMemo(() => {
    return Array.from(
      new Set(
        (sourceAssignments || [])
          .map((assignment: any) => assignment.container?.id || assignment.container_info?.id)
          .filter(Boolean)
      )
    ) as number[];
  }, [sourceAssignments]);

  const { data: sourceContainerDetails } = useQuery({
    queryKey: ['transport-dialog-source-containers', sourceContainerIds],
    queryFn: async () => {
      const pairs = await Promise.all(
        sourceContainerIds.map(async (containerId) => [
          containerId,
          await ApiService.apiV1InfrastructureContainersRetrieve(containerId),
        ])
      );
      return new Map<number, any>(pairs as [number, any][]);
    },
    enabled: open && sourceContainerIds.length > 0,
  });

  const { data: destinationContainers } = useQuery({
    queryKey: ['transport-dialog-destination-containers'],
    queryFn: async () => {
      const results: any[] = [];
      let page = 1;
      while (true) {
        const response = await ApiService.apiV1InfrastructureContainersList(
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          page,
          undefined
        );
        results.push(...(response.results || []));
        if (!response.next) break;
        page += 1;
      }
      return results;
    },
    enabled: open,
  });

  const destinationById = useMemo(() => {
    return new Map<number, any>(
      (destinationContainers || []).map((container: any) => [container.id, container])
    );
  }, [destinationContainers]);

  const assignmentMetaById = useMemo(() => {
    const map = new Map<number, any>();
    (sourceAssignments || []).forEach((assignment: any) => {
      const containerId = assignment.container?.id || assignment.container_info?.id;
      const containerDetail = containerId
        ? sourceContainerDetails?.get(containerId) || destinationById.get(containerId)
        : undefined;
      map.set(assignment.id, {
        ...assignment,
        containerDetail,
        category: getContainerCategory(containerDetail),
      });
    });
    return map;
  }, [sourceAssignments, sourceContainerDetails, destinationById]);

  const allAssignmentsByContainer = useMemo(() => {
    const map = new Map<number, any[]>();
    (allBatchAssignments || []).forEach((assignment: any) => {
      const containerId = assignment.container?.id || assignment.container_info?.id;
      if (!containerId) return;
      const entries = map.get(containerId) || [];
      entries.push(assignment);
      map.set(containerId, entries);
    });
    map.forEach((entries) => {
      entries.sort((a, b) => (b.id || 0) - (a.id || 0));
    });
    return map;
  }, [allBatchAssignments]);

  const nextActionNumberBase = useMemo(() => {
    const workflowAny = workflow as any;
    const existingActions = Array.isArray(workflowAny.actions) ? workflowAny.actions : [];
    const maxFromActions = existingActions.reduce((max: number, action: any) => {
      const actionNumber = Number(action?.action_number);
      return Number.isFinite(actionNumber) ? Math.max(max, actionNumber) : max;
    }, 0);
    const totalPlanned = Number(workflowAny.total_actions_planned || 0);
    return Math.max(maxFromActions, totalPlanned) + 1;
  }, [workflow]);

  const updateRow = (id: string, patch: Partial<DynamicLegRow>) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, ...patch };

        if (
          patch.sourceAssignmentId !== undefined ||
          patch.transferredCount !== undefined ||
          patch.transferAll !== undefined
        ) {
          const source = updated.sourceAssignmentId
            ? assignmentMetaById.get(updated.sourceAssignmentId)
            : undefined;
          const population = source?.population_count || 0;
          const avgWeightG = parseFloat(source?.avg_weight_g || '0');
          const transferCount = updated.transferAll
            ? population
            : updated.transferredCount || 0;

          updated.sourcePopulationBefore = population;
          if (updated.transferAll) {
            updated.transferredCount = population;
          }
          if (transferCount > 0 && avgWeightG > 0) {
            updated.transferredBiomassKg = ((transferCount * avgWeightG) / 1000).toFixed(2);
          }
        }

        return updated;
      })
    );
  };

  const addRow = () => {
    setRows((currentRows) => [
      ...currentRows,
      {
        ...createDefaultRow(routeMode),
        legType: ROUTE_LEGS[routeMode][Math.min(currentRows.length, ROUTE_LEGS[routeMode].length - 1)],
      },
    ]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length === 1) {
      toast({
        title: 'Cannot Remove',
        description: 'At least one handoff is required.',
        variant: 'destructive',
      });
      return;
    }
    setRows((currentRows) => currentRows.filter((row) => row.id !== rowId));
  };

  const legOptions = ROUTE_LEGS[routeMode];

  useEffect(() => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (legOptions.includes(row.legType)) {
          return row;
        }
        return {
          ...row,
          legType: legOptions[0],
          sourceAssignmentId: undefined,
          destContainerId: undefined,
          destAssignmentId: undefined,
        };
      })
    );
  }, [routeMode]);

  const getSourceOptionsForLeg = (legType: LegType) => {
    const sourceCategory = getLegSourceCategory(legType);
    return Array.from(assignmentMetaById.values()).filter(
      (assignment: any) => assignment.category === sourceCategory
    );
  };

  const getDestinationOptionsForLeg = (legType: LegType) => {
    const destCategory = getLegDestCategory(legType);
    return (destinationContainers || []).filter(
      (container: any) => getContainerCategory(container) === destCategory
    );
  };

  const validateRows = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    rows.forEach((row) => {
      const source = row.sourceAssignmentId ? assignmentMetaById.get(row.sourceAssignmentId) : undefined;
      const dest = row.destContainerId ? destinationById.get(row.destContainerId) : undefined;

      if (!row.sourceAssignmentId) {
        newErrors[`${row.id}-source`] = 'Source assignment is required.';
        isValid = false;
      }
      if (!row.destContainerId) {
        newErrors[`${row.id}-dest`] = 'Destination container is required.';
        isValid = false;
      }
      if (!row.transferredCount || row.transferredCount <= 0) {
        newErrors[`${row.id}-count`] = 'Transfer count must be greater than zero.';
        isValid = false;
      }
      if (!row.transferredBiomassKg || parseFloat(row.transferredBiomassKg) <= 0) {
        newErrors[`${row.id}-biomass`] = 'Biomass must be greater than zero.';
        isValid = false;
      }

      if (source && source.population_count && row.transferredCount && row.transferredCount > source.population_count) {
        newErrors[`${row.id}-count`] = `Cannot exceed source population (${formatCount(source.population_count)}).`;
        isValid = false;
      }

      if (source) {
        const expectedSource = getLegSourceCategory(row.legType);
        if (source.category !== expectedSource) {
          newErrors[`${row.id}-source`] = `Source must be a ${expectedSource} container for this leg.`;
          isValid = false;
        }
      }

      if (dest) {
        const expectedDest = getLegDestCategory(row.legType);
        const actualDest = getContainerCategory(dest);
        if (actualDest !== expectedDest) {
          newErrors[`${row.id}-dest`] = `Destination must be a ${expectedDest} container for this leg.`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateRows()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the highlighted fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      for (const [index, row] of rows.entries()) {
        const actionNumber = nextActionNumberBase + index;
        let destAssignmentId = row.destAssignmentId;

        if (!destAssignmentId && row.destContainerId) {
          const existingForContainer = allAssignmentsByContainer.get(row.destContainerId) || [];
          const existingSameBatch = existingForContainer.find((assignment: any) => assignment.batch?.id === workflow.batch);
          if (existingSameBatch) {
            destAssignmentId = existingSameBatch.id;
          }
        }

        if (!destAssignmentId) {
          const destAssignment = await ApiService.apiV1BatchContainerAssignmentsCreate({
            batch_id: workflow.batch,
            container_id: row.destContainerId!,
            lifecycle_stage_id: workflow.dest_lifecycle_stage,
            assignment_date: new Date().toISOString().split('T')[0],
            population_count: 0,
            biomass_kg: '0.00',
            avg_weight_g: '0.00',
            is_active: false,
            notes: `Dynamic transport placeholder for ${workflow.workflow_number} action ${actionNumber}`,
          } as any);
          destAssignmentId = destAssignment.id;
        }

        await createAction.mutateAsync({
          workflow: workflow.id,
          action_number: actionNumber,
          source_assignment: row.sourceAssignmentId!,
          dest_assignment: destAssignmentId,
          source_population_before: row.sourcePopulationBefore!,
          transferred_count: row.transferredCount!,
          transferred_biomass_kg: row.transferredBiomassKg!,
          allow_mixed: !!row.allowMixed,
          status: 'PENDING',
          notes: `[${row.legType}]`,
        } as any);
      }

      toast({
        title: 'Handoffs Added',
        description: `Added ${rows.length} transport leg(s).`,
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      let message = 'Failed to add dynamic transport legs.';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.body) {
          message = JSON.stringify(apiError.body);
        } else if (apiError.message) {
          message = apiError.message;
        }
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const totalCount = rows.reduce((sum, row) => sum + (row.transferredCount || 0), 0);
  const totalBiomass = rows.reduce((sum, row) => sum + parseFloat(row.transferredBiomassKg || '0'), 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Dynamic Transport Handoffs</DialogTitle>
          <DialogDescription>
            Workflow: {workflow.workflow_number} • {workflow.batch_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Build route legs explicitly for station-to-sea transfers. Add legs as transport progresses.
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <Label className="text-sm font-medium">Route Pattern</Label>
            <Select
              value={routeMode}
              onValueChange={(value) => setRouteMode(value as RouteMode)}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DIRECT_TO_VESSEL">Direct: Station to Vessel to Ring</SelectItem>
                <SelectItem value="VIA_TRUCKS">Via Trucks: Station to Truck to Vessel to Ring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left text-sm font-medium">#</th>
                  <th className="p-2 text-left text-sm font-medium">Leg Type *</th>
                  <th className="p-2 text-left text-sm font-medium">Source *</th>
                  <th className="p-2 text-left text-sm font-medium">Destination *</th>
                  <th className="p-2 text-left text-sm font-medium">Count *</th>
                  <th className="p-2 text-left text-sm font-medium">Biomass (kg) *</th>
                  <th className="p-2 text-center text-sm font-medium w-12" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const sourceOptions = getSourceOptionsForLeg(row.legType);
                  const destinationOptions = getDestinationOptionsForLeg(row.legType);
                  return (
                    <tr key={row.id} className="border-t">
                      <td className="p-2 text-sm font-medium">{nextActionNumberBase + index}</td>
                      <td className="p-2">
                        <Select
                          value={row.legType}
                          onValueChange={(value) =>
                            updateRow(row.id, {
                              legType: value as LegType,
                              sourceAssignmentId: undefined,
                              destContainerId: undefined,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {legOptions.map((legType) => (
                              <SelectItem key={legType} value={legType}>
                                {LEG_LABELS[legType]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Select
                          value={row.sourceAssignmentId?.toString() || ''}
                          onValueChange={(value) =>
                            updateRow(row.id, { sourceAssignmentId: parseInt(value, 10) })
                          }
                        >
                          <SelectTrigger className={errors[`${row.id}-source`] ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select source assignment..." />
                          </SelectTrigger>
                          <SelectContent>
                            {sourceOptions.map((assignment: any) => {
                              const containerName =
                                assignment.containerDetail?.name ||
                                assignment.container_info?.name ||
                                `Assignment #${assignment.id}`;
                              return (
                                <SelectItem key={assignment.id} value={assignment.id.toString()}>
                                  {containerName} ({formatCount(assignment.population_count || 0)} fish)
                                </SelectItem>
                              );
                            })}
                            {sourceOptions.length === 0 && (
                              <SelectItem value="none" disabled>
                                No active source assignments for this leg type
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {errors[`${row.id}-source`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${row.id}-source`]}</p>
                        )}
                      </td>
                      <td className="p-2">
                        <Select
                          value={row.destContainerId?.toString() || ''}
                          onValueChange={(value) =>
                            updateRow(row.id, {
                              destContainerId: parseInt(value, 10),
                              destAssignmentId: undefined,
                            })
                          }
                        >
                          <SelectTrigger className={errors[`${row.id}-dest`] ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select destination..." />
                          </SelectTrigger>
                          <SelectContent>
                            {destinationOptions.map((container: any) => (
                              <SelectItem key={container.id} value={container.id.toString()}>
                                {container.name}
                                {container.carrier_name ? ` (${container.carrier_name})` : ''}
                              </SelectItem>
                            ))}
                            {destinationOptions.length === 0 && (
                              <SelectItem value="none" disabled>
                                No destination containers available for this leg type
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <div className="mt-2 flex items-center gap-2">
                          <Checkbox
                            id={`${row.id}-allow-mixed`}
                            checked={!!row.allowMixed}
                            onCheckedChange={(checked) =>
                              updateRow(row.id, { allowMixed: checked === true })
                            }
                          />
                          <Label htmlFor={`${row.id}-allow-mixed`} className="text-xs text-muted-foreground">
                            Allow mixed batch if destination is occupied
                          </Label>
                        </div>
                        {errors[`${row.id}-dest`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${row.id}-dest`]}</p>
                        )}
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={row.transferredCount || ''}
                          onChange={(event) =>
                            updateRow(row.id, {
                              transferredCount: parseInt(event.target.value || '0', 10) || 0,
                            })
                          }
                          disabled={row.transferAll}
                          className={errors[`${row.id}-count`] ? 'border-red-500' : ''}
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <Checkbox
                            id={`${row.id}-transfer-all`}
                            checked={!!row.transferAll}
                            onCheckedChange={(checked) =>
                              updateRow(row.id, { transferAll: checked === true })
                            }
                          />
                          <Label htmlFor={`${row.id}-transfer-all`} className="text-xs text-muted-foreground">
                            Transfer all from source
                          </Label>
                        </div>
                        {errors[`${row.id}-count`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${row.id}-count`]}</p>
                        )}
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.transferredBiomassKg || ''}
                          onChange={(event) =>
                            updateRow(row.id, { transferredBiomassKg: event.target.value })
                          }
                          className={errors[`${row.id}-biomass`] ? 'border-red-500' : ''}
                        />
                        {errors[`${row.id}-biomass`] && (
                          <p className="text-xs text-red-500 mt-1">{errors[`${row.id}-biomass`]}</p>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(row.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button variant="outline" onClick={addRow} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Handoff Leg
          </Button>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Legs:</span>{' '}
                <span className="font-medium">{rows.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Fish:</span>{' '}
                <span className="font-medium">{formatCount(totalCount)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Biomass:</span>{' '}
                <span className="font-medium">{formatBiomass(totalBiomass.toFixed(2))}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createAction.isPending}>
            {createAction.isPending ? 'Adding...' : `Add ${rows.length} Leg(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
