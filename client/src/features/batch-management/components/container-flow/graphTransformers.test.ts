import { describe, it, expect } from "vitest";
import {
  classifyLocationType,
  normalizeAssignment,
  groupByHall,
  buildNodes,
  buildEdges,
  normalizeTransferAction,
} from "./graphTransformers";
import type { AssignmentRecord, TransferActionRecord, WorkflowRecord } from "./containerFlow.types";

function makeAssignment(overrides: Partial<AssignmentRecord> = {}): AssignmentRecord {
  return {
    id: 1,
    batch_id: 16,
    container_id: 100,
    container_name: "Tank A1",
    lifecycle_stage_id: 1,
    lifecycle_stage_name: "Egg&Alevin",
    stage_order: 1,
    population_count: 300_000,
    biomass_kg: 30,
    avg_weight_g: 0.1,
    assignment_date: "2024-05-26",
    departure_date: "2024-08-24",
    is_active: false,
    location_type: "FRESHWATER",
    station_name: "S03 Nordtoftir",
    hall_name: "Kleking",
    area_name: null,
    carrier_name: null,
    carrier_type: null,
    ...overrides,
  };
}

function makeAction(overrides: Partial<TransferActionRecord> = {}): TransferActionRecord {
  return {
    id: 1,
    workflow_id: 1,
    workflow_number: "TRF-001",
    action_number: 1,
    status: "COMPLETED",
    source_assignment_id: 1,
    dest_assignment_id: 2,
    transferred_count: 300_000,
    transferred_biomass_kg: 30,
    mortality_during_transfer: 0,
    leg_type: null,
    transfer_method: "PUMP",
    actual_execution_date: "2024-08-24",
    allow_mixed: false,
    ...overrides,
  };
}

describe("classifyLocationType", () => {
  it("classifies freshwater containers by hall_id", () => {
    expect(classifyLocationType({ hall_id: 22 })).toBe("FRESHWATER");
  });

  it("classifies sea containers by area_id", () => {
    expect(classifyLocationType({ area_id: 5 })).toBe("SEA");
  });

  it("classifies truck transport", () => {
    expect(classifyLocationType({ carrier_id: 3, carrier_type: "TRUCK" })).toBe("TRANSPORT_TRUCK");
  });

  it("classifies vessel transport", () => {
    expect(classifyLocationType({ carrier_id: 7, carrier_type: "VESSEL" })).toBe("TRANSPORT_VESSEL");
  });

  it("returns UNKNOWN when no location context set", () => {
    expect(classifyLocationType({})).toBe("UNKNOWN");
  });
});

describe("groupByHall", () => {
  it("groups assignments by station + hall + stage", () => {
    const assignments = [
      makeAssignment({ id: 1, station_name: "S03", hall_name: "Kleking", lifecycle_stage_name: "Egg&Alevin" }),
      makeAssignment({ id: 2, station_name: "S03", hall_name: "Kleking", lifecycle_stage_name: "Egg&Alevin" }),
      makeAssignment({ id: 3, station_name: "S08", hall_name: "Kleking", lifecycle_stage_name: "Egg&Alevin" }),
    ];

    const groups = groupByHall(assignments);
    expect(groups).toHaveLength(2);
    expect(groups[0].assignments).toHaveLength(2);
    expect(groups[1].assignments).toHaveLength(1);
  });

  it("uses area_name for sea containers", () => {
    const assignments = [
      makeAssignment({ id: 1, station_name: null, hall_name: null, area_name: "A19 Vagur", lifecycle_stage_name: "Adult", location_type: "SEA" }),
      makeAssignment({ id: 2, station_name: null, hall_name: null, area_name: "A19 Vagur", lifecycle_stage_name: "Adult", location_type: "SEA" }),
    ];

    const groups = groupByHall(assignments);
    expect(groups).toHaveLength(1);
    expect(groups[0].hallName).toBe("A19 Vagur");
    expect(groups[0].assignments).toHaveLength(2);
  });
});

describe("buildNodes", () => {
  it("creates stage headers and container nodes", () => {
    const assignments = [
      makeAssignment({ id: 1, lifecycle_stage_name: "Egg&Alevin", stage_order: 1 }),
      makeAssignment({ id: 2, lifecycle_stage_name: "Fry", stage_order: 2 }),
    ];
    const nodes = buildNodes(assignments, "expanded", new Set());

    const headers = nodes.filter((n) => n.type === "stageHeader");
    const containers = nodes.filter((n) => n.type === "container");
    expect(headers).toHaveLength(2);
    expect(containers).toHaveLength(2);
  });

  it("collapses same-hall assignments into group nodes", () => {
    const assignments = [
      makeAssignment({ id: 1, station_name: "S03", hall_name: "Kleking" }),
      makeAssignment({ id: 2, station_name: "S03", hall_name: "Kleking" }),
      makeAssignment({ id: 3, station_name: "S03", hall_name: "Kleking" }),
    ];
    const nodes = buildNodes(assignments, "collapsed", new Set());

    const containers = nodes.filter((n) => n.type === "container");
    expect(containers).toHaveLength(1);
    expect((containers[0].data as any).isCollapsedGroup).toBe(true);
    expect((containers[0].data as any).groupedCount).toBe(3);
  });
});

