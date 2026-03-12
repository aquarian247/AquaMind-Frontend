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
  collectAssignmentHighlightState,
  buildSwimlaneGroups,
  buildSwimlaneItems,
  buildTransferConnections,
  collectLaneHighlightState,
  collectTransferHighlightState,
  computeTimeRange,
  formatPopulation,
  formatBiomass,
  formatDuration,
} from "./swimlaneTransformers";
import { TransferArrowOverlay } from "./TransferArrowOverlay";
import type {
  AssignmentRecord,
  TransferActionRecord,
  SwimlaneGroup,
  SwimlaneItem,
} from "./containerFlow.types";

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

export interface ContainerAssignmentSwimlaneViewProps {
  assignments: AssignmentRecord[];
  actions: TransferActionRecord[];
  isLoading: boolean;
  error: Error | null;
  viewKey?: string | number;
  initialVisibleWindow?: { start: number; end: number } | null;
  showBatchLabels?: boolean;
  stackItems?: boolean;
}

interface ContainerAssignmentSwimlaneProps {
  batchId: number;
}

type SwimlaneSelection =
  | { type: "lane"; groupId: string }
  | { type: "assignment"; assignmentId: number }
  | { type: "transfer"; transferGroupId: string }
  | null;

type LaneHighlightState = {
  groupIds: Set<string>;
  connectionIds: Set<string>;
};

type AssignmentHighlightState = LaneHighlightState & {
  assignmentIds: Set<number>;
};

type SelectionHighlightState = LaneHighlightState | AssignmentHighlightState | null;

const SIDEBAR_WIDTH = 220;
const LINE_HEIGHT = 36;
const DAY_MS = 86_400_000;
const ZOOM_FACTOR = 0.6;

interface TimelineResizeListener {
  resize?: () => void;
}

interface TimelineResizeDetector {
  addListener?: (listener: TimelineResizeListener) => void;
  removeListener: (listener: TimelineResizeListener) => void;
  notify: () => void;
}

