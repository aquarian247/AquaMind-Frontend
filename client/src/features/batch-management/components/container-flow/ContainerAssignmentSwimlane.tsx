import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TodayMarker,
  type TimelineGroupBase,
  type TimelineItemBase,
} from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import "./ContainerAssignmentSwimlane.css";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ZoomIn,
  ZoomOut,
  ChevronsDownUp,
  ArrowRightLeft,
  LayoutList,
} from "lucide-react";

import { useContainerFlowData } from "./useContainerFlowData";
import {
  buildSwimlaneGroups,
  buildSwimlaneItems,
  buildTransferConnections,
  computeTimeRange,
  formatPopulation,
  formatBiomass,
  formatDuration,
} from "./swimlaneTransformers";
import { TransferArrowOverlay } from "./TransferArrowOverlay";
import type { SwimlaneGroup, SwimlaneItem } from "./containerFlow.types";

interface SwimGroup extends TimelineGroupBase {
  id: string;
  title: string;
  swimlane: SwimlaneGroup;
}

interface SwimItem extends TimelineItemBase<number> {
  id: number;
  group: string;
  swimlaneData: SwimlaneItem;
}

interface TooltipData {
  x: number;
  y: number;
  item: SwimlaneItem;
}

interface ContainerAssignmentSwimlaneProps {
  batchId: number;
}

const SIDEBAR_WIDTH = 220;
const LINE_HEIGHT = 36;
const DAY_MS = 86_400_000;
const ZOOM_FACTOR = 0.6;

