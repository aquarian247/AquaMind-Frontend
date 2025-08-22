import React, { ReactNode } from 'react';
import { useLocation, Redirect } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  fallbackPath?: string;
}

/**
 * ProtectedRoute component that guards routes requiring authentication.
 * 
 * Features:
 * - Redirects unauthenticated users to login
 * - Shows loading state while checking auth
 * - Supports permission-based access control
 * - Passes current location as return URL
 * 
 * @example Basic usage
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * 
 * @example With permission check
 * <ProtectedRoute requiredPermission="admin:access">
 *   <AdminPage />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const [location] = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location);
    return <Redirect to={`${fallbackPath}?returnUrl=${returnUrl}`} />;
  }
  
  // If permission check is required and fails, redirect to fallback
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Redirect to="/unauthorized" />;
  }
  
  // User is authenticated and has required permissions, render children
  return <>{children}</>;
};

/**
 * Higher-Order Component (HOC) version of ProtectedRoute
 * 
 * @example
 * const ProtectedDashboard = withProtectedRoute(DashboardPage);
 * 
 * @example With permission
 * const AdminDashboard = withProtectedRoute(AdminPage, { requiredPermission: 'admin:access' });
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function WithProtectedRoute(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;