export function ContainerAssignmentSwimlaneView({
  assignments,
  actions,
  isLoading,
  error,
  viewKey,
  initialVisibleWindow = null,
  showBatchLabels = false,
  stackItems = false,
}: ContainerAssignmentSwimlaneViewProps) {
  const [showTransfers, setShowTransfers] = useState(true);
  const [openGroupIds, setOpenGroupIds] = useState<Set<string> | null>(null);
  const [selection, setSelection] = useState<SwimlaneSelection>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [visibleTimeStart, setVisibleTimeStart] = useState<number | null>(null);
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<number | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const resizeDetector = useMemo<TimelineResizeDetector>(() => {
    const listeners = new Set<TimelineResizeListener>();
    return {
      addListener: (listener) => {
        listeners.add(listener);
      },
      removeListener: (listener) => {
        listeners.delete(listener);
      },
      notify: () => {
        listeners.forEach((listener) => {
          listener.resize?.();
        });
      },
    };
  }, []);

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

  useEffect(() => {
    setOpenGroupIds(null);
    setSelection(null);
    setVisibleTimeStart(null);
    setVisibleTimeEnd(null);
    setRenderTick((t) => t + 1);
  }, [viewKey]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        resizeDetector.notify();
        setRenderTick((t) => t + 1);
      });
    });

    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [resizeDetector]);

  const leafGroupIds = useMemo(
    () => new Set(swimGroups.filter((g) => g.isLeaf).map((g) => g.id)),
    [swimGroups],
  );

  const defaultExpandedGroupIds = useMemo(
    () => new Set(swimGroups.filter((g) => !g.isLeaf).map((g) => g.id)),
    [swimGroups],
  );

  const assignmentGroupById = useMemo(
    () => new Map(swimItems.map((item) => [item.id, item.group] as const)),
    [swimItems],
  );

  const selectionState = useMemo<SelectionHighlightState>(() => {
    if (!selection) return null;
    if (selection.type === "lane") {
      return collectLaneHighlightState(selection.groupId, connections);
    }
    if (selection.type === "assignment") {
      return collectAssignmentHighlightState(selection.assignmentId, connections, assignmentGroupById);
    }
    return collectTransferHighlightState(selection.transferGroupId, connections);
  }, [selection, connections, assignmentGroupById]);

  const highlightedGroupIds = selectionState?.groupIds ?? null;
  const highlightedConnectionIds = selectionState?.connectionIds ?? null;
  const highlightedAssignmentIds = useMemo<Set<number> | null>(() => {
    if (!selectionState) return null;
    if ("assignmentIds" in selectionState) return selectionState.assignmentIds;
    const ids = new Set<number>();
    for (const item of swimItems) {
      if (selectionState.groupIds.has(item.group)) {
        ids.add(item.id);
      }
    }
    return ids;
  }, [selectionState, swimItems]);
  const selectionActive = selection !== null;

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
    setRenderTick((t) => t + 1);
  }, []);

  const expandAll = useCallback(() => {
    setOpenGroupIds(new Set(swimGroups.filter((g) => !g.isLeaf).map((g) => g.id)));
    setRenderTick((t) => t + 1);
  }, [swimGroups]);

  const collapseAll = useCallback(() => {
    setOpenGroupIds(new Set());
    setRenderTick((t) => t + 1);
  }, []);

  const handleLaneSelect = useCallback((groupId: string) => {
    if (!leafGroupIds.has(groupId)) return;
    setSelection((prev) =>
      prev?.type === "lane" && prev.groupId === groupId
        ? null
        : { type: "lane", groupId },
    );
  }, [leafGroupIds]);

  const handleTransferSelect = useCallback((transferGroupId: string) => {
    setSelection((prev) =>
      prev?.type === "transfer" && prev.transferGroupId === transferGroupId
        ? null
        : { type: "transfer", transferGroupId },
    );
  }, []);

  const handleAssignmentSelect = useCallback((assignmentId: number) => {
    setSelection((prev) =>
      prev?.type === "assignment" && prev.assignmentId === assignmentId
        ? null
        : { type: "assignment", assignmentId },
    );
  }, []);

  const handleCanvasClick = useCallback((groupId: string) => {
    if (leafGroupIds.has(groupId)) {
      handleLaneSelect(groupId);
      return;
    }
    setSelection(null);
  }, [handleLaneSelect, leafGroupIds]);

  const currentOpenIds = openGroupIds ?? defaultExpandedGroupIds;

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

  const defaultTimeStart = visibleTimeStart ?? initialVisibleWindow?.start ?? timeRange.start;
  const defaultTimeEnd = visibleTimeEnd ?? initialVisibleWindow?.end ?? timeRange.end;

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
      const hasChildren = !sg.isLeaf;
      const isOpen = currentOpenIds.has(sg.id);
      const isSelectableLane = sg.isLeaf;
      const isSelectedLane = selection?.type === "lane" && selection.groupId === sg.id;
      const isHighlightedLane = highlightedGroupIds?.has(sg.id) ?? false;
      const isDimmedLane = selectionActive && isSelectableLane && !isHighlightedLane;
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
          className={`swimlane-group ${depthClass} ${isSelectableLane ? "swimlane-group--clickable" : ""} ${isSelectedLane ? "swimlane-group--selected" : ""} ${!isSelectedLane && isHighlightedLane ? "swimlane-group--highlighted" : ""} ${isDimmedLane ? "swimlane-group--dimmed" : ""}`}
          onClick={isSelectableLane ? () => handleLaneSelect(sg.id) : undefined}
          onKeyDown={isSelectableLane
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLaneSelect(sg.id);
                }
              }
            : undefined}
          role={isSelectableLane ? "button" : undefined}
          tabIndex={isSelectableLane ? 0 : undefined}
          aria-pressed={isSelectableLane ? isSelectedLane : undefined}
          style={{ cursor: isSelectableLane ? "pointer" : "default" }}
        >
          {hasChildren && (
            <button
              type="button"
              className="swimlane-group__toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleGroup(sg.id);
              }}
              aria-label={isOpen ? `Collapse ${sg.title}` : `Expand ${sg.title}`}
            >
              {isOpen ? "▾" : "▸"}
            </button>
          )}
          <span
            className="swimlane-group__dot"
            style={{ backgroundColor: sg.stageColor }}
          />
          <span className="swimlane-group__label" title={sg.title}>
            {sg.title}
          </span>
        </div>
      );
    },
    [currentOpenIds, handleLaneSelect, highlightedGroupIds, selection, selectionActive, toggleGroup],
  );

  const horizontalLineClassNamesForGroup = useCallback((group: SwimGroup) => {
    if (!group.swimlane.isLeaf) return [];
    const groupId = group.swimlane.id;
    const isSelectedLane = selection?.type === "lane" && selection.groupId === groupId;
    const isHighlightedLane = highlightedGroupIds?.has(groupId) ?? false;
    const isDimmedLane = selectionActive && !isHighlightedLane;

    return [
      "swimlane-row",
      isSelectedLane ? "swimlane-row--selected" : "",
      !isSelectedLane && isHighlightedLane ? "swimlane-row--highlighted" : "",
      isDimmedLane ? "swimlane-row--dimmed" : "",
    ].filter(Boolean);
  }, [highlightedGroupIds, selection, selectionActive]);

  // ── Item renderer ──

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
      const showPopulation = width > 50;
      const hasBiomass = sd.biomassKg > 0;
      const showBio = width > 140 && hasBiomass;
      const showBatch = showBatchLabels && width > 210 && !!sd.assignment.batch_number;
      const isSelectedLane = selection?.type === "lane" && selection.groupId === item.group;
      const isSelectedAssignment = selection?.type === "assignment" && selection.assignmentId === item.id;
      const isSelectedTransferEndpoint =
        selection?.type === "transfer" && (highlightedAssignmentIds?.has(item.id) ?? false);
      const isSelectedItem = isSelectedLane || isSelectedAssignment || isSelectedTransferEndpoint;
      const isHighlightedItem = highlightedAssignmentIds?.has(item.id) ?? false;
      const isDimmedLane = selectionActive && !isHighlightedItem;

      const { key, ...restItemProps } = getItemProps({
        style: {
          background: sd.stageColor,
          border: "none",
          borderRadius: "4px",
          boxShadow: isSelectedItem
            ? "0 0 0 2px hsl(var(--ring)), 0 3px 10px rgba(0,0,0,0.22)"
            : isHighlightedItem
              ? "0 2px 8px rgba(0,0,0,0.18)"
              : "0 1px 3px rgba(0,0,0,0.15)",
          cursor: "pointer",
          opacity: isDimmedLane ? 0.26 : 1,
          transition: "opacity 160ms ease, box-shadow 160ms ease, transform 160ms ease",
          transform: isSelectedItem ? "translateY(-1px)" : undefined,
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
          onClick={() => handleAssignmentSelect(item.id)}
        >
          <div
            className={`swimlane-item-bar ${sd.isActive ? "swimlane-item-bar--active" : ""} ${isSelectedItem ? "swimlane-item-bar--selected" : ""} ${!isSelectedItem && isHighlightedItem ? "swimlane-item-bar--highlighted" : ""} ${isDimmedLane ? "swimlane-item-bar--dimmed" : ""}`}
          >
            {showBatch && (
              <span className="swimlane-item-bar__batch">
                {sd.assignment.batch_number}
              </span>
            )}
            {showPopulation && (
              <span className="swimlane-item-bar__label">
                {formatPopulation(sd.populationCount)}
              </span>
            )}
            {showBio && (
              <span className="swimlane-item-bar__metric">
                {formatBiomass(sd.biomassKg)}
              </span>
            )}
          </div>
        </div>
      );
    },
    [handleAssignmentSelect, highlightedAssignmentIds, selection, selectionActive, showBatchLabels],
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
          stackItems={stackItems}
          minZoom={7 * DAY_MS}
          maxZoom={3 * 365 * DAY_MS}
          onTimeChange={handleTimeChange}
          onCanvasClick={handleCanvasClick}
          groupRenderer={groupRenderer}
          horizontalLineClassNamesForGroup={horizontalLineClassNamesForGroup}
          itemRenderer={itemRenderer}
          buffer={1}
          resizeDetector={resizeDetector}
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
            highlightedConnectionIds={highlightedConnectionIds}
            selectedTransferGroupId={selection?.type === "transfer" ? selection.transferGroupId : null}
            selectionActive={selectionActive}
            onTransferSelect={handleTransferSelect}
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
            {showBatchLabels && tooltip.item.assignment.batch_number && (
              <span className="swimlane-tooltip__pill">
                {tooltip.item.assignment.batch_number}
              </span>
            )}
          </div>

          {(() => {
            const t = tooltip.item;
            const tr = t.transfers;
            const hasPopulationTransfers = tr.totalIn > 0 || tr.totalOut > 0 || tr.mortalityOut > 0;
            const hasBiomassTransfers = tr.biomassIn > 0 || tr.biomassOut > 0;
            return (
              <>
                <div className="swimlane-tooltip__section">Population</div>
                <div className="swimlane-tooltip__row">
                  <span className="swimlane-tooltip__label">Count</span>
                  <span className="swimlane-tooltip__value">
                    {formatPopulation(t.populationCount)}
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
                {!hasPopulationTransfers && (
                  <div className="swimlane-tooltip__row">
                    <span className="swimlane-tooltip__label" style={{ fontSize: 10, opacity: 0.6 }}>
                      No transfer records found
                    </span>
                  </div>
                )}

                {(t.biomassKg > 0 || hasBiomassTransfers) && (
                  <>
                    <div className="swimlane-tooltip__section">Biomass</div>
                    <div className="swimlane-tooltip__row">
                      <span className="swimlane-tooltip__label">Recorded</span>
                      <span className="swimlane-tooltip__value">
                        {formatBiomass(t.biomassKg)}
                      </span>
                    </div>
                    {tr.biomassIn > 0 && (
                      <div className="swimlane-tooltip__row">
                        <span className="swimlane-tooltip__label">+ Received</span>
                        <span className="swimlane-tooltip__value" style={{ color: "hsl(142, 71%, 35%)" }}>
                          +{formatBiomass(tr.biomassIn)}
                        </span>
                      </div>
                    )}
                    {tr.biomassOut > 0 && (
                      <div className="swimlane-tooltip__row">
                        <span className="swimlane-tooltip__label">- Transferred out</span>
                        <span className="swimlane-tooltip__value" style={{ color: "hsl(var(--destructive))" }}>
                          -{formatBiomass(tr.biomassOut)}
                        </span>
                      </div>
                    )}
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

export function ContainerAssignmentSwimlane({ batchId }: ContainerAssignmentSwimlaneProps) {
  const { assignments, actions, isLoading, error } = useContainerFlowData(batchId);

  return (
    <ContainerAssignmentSwimlaneView
      assignments={assignments}
      actions={actions}
      isLoading={isLoading}
      error={error}
      viewKey={`batch-${batchId}`}
    />
  );
}
