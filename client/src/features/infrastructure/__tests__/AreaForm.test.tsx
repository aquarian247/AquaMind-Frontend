import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AreaForm } from '../components/AreaForm'
import * as api from '../api'
import type { Area, Geography } from '@/api/generated'

// Mock the API hooks
vi.mock('../api', () => ({
  useCreateArea: vi.fn(),
  useUpdateArea: vi.fn(),
  useGeographies: vi.fn(),
}))

// Mock permission components - allow all by default
vi.mock('@/features/shared/permissions', () => ({
  WriteGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockGeographies: Geography[] = [
  { id: 1, name: 'Norwegian Coast', description: '' },
  { id: 2, name: 'North Sea', description: '' },
]

const mockArea: Area = {
  id: 1,
  name: 'Site Alpha',
  geography: 1,
  latitude: '59.9139',
  longitude: '10.7522',
  max_biomass: '100000.00',
  active: true,
}

describe('AreaForm', () => {
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
        <AreaForm {...props} />
      </QueryClientProvider>
    )
  }

  describe('Create Mode', () => {
    beforeEach(() => {
      vi.mocked(api.useGeographies).mockReturnValue({
        data: { results: mockGeographies },
        isLoading: false,
      } as any)
    })

    it('renders create form with empty fields', () => {
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm()

      expect(screen.getByText('Create Area')).toBeInTheDocument()
      expect(screen.getByLabelText('Area Name')).toHaveValue('')
      expect(screen.getByLabelText('Latitude')).toHaveValue('')
      expect(screen.getByLabelText('Longitude')).toHaveValue('')
      expect(screen.getByLabelText('Maximum Biomass')).toHaveValue('')
      expect(screen.getByRole('button', { name: /create area/i })).toBeInTheDocument()
    })

    it('validates required fields', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm()

      const submitButton = screen.getByRole('button', { name: /create area/i })
      await user.click(submitButton)

      // Should show validation errors for required fields
      await waitFor(() => {
        const errors = screen.getAllByText(/required|must contain at least/i)
        expect(errors.length).toBeGreaterThan(0)
      })

      expect(mockCreate.mutateAsync).not.toHaveBeenCalled()
    })

    it('validates latitude range (-90 to 90)', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm()

      await user.type(screen.getByLabelText('Area Name'), 'Test Area')
      await user.type(screen.getByLabelText('Latitude'), '95') // Invalid: > 90
      await user.type(screen.getByLabelText('Longitude'), '10')
      await user.type(screen.getByLabelText('Maximum Biomass'), '100000')
      await user.click(screen.getByRole('button', { name: /create area/i }))

      await waitFor(() => {
        expect(screen.getByText(/latitude must be between -90 and 90/i)).toBeInTheDocument()
      })

      expect(mockCreate.mutateAsync).not.toHaveBeenCalled()
    })

    it('validates longitude range (-180 to 180)', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm()

      await user.type(screen.getByLabelText('Area Name'), 'Test Area')
      await user.type(screen.getByLabelText('Latitude'), '59')
      await user.type(screen.getByLabelText('Longitude'), '200') // Invalid: > 180
      await user.type(screen.getByLabelText('Maximum Biomass'), '100000')
      await user.click(screen.getByRole('button', { name: /create area/i }))

      await waitFor(() => {
        expect(screen.getByText(/longitude must be between -180 and 180/i)).toBeInTheDocument()
      })

      expect(mockCreate.mutateAsync).not.toHaveBeenCalled()
    })

    it('validates positive max_biomass', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm()

      await user.type(screen.getByLabelText('Area Name'), 'Test Area')
      await user.type(screen.getByLabelText('Latitude'), '59')
      await user.type(screen.getByLabelText('Longitude'), '10')
      await user.type(screen.getByLabelText('Maximum Biomass'), '-100') // Invalid: negative
      await user.click(screen.getByRole('button', { name: /create area/i }))

      await waitFor(() => {
        expect(screen.getByText(/must be greater than or equal to 0/i)).toBeInTheDocument()
      })

      expect(mockCreate.mutateAsync).not.toHaveBeenCalled()
    })

    it('submits valid form data with all fields', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
      const mockOnSuccess = vi.fn()
      
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      // Use pre-filled area to avoid Select component issues in jsdom
      const preFilledArea = {
        ...mockArea,
        id: undefined,
        name: '',
      } as any

      renderForm({ area: preFilledArea, onSuccess: mockOnSuccess })

      const nameInput = screen.getByLabelText('Area Name')
      await user.clear(nameInput)
      await user.type(nameInput, 'New Site')
      
      const latInput = screen.getByLabelText('Latitude')
      await user.clear(latInput)
      await user.type(latInput, '60.5')
      
      const lonInput = screen.getByLabelText('Longitude')
      await user.clear(lonInput)
      await user.type(lonInput, '5.25')
      
      const bioInput = screen.getByLabelText('Maximum Biomass')
      await user.clear(bioInput)
      await user.type(bioInput, '150000.50')
      
      await user.click(screen.getByRole('button', { name: /create area/i }))

      await waitFor(() => {
        expect(mockCreate.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Site',
            geography: 1,
            latitude: '60.5',
            longitude: '5.25',
            max_biomass: '150000.50',
            active: true,
          })
        )
      })

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })

    it('handles checkbox for active status', async () => {
      const user = userEvent.setup()
      const mockCreate = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
      
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      // Use pre-filled area to avoid Select component issues in jsdom
      const preFilledArea = {
        ...mockArea,
        id: undefined,
        name: '',
        active: true,
      } as any

      renderForm({ area: preFilledArea })

      const activeCheckbox = screen.getByRole('checkbox', { name: /active/i })
      expect(activeCheckbox).toBeChecked() // Default is true

      // Uncheck active
      await user.click(activeCheckbox)
      expect(activeCheckbox).not.toBeChecked()

      await user.type(screen.getByLabelText('Area Name'), 'Test')
      await user.click(screen.getByRole('button', { name: /create area/i }))

      await waitFor(() => {
        expect(mockCreate.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            active: false,
          })
        )
      })
    })

    it('handles API errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockCreate = {
        mutateAsync: vi.fn().mockRejectedValue(new Error('API Error')),
        isPending: false,
      }
      
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      // Use pre-filled area to avoid Select component issues in jsdom
      const preFilledArea = {
        ...mockArea,
        id: undefined,
        name: '',
      } as any

      renderForm({ area: preFilledArea })

      await user.type(screen.getByLabelText('Area Name'), 'Test')
      await user.click(screen.getByRole('button', { name: /create area/i }))

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'Form submission error:',
          expect.any(Error)
        )
      })

      consoleError.mockRestore()
    })
  })

  describe('Edit Mode', () => {
    beforeEach(() => {
      vi.mocked(api.useGeographies).mockReturnValue({
        data: { results: mockGeographies },
        isLoading: false,
      } as any)
    })

    it('renders edit form with existing data', () => {
      const mockCreate = { mutateAsync: vi.fn(), isPending: false }
      const mockUpdate = { mutateAsync: vi.fn(), isPending: false }
      
      vi.mocked(api.useCreateArea).mockReturnValue(mockCreate as any)
      vi.mocked(api.useUpdateArea).mockReturnValue(mockUpdate as any)

      renderForm({ area: mockArea })

      expect(screen.getByText('Edit Area')).toBeInTheDocument()
      expect(screen.getByLabelText('Area Name')).toHaveValue('Site Alpha')
      expect(screen.getByLabelText('Latitude')).toHaveValue('59.9139')
      expect(screen.getByLabelText('Longitude')).toHaveValue('10.7522')
      expect(screen.getByLabelText('Maximum Biomass')).toHaveValue('100000.00')
      expect(screen.getByRole('checkbox', { name: /active/i })).toBeChecked()
      expect(screen.getByRole('button', { name: /update area/i })).toBeInTheDocument()
    })

    it('submits updated data', async () => {
      const user = userEvent.setup()
      const mockUpdate = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false }
      const mockOnSuccess = vi.fn()
      
      vi.mocked(api.useCreateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)
      vi.mocked(api.useUpdateArea).mockReturnValue(mockUpdate as any)

      renderForm({ area: mockArea, onSuccess: mockOnSuccess })

      const nameInput = screen.getByLabelText('Area Name')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Site')
      await user.click(screen.getByRole('button', { name: /update area/i }))

      await waitFor(() => {
        expect(mockUpdate.mutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 1,
            name: 'Updated Site',
          })
        )
      })

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled()
      })
    })
  })

  describe('Cancel Functionality', () => {
    beforeEach(() => {
      vi.mocked(api.useGeographies).mockReturnValue({
        data: { results: mockGeographies },
        isLoading: false,
      } as any)
    })

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      const mockOnCancel = vi.fn()
      
      vi.mocked(api.useCreateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)
      vi.mocked(api.useUpdateArea).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as any)

      renderForm({ onCancel: mockOnCancel })

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(mockOnCancel).toHaveBeenCalled()
    })
  })
})
