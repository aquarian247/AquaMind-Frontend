import React from 'react';
import { AlertCircle, Ban, FileX, Server, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  error?: Error | unknown;
  statusCode?: number;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorState({
  error,
  statusCode,
  title,
  message,
  onRetry,
  showRetry = true,
  className
}: ErrorStateProps) {
  // Extract status code from error if available
  const actualStatusCode = statusCode || getStatusCodeFromError(error);

  // Get appropriate error details based on status code
  const errorDetails = getErrorDetails(actualStatusCode);

  const displayTitle = title || errorDetails.title;
  const displayMessage = message || errorDetails.message;
  const Icon = errorDetails.icon;

  return (
    <div
      className={`flex items-center justify-center min-h-[300px] p-6 ${className || ''}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <Icon className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>{displayTitle}</AlertTitle>
          <AlertDescription className="mt-2">
            {displayMessage}
          </AlertDescription>
        </Alert>

        {showRetry && onRetry && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              aria-label={`Retry loading audit trail data: ${displayMessage}`}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </Button>
          </div>
        )}

        {process.env.NODE_ENV === 'development' && error ? (
          <details className="mt-4 p-3 bg-muted rounded text-xs">
            <summary
              className="cursor-pointer font-medium"
              aria-label="Toggle error details for debugging (development mode only)"
            >
              Error Details (Dev Mode)
            </summary>
            <pre
              className="mt-2 whitespace-pre-wrap text-destructive"
              aria-label="Technical error details"
            >
              {error instanceof Error ? error.message : String(error)}
              {error instanceof Error && error.stack && (
                <div className="mt-2 opacity-75" aria-label="Error stack trace">
                  {error.stack}
                </div>
              )}
            </pre>
          </details>
        ) : null}
      </div>
    </div>
  );
}

// Helper function to extract status code from error
function getStatusCodeFromError(error: unknown): number | undefined {
  if (!error) return undefined;

  // Check for common error patterns
  const errorString = String(error);

  // Look for status codes in error message
  const statusMatch = errorString.match(/(\d{3}):/);
  if (statusMatch) {
    return parseInt(statusMatch[1], 10);
  }

  // Check if error has a status property
  if (typeof error === 'object' && error !== null && 'status' in error) {
    return (error as any).status;
  }

  return undefined;
}

// Get error details based on status code
function getErrorDetails(statusCode?: number) {
  switch (statusCode) {
    case 400:
      return {
        title: 'Bad Request',
        message: 'The request was invalid. Please check your filters and try again.',
        icon: AlertCircle
      };

    case 401:
      return {
        title: 'Authentication Required',
        message: 'Your session has expired. Please log in again to continue.',
        icon: Ban
      };

    case 403:
      return {
        title: 'Access Forbidden',
        message: 'You don\'t have permission to view audit trail data. Please contact your administrator.',
        icon: Ban
      };

    case 404:
      return {
        title: 'Data Not Found',
        message: 'The requested audit trail data could not be found. It may have been deleted or moved.',
        icon: FileX
      };

    case 429:
      return {
        title: 'Too Many Requests',
        message: 'You\'ve made too many requests. Please wait a moment before trying again.',
        icon: AlertCircle
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        title: 'Server Error',
        message: 'The server encountered an error while processing your request. Please try again later.',
        icon: Server
      };

    default:
      // Network or unknown errors
      return {
        title: 'Connection Error',
        message: 'Unable to load audit trail data. Please check your internet connection and try again.',
        icon: Wifi
      };
  }
}

// Specialized error components for common scenarios
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}

export function PermissionErrorState() {
  return (
    <ErrorState
      statusCode={403}
      showRetry={false}
    />
  );
}

export function NotFoundErrorState() {
  return (
    <ErrorState
      statusCode={404}
      message="The audit trail record you're looking for could not be found."
      showRetry={false}
    />
  );
}
