import { describe, it, expect } from "vitest";
import {
  collectAssignmentHighlightState,
  buildSwimlaneItems,
  buildTransferConnections,
  computeTrailingTimeWindow,
  collectLaneHighlightState,
  collectTransferHighlightState,
  makeTransferGroupId,
} from "./swimlaneTransformers";
import type {
  AssignmentRecord,
  TransferActionRecord,
  TransferConnection,
} from "./containerFlow.types";

function makeAssignment(overrides: Partial<AssignmentRecord> = {}): AssignmentRecord {
  return {
    id: 1,
    batch_id: 1119,
    container_id: 100,
    container_name: "01",
    lifecycle_stage_id: 1,
    lifecycle_stage_name: "Egg&Alevin",
    stage_order: 1,
    population_count: 349_999,
    biomass_kg: 0,
    avg_weight_g: null,
    assignment_date: "2023-10-27",
    departure_date: "2024-01-16",
    is_active: false,
    location_type: "FRESHWATER",
    station_name: "S16 Glyvradalur",
    hall_name: "Klekiholl",
    area_name: null,
    carrier_name: null,
    carrier_type: null,
    ...overrides,
  };
}

function makeAction(overrides: Partial<TransferActionRecord> = {}): TransferActionRecord {
  return {
    id: 1,
    workflow_id: 6992,
    workflow_number: "TRF-6992",
    action_number: 1,
    status: "COMPLETED",
    source_assignment_id: 1,
    dest_assignment_id: 2,
    source_population_before: 349_999,
    transferred_count: 42_979,
    transferred_biomass_kg: 0.43,
    mortality_during_transfer: 0,
    leg_type: null,
    transfer_method: "PUMP",
    actual_execution_date: "2024-01-16",
    allow_mixed: false,
    ...overrides,
  };
}

function makeConnection(overrides: Partial<TransferConnection> = {}): TransferConnection {
  return {
    id: "wf-1:1:2024-01-16:1->2",
    transferGroupId: "wf-1:1:2024-01-16",
    sourceAssignmentId: 1,
    destAssignmentId: 2,
    transferredCount: 42_979,
    transferredBiomassKg: 0.43,
    mortalityCount: 0,
    executionDate: "2024-01-16",
    sourceGroupId: "stage-1/stn-S16 Glyvradalur/hall-Klekiholl/c-100",
    destGroupId: "stage-2/stn-S16 Glyvradalur/hall-Hall B/c-200",
    destStageColor: "#65a30d",
    ...overrides,
  };
}

describe("buildSwimlaneItems", () => {
  it("uses raw assignment values for swimlane labels and tooltips", () => {
    const eggAssignment = makeAssignment({
      id: 25084,
      container_name: "01",
      population_count: 349_999,
      biomass_kg: 0,
    });
    const fryAssignment = makeAssignment({
      id: 27146,
      container_id: 200,
      container_name: "I01",
      lifecycle_stage_id: 2,
      lifecycle_stage_name: "Fry",
      stage_order: 2,
      population_count: 42_979,
      biomass_kg: 0.43,
      avg_weight_g: 0.01,
      assignment_date: "2024-01-16",
      departure_date: "2024-04-16",
    });

    const items = buildSwimlaneItems(
      [eggAssignment, fryAssignment],
      [
        makeAction({
          id: 1,
          source_assignment_id: eggAssignment.id,
          dest_assignment_id: fryAssignment.id,
          transferred_count: 42_979,
          transferred_biomass_kg: 0.43,
        }),
        makeAction({
          id: 2,
          source_assignment_id: eggAssignment.id,
          dest_assignment_id: 999,
          transferred_count: 274_816,
          transferred_biomass_kg: 0,
        }),
        makeAction({
          id: 3,
          source_assignment_id: fryAssignment.id,
          dest_assignment_id: 998,
          transferred_count: 35_014,
          transferred_biomass_kg: 0.35,
        }),
      ],
    );

    const eggItem = items.find((item) => item.id === eggAssignment.id);
    const fryItem = items.find((item) => item.id === fryAssignment.id);

    expect(eggItem).toBeDefined();
    expect(eggItem?.populationCount).toBe(349_999);
    expect(eggItem?.biomassKg).toBe(0);
    expect(eggItem?.transfers.totalOut).toBe(317_795);

    expect(fryItem).toBeDefined();
    expect(fryItem?.populationCount).toBe(42_979);
    expect(fryItem?.biomassKg).toBeCloseTo(0.43);
    expect(fryItem?.transfers.totalIn).toBe(42_979);
    expect(fryItem?.transfers.totalOut).toBe(35_014);
  });
});

