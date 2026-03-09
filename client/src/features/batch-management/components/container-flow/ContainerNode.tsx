import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { Factory, Truck, Ship, Waves, Layers, MapPin } from "lucide-react";
import type { ContainerNodeData } from "./containerFlow.types";

const LOCATION_STYLES: Record<string, { bg: string; border: string; headerBg: string; iconColor: string; icon: typeof Factory }> = {
  FRESHWATER: { bg: "#dbeafe", border: "#60a5fa", headerBg: "#bfdbfe", iconColor: "#1d4ed8", icon: Factory },
  TRANSPORT_TRUCK: { bg: "#fef3c7", border: "#f59e0b", headerBg: "#fde68a", iconColor: "#b45309", icon: Truck },
  TRANSPORT_VESSEL: { bg: "#fef3c7", border: "#f59e0b", headerBg: "#fde68a", iconColor: "#b45309", icon: Ship },
  SEA: { bg: "#ccfbf1", border: "#2dd4bf", headerBg: "#99f6e4", iconColor: "#0f766e", icon: Waves },
  UNKNOWN: { bg: "#f3f4f6", border: "#9ca3af", headerBg: "#e5e7eb", iconColor: "#4b5563", icon: Factory },
};

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function formatBiomass(kg: number): string {
  if (kg >= 1_000_000) return `${(kg / 1_000_000).toFixed(1)}Kt`;
  if (kg >= 1_000) return `${(kg / 1_000).toFixed(1)}t`;
  return `${kg.toFixed(0)}kg`;
}

function ContainerNodeComponent({ data, selected }: NodeProps & { data: ContainerNodeData }) {
  const style = LOCATION_STYLES[data.locationType] ?? LOCATION_STYLES.UNKNOWN;
  const Icon = style.icon;
  const isCollapsed = data.isCollapsedGroup;

  const primaryLocation = data.stationName ?? data.areaName ?? data.carrierName ?? null;
  const secondaryLocation = data.hallName && data.stationName ? data.hallName : null;

  return (
    <div
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        borderWidth: 2,
        borderStyle: data.isActive ? "solid" : "dashed",
        opacity: data.isActive ? 1 : 0.75,
        minWidth: 220,
        borderRadius: 8,
        boxShadow: selected
          ? `0 0 0 2px #3b82f6, 0 1px 3px rgba(0,0,0,0.1)`
          : data.isMixed
            ? `0 0 0 2px #a855f7, 0 1px 3px rgba(0,0,0,0.1)`
            : "0 1px 3px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-gray-400" />

      {/* Header bar with station/area */}
      {primaryLocation && (
        <div
          style={{
            backgroundColor: style.headerBg,
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            borderBottom: `1px solid ${style.border}40`,
          }}
        >
          <MapPin style={{ width: 10, height: 10, color: style.iconColor, flexShrink: 0 }} />
          <span
            style={{ fontSize: 10, fontWeight: 600, color: style.iconColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={secondaryLocation ? `${primaryLocation} / ${secondaryLocation}` : primaryLocation}
          >
            {primaryLocation}
            {secondaryLocation && (
              <span style={{ fontWeight: 400, opacity: 0.8 }}> / {secondaryLocation}</span>
            )}
          </span>
        </div>
      )}

      <div style={{ padding: "6px 10px" }}>
        {/* Container name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <Icon style={{ width: 13, height: 13, color: style.iconColor, flexShrink: 0 }} />
          <span
            style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}
            title={data.containerName}
          >
            {data.containerName}
          </span>
          {isCollapsed && (
            <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, color: "#6b7280", flexShrink: 0 }}>
              <Layers style={{ width: 11, height: 11 }} />
              {data.groupedCount}
            </span>
          )}
          {data.isMixed && (
            <span style={{ fontSize: 9, fontWeight: 600, color: "#7c3aed", backgroundColor: "#ede9fe", padding: "1px 4px", borderRadius: 3, flexShrink: 0 }}>
              MIX
            </span>
          )}
        </div>

        {/* Lifecycle stage pill */}
        <div style={{ marginBottom: 4 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 500,
              color: style.iconColor,
              backgroundColor: `${style.border}30`,
              padding: "1px 6px",
              borderRadius: 10,
              display: "inline-block",
            }}
          >
            {data.lifecycleStage}
          </span>
        </div>

        {/* Metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px 10px", fontSize: 11 }}>
          <div>
            <span style={{ color: "#6b7280", fontSize: 9 }}>Pop </span>
            <span style={{ fontWeight: 500 }}>{formatPopulation(data.populationCount)}</span>
          </div>
          <div>
            <span style={{ color: "#6b7280", fontSize: 9 }}>Bio </span>
            <span style={{ fontWeight: 500 }}>{formatBiomass(data.biomassKg)}</span>
          </div>
        </div>

        {/* Date range footer */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#9ca3af", marginTop: 3, paddingTop: 3, borderTop: "1px solid #00000010" }}>
          <span>{data.assignmentDate?.split("T")[0]}</span>
          {data.departureDate ? (
            <span>{data.departureDate.split("T")[0]}</span>
          ) : (
            <span style={{ color: "#059669", fontWeight: 600 }}>Active</span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-gray-400" />
    </div>
  );
}

export const ContainerNode = memo(ContainerNodeComponent);
