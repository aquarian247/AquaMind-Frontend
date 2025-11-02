import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { PermissionDeniedState } from './RBACEmptyState';

interface PermissionGuardProps {
  children: React.ReactNode;
  require?: 'health' | 'operational' | 'finance' | 'admin' | 'treatment-edit';
  resource?: string;
  fallback?: React.ReactNode;
}

/**
 * PermissionGuard component that checks user permissions
 * and either renders children or shows permission denied state
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  require,
  resource = 'this feature',
  fallback
}) => {
  const {
    hasHealthAccess,
    hasOperationalAccess,
    hasFinanceAccess,
    hasTreatmentEditAccess,
    isAdmin,
  } = useUser();

  // Check if user has required permission
  const hasPermission = () => {
    if (!require) return true; // No permission required

    switch (require) {
      case 'health':
        return hasHealthAccess;
      case 'operational':
        return hasOperationalAccess;
      case 'finance':
        return hasFinanceAccess;
      case 'treatment-edit':
        return hasTreatmentEditAccess;
      case 'admin':
        return isAdmin;
      default:
        return true;
    }
  };

  if (!hasPermission()) {
    // Show custom fallback or default permission denied state
    return fallback ? <>{fallback}</> : <PermissionDeniedState resource={resource} />;
  }

  return <>{children}</>;
};

/**
 * Higher-order component to wrap pages with permission checks
 */
export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P>,
  requirement: PermissionGuardProps['require'],
  resource?: string
) {
  return function PermissionGuardedComponent(props: P) {
    return (
      <PermissionGuard require={requirement} resource={resource}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}

/**
 * Hook-based permission check for conditional rendering
 */
export function usePermissionCheck(requirement: PermissionGuardProps['require']): boolean {
  const {
    hasHealthAccess,
    hasOperationalAccess,
    hasFinanceAccess,
    hasTreatmentEditAccess,
    isAdmin,
  } = useUser();

  switch (requirement) {
    case 'health':
      return hasHealthAccess;
    case 'operational':
      return hasOperationalAccess;
    case 'finance':
      return hasFinanceAccess;
    case 'treatment-edit':
      return hasTreatmentEditAccess;
    case 'admin':
      return isAdmin;
    default:
      return true;
  }
}

export default PermissionGuard;
