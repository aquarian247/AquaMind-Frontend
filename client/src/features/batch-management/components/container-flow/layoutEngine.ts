import dagre from "@dagrejs/dagre";
import type { ContainerFlowNode, ContainerFlowEdge, ContainerNodeData, StageHeaderData } from "./containerFlow.types";

const NODE_WIDTH = 240;
const NODE_HEIGHT = 160;
const HEADER_WIDTH = 200;
const HEADER_HEIGHT = 50;
const RANK_SEP = 200;
const NODE_SEP = 40;
const STAGE_HEADER_Y_MARGIN = 20;

export function applyDagreLayout(
  nodes: ContainerFlowNode[],
  edges: ContainerFlowEdge[],
): { nodes: ContainerFlowNode[]; edges: ContainerFlowEdge[] } {
  const g = new dagre.graphlib.Graph({ compound: true });
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR",
    ranksep: RANK_SEP,
    nodesep: NODE_SEP,
    marginx: 40,
    marginy: 40,
  });

  const containerNodes = nodes.filter((n): n is typeof n & { type: "container" } => n.type === "container");
  const headerNodes = nodes.filter((n): n is typeof n & { type: "stageHeader" } => n.type === "stageHeader");

  for (const node of containerNodes) {
    const data = node.data as ContainerNodeData;
    g.setNode(node.id, {
      width: NODE_WIDTH,
      height: data.isCollapsedGroup ? NODE_HEIGHT + 20 : NODE_HEIGHT,
      rank: data.stageOrder,
    });
  }

  for (const edge of edges) {
    if (g.hasNode(edge.source) && g.hasNode(edge.target)) {
      g.setEdge(edge.source, edge.target);
    }
  }

  dagre.layout(g);

  const positionedNodes: ContainerFlowNode[] = [];

  for (const node of containerNodes) {
    const pos = g.node(node.id);
    if (pos) {
      positionedNodes.push({
        ...node,
        position: {
          x: pos.x - NODE_WIDTH / 2,
          y: pos.y - NODE_HEIGHT / 2,
        },
      });
    }
  }

  const stagePositions = new Map<number, { minX: number; maxX: number; minY: number; maxY: number }>();
  for (const node of positionedNodes) {
    if (node.type !== "container") continue;
    const data = node.data as ContainerNodeData;
    const order = data.stageOrder;
    const bounds = stagePositions.get(order) ?? {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };
    bounds.minX = Math.min(bounds.minX, node.position.x);
    bounds.maxX = Math.max(bounds.maxX, node.position.x + NODE_WIDTH);
    bounds.minY = Math.min(bounds.minY, node.position.y);
    bounds.maxY = Math.max(bounds.maxY, node.position.y + NODE_HEIGHT);
    stagePositions.set(order, bounds);
  }

  const globalMinY = Math.min(...positionedNodes.map((n) => n.position.y));

  for (const header of headerNodes) {
    const data = header.data as StageHeaderData;
    const bounds = stagePositions.get(data.stageOrder);
    if (bounds) {
      const centerX = (bounds.minX + bounds.maxX) / 2 - HEADER_WIDTH / 2;
      positionedNodes.push({
        ...header,
        position: {
          x: centerX,
          y: globalMinY - HEADER_HEIGHT - STAGE_HEADER_Y_MARGIN,
        },
      });
    }
  }

  return { nodes: positionedNodes, edges };
}
