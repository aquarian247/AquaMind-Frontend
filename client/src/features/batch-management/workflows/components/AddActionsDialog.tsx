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

import { useState, useEffect, useMemo } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { useContainerAvailability } from '../hooks/useContainerAvailability';
import { formatCount, formatBiomass } from '../utils';

// ============================================================================
// Types
// ============================================================================

interface ActionRow {
  id: string;
  sourceAssignmentId?: number;
  destContainerId?: number; // Changed from destAssignmentId - we select container, not assignment
  destAssignmentId?: number;
  transferredCount?: number;
  transferredBiomassKg?: string;
  sourcePopulationBefore?: number;
  transferAll?: boolean;
  allowMixed?: boolean;
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
  const [destContainerTypeId, setDestContainerTypeId] = useState<number | 'auto'>('auto');
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

  const nextActionNumberBase = useMemo(() => {
    const workflowAny = workflow as any;
    const existingActions = Array.isArray(workflowAny.actions)
      ? workflowAny.actions
      : [];

    const maxFromActions = existingActions.reduce((max: number, action: any) => {
      const actionNumber = Number(action?.action_number);
      return Number.isFinite(actionNumber)
        ? Math.max(max, actionNumber)
        : max;
    }, 0);

    const totalPlanned = Number(workflowAny.total_actions_planned || 0);
    return Math.max(maxFromActions, totalPlanned) + 1;
  }, [workflow]);

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

  // Fetch area (if source container is sea-based)
  const areaId = firstContainerFull ? (firstContainerFull as any).area : undefined;

  const { data: areaData } = useQuery({
    queryKey: ['area', areaId],
    queryFn: async () => {
      console.log('[AddActions] Fetching area details for ID:', areaId);
      const area = await ApiService.apiV1InfrastructureAreasRetrieve(areaId!);
      console.log('[AddActions] Area received:', area);
      return area;
    },
    enabled: open && !!areaId,
  });

  // Extract geography from station
  const geographyId = (stationData as any)?.geography_id
    || (stationData as any)?.geography
    || (areaData as any)?.geography
    || (batchData as any)?.geography_id
    || (batchData as any)?.geography;

  const destStageName = (workflow.dest_stage_name || '').toLowerCase();
  const isLifecycleTransition = workflow.workflow_type === 'LIFECYCLE_TRANSITION';
  const isDestSeaStage = ['post-smolt', 'adult'].some((stage) => destStageName.includes(stage));

  const sourceLocationType: 'freshwater' | 'sea' | 'unknown' =
    (firstContainerFull as any)?.area ? 'sea'
      : (firstContainerFull as any)?.hall ? 'freshwater'
      : 'unknown';

  const destLocationScope: 'freshwater' | 'sea' | 'any' = isLifecycleTransition
    ? (isDestSeaStage ? 'sea' : 'freshwater')
    : sourceLocationType === 'unknown' ? 'any' : sourceLocationType;

  const getDestStageKey = () => {
    if (!isLifecycleTransition) return undefined;
    if (destStageName.includes('post-smolt')) return 'post-smolt';
    if (destStageName.includes('smolt')) return 'smolt';
    if (destStageName.includes('parr')) return 'parr';
    if (destStageName.includes('fry')) return 'fry';
    if (destStageName.includes('alevin') || destStageName.includes('egg')) return 'egg-alevin';
    if (destStageName.includes('adult')) return 'adult';
    return undefined;
  };

  const destStageKey = getDestStageKey();

  const stageKeywords: Record<string, string[]> = {
    'egg-alevin': ['tray', 'incubation'],
    fry: ['fry'],
    parr: ['parr'],
    smolt: ['smolt'],
    'post-smolt': ['post-smolt'],
    adult: ['adult', 'ring', 'pen', 'cage', 'sea'],
  };

  console.log('[AddActions] Geography derived from station:', geographyId);
  console.log('[AddActions] Source assignments count:', sourceAssignments?.length || 0);
  
