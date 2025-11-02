import { ApiError } from '@/api/generated/core/ApiError';

/**
 * Enhanced error message configuration for RBAC-related errors
 */
interface RBACErrorMessage {
  title: string;
  message: string;
  action?: string;
}

/**
 * Parse RBAC-specific error messages from API responses
 */
export function parseRBACError(error: unknown): RBACErrorMessage {
  // Default error message
  const defaultError: RBACErrorMessage = {
    title: 'Error',
    message: 'An unexpected error occurred. Please try again.',
  };
  
  // Handle ApiError from generated client
  if (error instanceof ApiError) {
    if (error.status === 403) {
      return parse403Error(error);
    }
    
    if (error.status === 401) {
      return {
        title: 'Authentication Required',
        message: 'Your session has expired. Please log in again.',
        action: 'Login',
      };
    }
    
    if (error.status === 404) {
      return {
        title: 'Not Found',
        message: 'The requested resource was not found.',
      };
    }
  }
  
  // Handle generic Error objects
  if (error instanceof Error) {
    return {
      title: 'Error',
      message: error.message,
    };
  }
  
  return defaultError;
}

/**
 * Parse 403 Forbidden errors with role-specific messages
 */
function parse403Error(error: ApiError): RBACErrorMessage {
  const errorBody = error.body as any;
  const detail = errorBody?.detail || error.message || '';
  
  // Health data access errors
  if (detail.toLowerCase().includes('health') || detail.toLowerCase().includes('veterinarian')) {
    return {
      title: 'Health Data Access Denied',
      message: 'Health data access requires Veterinarian or Quality Assurance role. Contact your administrator if you need access.',
      action: 'Contact Administrator',
    };
  }
  
  // Treatment editing errors
  if (detail.toLowerCase().includes('treatment') && detail.toLowerCase().includes('veterinarian')) {
    return {
      title: 'Treatment Editing Restricted',
      message: 'Only Veterinarians can modify treatments. Quality Assurance users have read-only access.',
      action: 'Request Veterinarian Role',
    };
  }
  
  // Geography restriction errors
  if (detail.toLowerCase().includes('geography') || detail.toLowerCase().includes('region')) {
    return {
      title: 'Geography Restriction',
      message: 'This data is outside your assigned geography. You only have access to your region\'s data.',
    };
  }
  
  // Location assignment errors
  if (detail.toLowerCase().includes('location') || detail.toLowerCase().includes('area') || detail.toLowerCase().includes('station')) {
    return {
      title: 'Location Access Denied',
      message: 'You don\'t have access to this location. Contact your manager to request location assignments.',
      action: 'Request Location Access',
    };
  }
  
  // Operational data access errors
  if (detail.toLowerCase().includes('operator') || detail.toLowerCase().includes('operational')) {
    return {
      title: 'Operational Access Required',
      message: 'This feature requires Operator, Manager, or Administrator role.',
      action: 'Contact Administrator',
    };
  }
  
  // Finance data access errors
  if (detail.toLowerCase().includes('finance')) {
    return {
      title: 'Finance Access Required',
      message: 'Finance data access requires Finance or Administrator role.',
      action: 'Contact Administrator',
    };
  }
  
  // Generic permission denied
  return {
    title: 'Permission Denied',
    message: detail || 'You don\'t have permission to perform this action. Contact your administrator if you believe this is an error.',
    action: 'Contact Administrator',
  };
}

/**
 * Get user-friendly error message from API error
 */
export function getRBACErrorMessage(error: unknown): string {
  const parsed = parseRBACError(error);
  return parsed.message;
}

/**
 * Get error title from API error
 */
export function getRBACErrorTitle(error: unknown): string {
  const parsed = parseRBACError(error);
  return parsed.title;
}

/**
 * Check if error is RBAC-related (403)
 */
export function isRBACError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 403;
  }
  return false;
}

/**
 * Check if error is authentication-related (401)
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401;
  }
  return false;
}

/**
 * Format error for toast notification
 */
export function formatErrorForToast(error: unknown): { title: string; description: string } {
  const parsed = parseRBACError(error);
  return {
    title: parsed.title,
    description: parsed.message,
  };
}

/**
 * Enhanced error handler for use in query error callbacks
 */
export function handleRBACError(error: unknown, onAction?: (action: string) => void): void {
  const parsed = parseRBACError(error);
  
  // Log error for debugging
  console.error('RBAC Error:', {
    title: parsed.title,
    message: parsed.message,
    action: parsed.action,
    originalError: error,
  });
  
  // Call action callback if provided
  if (parsed.action && onAction) {
    onAction(parsed.action);
  }
}

/**
 * React Query error handler wrapper
 */
export function createRBACErrorHandler(
  onError?: (error: RBACErrorMessage) => void
) {
  return (error: unknown) => {
    const parsed = parseRBACError(error);
    
    if (onError) {
      onError(parsed);
    } else {
      // Default: log to console
      console.error('API Error:', parsed);
    }
  };
}
