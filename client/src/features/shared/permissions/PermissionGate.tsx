import React, { ReactNode } from 'react'
import { usePermissionGuard } from './usePermissionGuard'
import type { PermissionCheckOptions } from './types'

/**
 * Component for conditional rendering based on permissions.
 * Hides content if user doesn't have required permissions.
 * 
 * @example Basic role check
 * ```tsx
 * <PermissionGate role={UserRole.ADMIN}>
 *   <AdminControls />
 * </PermissionGate>
 * ```
 * 
 * @example Complex permission check
 * ```tsx
 * <PermissionGate
 *   role={UserRole.OPR}
 *   geography={Geography.FAROE_ISLANDS}
 *   subsidiary={Subsidiary.FARMING}
 *   fallback={<AccessDenied />}
 * >
 *   <BatchForm />
 * </PermissionGate>
 * ```
 * 
 * @example With custom fallback
 * ```tsx
 * <PermissionGate
 *   role={UserRole.MGR}
 *   fallback={<div>Manager access required</div>}
 * >
 *   <DeleteButton />
 * </PermissionGate>
 * ```
 */
export interface PermissionGateProps extends PermissionCheckOptions {
  /** Content to render if permission check passes */
  children: ReactNode
  /** Optional content to render if permission check fails */
  fallback?: ReactNode
  /** Optional class name for wrapper div */
  className?: string
}

export function PermissionGate({
  children,
  fallback = null,
  className,
  ...permissionOptions
}: PermissionGateProps) {
  const { can } = usePermissionGuard()
  
  const { allowed } = can(permissionOptions)
  
  if (!allowed) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }
  
  return <div className={className}>{children}</div>
}

/**
 * Shorthand component for admin-only content.
 * 
 * @example
 * ```tsx
 * <AdminGate>
 *   <AdminPanel />
 * </AdminGate>
 * ```
 */
export function AdminGate({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const { isAdmin } = usePermissionGuard()
  return isAdmin ? <>{children}</> : fallback ? <>{fallback}</> : null
}

/**
 * Shorthand component for write-permission content (excludes VIEW role).
 * 
 * @example
 * ```tsx
 * <WriteGate>
 *   <Button>Save</Button>
 * </WriteGate>
 * ```
 */
export function WriteGate({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const { canWrite } = usePermissionGuard()
  return canWrite ? <>{children}</> : fallback ? <>{fallback}</> : null
}

/**
 * Shorthand component for delete-permission content (manager or higher).
 * 
 * @example
 * ```tsx
 * <DeleteGate>
 *   <Button variant="destructive">Delete</Button>
 * </DeleteGate>
 * ```
 */
export function DeleteGate({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const { canDelete } = usePermissionGuard()
  return canDelete ? <>{children}</> : fallback ? <>{fallback}</> : null
}
