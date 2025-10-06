import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PermissionGate, AdminGate, WriteGate, DeleteGate } from '../PermissionGate'
import { UserRole } from '../types'
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

describe('PermissionGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when permission check passes', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'ADMIN' }),
      isAuthenticated: true,
    } as any)

    render(
      <PermissionGate role={UserRole.ADMIN}>
        <div>Protected Content</div>
      </PermissionGate>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('hides children when permission check fails', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'VIEW' }),
      isAuthenticated: true,
    } as any)

    render(
      <PermissionGate role={UserRole.ADMIN}>
        <div>Protected Content</div>
      </PermissionGate>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('shows fallback when permission check fails', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'VIEW' }),
      isAuthenticated: true,
    } as any)

    render(
      <PermissionGate role={UserRole.ADMIN} fallback={<div>Access Denied</div>}>
        <div>Protected Content</div>
      </PermissionGate>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('passes className to wrapper', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'ADMIN' }),
      isAuthenticated: true,
    } as any)

    const { container } = render(
      <PermissionGate role={UserRole.ADMIN} className="custom-class">
        <div>Content</div>
      </PermissionGate>
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})

describe('AdminGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children for admin user', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'ADMIN' }),
      isAuthenticated: true,
    } as any)

    render(
      <AdminGate>
        <div>Admin Panel</div>
      </AdminGate>
    )

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('hides children for non-admin user', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'MGR' }),
      isAuthenticated: true,
    } as any)

    render(
      <AdminGate>
        <div>Admin Panel</div>
      </AdminGate>
    )

    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })
})

describe('WriteGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children for users with write permission', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'OPR' }),
      isAuthenticated: true,
    } as any)

    render(
      <WriteGate>
        <button>Save</button>
      </WriteGate>
    )

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('hides children for VIEW role', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'VIEW' }),
      isAuthenticated: true,
    } as any)

    render(
      <WriteGate>
        <button>Save</button>
      </WriteGate>
    )

    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument()
  })
})

describe('DeleteGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children for users with delete permission', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'MGR' }),
      isAuthenticated: true,
    } as any)

    render(
      <DeleteGate>
        <button>Delete</button>
      </DeleteGate>
    )

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('hides children for users without delete permission', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: createUser({ role: 'OPR' }),
      isAuthenticated: true,
    } as any)

    render(
      <DeleteGate>
        <button>Delete</button>
      </DeleteGate>
    )

    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})
