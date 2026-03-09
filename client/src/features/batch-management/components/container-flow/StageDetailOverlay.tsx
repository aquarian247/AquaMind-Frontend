import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AssignmentRecord, TransferActionRecord } from "./containerFlow.types";

interface StageDetailOverlayProps {
  stageName: string | null;
  open: boolean;
  onClose: () => void;
  assignments: AssignmentRecord[];
  actions: TransferActionRecord[];
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.split("T")[0];
}

function GanttBar({
  assignment,
  minTime,
  totalSpan,
}: {
  assignment: AssignmentRecord;
  minTime: number;
  totalSpan: number;
}) {
  const start = new Date(assignment.assignment_date).getTime();
  const end = assignment.departure_date
    ? new Date(assignment.departure_date).getTime()
    : Date.now();
  const leftPct = totalSpan > 0 ? ((start - minTime) / totalSpan) * 100 : 0;
  const widthPct = totalSpan > 0 ? Math.max(1, ((end - start) / totalSpan) * 100) : 100;

  const bgColor = assignment.is_active ? "#3b82f6" : "#93c5fd";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 28 }}>
      <div
        style={{ width: 120, fontSize: 11, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}
        title={assignment.container_name}
      >
        {assignment.container_name}
      </div>
      <div style={{ flex: 1, position: "relative", height: 18, backgroundColor: "#f3f4f6", borderRadius: 3 }}>
        <div
          style={{
            position: "absolute",
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            height: "100%",
            backgroundColor: bgColor,
            borderRadius: 3,
            opacity: 0.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={`${formatDate(assignment.assignment_date)} to ${assignment.departure_date ? formatDate(assignment.departure_date) : "active"} | Pop: ${formatCount(assignment.population_count)}`}
        >
          <span style={{ fontSize: 8, color: "white", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden" }}>
            {formatCount(assignment.population_count)}
          </span>
        </div>
      </div>
      <div style={{ width: 50, fontSize: 9, color: "#9ca3af", textAlign: "right", flexShrink: 0 }}>
        {assignment.is_active ? "Active" : formatDate(assignment.departure_date)}
      </div>
    </div>
  );
}

interface TransferSummaryRow {
  sourceGroup: string;
  destGroup: string;
  actionCount: number;
  totalFish: number;
  dateStart: string;
  dateEnd: string;
}

export function StageDetailOverlay({ stageName, open, onClose, assignments, actions }: StageDetailOverlayProps) {
  const stageAssignments = useMemo(
    () => assignments.filter((a) => a.lifecycle_stage_name === stageName).sort(
      (a, b) => new Date(a.assignment_date).getTime() - new Date(b.assignment_date).getTime(),
    ),
    [assignments, stageName],
  );

  const stageAssignmentIds = useMemo(
    () => new Set(stageAssignments.map((a) => a.id)),
    [stageAssignments],
  );

  const relevantActions = useMemo(
    () => actions.filter(
      (act) => stageAssignmentIds.has(act.source_assignment_id) || (act.dest_assignment_id && stageAssignmentIds.has(act.dest_assignment_id)),
    ),
    [actions, stageAssignmentIds],
  );

  const assignmentLookup = useMemo(() => {
    const m = new Map<number, AssignmentRecord>();
    for (const a of assignments) m.set(a.id, a);
    return m;
  }, [assignments]);

  const transferSummary = useMemo(() => {
    const groups = new Map<string, TransferSummaryRow>();
    for (const act of relevantActions) {
      if (!act.dest_assignment_id) continue;
      const src = assignmentLookup.get(act.source_assignment_id);
      const dst = assignmentLookup.get(act.dest_assignment_id);
      const srcLabel = src ? `${src.container_name} (${src.lifecycle_stage_name})` : `#${act.source_assignment_id}`;
      const dstLabel = dst ? `${dst.container_name} (${dst.lifecycle_stage_name})` : `#${act.dest_assignment_id}`;

      const srcGroup = src?.hall_name ?? src?.area_name ?? srcLabel;
      const dstGroup = dst?.hall_name ?? dst?.area_name ?? dstLabel;
      const key = `${srcGroup} -> ${dstGroup}`;

      if (!groups.has(key)) {
        groups.set(key, { sourceGroup: srcGroup, destGroup: dstGroup, actionCount: 0, totalFish: 0, dateStart: "", dateEnd: "" });
      }
      const g = groups.get(key)!;
      g.actionCount++;
      g.totalFish += act.transferred_count;
      const d = act.actual_execution_date ?? "";
      if (!g.dateStart || d < g.dateStart) g.dateStart = d;
      if (!g.dateEnd || d > g.dateEnd) g.dateEnd = d;
    }
    return Array.from(groups.values()).sort((a, b) => a.dateStart.localeCompare(b.dateStart));
  }, [relevantActions, assignmentLookup]);

  const timeRange = useMemo(() => {
    if (stageAssignments.length === 0) return { min: 0, span: 1 };
    const times = stageAssignments.map((a) => new Date(a.assignment_date).getTime());
    const endTimes = stageAssignments.map((a) => a.departure_date ? new Date(a.departure_date).getTime() : Date.now());
    const min = Math.min(...times);
    const max = Math.max(...endTimes);
    return { min, span: max - min || 1 };
  }, [stageAssignments]);

  const activeCount = stageAssignments.filter((a) => a.is_active).length;
  const totalPop = stageAssignments.reduce((s, a) => s + a.population_count, 0);

  if (!stageName) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {stageName} Stage Detail
            <Badge variant="outline" className="text-xs">{stageAssignments.length} assignments</Badge>
            {activeCount > 0 && <Badge className="text-xs bg-green-600">{activeCount} active</Badge>}
          </DialogTitle>
          <DialogDescription>
            {formatCount(totalPop)} fish across {stageAssignments.length} containers &middot; {relevantActions.length} transfer actions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Assignment Timeline</h4>
            <div className="flex justify-between text-[9px] text-muted-foreground mb-1 px-[128px]">
              <span>{formatDate(stageAssignments[0]?.assignment_date)}</span>
              <span>{stageAssignments.some((a) => a.is_active) ? "Now" : formatDate(stageAssignments[stageAssignments.length - 1]?.departure_date)}</span>
            </div>
            <div className="space-y-1">
              {stageAssignments.map((a) => (
                <GanttBar key={a.id} assignment={a} minTime={timeRange.min} totalSpan={timeRange.span} />
              ))}
            </div>
          </div>

          {transferSummary.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Transfer Summary ({relevantActions.length} actions)
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">From</TableHead>
                      <TableHead className="text-xs">To</TableHead>
                      <TableHead className="text-xs text-right">Transfers</TableHead>
                      <TableHead className="text-xs text-right">Total Fish</TableHead>
                      <TableHead className="text-xs">Date Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transferSummary.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs py-1.5">{row.sourceGroup}</TableCell>
                        <TableCell className="text-xs py-1.5">{row.destGroup}</TableCell>
                        <TableCell className="text-xs text-right py-1.5">{row.actionCount}</TableCell>
                        <TableCell className="text-xs text-right py-1.5">{formatCount(row.totalFish)}</TableCell>
                        <TableCell className="text-xs py-1.5">
                          {formatDate(row.dateStart)}
                          {row.dateEnd !== row.dateStart && ` - ${formatDate(row.dateEnd)}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
