import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermissionGuard } from '../usePermissionGuard'
import { UserRole, Geography, Subsidiary } from '../types'
import * as AuthContext from '@/contexts/AuthContext'
import type { User } from '@/api/generated'

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

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

describe('usePermissionGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns permission check function and flags', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'ADMIN' }),
      isAuthenticated: true,
    } as any)

    const { result } = renderHook(() => usePermissionGuard())

    expect(result.current.can).toBeDefined()
    expect(typeof result.current.can).toBe('function')
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isAdmin).toBe(true)
  })

  it('exposes role flags correctly', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'MGR' }),
      isAuthenticated: true,
    } as any)

    const { result } = renderHook(() => usePermissionGuard())

    expect(result.current.isAdmin).toBe(false)
    expect(result.current.isManager).toBe(true)
    // Manager has operator permissions (hierarchical)
    expect(result.current.isOperator).toBe(true)
  })

  it('exposes action permission flags', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'MGR' }),
      isAuthenticated: true,
    } as any)

    const { result } = renderHook(() => usePermissionGuard())

    expect(result.current.canWrite).toBe(true)
    expect(result.current.canDelete).toBe(true)
  })

  it('exposes VIEW role as no-write', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'VIEW' }),
      isAuthenticated: true,
    } as any)

    const { result } = renderHook(() => usePermissionGuard())

    expect(result.current.canWrite).toBe(false)
    expect(result.current.canDelete).toBe(false)
  })

  it('exposes user info', () => {
    const user = createUser({ role: 'OPR', geography: 'SC', subsidiary: 'BS' })
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user,
      isAuthenticated: true,
    } as any)

    const { result } = renderHook(() => usePermissionGuard())

    expect(result.current.role).toBe('OPR')
    expect(result.current.geography).toBe('SC')
    expect(result.current.subsidiary).toBe('BS')
    expect(result.current.user).toEqual(user)
  })

  it('can function checks permissions correctly', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'OPR', geography: 'FO', subsidiary: 'FM' }),
      isAuthenticated: true,
    } as any)

    const { result } = renderHook(() => usePermissionGuard())

    // Allowed
    expect(
      result.current.can({
        role: UserRole.OPR,
        geography: Geography.FAROE_ISLANDS,
        subsidiary: Subsidiary.FARMING,
      }).allowed
    ).toBe(true)

    // Not allowed - wrong geography
    expect(
      result.current.can({
        role: UserRole.OPR,
        geography: Geography.SCOTLAND,
        subsidiary: Subsidiary.FARMING,
      }).allowed
    ).toBe(false)
  })

  it('handles unauthenticated user', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
    } as any)

    const { result } = renderHook(() => usePermissionGuard())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isAdmin).toBe(false)
    expect(result.current.canWrite).toBe(false)
    expect(result.current.can({ role: UserRole.VIEW }).allowed).toBe(false)
  })
})
