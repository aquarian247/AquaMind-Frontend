import { describe, it, expect } from 'vitest'
import {
  checkPermission,
  isAdmin,
  isManager,
  isOperator,
  canWrite,
  canDelete,
} from '../utils'
import { UserRole, Geography, Subsidiary } from '../types'
import type { User } from '@/api/generated'

// Helper to create test user
const createUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'VIEW',
  geography: 'FO',
  subsidiary: 'FM',
  is_active: true,
  date_joined: '2024-01-01',
  profile: {} as any,
  ...overrides,
})

describe('Permission Utils', () => {
  describe('checkPermission', () => {
    it('denies permission when user is null', () => {
      const result = checkPermission(null, { role: UserRole.ADMIN })
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('not authenticated')
    })

    it('denies permission when user is undefined', () => {
      const result = checkPermission(undefined, { role: UserRole.ADMIN })
      expect(result.allowed).toBe(false)
    })

    it('denies permission when user is inactive', () => {
      const user = createUser({ is_active: false })
      const result = checkPermission(user, { role: UserRole.ADMIN })
      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('inactive')
    })

    it('allows permission when no requirements specified', () => {
      const user = createUser()
      const result = checkPermission(user, {})
      expect(result.allowed).toBe(true)
    })

    it('checks role hierarchy correctly', () => {
      const user = createUser({ role: 'MGR' })
      
      // Manager can access operator-level resources
      expect(checkPermission(user, { role: UserRole.OPR }).allowed).toBe(true)
      
      // Manager can access manager-level resources
      expect(checkPermission(user, { role: UserRole.MGR }).allowed).toBe(true)
      
      // Manager cannot access admin resources
      expect(checkPermission(user, { role: UserRole.ADMIN }).allowed).toBe(false)
    })

    it('checks exact role when specified', () => {
      const user = createUser({ role: 'MGR' })
      
      // Hierarchical: manager can act as operator
      expect(checkPermission(user, { role: UserRole.OPR }).allowed).toBe(true)
      
      // Exact: manager is not operator
      expect(checkPermission(user, { role: UserRole.OPR, exactRole: true }).allowed).toBe(false)
      
      // Exact: manager is manager
      expect(checkPermission(user, { role: UserRole.MGR, exactRole: true }).allowed).toBe(true)
    })

    it('checks geography access correctly', () => {
      const user = createUser({ geography: 'FO' })
      
      // Can access own geography
      expect(checkPermission(user, { geography: Geography.FAROE_ISLANDS }).allowed).toBe(true)
      
      // Cannot access other geography
      expect(checkPermission(user, { geography: Geography.SCOTLAND }).allowed).toBe(false)
    })

    it('allows ALL geography to access any geography', () => {
      const user = createUser({ geography: 'ALL' })
      
      expect(checkPermission(user, { geography: Geography.FAROE_ISLANDS }).allowed).toBe(true)
      expect(checkPermission(user, { geography: Geography.SCOTLAND }).allowed).toBe(true)
    })

    it('checks subsidiary access correctly', () => {
      const user = createUser({ subsidiary: 'FM' })
      
      // Can access own subsidiary
      expect(checkPermission(user, { subsidiary: Subsidiary.FARMING }).allowed).toBe(true)
      
      // Cannot access other subsidiary
      expect(checkPermission(user, { subsidiary: Subsidiary.BROODSTOCK }).allowed).toBe(false)
    })

    it('allows ALL subsidiary to access any subsidiary', () => {
      const user = createUser({ subsidiary: 'ALL' })
      
      expect(checkPermission(user, { subsidiary: Subsidiary.FARMING }).allowed).toBe(true)
      expect(checkPermission(user, { subsidiary: Subsidiary.BROODSTOCK }).allowed).toBe(true)
    })

    it('checks combined role, geography, and subsidiary', () => {
      const user = createUser({
        role: 'OPR',
        geography: 'FO',
        subsidiary: 'FM',
      })
      
      // All match
      const result1 = checkPermission(user, {
        role: UserRole.OPR,
        geography: Geography.FAROE_ISLANDS,
        subsidiary: Subsidiary.FARMING,
      })
      expect(result1.allowed).toBe(true)
      
      // Role doesn't match
      const result2 = checkPermission(user, {
        role: UserRole.ADMIN,
        geography: Geography.FAROE_ISLANDS,
        subsidiary: Subsidiary.FARMING,
      })
      expect(result2.allowed).toBe(false)
      expect(result2.reason).toContain('role')
      
      // Geography doesn't match
      const result3 = checkPermission(user, {
        role: UserRole.OPR,
        geography: Geography.SCOTLAND,
        subsidiary: Subsidiary.FARMING,
      })
      expect(result3.allowed).toBe(false)
      expect(result3.reason).toContain('geography')
      
      // Subsidiary doesn't match
      const result4 = checkPermission(user, {
        role: UserRole.OPR,
        geography: Geography.FAROE_ISLANDS,
        subsidiary: Subsidiary.BROODSTOCK,
      })
      expect(result4.allowed).toBe(false)
      expect(result4.reason).toContain('subsidiary')
    })
  })

  describe('isAdmin', () => {
    it('returns true for admin user', () => {
      const user = createUser({ role: 'ADMIN' })
      expect(isAdmin(user)).toBe(true)
    })

    it('returns false for non-admin user', () => {
      const user = createUser({ role: 'MGR' })
      expect(isAdmin(user)).toBe(false)
    })

    it('returns false for null user', () => {
      expect(isAdmin(null)).toBe(false)
    })
  })

  describe('isManager', () => {
    it('returns true for manager or higher', () => {
      expect(isManager(createUser({ role: 'ADMIN' }))).toBe(true)
      expect(isManager(createUser({ role: 'MGR' }))).toBe(true)
    })

    it('returns false for roles lower than manager', () => {
      expect(isManager(createUser({ role: 'OPR' }))).toBe(false)
      expect(isManager(createUser({ role: 'VIEW' }))).toBe(false)
    })
  })

  describe('isOperator', () => {
    it('returns true for operator or higher', () => {
      expect(isOperator(createUser({ role: 'ADMIN' }))).toBe(true)
      expect(isOperator(createUser({ role: 'MGR' }))).toBe(true)
      expect(isOperator(createUser({ role: 'OPR' }))).toBe(true)
    })

    it('returns false for roles lower than operator', () => {
      expect(isOperator(createUser({ role: 'VET' }))).toBe(false)
      expect(isOperator(createUser({ role: 'VIEW' }))).toBe(false)
    })
  })

  describe('canWrite', () => {
    it('returns true for non-view roles', () => {
      expect(canWrite(createUser({ role: 'ADMIN' }))).toBe(true)
      expect(canWrite(createUser({ role: 'MGR' }))).toBe(true)
      expect(canWrite(createUser({ role: 'OPR' }))).toBe(true)
    })

    it('returns false for VIEW role', () => {
      expect(canWrite(createUser({ role: 'VIEW' }))).toBe(false)
    })

    it('returns false for null user', () => {
      expect(canWrite(null)).toBe(false)
    })
  })

  describe('canDelete', () => {
    it('returns true for manager or higher', () => {
      expect(canDelete(createUser({ role: 'ADMIN' }))).toBe(true)
      expect(canDelete(createUser({ role: 'MGR' }))).toBe(true)
    })

    it('returns false for roles lower than manager', () => {
      expect(canDelete(createUser({ role: 'OPR' }))).toBe(false)
      expect(canDelete(createUser({ role: 'VIEW' }))).toBe(false)
    })

    it('returns false for null user', () => {
      expect(canDelete(null)).toBe(false)
    })
  })
})

