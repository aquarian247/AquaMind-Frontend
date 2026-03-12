import type { Node, Edge } from "@xyflow/react";
import type {
  AssignmentRecord,
  TransferActionRecord,
  WorkflowRecord,
  ContainerNodeData,
  StageHeaderData,
  TransferEdgeData,
  HallGroup,
  ContainerFlowNode,
  ContainerFlowEdge,
  CollapseMode,
  LocationType,
} from "./containerFlow.types";

export function classifyLocationType(container: {
  hall_id?: number | null;
  area_id?: number | null;
  carrier_id?: number | null;
  carrier_type?: string | null;
}): LocationType {
  if (container.hall_id) return "FRESHWATER";
  if (container.carrier_id) {
    return container.carrier_type === "TRUCK" ? "TRANSPORT_TRUCK" : "TRANSPORT_VESSEL";
  }
  if (container.area_id) return "SEA";
  return "UNKNOWN";
}

export function normalizeAssignment(
  raw: any,
  containerLookup: Map<number, any>,
  stageLookup: Map<number, any>,
  hallStationLookup: Map<number, string>,
): AssignmentRecord {
  const nestedContainer = typeof raw.container === "object" ? raw.container : null;
  const nestedStage = typeof raw.lifecycle_stage === "object" ? raw.lifecycle_stage : null;

  const containerId = Number(nestedContainer?.id ?? raw.container_id ?? raw.container);
  const stageId = Number(nestedStage?.id ?? raw.lifecycle_stage_id ?? raw.lifecycle_stage);

  const containerInfo = containerLookup.get(containerId);
  const stageInfo = stageLookup.get(stageId);

  const hallId = containerInfo?.hall ? Number(containerInfo.hall) : null;
  const areaId = containerInfo?.area ? Number(containerInfo.area) : null;
  const carrierId = containerInfo?.carrier ? Number(containerInfo.carrier) : null;

  const locationType = classifyLocationType({
    hall_id: hallId,
    area_id: areaId,
    carrier_id: carrierId,
    carrier_type: containerInfo?.carrier_type ?? null,
  });

  const stationName = hallId ? (hallStationLookup.get(hallId) ?? null) : null;
  const containerName = nestedContainer?.name ?? containerInfo?.name ?? `Container ${containerId}`;
  const stageName = nestedStage?.name ?? stageInfo?.name ?? "Unknown";

  return {
    id: raw.id,
    batch_id: typeof raw.batch === "object" ? raw.batch?.id : raw.batch,
    batch_number:
      (typeof raw.batch === "object" ? raw.batch?.batch_number : null)
      ?? raw.batch_info?.batch_number
      ?? null,
    batch_status:
      (typeof raw.batch === "object" ? raw.batch?.status : null)
      ?? null,
    container_id: containerId,
    container_name: containerName,
    lifecycle_stage_id: stageId,
    lifecycle_stage_name: stageName,
    stage_order: stageInfo?.order ?? 999,
    population_count: raw.population_count ?? 0,
    biomass_kg: parseFloat(raw.biomass_kg ?? 0),
    avg_weight_g: raw.avg_weight_g ? parseFloat(raw.avg_weight_g) : null,
    assignment_date: raw.assignment_date,
    departure_date: raw.departure_date ?? null,
    is_active: raw.is_active ?? false,
    location_type: locationType,
    station_name: stationName,
    hall_name: containerInfo?.hall_name ?? null,
    area_name: containerInfo?.area_name ?? null,
    carrier_name: containerInfo?.carrier_name ?? null,
    carrier_type: containerInfo?.carrier_type ?? null,
  };
}

