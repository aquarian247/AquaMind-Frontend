import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Factory, Truck, Ship, Waves } from "lucide-react";
import type { ContainerNodeData, AssignmentRecord } from "./containerFlow.types";

interface NodeDetailPanelProps {
  data: ContainerNodeData | null;
  open: boolean;
  onClose: () => void;
}

const LOCATION_ICONS: Record<string, typeof Factory> = {
  FRESHWATER: Factory,
  TRANSPORT_TRUCK: Truck,
  TRANSPORT_VESSEL: Ship,
  SEA: Waves,
};

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{typeof value === "number" ? value.toLocaleString() : value}</span>
    </div>
  );
}

function AssignmentRow({ a }: { a: AssignmentRecord }) {
  return (
    <div className="py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{a.container_name}</span>
        <Badge variant={a.is_active ? "default" : "secondary"} className="text-[10px]">
          {a.is_active ? "Active" : "Departed"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-muted-foreground">
        <span>Pop: {a.population_count.toLocaleString()}</span>
        <span>Bio: {a.biomass_kg.toFixed(0)} kg</span>
        <span>From: {a.assignment_date?.split("T")[0]}</span>
        <span>{a.departure_date ? `To: ${a.departure_date.split("T")[0]}` : "Active"}</span>
      </div>
    </div>
  );
}

export function NodeDetailPanel({ data, open, onClose }: NodeDetailPanelProps) {
  if (!data) return null;

  const Icon = LOCATION_ICONS[data.locationType] ?? Factory;
  const locationParts = [data.stationName, data.hallName, data.areaName, data.carrierName].filter(Boolean);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {data.containerName}
          </SheetTitle>
          <SheetDescription>
            {data.lifecycleStage} &middot; {locationParts.join(" > ")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Assignment Details</h4>
            <DetailRow label="Population" value={data.populationCount} />
            <DetailRow label="Biomass" value={`${data.biomassKg.toLocaleString()} kg`} />
            <DetailRow label="Avg Weight" value={data.avgWeightG != null ? `${data.avgWeightG.toFixed(1)} g` : null} />
            <DetailRow label="Assigned" value={data.assignmentDate?.split("T")[0]} />
            <DetailRow label="Departed" value={data.departureDate?.split("T")[0]} />
            <DetailRow label="Status" value={data.isActive ? "Active" : "Departed"} />
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Location</h4>
            <DetailRow label="Type" value={data.locationType.replace(/_/g, " ")} />
            <DetailRow label="Station" value={data.stationName} />
            <DetailRow label="Hall" value={data.hallName} />
            <DetailRow label="Area" value={data.areaName} />
            <DetailRow label="Carrier" value={data.carrierName} />
          </div>

          {data.isMixed && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Mixed Batch</h4>
                <p className="text-sm text-muted-foreground">
                  This container has multiple active batches sharing the same physical space.
                </p>
              </div>
            </>
          )}

          {data.isCollapsedGroup && data.groupedAssignments.length > 1 && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Grouped Tanks ({data.groupedCount})
                </h4>
                {data.groupedAssignments.map((a) => (
                  <AssignmentRow key={a.id} a={a} />
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
