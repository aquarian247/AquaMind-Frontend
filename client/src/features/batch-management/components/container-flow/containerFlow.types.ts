import type { Node, Edge } from "@xyflow/react";

export type LocationType = "FRESHWATER" | "TRANSPORT_TRUCK" | "TRANSPORT_VESSEL" | "SEA" | "UNKNOWN";

export interface AssignmentRecord {
  id: number;
  batch_id: number;
  container_id: number;
  container_name: string;
  lifecycle_stage_id: number;
  lifecycle_stage_name: string;
  stage_order: number;
  population_count: number;
  biomass_kg: number;
  avg_weight_g: number | null;
  assignment_date: string;
  departure_date: string | null;
  is_active: boolean;
  location_type: LocationType;
  station_name: string | null;
  hall_name: string | null;
  area_name: string | null;
  carrier_name: string | null;
  carrier_type: string | null;
}

export interface TransferActionRecord {
  id: number;
  workflow_id: number;
  workflow_number: string;
  action_number: number;
  status: string;
  source_assignment_id: number;
  dest_assignment_id: number | null;
  source_population_before: number;
  transferred_count: number;
  transferred_biomass_kg: number;
  mortality_during_transfer: number;
  leg_type: string | null;
  transfer_method: string | null;
  actual_execution_date: string | null;
  allow_mixed: boolean;
}

export interface WorkflowRecord {
  id: number;
  workflow_number: string;
  workflow_type: string;
  status: string;
  source_stage: string;
  dest_stage: string | null;
  is_dynamic_execution: boolean;
  planned_start_date: string;
  actual_completion_date: string | null;
}

export interface ContainerNodeData {
  [key: string]: unknown;
  assignmentId: number;
  containerName: string;
  containerId: number;
  lifecycleStage: string;
  stageOrder: number;
  populationCount: number;
  biomassKg: number;
  avgWeightG: number | null;
  assignmentDate: string;
  departureDate: string | null;
  isActive: boolean;
  locationType: LocationType;
  stationName: string | null;
  hallName: string | null;
  areaName: string | null;
  carrierName: string | null;
  carrierType: string | null;
  isMixed: boolean;
  isCollapsedGroup: boolean;
  groupedCount: number;
  groupedAssignments: AssignmentRecord[];
}

export interface StageHeaderData {
  [key: string]: unknown;
  stageName: string;
  stageOrder: number;
  assignmentCount: number;
  totalPopulation: number;
  internalTransferCount: number;
}

export interface TransferEdgeData {
  [key: string]: unknown;
  transferredCount: number;
  transferredBiomassKg: number;
  mortalityCount: number;
  actionCount: number;
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
  legType: string | null;
  transferMethod: string | null;
  workflowNumber: string;
  executionDate: string | null;
  maxTransferredCount: number;
}

export type ContainerFlowNode = Node<ContainerNodeData, "container"> | Node<StageHeaderData, "stageHeader">;
export type ContainerFlowEdge = Edge<TransferEdgeData>;

export interface HallGroup {
  key: string;
  stationName: string;
  hallName: string;
  stageOrder: number;
  lifecycleStage: string;
  assignments: AssignmentRecord[];
}

export interface ContainerFlowData {
  nodes: ContainerFlowNode[];
  edges: ContainerFlowEdge[];
  assignments: AssignmentRecord[];
  actions: TransferActionRecord[];
  workflows: WorkflowRecord[];
  isLoading: boolean;
  error: Error | null;
}

export type ViewMode = "graph" | "swimlane" | "table";
export type CollapseMode = "expanded" | "collapsed";

// --- Swimlane types ---

export interface SwimlaneGroup {
  id: string;
  title: string;
  /** Parent group id for tree hierarchy (null = root) */
  parent: string | null;
  /** Depth: 0 = stage, 1 = station, 2 = hall, 3 = container */
  depth: number;
  stageOrder: number;
  stageColor: string;
  isLeaf: boolean;
}

export interface AssignmentTransferSummary {
  totalIn: number;
  totalOut: number;
  biomassIn: number;
  biomassOut: number;
  mortalityOut: number;
}

export interface SwimlaneItem {
  id: number;
  group: string;
  title: string;
  start_time: number;
  end_time: number;
  assignment: AssignmentRecord;
  stageColor: string;
  isActive: boolean;
  transfers: AssignmentTransferSummary;
  /** population_count is the recorded value; entryPop is back-computed from transfers */
  entryPopulation: number;
  exitPopulation: number;
  entryBiomass: number;
  exitBiomass: number;
}

export interface TransferConnection {
  id: string;
  sourceAssignmentId: number;
  destAssignmentId: number;
  transferredCount: number;
  transferredBiomassKg: number;
  mortalityCount: number;
  executionDate: string | null;
  sourceGroupId: string;
  destGroupId: string;
  destStageColor: string;
}