export function groupByHall(assignments: AssignmentRecord[]): HallGroup[] {
  const groups = new Map<string, HallGroup>();

  for (const a of assignments) {
    const key = `${a.station_name ?? "unknown"}-${a.hall_name ?? a.area_name ?? "unknown"}-${a.lifecycle_stage_name}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        stationName: a.station_name ?? a.area_name ?? "Unknown",
        hallName: a.hall_name ?? a.area_name ?? "Unknown",
        stageOrder: a.stage_order,
        lifecycleStage: a.lifecycle_stage_name,
        assignments: [],
      });
    }
    groups.get(key)!.assignments.push(a);
  }

  return Array.from(groups.values()).sort(
    (a, b) => a.stageOrder - b.stageOrder || a.stationName.localeCompare(b.stationName),
  );
}

function makeNodeId(assignmentId: number): string {
  return `assignment-${assignmentId}`;
}

function makeGroupNodeId(group: HallGroup): string {
  return `group-${group.key}`;
}

function buildContainerNode(a: AssignmentRecord, isMixed: boolean): Node<ContainerNodeData, "container"> {
  return {
    id: makeNodeId(a.id),
    type: "container",
    position: { x: 0, y: 0 },
    data: {
      assignmentId: a.id,
      containerName: a.container_name,
      containerId: a.container_id,
      lifecycleStage: a.lifecycle_stage_name,
      stageOrder: a.stage_order,
      populationCount: a.population_count,
      biomassKg: a.biomass_kg,
      avgWeightG: a.avg_weight_g,
      assignmentDate: a.assignment_date,
      departureDate: a.departure_date,
      isActive: a.is_active,
      locationType: a.location_type,
      stationName: a.station_name,
      hallName: a.hall_name,
      areaName: a.area_name,
      carrierName: a.carrier_name,
      carrierType: a.carrier_type,
      isMixed,
      isCollapsedGroup: false,
      groupedCount: 1,
      groupedAssignments: [a],
    },
  };
}

function buildGroupNode(group: HallGroup): Node<ContainerNodeData, "container"> {
  const totalPop = group.assignments.reduce((s, a) => s + a.population_count, 0);
  const totalBiomass = group.assignments.reduce((s, a) => s + a.biomass_kg, 0);
  const anyActive = group.assignments.some((a) => a.is_active);
  const representative = group.assignments[0];

  return {
    id: makeGroupNodeId(group),
    type: "container",
    position: { x: 0, y: 0 },
    data: {
      assignmentId: representative.id,
      containerName: group.stationName !== "Unknown"
        ? `${group.hallName} (${group.assignments.length})`
        : `${group.hallName} (${group.assignments.length})`,
      containerId: representative.container_id,
      lifecycleStage: group.lifecycleStage,
      stageOrder: group.stageOrder,
      populationCount: totalPop,
      biomassKg: totalBiomass,
      avgWeightG: totalPop > 0 ? (totalBiomass * 1000) / totalPop : null,
      assignmentDate: representative.assignment_date,
      departureDate: representative.departure_date,
      isActive: anyActive,
      locationType: representative.location_type,
      stationName: group.stationName,
      hallName: group.hallName,
      areaName: representative.area_name,
      carrierName: representative.carrier_name,
      carrierType: representative.carrier_type,
      isMixed: false,
      isCollapsedGroup: true,
      groupedCount: group.assignments.length,
      groupedAssignments: group.assignments,
    },
  };
}

function buildStageHeaderNode(
  stageName: string,
  stageOrder: number,
  stageAssignments: AssignmentRecord[],
  internalTransferCount: number,
): Node<StageHeaderData, "stageHeader"> {
  return {
    id: `stage-header-${stageOrder}`,
    type: "stageHeader",
    position: { x: 0, y: 0 },
    data: {
      stageName,
      stageOrder,
      assignmentCount: stageAssignments.length,
      totalPopulation: stageAssignments.reduce((s, a) => s + a.population_count, 0),
      internalTransferCount,
    },
    draggable: false,
    selectable: true,
  };
}

export function buildNodes(
  assignments: AssignmentRecord[],
  collapseMode: CollapseMode,
  mixedContainerIds: Set<number>,
  actions: TransferActionRecord[] = [],
): ContainerFlowNode[] {
  const nodes: ContainerFlowNode[] = [];

  const stageMap = new Map<string, AssignmentRecord[]>();
  for (const a of assignments) {
    const key = a.lifecycle_stage_name;
    if (!stageMap.has(key)) stageMap.set(key, []);
    stageMap.get(key)!.push(a);
  }

  const assignmentStageMap = new Map<number, string>();
  for (const a of assignments) {
    assignmentStageMap.set(a.id, a.lifecycle_stage_name);
  }

  for (const [stageName, stageAssignments] of stageMap) {
    const order = stageAssignments[0]?.stage_order ?? 999;
    const stageAssignmentIds = new Set(stageAssignments.map((a) => a.id));
    const internalCount = actions.filter(
      (act) => stageAssignmentIds.has(act.source_assignment_id) && act.dest_assignment_id && stageAssignmentIds.has(act.dest_assignment_id),
    ).length;
    nodes.push(buildStageHeaderNode(stageName, order, stageAssignments, internalCount));
  }

  if (collapseMode === "collapsed") {
    const groups = groupByHall(assignments);
    for (const group of groups) {
      if (group.assignments.length === 1) {
        nodes.push(buildContainerNode(group.assignments[0], mixedContainerIds.has(group.assignments[0].container_id)));
      } else {
        nodes.push(buildGroupNode(group));
      }
    }
  } else {
    for (const a of assignments) {
      nodes.push(buildContainerNode(a, mixedContainerIds.has(a.container_id)));
    }
  }

  return nodes;
}

export function buildEdges(
  actions: TransferActionRecord[],
  assignments: AssignmentRecord[],
  collapseMode: CollapseMode,
): ContainerFlowEdge[] {
  const maxTransferred = Math.max(1, ...actions.map((a) => a.transferred_count));
  const assignmentToGroup = new Map<number, string>();

  if (collapseMode === "collapsed") {
    const groups = groupByHall(assignments);
    for (const group of groups) {
      const groupId = group.assignments.length === 1
        ? makeNodeId(group.assignments[0].id)
        : makeGroupNodeId(group);
      for (const a of group.assignments) {
        assignmentToGroup.set(a.id, groupId);
      }
    }
  }

  const edgeAggregation = new Map<string, {
    totalTransferred: number;
    totalBiomass: number;
    totalMortality: number;
    actions: TransferActionRecord[];
  }>();

  const edges: ContainerFlowEdge[] = [];

  for (const action of actions) {
    if (!action.dest_assignment_id) continue;

    const sourceNodeId = collapseMode === "collapsed"
      ? assignmentToGroup.get(action.source_assignment_id) ?? makeNodeId(action.source_assignment_id)
      : makeNodeId(action.source_assignment_id);
    const targetNodeId = collapseMode === "collapsed"
      ? assignmentToGroup.get(action.dest_assignment_id) ?? makeNodeId(action.dest_assignment_id)
      : makeNodeId(action.dest_assignment_id);

    if (sourceNodeId === targetNodeId) continue;

    if (collapseMode === "collapsed") {
      const aggregateKey = `${sourceNodeId}->${targetNodeId}`;
      if (!edgeAggregation.has(aggregateKey)) {
        edgeAggregation.set(aggregateKey, { totalTransferred: 0, totalBiomass: 0, totalMortality: 0, actions: [] });
      }
      const agg = edgeAggregation.get(aggregateKey)!;
      agg.totalTransferred += action.transferred_count;
      agg.totalBiomass += action.transferred_biomass_kg;
      agg.totalMortality += action.mortality_during_transfer;
      agg.actions.push(action);
    } else {
      edges.push({
        id: `edge-action-${action.id}`,
        source: sourceNodeId,
        target: targetNodeId,
        type: "transfer",
        data: {
          transferredCount: action.transferred_count,
          transferredBiomassKg: action.transferred_biomass_kg,
          mortalityCount: action.mortality_during_transfer,
          actionCount: 1,
          dateRangeStart: action.actual_execution_date,
          dateRangeEnd: action.actual_execution_date,
          legType: action.leg_type,
          transferMethod: action.transfer_method,
          workflowNumber: action.workflow_number,
          executionDate: action.actual_execution_date,
          maxTransferredCount: maxTransferred,
        },
      });
    }
  }

  if (collapseMode === "collapsed") {
    const aggMaxTransferred = Math.max(
      1,
      ...Array.from(edgeAggregation.values()).map((a) => a.totalTransferred),
    );
    for (const [key, agg] of edgeAggregation) {
      const [source, target] = key.split("->");
      const dates = agg.actions
        .map((a) => a.actual_execution_date)
        .filter(Boolean)
        .sort();
      edges.push({
        id: `edge-agg-${key}`,
        source,
        target,
        type: "transfer",
        data: {
          transferredCount: agg.totalTransferred,
          transferredBiomassKg: agg.totalBiomass,
          mortalityCount: agg.totalMortality,
          actionCount: agg.actions.length,
          dateRangeStart: dates[0] ?? null,
          dateRangeEnd: dates[dates.length - 1] ?? null,
          legType: agg.actions[0]?.leg_type ?? null,
          transferMethod: agg.actions[0]?.transfer_method ?? null,
          workflowNumber: `${agg.actions.length} transfers`,
          executionDate: agg.actions[0]?.actual_execution_date ?? null,
          maxTransferredCount: aggMaxTransferred,
        },
      });
    }
  }

  return edges;
}

export function normalizeTransferAction(raw: any, workflow?: WorkflowRecord): TransferActionRecord {
  return {
    id: raw.id,
    workflow_id: typeof raw.workflow === "object" ? raw.workflow?.id : raw.workflow,
    workflow_number: workflow?.workflow_number ?? raw.workflow_number ?? "",
    action_number: raw.action_number,
    status: raw.status,
    source_assignment_id: typeof raw.source_assignment === "object" ? raw.source_assignment?.id : raw.source_assignment,
    dest_assignment_id: raw.dest_assignment
      ? (typeof raw.dest_assignment === "object" ? raw.dest_assignment?.id : raw.dest_assignment)
      : null,
    source_population_before: raw.source_population_before ?? 0,
    transferred_count: raw.transferred_count ?? 0,
    transferred_biomass_kg: parseFloat(raw.transferred_biomass_kg ?? 0),
    mortality_during_transfer: raw.mortality_during_transfer ?? 0,
    leg_type: raw.leg_type ?? null,
    transfer_method: raw.transfer_method ?? null,
    actual_execution_date: raw.actual_execution_date ?? null,
    allow_mixed: raw.allow_mixed ?? false,
  };
}
