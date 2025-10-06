/**
 * Permission system for role-based access control (RBAC).
 * 
 * This module provides utilities, hooks, and components for checking and enforcing
 * user permissions based on role, geography, and subsidiary access levels.
 * 
 * @example Using the permission guard hook
 * ```tsx
 * function MyComponent() {
 *   const { can, isAdmin, canWrite } = usePermissionGuard()
 *   
 *   if (!canWrite) {
 *     return <ReadOnlyView />
 *   }
 *   
 *   return <EditableView />
 * }
 * ```
 * 
 * @example Using permission gates
 * ```tsx
 * <PermissionGate role={UserRole.ADMIN}>
 *   <AdminPanel />
 * </PermissionGate>
 * 
 * <WriteGate>
 *   <SaveButton />
 * </WriteGate>
 * ```
 */

// Types
export {
  UserRole,
  Geography,
  Subsidiary,
  ROLE_HIERARCHY,
  type PermissionCheckOptions,
  type PermissionCheckResult,
} from './types'

// Utils
export {
  checkPermission,
  isAdmin,
  isManager,
  isOperator,
  canWrite,
  canDelete,
} from './utils'

// Hooks
export { usePermissionGuard, type PermissionGuard } from './usePermissionGuard'

// Components
export {
  PermissionGate,
  AdminGate,
  WriteGate,
  DeleteGate,
  type PermissionGateProps,
} from './PermissionGate'