export function ContainerAssignmentSwimlane({ batchId }: ContainerAssignmentSwimlaneProps) {
  const { assignments, actions, isLoading, error } = useContainerFlowData(batchId);

  const [showTransfers, setShowTransfers] = useState(true);
  const [openGroupIds, setOpenGroupIds] = useState<Set<string> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [visibleTimeStart, setVisibleTimeStart] = useState<number | null>(null);
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<number | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const swimGroups = useMemo(() => buildSwimlaneGroups(assignments), [assignments]);
  const swimItems = useMemo(
    () => buildSwimlaneItems(assignments, actions),
    [assignments, actions],
  );
  const connections = useMemo(
    () => buildTransferConnections(actions, assignments),
    [actions, assignments],
  );
  const timeRange = useMemo(() => computeTimeRange(assignments), [assignments]);

  // Default: expand ALL groups
  useEffect(() => {
    if (swimGroups.length > 0 && openGroupIds === null) {
      const all = new Set(swimGroups.filter((g) => !g.isLeaf).map((g) => g.id));
      setOpenGroupIds(all);
    }
  }, [swimGroups, openGroupIds]);

  const isAllExpanded = useMemo(() => {
    if (!openGroupIds) return true;
    const nonLeaf = swimGroups.filter((g) => !g.isLeaf);
    return nonLeaf.every((g) => openGroupIds.has(g.id));
  }, [openGroupIds, swimGroups]);

  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroupIds((prev) => {
      const next = new Set(prev ?? []);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setOpenGroupIds(new Set(swimGroups.filter((g) => !g.isLeaf).map((g) => g.id)));
  }, [swimGroups]);

  const collapseAll = useCallback(() => {
    setOpenGroupIds(new Set());
  }, []);

  const currentOpenIds = openGroupIds ?? new Set<string>();

  const isGroupVisible = useCallback(
    (group: SwimlaneGroup): boolean => {
      if (group.parent === null) return true;
      let parentId: string | null = group.parent;
      while (parentId !== null) {
        if (!currentOpenIds.has(parentId)) return false;
        const parentGroup = swimGroups.find((g) => g.id === parentId);
        parentId = parentGroup?.parent ?? null;
      }
      return true;
    },
    [currentOpenIds, swimGroups],
  );

  const visibleGroups = useMemo<SwimGroup[]>(() => {
    return swimGroups
      .filter(isGroupVisible)
      .map((g) => ({
        id: g.id,
        title: g.title,
        height: g.isLeaf ? LINE_HEIGHT : LINE_HEIGHT - 4,
        swimlane: g,
      }));
  }, [swimGroups, isGroupVisible]);

  const visibleGroupIds = useMemo(
    () => new Set(visibleGroups.map((g) => g.id)),
    [visibleGroups],
  );

  const visibleItems = useMemo<SwimItem[]>(() => {
    return swimItems
      .filter((item) => visibleGroupIds.has(item.group))
      .map((item) => ({
        id: item.id,
        group: item.group,
        title: item.title,
        start_time: item.start_time,
        end_time: item.end_time,
        canMove: false,
        canResize: false,
        canChangeGroup: false,
        swimlaneData: item,
      }));
  }, [swimItems, visibleGroupIds]);

  const stageEntries = useMemo(() => {
    const seen = new Map<string, string>();
    for (const g of swimGroups) {
      if (g.depth === 0 && !seen.has(g.title)) {
        seen.set(g.title, g.stageColor);
      }
    }
    return Array.from(seen.entries());
  }, [swimGroups]);

  const defaultTimeStart = visibleTimeStart ?? timeRange.start;
  const defaultTimeEnd = visibleTimeEnd ?? timeRange.end;

  const handleZoom = useCallback(
    (direction: "in" | "out") => {
      const start = visibleTimeStart ?? timeRange.start;
      const end = visibleTimeEnd ?? timeRange.end;
      const center = (start + end) / 2;
      const halfSpan = (end - start) / 2;
      const factor = direction === "in" ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      const newHalf = halfSpan * factor;
      setVisibleTimeStart(center - newHalf);
      setVisibleTimeEnd(center + newHalf);
      setRenderTick((t) => t + 1);
    },
    [visibleTimeStart, visibleTimeEnd, timeRange],
  );

  const handleTimeChange = useCallback(
    (start: number, end: number, updateCanvas: (s: number, e: number) => void) => {
      setVisibleTimeStart(start);
      setVisibleTimeEnd(end);
      setRenderTick((t) => t + 1);
      updateCanvas(start, end);
    },
    [],
  );

  // ── Group renderer ──

  const groupRenderer = useCallback(
    ({ group }: { group: SwimGroup }) => {
      const sg = group.swimlane;
      const hasChildren = swimGroups.some((g) => g.parent === sg.id);
      const isOpen = currentOpenIds.has(sg.id);
      const depthClass =
        sg.depth === 0
          ? "swimlane-group--stage"
          : sg.depth === 1
            ? "swimlane-group--station"
            : sg.depth === 2
              ? "swimlane-group--hall"
              : "swimlane-group--container";

      return (
        <div
          className={`swimlane-group ${depthClass}`}
          onClick={hasChildren ? () => toggleGroup(sg.id) : undefined}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
        >
          <span
            className="swimlane-group__dot"
            style={{ backgroundColor: sg.stageColor }}
          />
          {hasChildren && (
            <span style={{ fontSize: 9, opacity: 0.5, width: 10, textAlign: "center" }}>
              {isOpen ? "▾" : "▸"}
            </span>
          )}
          <span className="swimlane-group__label" title={sg.title}>
            {sg.title}
          </span>
        </div>
      );
    },
    [swimGroups, currentOpenIds, toggleGroup],
  );

  // ── Item renderer: shows entry pop | exit pop + biomass ──

  const itemRenderer = useCallback(
    ({
      item,
      itemContext,
      getItemProps,
    }: {
      item: SwimItem;
      itemContext: { dimensions: { width: number } };
      getItemProps: (params: Record<string, any>) => Record<string, any>;
      getResizeProps: any;
      timelineContext: any;
    }) => {
      const sd = item.swimlaneData;
      const width = itemContext.dimensions.width;
      const hasTransferData = sd.transfers.totalIn > 0 || sd.transfers.totalOut > 0;
      const showEntry = width > 50;
      const showExit = width > 120 && hasTransferData;
      const hasBiomass = sd.entryBiomass > 0 || sd.exitBiomass > 0;
      const showBio = width > 180 && hasBiomass;

      const { key, ...restItemProps } = getItemProps({
        style: {
          background: sd.stageColor,
          border: "none",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        },
      });

      return (
        <div
          key={key}
          {...restItemProps}
          data-assignment-id={sd.assignment.id}
          onMouseEnter={(e) =>
            setTooltip({ x: e.clientX, y: e.clientY, item: sd })
          }
          onMouseMove={(e) =>
            setTooltip((prev) =>
              prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
            )
          }
          onMouseLeave={() => setTooltip(null)}
        >
          <div
            className={`swimlane-item-bar ${sd.isActive ? "swimlane-item-bar--active" : ""}`}
          >
            {showEntry && (
              <span className="swimlane-item-bar__label">
                {hasTransferData
                  ? formatPopulation(sd.entryPopulation)
                  : formatPopulation(sd.exitPopulation)}
              </span>
            )}
            {showExit && sd.entryPopulation !== sd.exitPopulation && (
              <span className="swimlane-item-bar__exit">
                {formatPopulation(sd.exitPopulation)}
              </span>
            )}
            {showBio && (
              <span className="swimlane-item-bar__metric">
                {formatBiomass(sd.entryBiomass)}
              </span>
            )}
          </div>
        </div>
      );
    },
    [],
  );

  // ── Loading / Error / Empty ──

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <LayoutList className="h-8 w-8 animate-pulse mr-3" />
        Loading swimlane data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-destructive">
        Failed to load container assignment data.
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LayoutList className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
        <h4 className="text-base font-medium mb-1">No Container Assignments</h4>
        <p className="text-sm text-muted-foreground">
          This batch has no container assignment history to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="swimlane-toolbar">
        <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
          <ZoomIn className="w-3.5 h-3.5 mr-1" /> Zoom In
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
          <ZoomOut className="w-3.5 h-3.5 mr-1" /> Zoom Out
        </Button>

        <div className="h-5 w-px bg-border mx-1" />

        {!isAllExpanded && (
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
        )}
        {isAllExpanded && (
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <ChevronsDownUp className="w-3.5 h-3.5 mr-1" /> Collapse
          </Button>
        )}

        <div className="h-5 w-px bg-border mx-1" />

        <div className="flex items-center gap-2">
          <Switch
            id="show-transfers"
            checked={showTransfers}
            onCheckedChange={setShowTransfers}
          />
          <Label htmlFor="show-transfers" className="text-xs flex items-center gap-1 cursor-pointer">
            <ArrowRightLeft className="w-3 h-3" />
            Transfers ({connections.length})
          </Label>
        </div>

        <div className="flex-1" />

        {/* Stage legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {stageEntries.map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: color }}
              />
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div ref={containerRef} className="assignment-swimlane relative rounded-md border overflow-hidden bg-background">
        <Timeline<SwimItem, SwimGroup>
          groups={visibleGroups}
          items={visibleItems}
          visibleTimeStart={defaultTimeStart}
          visibleTimeEnd={defaultTimeEnd}
          sidebarWidth={SIDEBAR_WIDTH}
          lineHeight={LINE_HEIGHT}
          itemHeightRatio={0.7}
          canMove={false}
          canResize={false}
          canChangeGroup={false}
          canSelect={false}
          stackItems={false}
          minZoom={7 * DAY_MS}
          maxZoom={3 * 365 * DAY_MS}
          onTimeChange={handleTimeChange}
          groupRenderer={groupRenderer}
          itemRenderer={itemRenderer}
          buffer={1}
        >
          <TimelineHeaders className="bg-muted text-muted-foreground">
            <SidebarHeader>
              {({ getRootProps }) => (
                <div
                  {...getRootProps()}
                  className="flex items-center px-3 font-medium text-xs border-r"
                >
                  Container Hierarchy
                </div>
              )}
            </SidebarHeader>
            <DateHeader unit="primaryHeader" />
            <DateHeader />
          </TimelineHeaders>
          <TodayMarker>
            {({ styles }) => (
              <div style={{ ...styles, backgroundColor: "hsl(var(--primary))", width: 2, opacity: 0.5 }} />
            )}
          </TodayMarker>
        </Timeline>

        {/* Transfer arrows */}
        {showTransfers && connections.length > 0 && (
          <TransferArrowOverlay
            connections={connections}
            containerRef={containerRef}
            sidebarWidth={SIDEBAR_WIDTH}
            renderTick={renderTick}
          />
        )}
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="swimlane-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y - 8 }}
        >
          <div className="swimlane-tooltip__header">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: tooltip.item.stageColor }}
            />
            {tooltip.item.assignment.container_name}
            <span style={{ fontWeight: 400, opacity: 0.7, fontSize: 11 }}>
              ({tooltip.item.assignment.lifecycle_stage_name})
            </span>
          </div>

          {(() => {
            const t = tooltip.item;
            const tr = t.transfers;
            const hasTransfers = tr.totalIn > 0 || tr.totalOut > 0;
            return (
              <>
                {hasTransfers ? (
                  <>
                    <div className="swimlane-tooltip__section">Population</div>
                    <div className="swimlane-tooltip__row">
                      <span className="swimlane-tooltip__label">Initial stock</span>
                      <span className="swimlane-tooltip__value">
                        {formatPopulation(t.entryPopulation)}
                      </span>
                    </div>
                    {tr.totalIn > 0 && (
                      <div className="swimlane-tooltip__row">
                        <span className="swimlane-tooltip__label">+ Received</span>
                        <span className="swimlane-tooltip__value" style={{ color: "hsl(142, 71%, 35%)" }}>
                          +{formatPopulation(tr.totalIn)}
                        </span>
                      </div>
                    )}
                    {tr.totalOut > 0 && (
                      <div className="swimlane-tooltip__row">
                        <span className="swimlane-tooltip__label">- Transferred out</span>
                        <span className="swimlane-tooltip__value" style={{ color: "hsl(var(--destructive))" }}>
                          -{formatPopulation(tr.totalOut)}
                        </span>
                      </div>
                    )}
                    {tr.mortalityOut > 0 && (
                      <div className="swimlane-tooltip__row">
                        <span className="swimlane-tooltip__label">- Transfer mortality</span>
                        <span className="swimlane-tooltip__value" style={{ color: "hsl(var(--destructive))" }}>
                          -{formatPopulation(tr.mortalityOut)}
                        </span>
                      </div>
                    )}
                    <div className="swimlane-tooltip__row" style={{ borderTop: "1px solid hsl(var(--border))", paddingTop: 2, marginTop: 2 }}>
                      <span className="swimlane-tooltip__label" style={{ fontWeight: 600 }}>
                        = Current
                      </span>
                      <span className="swimlane-tooltip__value" style={{ fontWeight: 600 }}>
                        {formatPopulation(t.exitPopulation)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="swimlane-tooltip__section">Population</div>
                    <div className="swimlane-tooltip__row">
                      <span className="swimlane-tooltip__label">Count</span>
                      <span className="swimlane-tooltip__value">
                        {formatPopulation(t.exitPopulation)}
                      </span>
                    </div>
                    <div className="swimlane-tooltip__row">
                      <span className="swimlane-tooltip__label" style={{ fontSize: 10, opacity: 0.6 }}>
                        No transfer records found
                      </span>
                    </div>
                  </>
                )}

                {(t.entryBiomass > 0 || t.exitBiomass > 0) && (
                  <>
                    <div className="swimlane-tooltip__section">Biomass</div>
                    {hasTransfers && t.entryBiomass > 0 && (
                      <div className="swimlane-tooltip__row">
                        <span className="swimlane-tooltip__label">At start</span>
                        <span className="swimlane-tooltip__value">
                          {formatBiomass(t.entryBiomass)}
                        </span>
                      </div>
                    )}
                    <div className="swimlane-tooltip__row">
                      <span className="swimlane-tooltip__label">Current</span>
                      <span className="swimlane-tooltip__value">
                        {formatBiomass(t.exitBiomass)}
                      </span>
                    </div>
                  </>
                )}

                {t.assignment.avg_weight_g !== null && (
                  <div className="swimlane-tooltip__row">
                    <span className="swimlane-tooltip__label">Avg weight</span>
                    <span className="swimlane-tooltip__value">
                      {t.assignment.avg_weight_g.toFixed(1)}g
                    </span>
                  </div>
                )}

                <div className="swimlane-tooltip__section">Period</div>
                <div className="swimlane-tooltip__row">
                  <span className="swimlane-tooltip__label">
                    {t.assignment.assignment_date.split("T")[0]}
                    {" → "}
                    {t.assignment.departure_date
                      ? t.assignment.departure_date.split("T")[0]
                      : "Active"}
                  </span>
                  <span className="swimlane-tooltip__value">
                    {formatDuration(t.start_time, t.end_time)}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Summary bar */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-xs">
          {assignments.length} assignments
        </Badge>
        <Badge variant="outline" className="text-xs">
          {assignments.filter((a) => a.is_active).length} active
        </Badge>
        <Badge variant="outline" className="text-xs">
          {connections.length} transfers
        </Badge>
        <Badge variant="outline" className="text-xs">
          {new Set(assignments.map((a) => a.lifecycle_stage_name)).size} stages
        </Badge>
      </div>
    </div>
  );
}
