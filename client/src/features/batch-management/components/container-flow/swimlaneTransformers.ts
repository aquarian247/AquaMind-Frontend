import type {
  AssignmentRecord,
  TransferActionRecord,
  SwimlaneGroup,
  SwimlaneItem,
  TransferConnection,
  AssignmentTransferSummary,
} from "./containerFlow.types";

/**
 * Lifecycle stage color palette: warm (early) to cool (late).
 * Keys are lowercased stage names.
 */
const STAGE_COLORS: Record<string, string> = {
  "egg&alevin": "#d97706",  // amber-600
  "egg & alevin": "#d97706",
  egg: "#d97706",
  alevin: "#d97706",
  fry: "#65a30d",           // lime-600
  parr: "#16a34a",          // green-600
  smolt: "#0d9488",         // teal-600
  "post-smolt": "#2563eb",  // blue-600
  postsmolt: "#2563eb",
  adult: "#4f46e5",         // indigo-600
  broodstock: "#7c3aed",   // violet-600
};

const DEFAULT_STAGE_COLOR = "#6b7280"; // gray-500

export function getStageColor(stageName: string): string {
  return STAGE_COLORS[stageName.toLowerCase().trim()] ?? DEFAULT_STAGE_COLOR;
}

/**
 * All stage colors for use in CSS variables and legend rendering.
 */
export const STAGE_COLOR_ENTRIES = Object.entries(STAGE_COLORS);

function locationLabel(a: AssignmentRecord): { station: string; hall: string } {
  const station = a.station_name ?? a.area_name ?? "Other";
  const hall = a.hall_name ?? a.area_name ?? "Default";
  return { station, hall };
}

/**
 * Build hierarchical timeline groups from assignment records.
 * Hierarchy: Stage → Station → Hall → Container (leaf rows).
 * Sorted by stage_order (egg top, adult bottom), then station, then hall, then container.
 */
