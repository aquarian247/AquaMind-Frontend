import { useParams, Link } from "wouter";
import { ArrowLeft, Calendar, User, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TypeBadge } from "../components/TypeBadge";
import { useHistoryDetail } from "../hooks/useHistory";
import { HistoryType } from "../hooks/useHistoryFilters";
import { format } from "date-fns";

interface RecordDetailPageProps {
  params?: {
    id?: string;
  };
}

export function RecordDetailPage({ params }: RecordDetailPageProps = {}) {
  const routeParams = useParams();
  const historyId = parseInt((params?.id || routeParams.id) || "0");

  // For now, we'll default to batch domain - in a real implementation,
  // you'd want to determine the domain from the route or context
  const { data, isLoading, error } = useHistoryDetail("batch", "batch", historyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">
            Record Not Found
          </h3>
          <p className="text-muted-foreground mb-4">
            The requested history record could not be found.
          </p>
          <Button asChild>
            <Link href="/audit-trail">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Audit Trail
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getFieldDisplayName = (fieldName: string): string => {
    // Convert snake_case to Title Case
    return fieldName
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Extract fields to display (exclude history-specific fields)
  const displayFields = Object.entries(data).filter(([key]) =>
    !key.startsWith("history_") && key !== "id"
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/audit-trail">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Audit Trail
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">History Record Details</h1>
          <p className="text-muted-foreground">
            Record #{data.history_id || (data as any).id || 'Unknown'}
          </p>
        </div>
      </div>

      {/* Record Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Record Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Date & Time</div>
                <div className="font-medium">
                  {format(new Date(data.history_date), "PPP 'at' p")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">User</div>
                <div className="font-medium">{data.history_user}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Change Type</div>
                <TypeBadge type={data.history_type as HistoryType} />
              </div>
            </div>

            {data.history_change_reason && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Reason</div>
                  <div className="font-medium">{data.history_change_reason}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Record Data Card */}
      <Card>
        <CardHeader>
          <CardTitle>Record Data</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete snapshot of the record at the time of this change
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayFields.map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="font-medium text-sm min-w-[200px]">
                  {getFieldDisplayName(key)}:
                </div>
                <div className="flex-1 text-sm break-all">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {formatFieldValue(value)}
                  </code>
                </div>
              </div>
            ))}
          </div>

          {displayFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No additional data fields available for this record.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
