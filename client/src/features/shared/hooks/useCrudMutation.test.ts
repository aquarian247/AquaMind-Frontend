import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { useCrudMutation } from './useCrudMutation'
import type { NormalizedError } from '@/features/shared/api/errorUtils'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }

  return { wrapper: Wrapper, queryClient }
}

describe('useCrudMutation', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('runs mutation and shows success toast', async () => {
    const mutationFn = vi.fn().mockResolvedValue({ id: 1 })
    const invalidateQueries = vi.spyOn(QueryClient.prototype, 'invalidateQueries').mockResolvedValue()

    const { wrapper } = createWrapper()
    const { result } = renderHook(() =>
      useCrudMutation({
        mutationFn,
        description: 'Species saved',
        invalidateQueries: ['species'],
        toastOnSuccess: false,
      }),
    { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ name: 'Test' })
    })

    expect(mutationFn).toHaveBeenCalledWith({ name: 'Test' })
    expect(invalidateQueries).toHaveBeenCalled()
  })

  it('normalizes errors', async () => {
    const error: NormalizedError = {
      title: 'Validation failed',
      message: 'Invalid data',
      fieldErrors: [],
    }

    const mutationFn = vi.fn().mockRejectedValue(error)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() =>
      useCrudMutation({ mutationFn, toastOnError: false }),
    { wrapper })

    await expect(result.current.mutateAsync({})).rejects.toMatchObject({
      title: 'Validation failed',
      message: 'Invalid data',
    })
  })
})
