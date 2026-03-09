import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { ArrowRightLeft } from "lucide-react";
import type { StageHeaderData } from "./containerFlow.types";

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function StageColumnHeaderComponent({ data }: NodeProps & { data: StageHeaderData }) {
  return (
    <div
      style={{
        padding: "6px 14px",
        borderRadius: 6,
        backgroundColor: "rgba(243, 244, 246, 0.9)",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        minWidth: 160,
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      className="hover:bg-gray-200/80 hover:border-gray-300 hover:shadow"
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{data.stageName}</div>
      <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <span>{data.assignmentCount} assignments</span>
        <span>&middot;</span>
        <span>{formatPopulation(data.totalPopulation)}</span>
        {data.internalTransferCount > 0 && (
          <>
            <span>&middot;</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: "#6366f1" }}>
              <ArrowRightLeft style={{ width: 9, height: 9 }} />
              {data.internalTransferCount}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export const StageColumnHeader = memo(StageColumnHeaderComponent);
