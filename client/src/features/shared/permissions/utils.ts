import type { User } from '@/api/generated'
import {
  UserRole,
  Geography,
  Subsidiary,
  ROLE_HIERARCHY,
  type PermissionCheckOptions,
  type PermissionCheckResult,
} from './types'

/**
 * Get the hierarchy level of a role (lower = more permissions).
 * Returns Infinity if role not found (least permissions).
 */
function getRoleLevel(role: UserRole | undefined): number {
  if (!role) return Infinity
  const index = ROLE_HIERARCHY.indexOf(role)
  return index === -1 ? Infinity : index
}

/**
 * Check if user's role meets the minimum required role.
 * Uses hierarchical comparison unless exactRole is true.
 */
function checkRole(
  userRole: UserRole | undefined,
  requiredRole: UserRole,
  exactRole: boolean = false
): boolean {
  if (!userRole) return false
  
  if (exactRole) {
    return userRole === requiredRole
  }
  
  // Hierarchical check: user role level must be <= required role level
  return getRoleLevel(userRole) <= getRoleLevel(requiredRole)
}

/**
 * Check if user's geography meets the required geography.
 * User with Geography.ALL can access any geography.
 */
function checkGeography(
  userGeography: Geography | undefined,
  requiredGeography: Geography
): boolean {
  if (!userGeography) return false
  if (userGeography === Geography.ALL) return true
  return userGeography === requiredGeography
}

/**
 * Check if user's subsidiary meets the required subsidiary.
 * User with Subsidiary.ALL can access any subsidiary.
 */
function checkSubsidiary(
  userSubsidiary: Subsidiary | undefined,
  requiredSubsidiary: Subsidiary
): boolean {
  if (!userSubsidiary) return false
  if (userSubsidiary === Subsidiary.ALL) return true
  return userSubsidiary === requiredSubsidiary
}

/**
 * Check if user has permission based on role, geography, and subsidiary.
 * 
 * @param user - Current user object
 * @param options - Permission requirements
 * @returns Permission check result with allowed flag and optional reason
 * 
 * @example
 * // Check if user is admin
 * checkPermission(user, { role: UserRole.ADMIN })
 * 
 * @example
 * // Check if user can access Faroe Islands broodstock
 * checkPermission(user, {
 *   role: UserRole.OPR,
 *   geography: Geography.FAROE_ISLANDS,
 *   subsidiary: Subsidiary.BROODSTOCK
 * })
 */
export function checkPermission(
  user: User | null | undefined,
  options: PermissionCheckOptions = {}
): PermissionCheckResult {
  // No user = no permission
  if (!user) {
    return {
      allowed: false,
      reason: 'User not authenticated',
    }
  }

  // Check if user is active
  if (user.is_active === false) {
    return {
      allowed: false,
      reason: 'User account is inactive',
    }
  }

  const {
    role: requiredRole,
    geography: requiredGeography,
    subsidiary: requiredSubsidiary,
    exactRole = false,
  } = options

  // If no requirements specified, authenticated user is enough
  if (!requiredRole && !requiredGeography && !requiredSubsidiary) {
    return { allowed: true }
  }

  // Check role if specified
  if (requiredRole) {
    if (!checkRole(user.role as UserRole, requiredRole, exactRole)) {
      return {
        allowed: false,
        reason: `User role '${user.role || 'none'}' does not meet required role '${requiredRole}'`,
      }
    }
  }

  // Check geography if specified
  if (requiredGeography) {
    if (!checkGeography(user.geography as Geography, requiredGeography)) {
      return {
        allowed: false,
        reason: `User geography '${user.geography || 'none'}' does not have access to '${requiredGeography}'`,
      }
    }
  }

  // Check subsidiary if specified
  if (requiredSubsidiary) {
    if (!checkSubsidiary(user.subsidiary as Subsidiary, requiredSubsidiary)) {
      return {
        allowed: false,
        reason: `User subsidiary '${user.subsidiary || 'none'}' does not have access to '${requiredSubsidiary}'`,
      }
    }
  }

  return { allowed: true }
}

/**
 * Shorthand to check if user is admin.
 */
export function isAdmin(user: User | null | undefined): boolean {
  return checkPermission(user, { role: UserRole.ADMIN, exactRole: true }).allowed
}

/**
 * Shorthand to check if user is manager or higher.
 */
export function isManager(user: User | null | undefined): boolean {
  return checkPermission(user, { role: UserRole.MGR }).allowed
}

/**
 * Shorthand to check if user is operator or higher.
 */
export function isOperator(user: User | null | undefined): boolean {
  return checkPermission(user, { role: UserRole.OPR }).allowed
}

/**
 * Check if user has write permissions (not VIEW role).
 */
export function canWrite(user: User | null | undefined): boolean {
  if (!user) return false
  return user.role !== UserRole.VIEW
}

/**
 * Check if user can delete entities (manager or higher).
 */
export function canDelete(user: User | null | undefined): boolean {
  return isManager(user)
}