describe("buildEdges", () => {
  it("creates edges from transfer actions", () => {
    const assignments = [
      makeAssignment({ id: 1, lifecycle_stage_name: "Egg&Alevin" }),
      makeAssignment({ id: 2, lifecycle_stage_name: "Fry" }),
    ];
    const actions = [
      makeAction({ id: 1, source_assignment_id: 1, dest_assignment_id: 2, transferred_count: 300_000 }),
    ];

    const edges = buildEdges(actions, assignments, "expanded");
    expect(edges).toHaveLength(1);
    expect(edges[0].data!.transferredCount).toBe(300_000);
    expect(edges[0].data!.actionCount).toBe(1);
  });

  it("aggregates multiple actions into single edge in collapsed mode", () => {
    const assignments = [
      makeAssignment({ id: 1, station_name: "S03", hall_name: "Kleking", lifecycle_stage_name: "Egg&Alevin" }),
      makeAssignment({ id: 2, station_name: "S03", hall_name: "Kleking", lifecycle_stage_name: "Egg&Alevin" }),
      makeAssignment({ id: 3, station_name: "S08", hall_name: "Start", lifecycle_stage_name: "Fry", stage_order: 2 }),
      makeAssignment({ id: 4, station_name: "S08", hall_name: "Start", lifecycle_stage_name: "Fry", stage_order: 2 }),
    ];
    const actions = [
      makeAction({ id: 1, source_assignment_id: 1, dest_assignment_id: 3, transferred_count: 100_000, actual_execution_date: "2024-08-20" }),
      makeAction({ id: 2, source_assignment_id: 2, dest_assignment_id: 4, transferred_count: 200_000, actual_execution_date: "2024-08-25" }),
    ];

    const edges = buildEdges(actions, assignments, "collapsed");
    expect(edges).toHaveLength(1);
    expect(edges[0].data!.transferredCount).toBe(300_000);
    expect(edges[0].data!.actionCount).toBe(2);
    expect(edges[0].data!.dateRangeStart).toBe("2024-08-20");
    expect(edges[0].data!.dateRangeEnd).toBe("2024-08-25");
  });

  it("skips self-loops in collapsed mode", () => {
    const assignments = [
      makeAssignment({ id: 1, station_name: "S03", hall_name: "Kleking", lifecycle_stage_name: "Egg&Alevin" }),
      makeAssignment({ id: 2, station_name: "S03", hall_name: "Kleking", lifecycle_stage_name: "Egg&Alevin" }),
    ];
    const actions = [
      makeAction({ id: 1, source_assignment_id: 1, dest_assignment_id: 2 }),
    ];

    const edges = buildEdges(actions, assignments, "collapsed");
    expect(edges).toHaveLength(0);
  });
});

describe("normalizeTransferAction", () => {
  it("extracts fields from raw API response with nested objects", () => {
    const workflow: WorkflowRecord = {
      id: 26,
      workflow_number: "TRF-001",
      workflow_type: "LIFECYCLE_TRANSITION",
      status: "COMPLETED",
      source_stage: "Egg&Alevin",
      dest_stage: "Fry",
      is_dynamic_execution: false,
      planned_start_date: "2024-08-24",
      actual_completion_date: "2024-08-24",
    };

    const raw = {
      id: 101,
      workflow: { id: 26 },
      action_number: 1,
      status: "COMPLETED",
      source_assignment: { id: 1328 },
      dest_assignment: { id: 1476 },
      transferred_count: 286671,
      transferred_biomass_kg: "1720.03",
      mortality_during_transfer: 50,
      leg_type: null,
      transfer_method: "PUMP",
      actual_execution_date: "2024-08-24",
      allow_mixed: false,
    };

    const result = normalizeTransferAction(raw, workflow);
    expect(result.id).toBe(101);
    expect(result.workflow_id).toBe(26);
    expect(result.source_assignment_id).toBe(1328);
    expect(result.dest_assignment_id).toBe(1476);
    expect(result.transferred_count).toBe(286671);
    expect(result.transferred_biomass_kg).toBeCloseTo(1720.03);
    expect(result.workflow_number).toBe("TRF-001");
  });
});