describe("buildTransferConnections", () => {
  it("groups sibling recipients under a shared transferGroupId and keeps separate events distinct", () => {
    const source = makeAssignment({ id: 1, container_id: 100, container_name: "01" });
    const destA = makeAssignment({
      id: 2,
      container_id: 200,
      container_name: "I01",
      lifecycle_stage_id: 2,
      lifecycle_stage_name: "Fry",
      stage_order: 2,
      station_name: "S16 Glyvradalur",
      hall_name: "Hall B",
    });
    const destB = makeAssignment({
      id: 3,
      container_id: 201,
      container_name: "I02",
      lifecycle_stage_id: 2,
      lifecycle_stage_name: "Fry",
      stage_order: 2,
      station_name: "S16 Glyvradalur",
      hall_name: "Hall B",
    });

    const dayOneGroupId = makeTransferGroupId({
      workflow_id: 6992,
      source_assignment_id: 1,
      actual_execution_date: "2024-01-16",
    });

    const connections = buildTransferConnections(
      [
        makeAction({
          id: 1,
          workflow_id: 6992,
          source_assignment_id: 1,
          dest_assignment_id: 2,
          transferred_count: 10,
          actual_execution_date: "2024-01-16",
        }),
        makeAction({
          id: 2,
          workflow_id: 6992,
          source_assignment_id: 1,
          dest_assignment_id: 3,
          transferred_count: 20,
          actual_execution_date: "2024-01-16",
        }),
        makeAction({
          id: 3,
          workflow_id: 6992,
          source_assignment_id: 1,
          dest_assignment_id: 2,
          transferred_count: 5,
          actual_execution_date: "2024-01-16",
        }),
        makeAction({
          id: 4,
          workflow_id: 6992,
          source_assignment_id: 1,
          dest_assignment_id: 2,
          transferred_count: 7,
          actual_execution_date: "2024-01-17",
        }),
      ],
      [source, destA, destB],
    );

    const dayOneConnections = connections.filter((conn) => conn.transferGroupId === dayOneGroupId);
    expect(dayOneConnections).toHaveLength(2);
    expect(dayOneConnections.map((conn) => conn.destAssignmentId).sort()).toEqual([2, 3]);
    expect(dayOneConnections.find((conn) => conn.destAssignmentId === 2)?.transferredCount).toBe(15);

    const dayTwoConnections = connections.filter((conn) => conn.executionDate === "2024-01-17");
    expect(dayTwoConnections).toHaveLength(1);
    expect(dayTwoConnections[0].transferGroupId).not.toBe(dayOneGroupId);
  });
});

describe("swimlane highlight helpers", () => {
  it("collects downstream lane highlights transitively from a selected lane", () => {
    const connections = [
      makeConnection({
        id: "c1",
        transferGroupId: "g1",
        sourceGroupId: "lane-a",
        destGroupId: "lane-b",
      }),
      makeConnection({
        id: "c2",
        transferGroupId: "g2",
        sourceGroupId: "lane-b",
        destGroupId: "lane-c",
      }),
      makeConnection({
        id: "c3",
        transferGroupId: "g3",
        sourceGroupId: "lane-a",
        destGroupId: "lane-d",
      }),
      makeConnection({
        id: "c4",
        transferGroupId: "g4",
        sourceGroupId: "lane-x",
        destGroupId: "lane-y",
      }),
    ];

    const result = collectLaneHighlightState("lane-a", connections);

    expect(Array.from(result.groupIds).sort()).toEqual(["lane-a", "lane-b", "lane-c", "lane-d"]);
    expect(Array.from(result.connectionIds).sort()).toEqual(["c1", "c2", "c3"]);
  });

  it("collects only the immediate transfer event source and recipients for transfer selection", () => {
    const connections = [
      makeConnection({
        id: "c1",
        transferGroupId: "g1",
        sourceGroupId: "lane-a",
        destGroupId: "lane-b",
      }),
      makeConnection({
        id: "c2",
        transferGroupId: "g1",
        sourceGroupId: "lane-a",
        destGroupId: "lane-c",
      }),
      makeConnection({
        id: "c3",
        transferGroupId: "g2",
        sourceGroupId: "lane-b",
        destGroupId: "lane-d",
      }),
    ];

    const result = collectTransferHighlightState("g1", connections);

    expect(Array.from(result.groupIds).sort()).toEqual(["lane-a", "lane-b", "lane-c"]);
    expect(Array.from(result.connectionIds).sort()).toEqual(["c1", "c2"]);
    expect(Array.from(result.assignmentIds).sort()).toEqual([1, 2]);
  });

  it("collects only the selected assignment lineage, not unrelated later assignments in the same lane", () => {
    const connections = [
      makeConnection({
        id: "c1",
        transferGroupId: "g1",
        sourceAssignmentId: 10,
        destAssignmentId: 11,
        sourceGroupId: "lane-a",
        destGroupId: "lane-b",
      }),
      makeConnection({
        id: "c2",
        transferGroupId: "g2",
        sourceAssignmentId: 11,
        destAssignmentId: 12,
        sourceGroupId: "lane-b",
        destGroupId: "lane-c",
      }),
      makeConnection({
        id: "c3",
        transferGroupId: "g3",
        sourceAssignmentId: 99,
        destAssignmentId: 100,
        sourceGroupId: "lane-a",
        destGroupId: "lane-d",
      }),
    ];
    const assignmentGroupById = new Map<number, string>([
      [10, "lane-a"],
      [11, "lane-b"],
      [12, "lane-c"],
      [99, "lane-a"],
      [100, "lane-d"],
    ]);

    const result = collectAssignmentHighlightState(10, connections, assignmentGroupById);

    expect(Array.from(result.assignmentIds).sort()).toEqual([10, 11, 12]);
    expect(Array.from(result.groupIds).sort()).toEqual(["lane-a", "lane-b", "lane-c"]);
    expect(Array.from(result.connectionIds).sort()).toEqual(["c1", "c2"]);
  });
});

describe("computeTrailingTimeWindow", () => {
  it("returns a one-year window ending at the latest assignment or transfer activity", () => {
    const assignments = [
      makeAssignment({
        assignment_date: "2024-01-01",
        departure_date: "2024-03-01",
      }),
      makeAssignment({
        id: 2,
        container_id: 200,
        container_name: "I01",
        assignment_date: "2024-04-01",
        departure_date: "2024-05-15",
      }),
    ];
    const actions = [
      makeAction({
        id: 3,
        actual_execution_date: "2024-06-20",
      }),
    ];

    const result = computeTrailingTimeWindow(assignments, actions, 365 * 24 * 60 * 60 * 1000);

    expect(result).not.toBeNull();
    expect(result?.end).toBe(new Date("2024-06-20").getTime());
    expect(result?.start).toBe(new Date("2024-06-20").getTime() - 365 * 24 * 60 * 60 * 1000);
  });
});
