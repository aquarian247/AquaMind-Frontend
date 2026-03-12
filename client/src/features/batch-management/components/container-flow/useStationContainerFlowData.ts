import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { ApiService, OpenAPI } from "@/api/generated";
import { AuthService } from "@/services/auth.service";
import type {
  AssignmentRecord,
  ContainerFlowData,
  TransferActionRecord,
} from "./containerFlow.types";
import { normalizeAssignment, normalizeTransferAction } from "./graphTransformers";
import { fetchContainersForIds, fetchHallStationLookup } from "./useContainerFlowData";

type SwimlaneFlowData = Pick<ContainerFlowData, "assignments" | "actions" | "isLoading" | "error">;

interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
}

function dedupeRowsById<T extends { id?: number | string | null }>(
  rows: T[],
  label: string,
): T[] {
  const seen = new Set<number | string>();
  const deduped: T[] = [];
  let duplicateCount = 0;

  for (const row of rows) {
    const id = row.id;
    if (id === null || id === undefined) {
      deduped.push(row);
      continue;
    }
    if (seen.has(id)) {
      duplicateCount += 1;
      continue;
    }
    seen.add(id);
    deduped.push(row);
  }

  if (duplicateCount > 0) {
    console.warn(`[station-container-flow] Dropped ${duplicateCount} duplicate ${label} row(s)`);
  }

  return deduped;
}

async function fetchAllPages<T>(path: string, params: Record<string, string>): Promise<T[]> {
  const allResults: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const search = new URLSearchParams({
      ...params,
      page: String(page),
    });
    const response = await AuthService.authenticatedFetch(
      `${OpenAPI.BASE}${path}?${search.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${path} (${response.status})`);
    }

    const payload = await response.json() as PaginatedResponse<T>;
    allResults.push(...(payload.results ?? []));
    hasMore = !!payload.next;
    page += 1;

    if (page > 100) {
      console.warn(`Stopped fetching ${path} after 100 pages`);
      break;
    }
  }

  return allResults;
}

async function fetchAllStationAssignments(stationId: number): Promise<any[]> {
  const rows = await fetchAllPages<any>("/api/v1/batch/container-assignments/", {
    station: String(stationId),
  });
  return dedupeRowsById(rows, "assignment");
}

async function fetchAllStationTransferActions(stationId: number): Promise<TransferActionRecord[]> {
  const rawActions = await fetchAllPages<any>("/api/v1/batch/transfer-actions/", {
    station: String(stationId),
    status: "COMPLETED",
  });

  return dedupeRowsById(rawActions, "transfer action").map((raw) => normalizeTransferAction(raw));
}

export function useStationContainerFlowData(stationId: number): SwimlaneFlowData {
  const {
    data: rawAssignments,
    isLoading: isLoadingAssignments,
    error: assignmentsError,
  } = useQuery({
    queryKey: ["station-container-flow/assignments", stationId],
    queryFn: () => fetchAllStationAssignments(stationId),
    enabled: stationId > 0,
    staleTime: 5 * 60 * 1000,
  });

  const assignmentContainerIds = useMemo(() => {
    if (!rawAssignments) return [];
    return rawAssignments
      .map((a: any) => {
        const cid = typeof a.container === "object" ? a.container?.id : a.container_id ?? a.container;
        return Number(cid);
      })
      .filter((id: number) => !Number.isNaN(id));
  }, [rawAssignments]);

  const {
    data: containerLookup,
    isLoading: isLoadingContainers,
    error: containersError,
  } = useQuery({
    queryKey: ["station-container-flow/containers", stationId, assignmentContainerIds.join(",")],
    queryFn: () => fetchContainersForIds(assignmentContainerIds),
    enabled: stationId > 0 && assignmentContainerIds.length > 0,
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
    data: actions,
    isLoading: isLoadingActions,
    error: actionsError,
  } = useQuery({
    queryKey: ["station-container-flow/actions", stationId],
    queryFn: () => fetchAllStationTransferActions(stationId),
    enabled: stationId > 0,
    staleTime: 5 * 60 * 1000,
  });

  const assignments: AssignmentRecord[] = useMemo(() => {
    if (!rawAssignments || !containerLookup || !stages || !hallStationLookup) return [];
    return rawAssignments.map((raw: any) => normalizeAssignment(raw, containerLookup, stages, hallStationLookup));
  }, [rawAssignments, containerLookup, stages, hallStationLookup]);

  const isLoading =
    isLoadingAssignments || isLoadingContainers || isLoadingStages || isLoadingHalls || isLoadingActions;
  const error = assignmentsError ?? containersError ?? stagesError ?? hallsError ?? actionsError ?? null;

  return {
    assignments,
    actions: actions ?? [],
    isLoading,
    error: error as Error | null,
  };
}
