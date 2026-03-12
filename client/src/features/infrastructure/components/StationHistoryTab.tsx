import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerAssignmentSwimlaneView } from "@/features/batch-management/components/container-flow/ContainerAssignmentSwimlane";
import { computeTrailingTimeWindow } from "@/features/batch-management/components/container-flow/swimlaneTransformers";
import { useStationContainerFlowData } from "@/features/batch-management/components/container-flow/useStationContainerFlowData";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

interface StationHistoryTabProps {
  stationId: number;
  stationName: string;
}

export function StationHistoryTab({ stationId, stationName }: StationHistoryTabProps) {
  const { assignments, actions, isLoading, error } = useStationContainerFlowData(stationId);

  const initialVisibleWindow = useMemo(
    () => computeTrailingTimeWindow(assignments, actions, ONE_YEAR_MS),
    [assignments, actions],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Container Assignment History</CardTitle>
        <CardDescription>
          Swimlane history across all batches that have occupied containers at {stationName}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContainerAssignmentSwimlaneView
          assignments={assignments}
          actions={actions}
          isLoading={isLoading}
          error={error}
          viewKey={`station-${stationId}`}
          initialVisibleWindow={initialVisibleWindow}
          showBatchLabels
          stackItems
        />
      </CardContent>
    </Card>
  );
}
