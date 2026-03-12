import { useState, useCallback, useEffect, useRef } from "react";
import type { TransferConnection } from "./containerFlow.types";
import { formatPopulation, formatBiomass } from "./swimlaneTransformers";

interface PathData {
  conn: TransferConnection;
  d: string;
  labelX: number;
  labelY: number;
  color: string;
}

interface TransferArrowOverlayProps {
  connections: TransferConnection[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  sidebarWidth: number;
  renderTick: number;
  highlightedConnectionIds: Set<string> | null;
  selectedTransferGroupId: string | null;
  selectionActive: boolean;
  onTransferSelect: (transferGroupId: string) => void;
}

interface TooltipState {
  x: number;
  y: number;
  conn: TransferConnection;
}

const SPREAD_PX = 28;

/**
 * Extract the stage segment from a swimlane group ID.
 * Group IDs are `stage-{order}/stn-{station}/hall-{hall}/c-{container}`.
 */
function stageOf(groupId: string): string {
  return groupId.split("/")[0];
}

/**
 * Group connections by source-stage → dest-stage transition so that all
 * transfers between the same lifecycle stages (e.g. Egg&Alevin → Fry)
 * get fanned apart, even when each goes to a unique container.
 */
function assignSpreadOffsets(
  connections: TransferConnection[],
): Map<string, { index: number; total: number }> {
  const bundles = new Map<string, string[]>();
  for (const conn of connections) {
    const key = `${stageOf(conn.sourceGroupId)}::${stageOf(conn.destGroupId)}`;
    let list = bundles.get(key);
    if (!list) {
      list = [];
      bundles.set(key, list);
    }
    list.push(conn.id);
  }

  const offsets = new Map<string, { index: number; total: number }>();
  for (const ids of bundles.values()) {
    const total = ids.length;
    for (let i = 0; i < total; i++) {
      offsets.set(ids[i], { index: i, total });
    }
  }
  return offsets;
}

export function TransferArrowOverlay({
  connections,
  containerRef,
  sidebarWidth,
  renderTick,
  highlightedConnectionIds,
  selectedTransferGroupId,
  selectionActive,
  onTransferSelect,
}: TransferArrowOverlayProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [svgLayout, setSvgLayout] = useState({ width: 0, height: 0, top: 0 });
  const rafRef = useRef(0);
  const retryRef = useRef(0);

  const spreadOffsets = useRef(assignSpreadOffsets(connections));

  useEffect(() => {
    spreadOffsets.current = assignSpreadOffsets(connections);
  }, [connections]);

  const computePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollEl = container.querySelector(".rct-scroll") as HTMLElement;
    if (!scrollEl) return;

    const containerRect = container.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();
    const headerOffset = scrollRect.top - containerRect.top;

    setSvgLayout({
      width: scrollRect.width,
      height: scrollRect.height,
      top: headerOffset,
    });

    const result: PathData[] = [];
    let foundAny = false;

    for (const conn of connections) {
      const srcEl = container.querySelector(
        `[data-assignment-id="${conn.sourceAssignmentId}"]`,
      );
      const dstEl = container.querySelector(
        `[data-assignment-id="${conn.destAssignmentId}"]`,
      );
      if (!srcEl || !dstEl) continue;
      foundAny = true;

      const srcRect = srcEl.getBoundingClientRect();
      const dstRect = dstEl.getBoundingClientRect();

      const srcX = srcRect.right - scrollRect.left;
      const srcY = srcRect.top - scrollRect.top + srcRect.height / 2;
      const dstX = dstRect.left - scrollRect.left;
      const dstY = dstRect.top - scrollRect.top + dstRect.height / 2;

      if (srcX < -400 || dstX < -400) continue;

      const offset = spreadOffsets.current.get(conn.id);
      const spreadOffset =
        offset && offset.total > 1
          ? (offset.index - (offset.total - 1) / 2) * SPREAD_PX
          : 0;

      const dx = dstX - srcX;
      const dy = Math.abs(dstY - srcY);
      const baseCpX = Math.max(40, Math.abs(dx) * 0.35);
      const cpX = baseCpX + spreadOffset;
      const cpY = dy > 100 ? dy * 0.12 : 0;

      const d = [
        `M ${srcX} ${srcY}`,
        `C ${srcX + cpX} ${srcY - cpY},`,
        `${dstX - cpX} ${dstY + cpY},`,
        `${dstX} ${dstY}`,
      ].join(" ");

      result.push({
        conn,
        d,
        labelX: (srcX + dstX) / 2 + spreadOffset * 0.3,
        labelY: (srcY + dstY) / 2 - 8,
        color: conn.destStageColor,
      });
    }

    setPaths(result);

    // If the DOM items haven't rendered yet, retry a few times
    if (!foundAny && connections.length > 0 && retryRef.current < 8) {
      retryRef.current++;
      rafRef.current = window.setTimeout(
        () => requestAnimationFrame(computePaths),
        100 * retryRef.current,
      ) as unknown as number;
    }
  }, [connections, containerRef, renderTick]);

  // Initial computation + retries for DOM readiness
  useEffect(() => {
    retryRef.current = 0;
    rafRef.current = requestAnimationFrame(computePaths);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(rafRef.current);
    };
  }, [computePaths]);

  // Recompute on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollEl = container.querySelector(".rct-scroll") as HTMLElement;
    if (!scrollEl) return;

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(computePaths);
    };

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef, computePaths]);

  if (paths.length === 0 || svgLayout.width <= 0) return null;

  return (
    <>
      <svg
        className="swimlane-transfer-overlay"
        style={{
          left: sidebarWidth,
          top: svgLayout.top,
          width: svgLayout.width,
          height: svgLayout.height,
        }}
        viewBox={`0 0 ${svgLayout.width} ${svgLayout.height}`}
      >
        <defs>
          <marker
            id="swimlane-arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="currentColor" opacity="0.7" />
          </marker>
        </defs>
        {paths.map(({ conn, d, labelX, labelY, color }) => (
          <g
            key={conn.id}
            className={`swimlane-transfer-group ${selectedTransferGroupId === conn.transferGroupId ? "swimlane-transfer-group--selected" : ""} ${selectionActive && !(highlightedConnectionIds?.has(conn.id) ?? false) ? "swimlane-transfer-group--dimmed" : ""}`}
          >
            <path
              d={d}
              fill="none"
              stroke="transparent"
              strokeWidth={12}
              className="swimlane-transfer-hitbox"
              onMouseEnter={(e) =>
                setTooltip({ x: e.clientX, y: e.clientY, conn })
              }
              onMouseMove={(e) =>
                setTooltip((prev) =>
                  prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                )
              }
              onMouseLeave={() => setTooltip(null)}
              onClick={() => onTransferSelect(conn.transferGroupId)}
            />
            <path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={selectedTransferGroupId === conn.transferGroupId ? 2.5 : 1.5}
              strokeDasharray="6 3"
              opacity={selectionActive
                ? ((highlightedConnectionIds?.has(conn.id) ?? false) ? 0.9 : 0.14)
                : 0.55}
              markerEnd="url(#swimlane-arrowhead)"
              className="swimlane-transfer-path"
              style={{ color }}
              onMouseEnter={(e) =>
                setTooltip({ x: e.clientX, y: e.clientY, conn })
              }
              onMouseMove={(e) =>
                setTooltip((prev) =>
                  prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
                )
              }
              onMouseLeave={() => setTooltip(null)}
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              className="swimlane-transfer-label"
              fill={color}
              opacity={selectionActive
                ? ((highlightedConnectionIds?.has(conn.id) ?? false) ? 0.95 : 0.22)
                : 0.85}
            >
              {formatPopulation(conn.transferredCount)}
            </text>
          </g>
        ))}
      </svg>

      {tooltip && (
        <div
          className="swimlane-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <div className="swimlane-tooltip__header">Transfer Details</div>
          <div className="swimlane-tooltip__row">
            <span className="swimlane-tooltip__label">Fish transferred</span>
            <span className="swimlane-tooltip__value">
              {formatPopulation(tooltip.conn.transferredCount)}
            </span>
          </div>
          <div className="swimlane-tooltip__row">
            <span className="swimlane-tooltip__label">Biomass</span>
            <span className="swimlane-tooltip__value">
              {formatBiomass(tooltip.conn.transferredBiomassKg)}
            </span>
          </div>
          {tooltip.conn.mortalityCount > 0 && (
            <div className="swimlane-tooltip__row">
              <span className="swimlane-tooltip__label">Transfer mortality</span>
              <span className="swimlane-tooltip__value">
                {formatPopulation(tooltip.conn.mortalityCount)}
              </span>
            </div>
          )}
          {tooltip.conn.executionDate && (
            <div className="swimlane-tooltip__row">
              <span className="swimlane-tooltip__label">Date</span>
              <span className="swimlane-tooltip__value">
                {tooltip.conn.executionDate.split("T")[0]}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
