import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { getHistoryTypeLabel, getHistoryTypeColor } from "../hooks/useHistory";
import { HistoryType } from "../hooks/useHistoryFilters";

interface TypeBadgeProps {
  type: HistoryType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const label = getHistoryTypeLabel(type);
  const colorClass = getHistoryTypeColor(type);

  return (
    <Badge
      variant="outline"
      className={`${colorClass} font-medium ${className || ''}`}
      aria-label={`Change type: ${label}`}
      role="status"
    >
      {label}
    </Badge>
  );
}

export const MemoizedTypeBadge = memo(TypeBadge);
