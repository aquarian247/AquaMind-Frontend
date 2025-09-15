import { FileX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({
  message = "No Data Available",
  className
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className || ''}`}>
      <FileX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        {message}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        No history records found for the selected filters.
        Try adjusting your search criteria or check back later.
      </p>
    </div>
  );
}
