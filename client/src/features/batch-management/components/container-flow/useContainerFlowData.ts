import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { api } from "@/lib/api";
import type {
  AssignmentRecord,
  TransferActionRecord,
  WorkflowRecord,
  ContainerFlowNode,
  ContainerFlowEdge,
  ContainerFlowData,
  CollapseMode,
} from "./containerFlow.types";
import { normalizeAssignment, normalizeTransferAction, buildNodes, buildEdges } from "./graphTransformers";
import { applyDagreLayout } from "./layoutEngine";

async function fetchAllWorkflows(batchId: number): Promise<WorkflowRecord[]> {
  const allWorkflows: WorkflowRecord[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await ApiService.apiV1BatchTransferWorkflowsList(
      undefined, undefined,
      batchId,
      undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined,
      page,
    );
    for (const raw of response.results ?? []) {
      allWorkflows.push({
        id: raw.id!,
        workflow_number: (raw as any).workflow_number ?? "",
        workflow_type: (raw as any).workflow_type ?? "",
        status: (raw as any).status ?? "",
        source_stage: (raw as any).source_lifecycle_stage_name ?? "",
        dest_stage: (raw as any).dest_lifecycle_stage_name ?? null,
        is_dynamic_execution: (raw as any).is_dynamic_execution ?? false,
        planned_start_date: (raw as any).planned_start_date ?? "",
        actual_completion_date: (raw as any).actual_completion_date ?? null,
      });
    }
    hasMore = !!response.next;
    page++;
  }
  return allWorkflows;
}

async function fetchAllActionsForWorkflows(workflows: WorkflowRecord[]): Promise<TransferActionRecord[]> {
  const allActions: TransferActionRecord[] = [];

  const fetchForWorkflow = async (wf: WorkflowRecord) => {
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const response = await ApiService.apiV1BatchTransferActionsList(
        undefined, undefined, undefined, undefined, undefined, undefined,
        undefined, undefined,
        page,
        undefined, undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined, undefined,
        wf.id,
      );
      for (const raw of response.results ?? []) {
        allActions.push(normalizeTransferAction(raw, wf));
      }
      hasMore = !!response.next;
      page++;
    }
  };

  const BATCH_SIZE = 5;
  for (let i = 0; i < workflows.length; i += BATCH_SIZE) {
    await Promise.all(workflows.slice(i, i + BATCH_SIZE).map(fetchForWorkflow));
  }

  return allActions;
}

export async function fetchContainersForIds(containerIds: number[]): Promise<Map<number, any>> {
  const lookup = new Map<number, any>();
  const uniqueIds = [...new Set(containerIds)];

  const BATCH_SIZE = 10;
  for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
    const batch = uniqueIds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((id) => ApiService.apiV1InfrastructureContainersRetrieve(id)),
    );
    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        lookup.set(Number(result.value.id), result.value);
      }
    }
  }
  return lookup;
}

export async function fetchHallStationLookup(): Promise<Map<number, string>> {
  const lookup = new Map<number, string>();
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 50) {
    const response = await ApiService.apiV1InfrastructureHallsList(
      undefined, undefined, undefined, undefined, undefined,
      page,
    );
    for (const h of response.results ?? []) {
      if (h.id && h.freshwater_station_name) {
        lookup.set(Number(h.id), h.freshwater_station_name);
      }
    }
    hasMore = !!response.next;
    page++;
  }
  return lookup;
}

export function useContainerFlowData(
  batchId: number,
  collapseMode: CollapseMode = "collapsed",
): ContainerFlowData {
  const {
    data: rawAssignments,
    isLoading: isLoadingAssignments,
    error: assignmentsError,
  } = useQuery({
    queryKey: ["container-flow/assignments", batchId],
    queryFn: async () => {
      const response = await api.batch.getAssignments(batchId);
      return response.results ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const assignmentContainerIds = useMemo(() => {
    if (!rawAssignments) return [];
    return rawAssignments.map((a: any) => {
      const cid = typeof a.container === "object" ? a.container?.id : a.container_id ?? a.container;
      return Number(cid);
    }).filter((id: number) => !isNaN(id));
  }, [rawAssignments]);

  const {
    data: containerLookup,
    isLoading: isLoadingContainers,
    error: containersError,
  } = useQuery({
    queryKey: ["container-flow/containers", assignmentContainerIds.join(",")],
    queryFn: () => fetchContainersForIds(assignmentContainerIds),
    enabled: assignmentContainerIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: stages,
    isLoading: isLoadingStages,
    error: stagesError,
  } = useQuery({
    queryKey: ["container-flow/stages"],
    queryFn: async () => {
      const response = await ApiService.apiV1BatchLifecycleStagesList();
      const lookup = new Map<number, any>();
      for (const s of response.results ?? []) {
        lookup.set(Number(s.id), s);
      }
      return lookup;
    },
    staleTime: 30 * 60 * 1000,
  });

  const {
    data: hallStationLookup,
    isLoading: isLoadingHalls,
    error: hallsError,
  } = useQuery({
    queryKey: ["container-flow/hall-stations"],
    queryFn: fetchHallStationLookup,
    staleTime: 30 * 60 * 1000,
  });

  const {
    data: workflows,
    isLoading: isLoadingWorkflows,
    error: workflowsError,
  } = useQuery({
    queryKey: ["container-flow/workflows", batchId],
    queryFn: () => fetchAllWorkflows(batchId),
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: actions,
    isLoading: isLoadingActions,
    error: actionsError,
  } = useQuery({
    queryKey: ["container-flow/actions", batchId, workflows?.map((w) => w.id).join(",")],
    queryFn: () => fetchAllActionsForWorkflows(workflows!),
    enabled: !!workflows && workflows.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const assignments: AssignmentRecord[] = useMemo(() => {
    if (!rawAssignments || !containerLookup || !stages || !hallStationLookup) return [];
    return rawAssignments.map((raw: any) => normalizeAssignment(raw, containerLookup, stages, hallStationLookup));
  }, [rawAssignments, containerLookup, stages, hallStationLookup]);

  const mixedContainerIds = useMemo(() => {
    const containerBatchMap = new Map<number, Set<number>>();
    for (const a of assignments) {
      if (!a.is_active) continue;
      if (!containerBatchMap.has(a.container_id)) containerBatchMap.set(a.container_id, new Set());
      containerBatchMap.get(a.container_id)!.add(a.batch_id);
    }
    const mixed = new Set<number>();
    for (const [cid, batches] of containerBatchMap) {
      if (batches.size > 1) mixed.add(cid);
    }
    return mixed;
  }, [assignments]);

  const allActions = actions ?? [];

  const { nodes, edges } = useMemo(() => {
    if (assignments.length === 0) return { nodes: [], edges: [] };

    const rawNodes = buildNodes(assignments, collapseMode, mixedContainerIds, allActions);
    const rawEdges = buildEdges(allActions, assignments, collapseMode);

    return applyDagreLayout(rawNodes, rawEdges);
  }, [assignments, allActions, collapseMode, mixedContainerIds]);

  const isLoading =
    isLoadingAssignments || isLoadingContainers || isLoadingStages || isLoadingHalls || isLoadingWorkflows || isLoadingActions;
  const error = assignmentsError ?? containersError ?? stagesError ?? hallsError ?? workflowsError ?? actionsError ?? null;

  return {
    nodes,
    edges,
    assignments,
    actions: allActions,
    workflows: workflows ?? [],
    isLoading,
    error: error as Error | null,
  };
}
