/**
 * Permission types and enums for role-based access control (RBAC).
 * Based on the User and UserProfile models from the generated API.
 */

/**
 * User roles with hierarchical access levels.
 * Lower role values have more permissions.
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  MGR = 'MGR',
  OPR = 'OPR',
  VET = 'VET',
  QA = 'QA',
  FIN = 'FIN',
  VIEW = 'VIEW',
}

/**
 * Role hierarchy for permission checks.
 * Roles earlier in the array have more permissions.
 */
export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.ADMIN,
  UserRole.MGR,
  UserRole.OPR,
  UserRole.VET,
  UserRole.QA,
  UserRole.FIN,
  UserRole.VIEW,
]

/**
 * Geographic access levels
 */
export enum Geography {
  FAROE_ISLANDS = 'FO',
  SCOTLAND = 'SC',
  ALL = 'ALL',
}

/**
 * Subsidiary access levels
 */
export enum Subsidiary {
  BROODSTOCK = 'BS',
  FRESHWATER = 'FW',
  FARMING = 'FM',
  LOGISTICS = 'LG',
  ALL = 'ALL',
}

/**
 * Permission check options
 */
export interface PermissionCheckOptions {
  /** Required role (user must have this role or higher) */
  role?: UserRole
  /** Required geography (user must have access to this geography or ALL) */
  geography?: Geography
  /** Required subsidiary (user must have access to this subsidiary or ALL) */
  subsidiary?: Subsidiary
  /** Require exact role match (no hierarchy check) */
  exactRole?: boolean
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  /** Whether permission check passed */
  allowed: boolean
  /** Reason for denial (if not allowed) */
  reason?: string
}


