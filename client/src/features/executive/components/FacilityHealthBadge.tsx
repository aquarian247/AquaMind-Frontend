/**
 * FacilityHealthBadge Component
 * 
 * Color-coded badge showing facility health status (Success/Warning/Danger/Info).
 * Integrates with Shadcn/ui Badge component and alert level utilities.
 */

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AlertLevel } from '../types';
import {
  getAlertLevelBadgeVariant,
  getAlertLevelLabel,
  getAlertLevelClass,
} from '../utils/alertLevels';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export interface FacilityHealthBadgeProps {
  level: AlertLevel;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

/**
 * Get icon component for alert level
 */
function getAlertIcon(level: AlertLevel) {
  const iconClass = 'h-3 w-3';

  switch (level) {
    case 'success':
      return <CheckCircle2 className={iconClass} aria-hidden="true" />;
    case 'warning':
      return <AlertTriangle className={iconClass} aria-hidden="true" />;
    case 'danger':
      return <XCircle className={iconClass} aria-hidden="true" />;
    case 'info':
      return <Info className={iconClass} aria-hidden="true" />;
  }
}

/**
 * Get custom color classes for alert level (to override badge defaults)
 */
function getCustomAlertClass(level: AlertLevel): string {
  switch (level) {
    case 'success':
      return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200';
    case 'danger':
      return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200';
    case 'info':
      return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200';
  }
}

/**
 * FacilityHealthBadge Component
 * 
 * @example
 * ```tsx
 * <FacilityHealthBadge level="success" showIcon showLabel />
 * <FacilityHealthBadge level="warning" showIcon />
 * <FacilityHealthBadge level="danger" />
 * ```
 */
export function FacilityHealthBadge({
  level,
  showIcon = false,
  showLabel = true,
  className,
}: FacilityHealthBadgeProps) {
  const variant = getAlertLevelBadgeVariant(level);
  const label = getAlertLevelLabel(level);

  return (
    <Badge
      variant={variant}
      className={cn(
        'inline-flex items-center gap-1',
        getCustomAlertClass(level),
        className
      )}
      aria-label={`Health status: ${label}`}
    >
      {showIcon && getAlertIcon(level)}
      {showLabel && <span>{label}</span>}
    </Badge>
  );
}

/**
 * FacilityHealthDot - Compact dot indicator for health status
 * Useful in dense tables where space is limited
 */
export function FacilityHealthDot({
  level,
  className,
}: {
  level: AlertLevel;
  className?: string;
}) {
  const colorClass = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-gray-400',
  }[level];

  const label = getAlertLevelLabel(level);

  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        colorClass,
        className
      )}
      aria-label={`Health: ${label}`}
      title={label}
    />
  );
}