export function buildSwimlaneGroups(assignments: AssignmentRecord[]): SwimlaneGroup[] {
  const groups: SwimlaneGroup[] = [];
  const seen = new Set<string>();

  const sorted = [...assignments].sort((a, b) => {
    const so = a.stage_order - b.stage_order;
    if (so !== 0) return so;
    const { station: sa, hall: ha } = locationLabel(a);
    const { station: sb, hall: hb } = locationLabel(b);
    const sc = sa.localeCompare(sb);
    if (sc !== 0) return sc;
    const hc = ha.localeCompare(hb);
    if (hc !== 0) return hc;
    return a.container_name.localeCompare(b.container_name);
  });

  for (const a of sorted) {
    const color = getStageColor(a.lifecycle_stage_name);
    const { station, hall } = locationLabel(a);

    const stageId = `stage-${a.stage_order}`;
    if (!seen.has(stageId)) {
      seen.add(stageId);
      groups.push({
        id: stageId,
        title: a.lifecycle_stage_name,
        parent: null,
        depth: 0,
        stageOrder: a.stage_order,
        stageColor: color,
        isLeaf: false,
      });
    }

    const stationId = `${stageId}/stn-${station}`;
    if (!seen.has(stationId)) {
      seen.add(stationId);
      groups.push({
        id: stationId,
        title: station,
        parent: stageId,
        depth: 1,
        stageOrder: a.stage_order,
        stageColor: color,
        isLeaf: false,
      });
    }

    const hallId = `${stationId}/hall-${hall}`;
    if (!seen.has(hallId)) {
      seen.add(hallId);
      groups.push({
        id: hallId,
        title: hall,
        parent: stationId,
        depth: 2,
        stageOrder: a.stage_order,
        stageColor: color,
        isLeaf: false,
      });
    }

    const containerId = `${hallId}/c-${a.container_id}`;
    if (!seen.has(containerId)) {
      seen.add(containerId);
      groups.push({
        id: containerId,
        title: a.container_name,
        parent: hallId,
        depth: 3,
        stageOrder: a.stage_order,
        stageColor: color,
        isLeaf: true,
      });
    }
  }

  return groups;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Aggregate COMPLETED transfer actions per assignment (in/out totals).
 * Only completed actions have actually modified population_count on the backend.
 */
function buildTransferSummaries(
  actions: TransferActionRecord[],
): Map<number, AssignmentTransferSummary> {
  const map = new Map<number, AssignmentTransferSummary>();

  const ensure = (id: number): AssignmentTransferSummary => {
    let s = map.get(id);
    if (!s) {
      s = { totalIn: 0, totalOut: 0, biomassIn: 0, biomassOut: 0, mortalityOut: 0 };
      map.set(id, s);
    }
    return s;
  };

  for (const act of actions) {
    if (act.status !== "COMPLETED") continue;

    const src = ensure(act.source_assignment_id);
    src.totalOut += act.transferred_count;
    src.biomassOut += act.transferred_biomass_kg;
    src.mortalityOut += act.mortality_during_transfer;

    if (act.dest_assignment_id) {
      const dst = ensure(act.dest_assignment_id);
      dst.totalIn += act.transferred_count;
      dst.biomassIn += act.transferred_biomass_kg;
    }
  }

  return map;
}

const EMPTY_TRANSFERS: AssignmentTransferSummary = {
  totalIn: 0, totalOut: 0, biomassIn: 0, biomassOut: 0, mortalityOut: 0,
};

/**
 * Build timeline items from assignment records.
 * Each assignment becomes one horizontal bar on the swimlane.
 *
 * The API's population_count is the CURRENT value (updated by every completed
 * transfer). So population_count = exit. We reconstruct entry by reversing
 * the transfer deltas: entry = current + totalOut + mortalityOut - totalIn.
 *
 * biomass_kg is recomputed on save as population_count * avg_weight_g / 1000,
 * so it also reflects the current state. Same reconstruction applies.
 */
export function buildSwimlaneItems(
  assignments: AssignmentRecord[],
  actions: TransferActionRecord[],
): SwimlaneItem[] {
  const summaries = buildTransferSummaries(actions);

  return assignments.map((a) => {
    const { station, hall } = locationLabel(a);
    const groupId = `stage-${a.stage_order}/stn-${station}/hall-${hall}/c-${a.container_id}`;
    const start = new Date(a.assignment_date).getTime();
    const end = a.departure_date
      ? new Date(a.departure_date).getTime()
      : Date.now();
    const safeEnd = end <= start ? start + DAY_MS : end;

    const transfers = summaries.get(a.id) ?? EMPTY_TRANSFERS;

    const exitPop = a.population_count;
    const entryPop = Math.max(
      0,
      a.population_count + transfers.totalOut + transfers.mortalityOut - transfers.totalIn,
    );

    const exitBio = a.biomass_kg;
    const entryBio = Math.max(
      0,
      a.biomass_kg + transfers.biomassOut - transfers.biomassIn,
    );

    return {
      id: a.id,
      group: groupId,
      title: a.container_name,
      start_time: start,
      end_time: safeEnd,
      assignment: a,
      stageColor: getStageColor(a.lifecycle_stage_name),
      isActive: a.is_active,
      transfers,
      entryPopulation: entryPop,
      exitPopulation: exitPop,
      entryBiomass: entryBio,
      exitBiomass: exitBio,
    };
  });
}

/**
 * Build transfer connections from actions, mapping source/dest to swimlane group IDs.
 */
export function buildTransferConnections(
  actions: TransferActionRecord[],
  assignments: AssignmentRecord[],
): TransferConnection[] {
  const assignmentMap = new Map<number, AssignmentRecord>();
  for (const a of assignments) assignmentMap.set(a.id, a);

  const connections: TransferConnection[] = [];
  const aggregated = new Map<string, TransferConnection>();

  for (const act of actions) {
    if (act.status !== "COMPLETED") continue;
    if (!act.dest_assignment_id) continue;
    const src = assignmentMap.get(act.source_assignment_id);
    const dst = assignmentMap.get(act.dest_assignment_id);
    if (!src || !dst) continue;

    const srcLoc = locationLabel(src);
    const dstLoc = locationLabel(dst);
    const srcGroup = `stage-${src.stage_order}/stn-${srcLoc.station}/hall-${srcLoc.hall}/c-${src.container_id}`;
    const dstGroup = `stage-${dst.stage_order}/stn-${dstLoc.station}/hall-${dstLoc.hall}/c-${dst.container_id}`;

    const key = `${act.source_assignment_id}->${act.dest_assignment_id}`;
    const existing = aggregated.get(key);
    if (existing) {
      existing.transferredCount += act.transferred_count;
      existing.transferredBiomassKg += act.transferred_biomass_kg;
      existing.mortalityCount += act.mortality_during_transfer;
    } else {
      aggregated.set(key, {
        id: key,
        sourceAssignmentId: act.source_assignment_id,
        destAssignmentId: act.dest_assignment_id,
        transferredCount: act.transferred_count,
        transferredBiomassKg: act.transferred_biomass_kg,
        mortalityCount: act.mortality_during_transfer,
        executionDate: act.actual_execution_date,
        sourceGroupId: srcGroup,
        destGroupId: dstGroup,
        destStageColor: getStageColor(dst.lifecycle_stage_name),
      });
    }
  }

  connections.push(...aggregated.values());
  return connections;
}

/**
 * Compute the overall time range from assignments with padding.
 */
export function computeTimeRange(assignments: AssignmentRecord[]): { start: number; end: number } {
  if (assignments.length === 0) {
    const now = Date.now();
    return { start: now - 30 * DAY_MS, end: now + 30 * DAY_MS };
  }

  let min = Infinity;
  let max = -Infinity;
  for (const a of assignments) {
    const s = new Date(a.assignment_date).getTime();
    const e = a.departure_date ? new Date(a.departure_date).getTime() : Date.now();
    if (s < min) min = s;
    if (e > max) max = e;
  }

  const span = max - min;
  const pad = Math.max(7 * DAY_MS, span * 0.05);
  return { start: min - pad, end: max + pad };
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatPopulation(count: number): string {
  return formatCount(count);
}

export function formatBiomass(kg: number): string {
  if (kg >= 1_000) return `${(kg / 1_000).toFixed(1)}T`;
  return `${kg.toFixed(1)} kg`;
}

export function formatDuration(startMs: number, endMs: number): string {
  const days = Math.round((endMs - startMs) / DAY_MS);
  if (days < 1) return "<1 day";
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month" : `${months} months`;
}
