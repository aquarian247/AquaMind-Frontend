import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'skeleton-table';
  message?: string;
  className?: string;
  rows?: number; // For skeleton-table variant
}

export function LoadingState({
  variant = 'spinner',
  message = 'Loading...',
  className,
  rows = 5
}: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 px-4 ${className || ''}`}
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground mb-4"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div
        className={`space-y-4 ${className || ''}`}
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        <Skeleton className="h-4 w-full" aria-hidden="true" />
        <Skeleton className="h-4 w-3/4" aria-hidden="true" />
        <Skeleton className="h-4 w-1/2" aria-hidden="true" />
      </div>
    );
  }

  if (variant === 'skeleton-table') {
    return (
      <div
        className={`rounded-md border ${className || ''}`}
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        {/* Table Header Skeleton */}
        <div className="border-b p-4">
          <div className="flex gap-4">
            <Skeleton className="h-4 flex-1" aria-hidden="true" />
            <Skeleton className="h-4 w-24" aria-hidden="true" />
            <Skeleton className="h-4 w-16" aria-hidden="true" />
            <Skeleton className="h-4 flex-1" aria-hidden="true" />
            <Skeleton className="h-4 w-32" aria-hidden="true" />
            <Skeleton className="h-4 w-20" aria-hidden="true" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="border-b last:border-b-0 p-4 animate-pulse">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-4 flex-1" aria-hidden="true" />
              <Skeleton className="h-4 w-24" aria-hidden="true" />
              <Skeleton className="h-4 w-16" aria-hidden="true" />
              <Skeleton className="h-4 flex-1" aria-hidden="true" />
              <Skeleton className="h-4 w-32" aria-hidden="true" />
              <Skeleton className="h-4 w-20" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// Specialized loading components for common use cases
export function TableLoadingState({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <LoadingState
      variant="skeleton-table"
      message="Loading audit trail records..."
      rows={rows}
      className={className}
    />
  );
}

export function PageLoadingState({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className || ''}`}>
      <LoadingState variant="spinner" message="Loading audit trail..." />
    </div>
  );
}
