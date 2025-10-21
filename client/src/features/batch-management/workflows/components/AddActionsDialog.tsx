/**
 * Add Actions Dialog - Multi-row form for populating DRAFT workflows with container pairs.
 * 
 * Features:
 * - Dynamic row addition/removal
 * - Source/dest container selection
 * - Auto-calculate biomass from count × avg_weight
 * - Validate transfer count ≤ source population
 * - Bulk create all actions
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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

import { ApiService } from '@/api/generated';
import type { BatchTransferWorkflowDetail } from '@/api/generated';
import { useCreateAction } from '../api';
import { formatCount, formatBiomass } from '../utils';

// ============================================================================
// Types
// ============================================================================

interface ActionRow {
  id: string;
  sourceAssignmentId?: number;
  destContainerId?: number; // Changed from destAssignmentId - we select container, not assignment
  transferredCount?: number;
  transferredBiomassKg?: string;
  sourcePopulationBefore?: number;
}

interface AddActionsDialogProps {
  workflow: BatchTransferWorkflowDetail;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function AddActionsDialog({
  workflow,
  open,
  onClose,
  onSuccess,
}: AddActionsDialogProps) {
  const [rows, setRows] = useState<ActionRow[]>([
    { id: crypto.randomUUID() },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [destContainerCategory, setDestContainerCategory] = useState<'TANK' | 'PEN' | 'TRAY' | 'OTHER' | undefined>();
  const { toast } = useToast();
  const createAction = useCreateAction();

  // Fetch batch details to get geography
  const { data: batchData } = useQuery({
    queryKey: ['batch', workflow.batch],
    queryFn: async () => {
      console.log('[AddActions] Fetching batch details for batch ID:', workflow.batch);
      const result = await ApiService.apiV1BatchBatchesRetrieve(workflow.batch);
      console.log('[AddActions] Batch data received:', result);
      console.log('[AddActions] ALL BATCH FIELDS:', Object.keys(result || {}));
      console.log('[AddActions] Batch geography:', (result as any)?.geography, (result as any)?.geography_name);
      
      // Check for alternative geography field names
      console.log('[AddActions] Checking alternative fields:');
      console.log('  - geography:', (result as any)?.geography);
      console.log('  - geography_id:', (result as any)?.geography_id);
      console.log('  - current_geography:', (result as any)?.current_geography);
      console.log('  - current_geography_id:', (result as any)?.current_geography_id);
      
      return result;
    },
    enabled: open,
  });

  // Fetch source containers AND assignments
  // Strategy: Use batch.active_containers to get container IDs, then fetch assignments by container
  const { data: sourceAssignmentsData } = useQuery({
    queryKey: ['source-assignments', batchData?.active_containers, workflow.batch],
    queryFn: async () => {
      if (!batchData?.active_containers || batchData.active_containers.length === 0) {
        console.log('[AddActions] No active containers on batch');
        console.log('[AddActions] Batch data:', batchData);
        return [];
      }
      
      console.log('[AddActions] Batch has active_containers:', batchData.active_containers);
      
      // Simplified approach: Fetch ALL assignments for this batch, filter client-side
      // Parameter positions:
      // 1-3: dates, 4: batch, 5: batchIn, 6: batchNumber, 7-8: biomass, 
      // 9: container, 10: containerIn, 11: containerName, 12: containerType,
      // 13: isActive, 14: lifecycleStage, 15: ordering, 16: page, 17-18: population, 19: search, 20: species
      const result = await ApiService.apiV1BatchContainerAssignmentsList(
        undefined, // 1: assignmentDate
        undefined, // 2: assignmentDateAfter
        undefined, // 3: assignmentDateBefore
        workflow.batch, // 4: batch ✅
        undefined, // 5: batchIn
        undefined, // 6: batchNumber
        undefined, // 7: biomassMax
        undefined, // 8: biomassMin
        undefined, // 9: container
        undefined, // 10: containerIn
        undefined, // 11: containerName
        undefined, // 12: containerType
        undefined, // 13: isActive
        undefined, // 14: lifecycleStage
        undefined, // 15: ordering
        1, // 16: page ✅
        undefined, // 17: populationMax
        undefined, // 18: populationMin
        undefined, // 19: search
        undefined, // 20: species
      );
      
      console.log('[AddActions] All assignments for batch:', result);
      console.log('[AddActions] Container IDs in result:', 
        result.results?.map((a: any) => a.container?.id || a.container_info?.id)
      );
      
      console.log('[AddActions] Assignments by containerIn:', result);
      console.log('[AddActions] Found', result.count, 'assignments');
      
      // DEBUG: Log what we're filtering
      if (result.results && result.results.length > 0) {
        const first = result.results[0];
        console.log('[AddActions] First assignment before filter:', first);
        console.log('[AddActions] Checking filter values:');
        console.log('  - first.is_active:', first.is_active, 'Type:', typeof first.is_active);
        console.log('  - first.batch (nested):', first.batch);
        console.log('  - first.batch.id:', first.batch?.id, 'Type:', typeof first.batch?.id);
        console.log('  - workflow.batch:', workflow.batch, 'Type:', typeof workflow.batch);
        console.log('  - Match?:', first.batch?.id === workflow.batch);
      }
      
      // Filter for assignments that match batch.active_containers
      const activeContainerIds = new Set(batchData.active_containers);
      
      const filtered = (result.results || []).filter((a: any) => {
        const containerId = a.container?.id || a.container_info?.id;
        const isInActiveContainers = activeContainerIds.has(containerId);
        
        console.log(`[AddActions] Assignment ${a.id}: container=${containerId}, in_active_containers=${isInActiveContainers}, is_active=${a.is_active}`);
        
        return isInActiveContainers; // Only assignments in batch.active_containers
      });
      
      console.log('[AddActions] After filtering:', filtered.length, 'assignments');
      
      if (filtered.length > 0) {
        console.log('[AddActions] First assignment full structure:', JSON.stringify(filtered[0], null, 2));
      } else if (result.results.length > 0) {
        console.log('[AddActions] All assignments filtered out! Here is the first one we rejected:');
        console.log(JSON.stringify(result.results[0], null, 2));
      }
      
      // We already have container info in the assignment response!
      // No need to fetch containers separately
      console.log('[AddActions] Using container_info from assignments (no separate fetch needed)');
      
      // Enrich assignments with days occupied
      const enriched = filtered.map((assignment: any) => {
        const assignmentDate = new Date(assignment.assignment_date);
        const today = new Date();
        const daysOccupied = Math.floor((today.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          ...assignment,
          days_occupied: daysOccupied,
        };
      });
      
      console.log('[AddActions] Enriched assignments:', enriched);
      if (enriched.length > 0) {
        console.log('[AddActions] First enriched assignment container_info:', enriched[0].container_info);
      }
      
      return enriched;
    },
    enabled: open && !!batchData && !!batchData.active_containers && batchData.active_containers.length > 0,
  });

  const sourceAssignments = sourceAssignmentsData || [];

  // Container categories for filter
  const containerCategories = [
    { value: 'TANK', label: 'Tanks (Freshwater)' },
    { value: 'PEN', label: 'Pens/Rings (Sea)' },
    { value: 'TRAY', label: 'Trays (Incubation)' },
    { value: 'OTHER', label: 'Other' },
  ] as const;

  // Fetch ONE full container to get geography chain
  const firstContainerId = sourceAssignments && sourceAssignments.length > 0
    ? (sourceAssignments[0] as any).container?.id || (sourceAssignments[0] as any).container_info?.id
    : undefined;

  const { data: firstContainerFull } = useQuery({
    queryKey: ['container-full', firstContainerId],
    queryFn: async () => {
      console.log('[AddActions] Fetching full container details for ID:', firstContainerId);
      const container = await ApiService.apiV1InfrastructureContainersRetrieve(firstContainerId!);
      console.log('[AddActions] Full container received:', container);
      console.log('[AddActions] Container has hall:', (container as any).hall);
      return container;
    },
    enabled: open && !!firstContainerId,
  });

  // Fetch the hall to get station ID
  const hallId = firstContainerFull ? (firstContainerFull as any).hall : undefined;
  
  const { data: hallData } = useQuery({
    queryKey: ['hall', hallId],
    queryFn: async () => {
      console.log('[AddActions] Fetching hall details for ID:', hallId);
      const hall = await ApiService.apiV1InfrastructureHallsRetrieve(hallId!);
      console.log('[AddActions] Hall received:', hall);
      console.log('[AddActions] Hall has freshwater_station:', (hall as any).freshwater_station);
      return hall;
    },
    enabled: open && !!hallId,
  });

  // Fetch the station to get geography
  const stationId = hallData ? (hallData as any).freshwater_station : undefined;
  
  const { data: stationData } = useQuery({
    queryKey: ['station', stationId],
    queryFn: async () => {
      console.log('[AddActions] Fetching station details for ID:', stationId);
      const station = await ApiService.apiV1InfrastructureFreshwaterStationsRetrieve(stationId!);
      console.log('[AddActions] Station received:', station);
      console.log('[AddActions] Station structure:', JSON.stringify(station, null, 2));
      return station;
    },
    enabled: open && !!stationId,
  });

  // Extract geography from station
  const geographyId = stationData
    ? (stationData as any).geography_id 
      || (stationData as any).geography
    : undefined;

  console.log('[AddActions] Geography derived from station:', geographyId);
  console.log('[AddActions] Source assignments count:', sourceAssignments?.length || 0);
  
  // Fetch destination containers (filtered by geography + optional category)
  const { data: destContainersRaw } = useQuery({
    queryKey: ['containers', 'geography', geographyId, 'category', destContainerCategory],
    queryFn: async () => {
      if (!geographyId) {
        console.log('[AddActions] Skipping dest containers - no geography available');
        return [];
      }
      
      console.log('[AddActions] Fetching destination containers:', {
        geography: geographyId,
        category: destContainerCategory,
      });
      
      // IMPORTANT: Geography filter on containers API doesn't include area-based containers (sea rings)!
      // Solution: Fetch areas in this geography, then get containers from both halls AND areas
      
      // 1. Get all areas in this geography
      // Parameters: active, geography, geographyIn, name, nameIcontains, ordering, page, search
      const areasInGeo = await ApiService.apiV1InfrastructureAreasList(
        true, // 1: active ✅
        geographyId, // 2: geography ✅
        undefined, // 3: geographyIn
        undefined, // 4: name
        undefined, // 5: nameIcontains
        undefined, // 6: ordering
        1, // 7: page ✅
        undefined, // 8: search
      );
      
      console.log('[AddActions] Areas in geography:', areasInGeo.count);
      console.log('[AddActions] Area names:', areasInGeo.results?.map((a: any) => a.name));
      const areaIds = areasInGeo.results?.map((a: any) => a.id) || [];
      console.log('[AddActions] Area IDs to fetch containers from:', areaIds);
      
      // 2. Fetch containers from halls (freshwater) - these have geography via station
      // NOTE: There's NO geography parameter! We'll get all hall containers and filter client-side
      // Parameters: active, area, areaIn, containerType, hall, hallIn, name, ordering, page, search
      const hallContainers = await ApiService.apiV1InfrastructureContainersList(
        true, // 1: active ✅
        undefined, // 2: area (null for hall-based)
        undefined, // 3: areaIn
        undefined, // 4: containerType
        undefined, // 5: hall
        undefined, // 6: hallIn
        undefined, // 7: name
        undefined, // 8: ordering
        1, // 9: page ✅
        undefined, // 10: search
      );
      
      console.log('[AddActions] All hall containers fetched:', hallContainers.count);
      
      // Filter to only containers in this geography (via hall → station → geography)
      // We'll need to do this client-side since API doesn't support geography filter
      const hallContainersInGeo = hallContainers.results || [];
      
      console.log('[AddActions] Hall-based containers:', hallContainers.count);
      
      // 3. Fetch containers from areas (sea) - need to query by area
      // Parameters: active, area, areaIn, containerType, hall, hallIn, name, ordering, page, search
      const areaContainersPromises = areaIds.map((areaId: number) =>
        ApiService.apiV1InfrastructureContainersList(
          true, // 1: active ✅
          areaId, // 2: area ✅
          undefined, // 3: areaIn
          undefined, // 4: containerType
          undefined, // 5: hall
          undefined, // 6: hallIn
          undefined, // 7: name
          undefined, // 8: ordering
          1, // 9: page ✅
          undefined, // 10: search
        )
      );
      
      const areaContainersResults = await Promise.all(areaContainersPromises);
      const areaContainers = areaContainersResults.flatMap(r => r.results || []);
      
      console.log('[AddActions] Area-based containers (sea):', areaContainers.length);
      console.log('[AddActions] Sample area containers:', areaContainers.slice(0, 3).map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.container_type_name,
      })));
      
      // 4. Combine both
      const allContainers = {
        count: hallContainersInGeo.length + areaContainers.length,
        results: [...hallContainersInGeo, ...areaContainers],
      };
      
      console.log('[AddActions] Total containers (halls + areas):', allContainers.count);
      console.log('[AddActions] Breakdown:', {
        hallContainers: hallContainersInGeo.length,
        areaContainers: areaContainers.length,
        total: allContainers.count,
      });
      console.log('[AddActions] Sample containers:', allContainers.results?.slice(0, 5).map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.container_type_name,
      })));
      
      // Filter client-side by category if specified (OPTIONAL helper)
      let filtered = allContainers.results || [];
      
      if (destContainerCategory) {
        console.log('[AddActions] Applying category filter:', destContainerCategory);
        
        filtered = filtered.filter((c: any) => {
          // Check container_type_category or infer from name
          const hasCategory = (c as any).container_type_category === destContainerCategory;
          
          // Fallback: Infer from container_type_name
          const nameMatch = destContainerCategory === 'PEN' 
            ? (c.container_type_name?.toLowerCase().includes('ring') || 
               c.container_type_name?.toLowerCase().includes('cage') ||
               c.container_type_name?.toLowerCase().includes('pen'))
            : destContainerCategory === 'TANK'
            ? c.container_type_name?.toLowerCase().includes('tank')
            : destContainerCategory === 'TRAY'
            ? (c.container_type_name?.toLowerCase().includes('tray') || 
               c.container_type_name?.toLowerCase().includes('incubation'))
            : true;
          
          console.log(`[AddActions] Container ${c.id} (${c.container_type_name}): hasCategory=${hasCategory}, nameMatch=${nameMatch}`);
          
          return hasCategory || nameMatch;
        });
        
        console.log('[AddActions] After category filter:', filtered.length, 'containers');
      }
      
      // Sort by container type name for better organization
      filtered.sort((a: any, b: any) => {
        // Group by type name
        const typeCompare = (a.container_type_name || '').localeCompare(b.container_type_name || '');
        if (typeCompare !== 0) return typeCompare;
        // Then by container name
        return (a.name || '').localeCompare(b.name || '');
      });
      
      return filtered;
    },
    enabled: open && !!geographyId && sourceAssignments && sourceAssignments.length > 0,
  });

  // Fetch current assignments for destination containers to show occupancy
  const { data: destAssignments } = useQuery({
    queryKey: ['container-assignments', 'geography', geographyId],
    queryFn: async () => {
      if (!geographyId) {
        console.log('[AddActions] Skipping dest assignments - no geography');
        return [];
      }
      
      console.log('[AddActions] Fetching destination assignments for geography:', geographyId);
      
      // Use correct parameter positions
      // 1-3: dates, 4: batch, 5: batchIn, 6: batchNumber, 7-8: biomass,
      // 9: container, 10: containerIn, 11: containerName, 12: containerType,
      // 13: isActive, 14: lifecycleStage, 15: ordering, 16: page, 17-18: population, 19: search, 20: species
      // NOTE: There's NO geography parameter in this endpoint!
      // We'll have to fetch by container IDs instead
      
      // First, get container IDs for this geography
      // Parameters: active, area, areaIn, containerType, hall, hallIn, name, ordering, page, search
      const containersInGeo = await ApiService.apiV1InfrastructureContainersList(
        true, // 1: active
        undefined, // 2: area
        undefined, // 3: areaIn
        undefined, // 4: containerType
        undefined, // 5: hall
        undefined, // 6: hallIn
        undefined, // 7: name
        undefined, // 8: ordering
        1, // 9: page
        undefined, // 10: search
      );
      
      console.log('[AddActions] Containers in geography:', containersInGeo.count);
      
      const containerIds = containersInGeo.results?.map((c: any) => c.id) || [];
      
      if (containerIds.length === 0) {
        return [];
      }
      
      // Now fetch assignments for those containers
      const result = await ApiService.apiV1BatchContainerAssignmentsList(
        undefined, // 1: assignmentDate
        undefined, // 2: assignmentDateAfter
        undefined, // 3: assignmentDateBefore
        undefined, // 4: batch (all batches)
        undefined, // 5: batchIn
        undefined, // 6: batchNumber
        undefined, // 7: biomassMax
        undefined, // 8: biomassMin
        undefined, // 9: container
        containerIds, // 10: containerIn ✅
        undefined, // 11: containerName
        undefined, // 12: containerType
        undefined, // 13: isActive
        undefined, // 14: lifecycleStage
        undefined, // 15: ordering
        1, // 16: page ✅
        undefined, // 17: populationMax
        undefined, // 18: populationMin
        undefined, // 19: search
        undefined, // 20: species
      );
      
      console.log('[AddActions] Destination assignments API result:', result);
      console.log('[AddActions] Total dest assignments found:', result.count);
      
      // Filter client-side for active only
      return (result.results || []).filter((a: any) => a.is_active === true);
    },
    enabled: open && !!geographyId,
  });

  // Combine container data with occupancy info
  const destContainers = (destContainersRaw || []).map((container: any) => {
    const assignment = (destAssignments || []).find((a: any) => a.container === container.id);
    
    let occupancyInfo = 'Empty';
    let daysOccupied = 0;
    
    if (assignment) {
      const assignmentDate = new Date((assignment as any).assignment_date);
      const today = new Date();
      daysOccupied = Math.floor((today.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24));
      occupancyInfo = `${(assignment as any).population_count?.toLocaleString() || 0} fish, ${daysOccupied} days`;
    }
    
    return {
      ...container,
      occupancy_info: occupancyInfo,
      days_occupied: daysOccupied,
      is_empty: !assignment,
    };
  }).sort((a: any, b: any) => {
    // Sort: Empty first, then by days_occupied DESC (oldest first)
    if (a.is_empty && !b.is_empty) return -1;
    if (!a.is_empty && b.is_empty) return 1;
    return b.days_occupied - a.days_occupied; // DESC - oldest first
  });

  // Log final destination containers
  console.log('[AddActions] Final destination containers (after enrichment & sorting):', destContainers);

  const addRow = () => {
    setRows([...rows, { id: crypto.randomUUID() }]);
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) {
      toast({
        title: 'Cannot Remove',
        description: 'At least one action is required',
        variant: 'destructive',
      });
      return;
    }
    setRows(rows.filter((row) => row.id !== id));
    // Clear errors for this row
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`${id}-`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const updateRow = (id: string, field: keyof ActionRow, value: any) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };

          // Auto-calculate biomass when count changes
          if (field === 'transferredCount' || field === 'sourceAssignmentId') {
            const sourceContainer = sourceAssignments?.find(
              (a: any) => a.id === (field === 'sourceAssignmentId' ? value : row.sourceAssignmentId)
            );
            
            if (sourceContainer && (field === 'transferredCount' ? value : row.transferredCount)) {
              const count = field === 'transferredCount' ? value : row.transferredCount;
              const avgWeight = parseFloat((sourceContainer as any).average_weight_g || batchData?.calculated_avg_weight_g || '0') / 1000; // g to kg
              const biomass = (count * avgWeight).toFixed(2);
              updated.transferredBiomassKg = biomass;
            }

            // Store source population for validation
            if (sourceContainer) {
              updated.sourcePopulationBefore = (sourceContainer as any).population_count || batchData?.calculated_population_count || 0;
            }
          }

          return updated;
        }
        return row;
      })
    );

    // Clear error for this field
    const errorKey = `${id}-${field}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validateRows = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    rows.forEach((row, index) => {
      // Required fields
      if (!row.sourceAssignmentId) {
        newErrors[`${row.id}-sourceAssignmentId`] = 'Source container required';
        isValid = false;
      }
      if (!row.destContainerId) {
        newErrors[`${row.id}-destContainerId`] = 'Destination container required';
        isValid = false;
      }
      if (!row.transferredCount || row.transferredCount <= 0) {
        newErrors[`${row.id}-transferredCount`] = 'Transfer count must be > 0';
        isValid = false;
      }

      // Validate transfer count ≤ source population
      if (row.transferredCount && row.sourcePopulationBefore) {
        if (row.transferredCount > row.sourcePopulationBefore) {
          newErrors[`${row.id}-transferredCount`] = 
            `Cannot exceed source population (${formatCount(row.sourcePopulationBefore)})`;
          isValid = false;
        }
      }

      // Biomass validation
      if (!row.transferredBiomassKg || parseFloat(row.transferredBiomassKg) <= 0) {
        newErrors[`${row.id}-transferredBiomassKg`] = 'Biomass must be > 0';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateRows()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create all actions sequentially
      // For each action, we need to create a placeholder dest_assignment first
      for (const [index, row] of rows.entries()) {
        console.log(`[AddActions] Creating action ${index + 1}/${rows.length}`);
        
        // Step 1: Create placeholder destination assignment (population=0, is_active=false)
        const destAssignment = await ApiService.apiV1BatchContainerAssignmentsCreate({
          batch_id: workflow.batch,
          container_id: row.destContainerId!,
          lifecycle_stage_id: workflow.dest_lifecycle_stage,
          assignment_date: new Date().toISOString().split('T')[0],
          population_count: 0,
          biomass_kg: '0.00',
          avg_weight_g: '0.00',
          is_active: false, // Not active until execution completes
          notes: `Placeholder for workflow ${workflow.workflow_number} action ${index + 1}`,
        } as any);
        
        console.log(`[AddActions] Created placeholder dest_assignment ${destAssignment.id} for container ${row.destContainerId}`);
        
        // Step 2: Create the transfer action
        const actionPayload = {
          workflow: workflow.id,
          action_number: index + 1,
          source_assignment: row.sourceAssignmentId!,
          dest_assignment: destAssignment.id, // Use placeholder assignment ID
          source_population_before: row.sourcePopulationBefore!,
          transferred_count: row.transferredCount!,
          transferred_biomass_kg: row.transferredBiomassKg!,
          status: 'PENDING' as const,
        };

        await createAction.mutateAsync(actionPayload as any);
        console.log(`[AddActions] Created action ${index + 1}`);
      }

      toast({
        title: 'Actions Added',
        description: `Successfully added ${rows.length} transfer action(s)`,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating actions:', error);
      
      let errorMessage = 'Failed to create actions';
      if (error && typeof error === 'object') {
        const apiError = error as any;
        if (apiError.body) {
          errorMessage = JSON.stringify(apiError.body);
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }

      toast({
        title: 'Error Creating Actions',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Calculate summary stats
  const totalCount = rows.reduce((sum, row) => sum + (row.transferredCount || 0), 0);
  const totalBiomass = rows.reduce(
    (sum, row) => sum + (parseFloat(row.transferredBiomassKg || '0')),
    0
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transfer Actions</DialogTitle>
          <DialogDescription>
            Workflow: {workflow.workflow_number} • {workflow.batch_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Add container-to-container movement pairs. Each row represents one transfer action.
              {geographyId && (
                <span className="block mt-1 text-xs">
                  Geography filter: <strong>ID {geographyId}</strong> (from source containers)
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* Container Category Filter for Destinations (OPTIONAL - Helper for cross-category transitions) */}
          <div className="bg-muted p-4 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">
              Filter Destination Containers by Category (Optional)
            </Label>
            <Select
              value={destContainerCategory || 'all'}
              onValueChange={(value) => setDestContainerCategory(value === 'all' ? undefined : value as any)}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories (Recommended)</SelectItem>
                {containerCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              {destContainerCategory 
                ? `Showing ${destContainers?.length || 0} ${destContainerCategory.toLowerCase()} containers`
                : `Showing all ${destContainers?.length || 0} containers (sorted by type)`
              }
            </p>
          </div>

          {/* Actions Table */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left text-sm font-medium">#</th>
                  <th className="p-2 text-left text-sm font-medium">Source Container *</th>
                  <th className="p-2 text-left text-sm font-medium">Dest Container *</th>
                  <th className="p-2 text-left text-sm font-medium">Count *</th>
                  <th className="p-2 text-left text-sm font-medium">Biomass (kg) *</th>
                  <th className="p-2 text-center text-sm font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2 text-sm font-medium">{index + 1}</td>
                    
                    {/* Source Container */}
                    <td className="p-2">
                      <Select
                        value={row.sourceAssignmentId?.toString() || ''}
                        onValueChange={(value) =>
                          updateRow(row.id, 'sourceAssignmentId', parseInt(value))
                        }
                      >
                        <SelectTrigger
                          className={errors[`${row.id}-sourceAssignmentId`] ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder="Select source..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceAssignments?.map((assignment: any) => {
                            const containerName = assignment.container_info?.name 
                              || assignment.container?.name
                              || `Container #${assignment.container?.id || assignment.container_info?.id}`;
                            const population = assignment.population_count || 0;
                            const days = assignment.days_occupied || 0;
                            
                            console.log('[AddActions] Rendering source assignment:', {
                              id: assignment.id,
                              containerName,
                              population,
                              days,
                              container: assignment.container,
                              container_info: assignment.container_info,
                            });
                            
                            return (
                              <SelectItem key={assignment.id} value={assignment.id.toString()}>
                                {containerName} ({formatCount(population)} fish, {days} days)
                              </SelectItem>
                            );
                          })}
                          {sourceAssignments?.length === 0 && (
                            <SelectItem value="none" disabled>
                              No active assignments found for this batch
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors[`${row.id}-sourceAssignmentId`] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors[`${row.id}-sourceAssignmentId`]}
                        </p>
                      )}
                    </td>

                    {/* Dest Container */}
                    <td className="p-2">
                      <Select
                        value={row.destContainerId?.toString() || ''}
                        onValueChange={(value) =>
                          updateRow(row.id, 'destContainerId', parseInt(value))
                        }
                      >
                        <SelectTrigger
                          className={errors[`${row.id}-destContainerId`] ? 'border-red-500' : ''}
                        >
                          <SelectValue placeholder="Select dest..." />
                        </SelectTrigger>
                        <SelectContent>
                          {destContainers && destContainers.length > 0 ? (
                            destContainers.map((container: any) => {
                              const typeName = container.container_type_name || 'Unknown Type';
                              const displayLabel = `${container.name} (${typeName}) - ${container.occupancy_info}`;
                              
                              console.log('[AddActions] Rendering dest container:', {
                                id: container.id,
                                name: container.name,
                                type: typeName,
                                occupancy: container.occupancy_info,
                                displayLabel,
                              });
                              
                              return (
                                <SelectItem key={container.id} value={container.id.toString()}>
                                  {displayLabel}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <SelectItem value="none" disabled>
                              No containers found
                              {destContainerCategory && ` for ${destContainerCategory}`}
                              {geographyId && ` in geography ${geographyId}`}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors[`${row.id}-destContainerId`] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors[`${row.id}-destContainerId`]}
                        </p>
                      )}
                    </td>

                    {/* Transferred Count */}
                    <td className="p-2">
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={row.transferredCount || ''}
                        onChange={(e) =>
                          updateRow(row.id, 'transferredCount', parseInt(e.target.value) || 0)
                        }
                        placeholder="Count"
                        className={errors[`${row.id}-transferredCount`] ? 'border-red-500' : ''}
                      />
                      {errors[`${row.id}-transferredCount`] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors[`${row.id}-transferredCount`]}
                        </p>
                      )}
                    </td>

                    {/* Biomass */}
                    <td className="p-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.transferredBiomassKg || ''}
                        onChange={(e) =>
                          updateRow(row.id, 'transferredBiomassKg', e.target.value)
                        }
                        placeholder="kg"
                        className={errors[`${row.id}-transferredBiomassKg`] ? 'border-red-500' : ''}
                      />
                      {errors[`${row.id}-transferredBiomassKg`] && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors[`${row.id}-transferredBiomassKg`]}
                        </p>
                      )}
                    </td>

                    {/* Remove Button */}
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <Button variant="outline" onClick={addRow} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>

          {/* Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Actions:</span>{' '}
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
            {createAction.isPending ? 'Adding Actions...' : `Add ${rows.length} Action(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

