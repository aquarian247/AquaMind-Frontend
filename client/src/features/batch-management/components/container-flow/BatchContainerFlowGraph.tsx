import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Layers, LayoutGrid, Loader2 } from "lucide-react";

import { ContainerNode } from "./ContainerNode";
import { TransferEdge } from "./TransferEdge";
import { StageColumnHeader } from "./StageColumnHeader";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { StageDetailOverlay } from "./StageDetailOverlay";
import { useContainerFlowData } from "./useContainerFlowData";
import type { CollapseMode, ContainerNodeData, StageHeaderData } from "./containerFlow.types";

const nodeTypes = {
  container: ContainerNode,
  stageHeader: StageColumnHeader,
} as const;

const edgeTypes = {
  transfer: TransferEdge,
} as const;

const GRAPH_HEIGHT = 600;

interface FlowCanvasProps {
  layoutNodes: any[];
  layoutEdges: any[];
  onContainerClick: (data: ContainerNodeData) => void;
  onStageClick: (data: StageHeaderData) => void;
}

function FlowCanvas({ layoutNodes, layoutEdges, onContainerClick, onStageClick }: FlowCanvasProps) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([] as any[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any[]);
  const hasFitted = useRef(false);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
    hasFitted.current = false;
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    const hasDimensions = changes.some(
      (c: any) => c.type === "dimensions" && c.dimensions,
    );
    if (hasDimensions && !hasFitted.current) {
      hasFitted.current = true;
      requestAnimationFrame(() => {
        fitView({ padding: 0.12, duration: 400 });
      });
    }
  }, [onNodesChange, fitView]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    if (node.type === "container") {
      onContainerClick(node.data as ContainerNodeData);
    } else if (node.type === "stageHeader") {
      onStageClick(node.data as StageHeaderData);
    }
  }, [onContainerClick, onStageClick]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={0.05}
      maxZoom={2}
      nodesDraggable={false}
      nodesConnectable={false}
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ animated: false }}
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
      <Controls position="bottom-left" showInteractive={false} />
      <MiniMap
        position="bottom-right"
        nodeStrokeWidth={3}
        nodeColor={(node: any) => {
          if (node.type === "stageHeader") return "#e5e7eb";
          const data = node.data as ContainerNodeData;
          if (!data?.locationType) return "#e5e7eb";
          switch (data.locationType) {
            case "FRESHWATER": return "#93c5fd";
            case "TRANSPORT_TRUCK":
            case "TRANSPORT_VESSEL": return "#fcd34d";
            case "SEA": return "#5eead4";
            default: return "#d1d5db";
          }
        }}
        style={{ height: 100, width: 160 }}
      />
    </ReactFlow>
  );
}

interface BatchContainerFlowGraphProps {
  batchId: number;
}

export function BatchContainerFlowGraph({ batchId }: BatchContainerFlowGraphProps) {
  const [collapseMode, setCollapseMode] = useState<CollapseMode>("collapsed");
  const [selectedNodeData, setSelectedNodeData] = useState<ContainerNodeData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedStageName, setSelectedStageName] = useState<string | null>(null);
  const [stageOverlayOpen, setStageOverlayOpen] = useState(false);

  const { nodes, edges, assignments, actions, workflows, isLoading, error } =
    useContainerFlowData(batchId, collapseMode);

  const handleContainerClick = useCallback((data: ContainerNodeData) => {
    setSelectedNodeData(data);
    setDetailOpen(true);
  }, []);

  const handleStageClick = useCallback((data: StageHeaderData) => {
    setSelectedStageName(data.stageName);
    setStageOverlayOpen(true);
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapseMode((prev) => (prev === "collapsed" ? "expanded" : "collapsed"));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading container flow graph...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px] text-destructive">
        Failed to load container flow data: {error.message}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
        <LayoutGrid className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No container assignments found</p>
        <p className="text-sm">This batch has no container assignment history to visualize.</p>
      </div>
    );
  }

  const containerNodeCount = nodes.filter((n) => n.type === "container").length;
  const activeCount = assignments.filter((a) => a.is_active).length;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {containerNodeCount} nodes
          </Badge>
          <Badge variant="outline" className="text-xs">
            {edges.length} transfers
          </Badge>
          <Badge variant="outline" className="text-xs text-green-600">
            {activeCount} active
          </Badge>
          <Badge variant="outline" className="text-xs">
            {workflows.length} workflows
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleCollapse}>
            {collapseMode === "collapsed" ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
                Show All Tanks
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Group by Location
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ height: GRAPH_HEIGHT }}>
        <ReactFlowProvider key={`rf-${collapseMode}-${containerNodeCount}`}>
          <FlowCanvas
            layoutNodes={nodes}
            layoutEdges={edges}
            onContainerClick={handleContainerClick}
            onStageClick={handleStageClick}
          />
        </ReactFlowProvider>
      </div>

      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-200 border border-blue-300" /> Freshwater
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" /> Transport
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-teal-200 border border-teal-300" /> Sea
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border-2 border-dashed border-gray-400" /> Departed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-purple-200 border border-purple-400" /> Mixed Batch
        </span>
        <span className="text-[9px] italic ml-auto">Click a stage header for detailed breakdown</span>
      </div>

      <NodeDetailPanel data={selectedNodeData} open={detailOpen} onClose={() => setDetailOpen(false)} />

      <StageDetailOverlay
        stageName={selectedStageName}
        open={stageOverlayOpen}
        onClose={() => setStageOverlayOpen(false)}
        assignments={assignments}
        actions={actions}
      />
    </div>
  );
}
