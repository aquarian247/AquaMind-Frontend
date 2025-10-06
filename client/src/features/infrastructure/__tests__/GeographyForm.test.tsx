import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tantml:query'
import { GeographyForm } from '../components/GeographyForm'
import * as api from '../api'
import type { Geography } from '@/api/generated'

// Mock the API hooks
vi.mock('../api', () => ({
  useCreateGeography: vi.fn(),
  useUpdateGeography: vi.fn(),
}))

// Mock permission components - allow all by default
vi.mock('@/features/shared/permissions', () => ({
  WriteGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockGeography: Geography = {
  id: 1,
  name: 'Norwegian Coast',
  description: 'Western coast of Norway',
}

describe('GeographyForm', () => {
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

  const renderForm = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <GeographyForm {...props} />
      </QueryClientProvider>
    )
  }

  describe('Create Mode', () => {
    it('renders create form', () => {
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      vi.mocked(api.useCreateGeography).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateGeography).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm()

      expect(screen.getByRole('heading', { name: 'Create Geography' })).toBeInTheDocument()
      expect(screen.getByLabelText('Geography Name')).toHaveValue('')
      expect(screen.getByLabelText('Geography Description')).toHaveValue('')
    })

    it('submits valid form data', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
      const mockOnSuccess = vi.fn()
      
      vi.mocked(api.useCreateGeography).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateGeography).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm({ onSuccess: mockOnSuccess })

      await user.type(screen.getByLabelText('Geography Name'), 'North Sea')
      await user.type(screen.getByLabelText('Geography Description'), 'Northern European waters')
      
      const submitButton = screen.getByRole('button', { name: 'Create Geography' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockCreate.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'North Sea',
            description: 'Northern European waters',
          })
        )
      })

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('trims whitespace from input', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
      
      vi.mocked(api.useCreateGeography).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateGeography).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm()

      await user.type(screen.getByLabelText('Geography Name'), '  Baltic Sea  ')
      
      const submitButton = screen.getByRole('button', { name: 'Create Geography' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockCreate.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Baltic Sea',
          })
        )
      })
    })
  })

  describe('Edit Mode', () => {
    it('renders edit form with existing data', () => {
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      const mockUpdate = { mutateAsync: vi.fn(), isPending: false }
      
      vi.mocked(api.useCreateGeography).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateGeography).mockReturnValue(mockUpdate as any)

      renderForm({ geography: mockGeography })

      expect(screen.getByRole('heading', { name: 'Edit Geography' })).toBeInTheDocument()
      expect(screen.getByLabelText('Geography Name')).toHaveValue('Norwegian Coast')
      expect(screen.getByLabelText('Geography Description')).toHaveValue('Western coast of Norway')
    })

    it('submits updated data', async () => {
      const user = userEvent.setup()
      const mockUpdate = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
      const mockOnSuccess = vi.fn()
      
      vi.mocked(api.useCreateGeography).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)
      vi.mocked(api.useUpdateGeography).mockReturnValue(mockUpdate as any)

      renderForm({ geography: mockGeography, onSuccess: mockOnSuccess })

      const nameInput = screen.getByLabelText('Geography Name')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Coast')
      
      const submitButton = screen.getByRole('button', { name: 'Update Geography' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockUpdate.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 1,
            name: 'Updated Coast',
            description: 'Western coast of Norway',
          })
        )
      })

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })
  })

  describe('Cancel Functionality', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnCancel = vi.fn()
      
      vi.mocked(api.useCreateGeography).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)
      vi.mocked(api.useUpdateGeography).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm({ onCancel: mockOnCancel })

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(mockOnCancel).toHaveBeenCalled()
    })
  })
})