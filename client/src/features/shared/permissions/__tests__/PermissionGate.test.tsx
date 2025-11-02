import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PermissionGate, AdminGate, WriteGate, DeleteGate } from '../PermissionGate'
import { UserRole } from '../types'
import * as AuthContext from '@/contexts/AuthContext'
import * as UserContext from '@/contexts/UserContext'
import type { User } from '@/api/generated'

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

// Mock UserContext
vi.mock('@/contexts/UserContext', () => ({
  useUser: vi.fn(),
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

// Helper to setup common mocks
const setupMocks = (role: string) => {
  vi.mocked(AuthContext.useAuth).mockReturnValue({
    user: createUser({ role }),
    isAuthenticated: true,
  } as any)

  const isAdmin = role === 'ADMIN'
  const canWrite = ['ADMIN', 'MGR', 'OPR', 'VET', 'QA', 'FIN'].includes(role)
  const canDelete = ['ADMIN', 'MGR'].includes(role)

  vi.mocked(UserContext.useUser).mockReturnValue({
    hasHealthAccess: ['ADMIN', 'VET', 'QA'].includes(role),
    hasOperationalAccess: ['ADMIN', 'MGR', 'OPR'].includes(role),
    hasTreatmentEditAccess: ['ADMIN', 'VET'].includes(role),
    hasFinanceAccess: ['ADMIN', 'FIN'].includes(role),
    hasLocationAssignments: false,
  } as any)
}

describe('PermissionGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when permission check passes', () => {
    setupMocks('ADMIN')

    render(
      <PermissionGate role={UserRole.ADMIN}>
        <div>Protected Content</div>
      </PermissionGate>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('hides children when permission check fails', () => {
    setupMocks('VIEW')

    render(
      <PermissionGate role={UserRole.ADMIN}>
        <div>Protected Content</div>
      </PermissionGate>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('shows fallback when permission check fails', () => {
    setupMocks('VIEW')

    render(
      <PermissionGate role={UserRole.ADMIN} fallback={<div>Access Denied</div>}>
        <div>Protected Content</div>
      </PermissionGate>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('passes className to wrapper', () => {
    setupMocks('ADMIN')

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
    setupMocks('ADMIN')

    render(
      <AdminGate>
        <div>Admin Panel</div>
      </AdminGate>
    )

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('hides children for non-admin user', () => {
    setupMocks('MGR')

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
    setupMocks('OPR')

    render(
      <WriteGate>
        <button>Save</button>
      </WriteGate>
    )

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('hides children for VIEW role', () => {
    setupMocks('VIEW')

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
    setupMocks('MGR')

    render(
      <DeleteGate>
        <button>Delete</button>
      </DeleteGate>
    )

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('hides children for users without delete permission', () => {
    setupMocks('OPR')

    render(
      <DeleteGate>
        <button>Delete</button>
      </DeleteGate>
    )

    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})


