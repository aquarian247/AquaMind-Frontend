import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import type { TransferEdgeData } from "./containerFlow.types";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function formatShortDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

const LEG_COLORS: Record<string, string> = {
  STATION_TO_TRUCK: "#d97706",
  STATION_TO_VESSEL: "#d97706",
  TRUCK_TO_VESSEL: "#d97706",
  VESSEL_TO_RING: "#0d9488",
};
const DEFAULT_COLOR = "#6b7280";

function TransferEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps & { data?: TransferEdgeData }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  if (!data) {
    return <BaseEdge id={id} path={edgePath} />;
  }

  const ratio = Math.max(0.15, data.transferredCount / data.maxTransferredCount);
  const strokeWidth = 1 + ratio * 4;
  const color = (data.legType && LEG_COLORS[data.legType]) ?? DEFAULT_COLOR;

  const isAggregated = data.actionCount > 1;
  const dateRange = data.dateRangeStart && data.dateRangeEnd
    ? data.dateRangeStart === data.dateRangeEnd
      ? formatShortDate(data.dateRangeStart)
      : `${formatShortDate(data.dateRangeStart)} - ${formatShortDate(data.dateRangeEnd)}`
    : null;

  const tooltip = [
    `${data.transferredCount.toLocaleString()} fish`,
    `${data.actionCount} transfer${data.actionCount !== 1 ? "s" : ""}`,
    dateRange,
    data.mortalityCount > 0 ? `${data.mortalityCount.toLocaleString()} mortality` : null,
  ].filter(Boolean).join("\n");

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth,
          stroke: selected ? "#3b82f6" : color,
          opacity: 0.7,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              lineHeight: 1.3,
              fontWeight: 500,
              padding: isAggregated ? "3px 6px" : "2px 6px",
              borderRadius: isAggregated ? 6 : 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: `1px solid ${selected ? "#93c5fd" : "#e5e7eb"}`,
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(4px)",
              color: selected ? "#1d4ed8" : "#4b5563",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
            title={tooltip}
          >
            {isAggregated && (
              <div style={{ fontSize: 8, color: "#9ca3af", fontWeight: 400 }}>
                {data.actionCount} transfers
              </div>
            )}
            <div style={{ fontWeight: 600 }}>{formatCount(data.transferredCount)}</div>
            {dateRange && (
              <div style={{ fontSize: 8, color: "#9ca3af", fontWeight: 400 }}>
                {dateRange}
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const TransferEdge = memo(TransferEdgeComponent);