  // Fetch destination containers (filtered by geography + location scope + optional category)
  const { data: destContainersRaw } = useQuery({
    queryKey: [
      'containers',
      'geography',
      geographyId,
      'scope',
      destLocationScope,
      'category',
      destContainerCategory,
      'station',
      stationId,
    ],
    queryFn: async () => {
      const getResults = (response: any) => {
        if (Array.isArray(response)) return response;
        return response?.results || [];
      };
      const getNext = (response: any) => {
        if (Array.isArray(response)) return null;
        return response?.next;
      };
      const fetchAllPages = async (fetchPage: (page: number) => Promise<any>) => {
        let page = 1;
        const results: any[] = [];
        while (true) {
          const response = await fetchPage(page);
          results.push(...getResults(response));
          if (!getNext(response)) break;
          page += 1;
        }
        return results;
      };

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
      
      // 1. Get all areas in this geography (sea containers)
      // Parameters: active, geography, geographyIn, name, nameIcontains, ordering, page, search
      const areasInGeoResults = await fetchAllPages((page) =>
        ApiService.apiV1InfrastructureAreasList(
          true, // active
          undefined, // areaGroup
          undefined, // areaGroupIn
          geographyId, // geography
          undefined, // geographyIn
          undefined, // name
          undefined, // nameIcontains
          undefined, // ordering
          page, // page
          undefined // search
        )
      );
      
      console.log('[AddActions] Areas in geography:', areasInGeoResults.length);
      console.log('[AddActions] Area names:', areasInGeoResults?.map((a: any) => a.name));
      const areaIds = areasInGeoResults?.map((a: any) => a.id) || [];
      console.log('[AddActions] Area IDs to fetch containers from:', areaIds);

      let hallContainersInStation: any[] = [];
      let areaContainers: any[] = [];
      let carrierContainers: any[] = [];

      if (destLocationScope !== 'sea') {
        // 2. Fetch halls for this station, then containers in those halls
        if (stationId) {
          const hallsInStationResults = await fetchAllPages((page) =>
            ApiService.apiV1InfrastructureHallsList(
              true, // active
              stationId, // freshwaterStation
              undefined, // freshwaterStationIn
              undefined, // name
              undefined, // ordering
              page, // page
              undefined, // search
            )
          );
          const hallIds = hallsInStationResults?.map((h: any) => h.id) || [];
          console.log('[AddActions] Halls in station:', hallIds);

          const hallContainersBulk = hallIds.length > 0
            ? await fetchAllPages((page) =>
                ApiService.apiV1InfrastructureContainersList(
                  true, // active
                  undefined, // area
                  undefined, // areaIn
                  undefined, // carrier
                  undefined, // carrierCarrierType
                  undefined, // carrierIn
                  undefined, // containerType
                  undefined, // containerTypeCategory
                  undefined, // hall
                  hallIds, // hallIn
                  undefined, // hierarchyRole
                  undefined, // name
                  undefined, // ordering
                  page, // page
                  undefined, // parentContainer
                  undefined, // parentContainerIn
                  undefined, // parentContainerIsnull
                  undefined, // search
                )
              )
            : [];

          const perHallResults = await Promise.all(
            hallIds.map((hallId: number) =>
              fetchAllPages((page) =>
                ApiService.apiV1InfrastructureContainersList(
                  true, // active
                  undefined, // area
                  undefined, // areaIn
                  undefined, // carrier
                  undefined, // carrierCarrierType
                  undefined, // carrierIn
                  undefined, // containerType
                  undefined, // containerTypeCategory
                  hallId, // hall
                  undefined, // hallIn
                  undefined, // hierarchyRole
                  undefined, // name
                  undefined, // ordering
                  page, // page
                  undefined, // parentContainer
                  undefined, // parentContainerIn
                  undefined, // parentContainerIsnull
                  undefined, // search
                )
              )
            )
          );

          const hallContainersPerHall = perHallResults.flatMap((r) => r || []);
          const hallContainerMap = new Map<number, any>();
          [...hallContainersBulk, ...hallContainersPerHall].forEach((container: any) => {
            hallContainerMap.set(container.id, container);
          });
          hallContainersInStation = Array.from(hallContainerMap.values());
        }
      }

      if (destLocationScope !== 'freshwater') {
        // 3. Fetch containers from areas (sea)
        const areaContainersPromises = areaIds.map((areaId: number) =>
          fetchAllPages((page) =>
            ApiService.apiV1InfrastructureContainersList(
              true, // active
              areaId, // area
              undefined, // areaIn
              undefined, // carrier
              undefined, // carrierCarrierType
              undefined, // carrierIn
              undefined, // containerType
              undefined, // containerTypeCategory
              undefined, // hall
              undefined, // hallIn
              undefined, // hierarchyRole
              undefined, // name
              undefined, // ordering
              page, // page
              undefined, // parentContainer
              undefined, // parentContainerIn
              undefined, // parentContainerIsnull
              undefined, // search
            )
          )
        );
      
      const areaContainersResults = await Promise.all(areaContainersPromises);
      areaContainers = areaContainersResults.flatMap(r => r || []);
      }

      if (destLocationScope !== 'freshwater') {
        // 4. Fetch transport carrier tanks (truck/vessel) for this geography
        const carriersInGeo = await fetchAllPages((page) =>
          ApiService.apiV1InfrastructureTransportCarriersList(
            true, // active
            undefined, // carrierType
            geographyId, // geography
            undefined, // ordering
            page, // page
            undefined, // search
          )
        );
        const carrierIds = (carriersInGeo || []).map((carrier: any) => carrier.id).filter(Boolean);
        console.log('[AddActions] Carriers in geography:', carrierIds.length);

        if (carrierIds.length > 0) {
          const carrierIdChunks: number[][] = [];
          const chunkSize = 100;
          for (let i = 0; i < carrierIds.length; i += chunkSize) {
            carrierIdChunks.push(carrierIds.slice(i, i + chunkSize));
          }

          const carrierContainerResponses = await Promise.all(
            carrierIdChunks.map((carrierChunk) =>
              fetchAllPages((page) =>
                ApiService.apiV1InfrastructureContainersList(
                  true, // active
                  undefined, // area
                  undefined, // areaIn
                  undefined, // carrier
                  undefined, // carrierCarrierType
                  carrierChunk, // carrierIn
                  undefined, // containerType
                  undefined, // containerTypeCategory
                  undefined, // hall
                  undefined, // hallIn
                  undefined, // hierarchyRole
                  undefined, // name
                  undefined, // ordering
                  page, // page
                  undefined, // parentContainer
                  undefined, // parentContainerIn
                  undefined, // parentContainerIsnull
                  undefined, // search
                )
              )
            )
          );
          carrierContainers = carrierContainerResponses.flatMap((result) => result || []);
        }
      }

      const containerById = new Map<number, any>();
      [...hallContainersInStation, ...areaContainers, ...carrierContainers].forEach((container: any) => {
        containerById.set(container.id, container);
      });
      const allContainers = {
        count: containerById.size,
        results: Array.from(containerById.values()),
      };
      
      console.log('[AddActions] Total containers (halls + areas):', allContainers.count);
      console.log('[AddActions] Breakdown:', {
        hallContainers: hallContainersInStation.length,
        areaContainers: areaContainers.length,
        carrierContainers: carrierContainers.length,
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

  const availabilityDate = workflow.planned_start_date || new Date().toISOString().split('T')[0];

  const availabilityContainerTypeName = destContainerTypeId !== 'auto'
    ? (destContainersRaw || []).find((c: any) => c.container_type === destContainerTypeId)?.container_type_name
    : undefined;

  const { data: containerAvailability } = useContainerAvailability({
    geography: geographyId,
    deliveryDate: availabilityDate,
    containerType: availabilityContainerTypeName,
    includeOccupied: true,
    enabled: open && !!geographyId && destLocationScope === 'sea',
  });

  const stageFilteredContainers = (destContainersRaw || []).filter((container: any) => {
    if (destContainerTypeId !== 'auto') {
      return container.container_type === destContainerTypeId;
    }

    if (!destStageKey || !stageKeywords[destStageKey]) {
      return true;
    }
    const keywords = stageKeywords[destStageKey];
    const typeName = (container.container_type_name || '').toLowerCase();
    const containerName = (container.name || '').toLowerCase();
    return keywords.some((keyword) =>
      typeName.includes(keyword) || containerName.includes(keyword)
    );
  });

  useEffect(() => {
    console.log('[AddActions] Dest containers raw:', destContainersRaw?.length || 0);
    console.log('[AddActions] Stage filter key:', destStageKey);
    console.log('[AddActions] Container type filter:', destContainerTypeId);
    console.log('[AddActions] Stage-filtered containers:', stageFilteredContainers.length);
    if (destContainersRaw && destContainersRaw.length > 0) {
      console.log(
        '[AddActions] Sample container types:',
        Array.from(
          new Map(
            destContainersRaw.map((container: any) => [
              container.container_type,
              container.container_type_name,
            ])
          )
        )
      );
    }
  }, [destContainersRaw, destStageKey, destContainerTypeId, stageFilteredContainers.length]);

  // Fetch current assignments for destination containers to show occupancy
  const { data: destAssignments } = useQuery({
    queryKey: ['container-assignments', 'dest-container-ids', stageFilteredContainers.map((c: any) => c.id)],
    queryFn: async () => {
      const destContainerIds = stageFilteredContainers.map((c: any) => c.id);
      if (destContainerIds.length === 0) {
        console.log('[AddActions] Skipping dest assignments - no dest containers');
        return [];
      }
      
      console.log('[AddActions] Fetching destination assignments for geography:', geographyId);
      
      // Use correct parameter positions
      // 1-3: dates, 4: batch, 5: batchIn, 6: batchNumber, 7-8: biomass,
      // 9: container, 10: containerIn, 11: containerName, 12: containerType,
      // 13: isActive, 14: lifecycleStage, 15: ordering, 16: page, 17-18: population, 19: search, 20: species
      // NOTE: There's NO geography parameter in this endpoint!
      // We'll have to fetch by container IDs instead
      
      const fetchAssignmentsForContainers = async (containerIds: number[]) => {
        let page = 1;
        const results: any[] = [];
        while (true) {
          const response = await ApiService.apiV1BatchContainerAssignmentsList(
            undefined, // 1: assignmentDate
            undefined, // 2: assignmentDateAfter
            undefined, // 3: assignmentDateBefore
            undefined, // 4: batch (all batches)
            undefined, // 5: batchIn
            undefined, // 6: batchNumber
            undefined, // 7: biomassMax
            undefined, // 8: biomassMin
            undefined, // 9: container
            containerIds.join(',') as any, // 10: containerIn (CSV)
            undefined, // 11: containerName
            undefined, // 12: containerType
            true, // 13: isActive
            undefined, // 14: lifecycleStage
            undefined, // 15: ordering
            page, // 16: page ✅
            undefined, // 17: populationMax
            undefined, // 18: populationMin
            undefined, // 19: search
            undefined, // 20: species
          );
          results.push(...(response.results || []));
          if (!response.next) break;
          page += 1;
        }
        return results;
      };

      const chunkSize = 100;
      const chunks = [];
      for (let i = 0; i < destContainerIds.length; i += chunkSize) {
        chunks.push(destContainerIds.slice(i, i + chunkSize));
      }

      console.log('[AddActions] Fetching assignments in chunks:', chunks.length);
      const chunkResults = await Promise.all(
        chunks.map((chunk) => fetchAssignmentsForContainers(chunk))
      );
      const result = { results: chunkResults.flat() };
      
      console.log('[AddActions] Destination assignments API result:', result);
      console.log('[AddActions] Total dest assignments found:', result.results.length);
      
      return result.results || [];
    },
    enabled: open && stageFilteredContainers.length > 0,
  });

  const destAssignmentsByContainer = new Map<number, any[]>();
  (destAssignments || []).forEach((assignment: any) => {
    const containerId =
      assignment.container?.id || assignment.container || assignment.container_info?.id;
    if (!containerId) return;
    const existing = destAssignmentsByContainer.get(containerId) || [];
    existing.push(assignment);
    destAssignmentsByContainer.set(containerId, existing);
  });

  const availabilityById = new Map<number, any>();
  (containerAvailability?.results || []).forEach((container: any) => {
    availabilityById.set(container.id, container);
  });

  // Combine container data with occupancy info
  const destContainers = stageFilteredContainers.map((container: any) => {
    const assignments = destAssignmentsByContainer.get(container.id) || [];
    const availability = availabilityById.get(container.id);
    const availabilityAssignments = availability?.current_assignments || [];

    const sameBatchAssignment = assignments.find(
      (a: any) => (a.batch?.id || a.batch_id) === workflow.batch
    );
    const otherBatchAssignments = assignments.filter(
      (a: any) => (a.batch?.id || a.batch_id) !== workflow.batch
    );

    let occupancyInfo = 'Empty';
    let daysOccupied = 0;

    if (availabilityAssignments.length > 0) {
      const occupancySegments = availabilityAssignments.map((a: any) => {
        const batchNumber = a.batch_number || 'Unknown Batch';
        const population = (a.population_count || 0).toLocaleString();
        const assignmentDate = new Date(a.assignment_date);
        const today = new Date();
        const days = Math.floor((today.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24));
        daysOccupied = Math.max(daysOccupied, days);
        return `${batchNumber} (${population} fish)`;
      });
      occupancyInfo = occupancySegments.join(' + ');
    } else if (assignments.length > 0) {
      const occupancySegments = assignments.map((a: any) => {
        const batchNumber = a.batch?.batch_number || a.batch_info?.batch_number || 'Unknown Batch';
        const population = (a.population_count || 0).toLocaleString();
        const assignmentDate = new Date(a.assignment_date);
        const today = new Date();
        const days = Math.floor((today.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24));
        daysOccupied = Math.max(daysOccupied, days);
        return `${batchNumber} (${population} fish)`;
      });
      occupancyInfo = occupancySegments.join(' + ');
    }

    const hasOtherBatchNow = availabilityAssignments.length > 0
      ? availabilityAssignments.some((a: any) => a.batch_id !== workflow.batch)
      : otherBatchAssignments.length > 0;

    const availabilityStatus = availability?.availability_status;
    const availabilityMessage = availability?.availability_message;
    const isMixedRisk = availabilityStatus
      ? ['OCCUPIED_BUT_OK', 'CONFLICT'].includes(availabilityStatus)
      : hasOtherBatchNow;

    const hasOtherBatch = hasOtherBatchNow && isMixedRisk;

    const isEmpty = availability
      ? availability.current_status === 'EMPTY'
      : assignments.length === 0;

    return {
      ...container,
      occupancy_info: occupancyInfo,
      days_occupied: daysOccupied,
      is_empty: isEmpty,
      has_other_batch: hasOtherBatch,
      availability_status: availabilityStatus,
      availability_message: availabilityMessage,
      same_batch_assignment_id: sameBatchAssignment?.id,
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
          if (field === 'transferAll') {
            if (value && updated.sourcePopulationBefore) {
              updated.transferredCount = updated.sourcePopulationBefore;
            }
          }

          if (field === 'transferredCount' || field === 'sourceAssignmentId' || field === 'transferAll') {
            const sourceContainer = sourceAssignments?.find(
              (a: any) => a.id === (field === 'sourceAssignmentId' ? value : row.sourceAssignmentId)
            );
            
            if (sourceContainer) {
              const population = (sourceContainer as any).population_count || batchData?.calculated_population_count || 0;
              updated.sourcePopulationBefore = population;

              const count = updated.transferAll ? population : (field === 'transferredCount' ? value : row.transferredCount);

              if (count) {
              const avgWeight = parseFloat((sourceContainer as any).average_weight_g || batchData?.calculated_avg_weight_g || '0') / 1000; // g to kg
              const biomass = (count * avgWeight).toFixed(2);
              updated.transferredBiomassKg = biomass;
            }
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

  const handleDestContainerChange = (rowId: string, containerId: number) => {
    const containerMeta = destContainers.find((c: any) => c.id === containerId);
    setRows(
      rows.map((row) => {
        if (row.id !== rowId) return row;
        return {
          ...row,
          destContainerId: containerId,
          destAssignmentId: containerMeta?.same_batch_assignment_id,
          allowMixed: containerMeta?.has_other_batch ? row.allowMixed : false,
        };
      })
    );
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

      if (row.destContainerId) {
        const containerMeta = destContainers.find((c: any) => c.id === row.destContainerId);
        if (containerMeta?.has_other_batch && !row.allowMixed) {
          newErrors[`${row.id}-allowMixed`] = 'Confirm mixed batch to proceed';
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
        description: 'Please fix the errors before submitting',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create all actions sequentially
      // For each action, we need to create a placeholder dest_assignment first
      for (const [index, row] of rows.entries()) {
        const actionNumber = nextActionNumberBase + index;
        console.log(`[AddActions] Creating action ${actionNumber} (${index + 1}/${rows.length})`);
        
        let destAssignmentId = row.destAssignmentId;

        if (!destAssignmentId) {
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
            notes: `Placeholder for workflow ${workflow.workflow_number} action ${actionNumber}${
              row.allowMixed ? ' (mixed batch)' : ''
            }`,
          } as any);
          
          destAssignmentId = destAssignment.id;
          console.log(`[AddActions] Created placeholder dest_assignment ${destAssignment.id} for container ${row.destContainerId}`);
        }
        
        // Step 2: Create the transfer action
        const actionPayload = {
          workflow: workflow.id,
          action_number: actionNumber,
          source_assignment: row.sourceAssignmentId!,
          dest_assignment: destAssignmentId, // Use placeholder or existing assignment
          source_population_before: row.sourcePopulationBefore!,
          transferred_count: row.transferredCount!,
          transferred_biomass_kg: row.transferredBiomassKg!,
          allow_mixed: !!row.allowMixed,
          status: 'PENDING' as const,
        };

        await createAction.mutateAsync(actionPayload as any);
        console.log(`[AddActions] Created action ${actionNumber}`);
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
              {destLocationScope === 'freshwater' && stationData && (
                <span className="block mt-1 text-xs">
                  Destination scope: <strong>same freshwater station</strong> ({(stationData as any).name || 'Station'})
                </span>
              )}
              {destLocationScope === 'sea' && (
                <span className="block mt-1 text-xs">
                  Destination scope: <strong>sea areas in same geography</strong>
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
            <div className="mt-3">
              <Label className="text-sm font-medium mb-2 block">
                Filter by Container Type (Optional)
              </Label>
              <Select
                value={destContainerTypeId === 'auto' ? 'auto' : destContainerTypeId.toString()}
                onValueChange={(value) =>
                  setDestContainerTypeId(value === 'auto' ? 'auto' : parseInt(value))
                }
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Auto (Next Stage)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Next Stage: {workflow.dest_stage_name})</SelectItem>
                  {Array.from(
                    new Map(
                      (destContainersRaw || []).map((container: any) => [
                        container.container_type,
                        container.container_type_name || `Type ${container.container_type}`,
                      ])
                    )
                  ).map(([typeId, typeName]) => (
                    <SelectItem key={typeId} value={typeId.toString()}>
                      {typeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {destContainerCategory 
                ? `Showing ${destContainers?.length || 0} ${destContainerCategory.toLowerCase()} containers`
                : `Showing all ${destContainers?.length || 0} containers (sorted by type)`
              }
            </p>
            {destStageKey && (
              <p className="text-xs text-muted-foreground mt-1">
                Stage filter: {workflow.dest_stage_name} containers only
              </p>
            )}
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
                    <td className="p-2 text-sm font-medium">{nextActionNumberBase + index}</td>
                    
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
                        onValueChange={(value) => handleDestContainerChange(row.id, parseInt(value))}
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
                              const availabilitySuffix = container.availability_message
                                ? ` - ${container.availability_message}`
                                : '';
                              const displayLabel = `${container.name} (${typeName}) - ${container.occupancy_info}${availabilitySuffix}`;
                              
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
                      {row.destContainerId && (() => {
                        const containerMeta = destContainers.find((c: any) => c.id === row.destContainerId);
                        if (!containerMeta?.has_other_batch) return null;
                        return (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-amber-600">
                              Destination already has another batch. This will create a mixed container.
                            </p>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`${row.id}-allow-mixed`}
                                checked={!!row.allowMixed}
                                onCheckedChange={(checked) =>
                                  updateRow(row.id, 'allowMixed', checked === true)
                                }
                              />
                              <Label htmlFor={`${row.id}-allow-mixed`} className="text-xs text-muted-foreground">
                                Allow mixed batch
                              </Label>
                            </div>
                            {errors[`${row.id}-allowMixed`] && (
                              <p className="text-xs text-red-500">
                                {errors[`${row.id}-allowMixed`]}
                              </p>
                            )}
                          </div>
                        );
                      })()}
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
                        disabled={row.transferAll}
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <Checkbox
                          id={`${row.id}-transfer-all`}
                          checked={!!row.transferAll}
                          onCheckedChange={(checked) =>
                            updateRow(row.id, 'transferAll', checked === true)
                          }
                        />
                        <Label htmlFor={`${row.id}-transfer-all`} className="text-xs text-muted-foreground">
                          Transfer all from source
                        </Label>
                      </div>
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
