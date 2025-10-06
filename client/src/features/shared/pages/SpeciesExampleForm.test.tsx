import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { SpeciesExampleForm } from './SpeciesExampleForm'
import { ApiService } from '@/api/generated'

vi.mock('@/api/generated', () => ({
  ApiService: {
    apiV1BatchSpeciesList: vi.fn(),
    apiV1BatchSpeciesCreate: vi.fn(),
  },
}))

const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient()
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, ui)
  )
}

describe('SpeciesExampleForm', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('submits form successfully', async () => {
    ;(ApiService.apiV1BatchSpeciesList as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [],
    })

    ;(ApiService.apiV1BatchSpeciesCreate as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1,
      name: 'Atlantic Salmon',
      scientific_name: 'Salmo salar',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    renderWithClient(<SpeciesExampleForm />)

    await userEvent.type(screen.getByRole('textbox', { name: /species name/i }), 'Atlantic Salmon')
    await userEvent.type(screen.getByRole('textbox', { name: /scientific name/i }), 'Salmo salar')
    await userEvent.click(screen.getByRole('button', { name: /create species/i }))

    await waitFor(() => {
      expect(ApiService.apiV1BatchSpeciesCreate).toHaveBeenCalledWith({
        name: 'Atlantic Salmon',
        scientific_name: 'Salmo salar',
        description: undefined,
        optimal_temperature_min: undefined,
        optimal_temperature_max: undefined,
        optimal_oxygen_min: undefined,
        optimal_ph_min: undefined,
        optimal_ph_max: undefined,
      })
    })
  })

  it('prevents duplicate names', async () => {
    ;(ApiService.apiV1BatchSpeciesList as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      results: [{ id: 1, name: 'Atlantic Salmon', scientific_name: 'Salmo salar' }],
    })

    renderWithClient(<SpeciesExampleForm />)

    await userEvent.type(screen.getByRole('textbox', { name: /species name/i }), 'Atlantic Salmon')
    await userEvent.type(screen.getByRole('textbox', { name: /scientific name/i }), 'Duplicate Salmon')
    await userEvent.click(screen.getByRole('button', { name: /create species/i }))

    expect(await screen.findByText(/unique/)).toBeInTheDocument()
    expect(ApiService.apiV1BatchSpeciesCreate).not.toHaveBeenCalled()
  })
})
