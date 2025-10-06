import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GeographyDeleteButton } from '../components/GeographyDeleteButton'
import * as api from '../api'
import type { Geography } from '@/api/generated'

// Mock the API hooks
vi.mock('../api', () => ({
  useDeleteGeography: vi.fn(),
}))

// Mock permission components - allow all by default
vi.mock('@/features/shared/permissions', () => ({
  DeleteGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock audit components
vi.mock('@/features/shared/audit', () => ({
  useAuditReasonPrompt: vi.fn(),
  AuditReasonDialog: ({ open, onConfirm, onCancel }: any) => {
    if (!open) return null
    return (
      <div data-testid="audit-dialog">
        <button onClick={() => onConfirm('Test reason')}>Confirm</button>
        <button onClick={onCancel}>Cancel Dialog</button>
      </div>
    )
  },
}))

const mockGeography: Geography = {
  id: 1,
  name: 'Norwegian Coast',
  description: 'Western coast of Norway',
}

describe('GeographyDeleteButton', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()
  })

  const renderButton = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <GeographyDeleteButton geography={mockGeography} {...props} />
      </QueryClientProvider>
    )
  }

  it('renders delete button', () => {
    const mockDelete = { mutateAsync: vi.fn(), isPending: false }
    vi.mocked(api.useDeleteGeography).mockReturnValue(mockDelete as any)
    
    const { useAuditReasonPrompt } = require('@/features/shared/audit')
    useAuditReasonPrompt.mockReturnValue({
      promptReason: vi.fn(),
      dialogState: { isOpen: false, options: {}, onConfirm: vi.fn(), onCancel: vi.fn() },
    })

    renderButton()

    expect(screen.getByRole('button', { name: /delete geography/i })).toBeInTheDocument()
  })

  it('shows audit dialog when delete is clicked', async () => {
    const user = userEvent.setup()
    const mockDelete = { mutateAsync: vi.fn(), isPending: false }
    const mockPromptReason = vi.fn().mockResolvedValue({ confirmed: true, reason: 'Test reason' })
    
    vi.mocked(api.useDeleteGeography).mockReturnValue(mockDelete as any)
    
    const { useAuditReasonPrompt } = require('@/features/shared/audit')
    useAuditReasonPrompt.mockReturnValue({
      promptReason: mockPromptReason,
      dialogState: { isOpen: true, options: {}, onConfirm: vi.fn(), onCancel: vi.fn() },
    })

    renderButton()

    const deleteButton = screen.getByRole('button', { name: /delete geography/i })
    await user.click(deleteButton)

    // Dialog should be shown
    await waitFor(() => {
      expect(screen.getByTestId('audit-dialog')).toBeInTheDocument()
    })
  })

  it('calls delete mutation with audit reason when confirmed', async () => {
    const user = userEvent.setup()
    const mockDelete = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
    const mockOnSuccess = vi.fn()
    const mockPromptReason = vi.fn().mockResolvedValue({ confirmed: true, reason: 'No longer needed' })
    
    vi.mocked(api.useDeleteGeography).mockReturnValue(mockDelete as any)
    
    const { useAuditReasonPrompt } = require('@/features/shared/audit')
    useAuditReasonPrompt.mockReturnValue({
      promptReason: mockPromptReason,
      dialogState: { isOpen: false, options: {}, onConfirm: vi.fn(), onCancel: vi.fn() },
    })

    renderButton({ onSuccess: mockOnSuccess })

    const deleteButton = screen.getByRole('button', { name: /delete geography/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockPromptReason).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Confirm Delete Geography',
          required: true,
          minLength: 10,
        })
      )
    })

    await waitFor(() => {
      expect(mockDelete.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          __auditReason: 'No longer needed',
        })
      )
    })

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('does not delete when user cancels audit dialog', async () => {
    const user = userEvent.setup()
    const mockDelete = { mutateAsync: vi.fn(), isPending: false }
    const mockPromptReason = vi.fn().mockResolvedValue({ confirmed: false, reason: '' })
    
    vi.mocked(api.useDeleteGeography).mockReturnValue(mockDelete as any)
    
    const { useAuditReasonPrompt } = require('@/features/shared/audit')
    useAuditReasonPrompt.mockReturnValue({
      promptReason: mockPromptReason,
      dialogState: { isOpen: false, options: {}, onConfirm: vi.fn(), onCancel: vi.fn() },
    })

    renderButton()

    const deleteButton = screen.getByRole('button', { name: /delete geography/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockPromptReason).toHaveBeenCalled()
    })

    expect(mockDelete.mutateAsync).not.toHaveBeenCalled()
  })

  it('shows loading state during deletion', () => {
    const mockDelete = { mutateAsync: vi.fn(), isPending: true }
    vi.mocked(api.useDeleteGeography).mockReturnValue(mockDelete as any)
    
    const { useAuditReasonPrompt } = require('@/features/shared/audit')
    useAuditReasonPrompt.mockReturnValue({
      promptReason: vi.fn(),
      dialogState: { isOpen: false, options: {}, onConfirm: vi.fn(), onCancel: vi.fn() },
    })

    renderButton()

    const deleteButton = screen.getByRole('button', { name: /deleting/i })
    expect(deleteButton).toBeDisabled()
    expect(deleteButton).toHaveTextContent('Deleting...')
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockDelete = {
      mutateAsync: vi.fn().mockRejectedValue(new Error('API Error')),
      isPending: false,
    }
    const mockPromptReason = vi.fn().mockResolvedValue({ confirmed: true, reason: 'Test reason' })
    
    vi.mocked(api.useDeleteGeography).mockReturnValue(mockDelete as any)
    
    const { useAuditReasonPrompt } = require('@/features/shared/audit')
    useAuditReasonPrompt.mockReturnValue({
      promptReason: mockPromptReason,
      dialogState: { isOpen: false, options: {}, onConfirm: vi.fn(), onCancel: vi.fn() },
    })

    renderButton()

    const deleteButton = screen.getByRole('button', { name: /delete geography/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Delete geography error:',
        expect.any(Error)
      )
    })

    consoleError.mockRestore()
  })

  it('supports custom button variants', () => {
    const mockDelete = { mutateAsync: vi.fn(), isPending: false }
    vi.mocked(api.useDeleteGeography).mockReturnValue(mockDelete as any)
    
    const { useAuditReasonPrompt } = require('@/features/shared/audit')
    useAuditReasonPrompt.mockReturnValue({
      promptReason: vi.fn(),
      dialogState: { isOpen: false, options: {}, onConfirm: vi.fn(), onCancel: vi.fn() },
    })

    renderButton({ variant: 'outline' })

    const deleteButton = screen.getByRole('button', { name: /delete geography/i })
    expect(deleteButton).toBeInTheDocument()
  })
})
