import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUser } from '@/contexts/UserContext'
import { checkPermission, isAdmin, isManager, isOperator, canWrite, canDelete } from './utils'
import type { PermissionCheckOptions, PermissionCheckResult } from './types'

/**
 * Hook for checking user permissions based on role, geography, and subsidiary.
 * Provides both a flexible check function and common permission shortcuts.
 * 
 * Now enhanced with UserContext integration for RBAC-specific permissions.
 * 
 * @example Basic usage
 * ```tsx
 * function AdminPanel() {
 *   const { can, isAdmin } = usePermissionGuard()
 *   
 *   if (!isAdmin) {
 *     return <AccessDenied />
 *   }
 *   
 *   return <AdminControls />
 * }
 * ```
 * 
 * @example Complex permission check
 * ```tsx
 * function BatchForm() {
 *   const { can } = usePermissionGuard()
 *   
 *   const canEdit = can({
 *     role: UserRole.OPR,
 *     geography: Geography.FAROE_ISLANDS,
 *     subsidiary: Subsidiary.FARMING
 *   })
 *   
 *   return (
 *     <Form>
 *       <Button disabled={!canEdit.allowed}>Save</Button>
 *     </Form>
 *   )
 * }
 * ```
 * 
 * @example RBAC-specific permissions
 * ```tsx
 * function TreatmentForm() {
 *   const { hasTreatmentEditAccess, hasHealthAccess } = usePermissionGuard()
 *   
 *   if (!hasHealthAccess) {
 *     return <AccessDenied />
 *   }
 *   
 *   return (
 *     <Form>
 *       <Button disabled={!hasTreatmentEditAccess}>Save Treatment</Button>
 *     </Form>
 *   )
 * }
 * ```
 */
export function usePermissionGuard() {
  const { user, isAuthenticated } = useAuth()
  const {
    hasHealthAccess,
    hasOperationalAccess,
    hasTreatmentEditAccess,
    hasFinanceAccess,
    hasLocationAssignments,
  } = useUser()

  // Memoize permission check function
  const can = useMemo(
    () => (options: PermissionCheckOptions = {}): PermissionCheckResult => {
      return checkPermission(user, options)
    },
    [user]
  )

  // Memoized convenience flags
  const permissions = useMemo(
    () => ({
      // Authentication status
      isAuthenticated,
      
      // Role checks
      isAdmin: isAdmin(user),
      isManager: isManager(user),
      isOperator: isOperator(user),
      
      // Action permissions
      canWrite: canWrite(user),
      canDelete: canDelete(user),
      
      // RBAC-specific permissions (from UserContext)
      hasHealthAccess,
      hasOperationalAccess,
      hasTreatmentEditAccess,
      hasFinanceAccess,
      hasLocationAssignments,
      
      // User info
      role: user?.role,
      geography: user?.geography,
      subsidiary: user?.subsidiary,
    }),
    [
      user, 
      isAuthenticated,
      hasHealthAccess,
      hasOperationalAccess,
      hasTreatmentEditAccess,
      hasFinanceAccess,
      hasLocationAssignments,
    ]
  )

  return {
    /** Flexible permission check function */
    can,
    /** Current user object */
    user,
    /** Convenience permission flags */
    ...permissions,
  }
}

/**
 * Result type for usePermissionGuard hook.
 */
export type PermissionGuard = ReturnType<typeof usePermissionGuard>


