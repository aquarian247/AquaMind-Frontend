import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuditReasonPrompt } from '../useAuditReasonPrompt'

describe('useAuditReasonPrompt', () => {
  it('initializes with closed dialog', () => {
    const { result } = renderHook(() => useAuditReasonPrompt())

    expect(result.current.dialogState.isOpen).toBe(false)
  })

  it('opens dialog when promptReason is called', async () => {
    const { result } = renderHook(() => useAuditReasonPrompt())

    act(() => {
      result.current.promptReason({
        title: 'Test Prompt',
        description: 'Test description',
      })
    })

    await waitFor(() => {
      expect(result.current.dialogState.isOpen).toBe(true)
    })
  })

  it('returns confirmed result when user confirms', async () => {
    const { result } = renderHook(() => useAuditReasonPrompt())

    let promiseResult: any
    act(() => {
      promiseResult = result.current.promptReason({
        title: 'Test Prompt',
      })
    })

    await waitFor(() => {
      expect(result.current.dialogState.isOpen).toBe(true)
    })

    act(() => {
      result.current.dialogState.onConfirm('Test reason')
    })

    const resolved = await promiseResult
    expect(resolved.confirmed).toBe(true)
    expect(resolved.reason).toBe('Test reason')
    expect(result.current.dialogState.isOpen).toBe(false)
  })

  it('returns cancelled result when user cancels', async () => {
    const { result } = renderHook(() => useAuditReasonPrompt())

    let promiseResult: any
    act(() => {
      promiseResult = result.current.promptReason({
        title: 'Test Prompt',
      })
    })

    await waitFor(() => {
      expect(result.current.dialogState.isOpen).toBe(true)
    })

    act(() => {
      result.current.dialogState.onCancel()
    })

    const resolved = await promiseResult
    expect(resolved.confirmed).toBe(false)
    expect(resolved.reason).toBe('')
    expect(result.current.dialogState.isOpen).toBe(false)
  })

  it('passes options to dialog state', async () => {
    const { result } = renderHook(() => useAuditReasonPrompt())

    const options = {
      title: 'Delete Confirmation',
      description: 'Please provide a reason',
      placeholder: 'Enter reason...',
      required: true,
      minLength: 5,
      maxLength: 200,
    }

    act(() => {
      result.current.promptReason(options)
    })

    await waitFor(() => {
      expect(result.current.dialogState.options).toEqual(options)
    })
  })

  it('handles multiple sequential prompts', async () => {
    const { result } = renderHook(() => useAuditReasonPrompt())

    // First prompt
    let firstPromise: any
    act(() => {
      firstPromise = result.current.promptReason({ title: 'First' })
    })

    await waitFor(() => {
      expect(result.current.dialogState.isOpen).toBe(true)
    })

    act(() => {
      result.current.dialogState.onConfirm('First reason')
    })

    const firstResult = await firstPromise
    expect(firstResult.reason).toBe('First reason')

    // Second prompt
    let secondPromise: any
    act(() => {
      secondPromise = result.current.promptReason({ title: 'Second' })
    })

    await waitFor(() => {
      expect(result.current.dialogState.isOpen).toBe(true)
    })

    act(() => {
      result.current.dialogState.onConfirm('Second reason')
    })

    const secondResult = await secondPromise
    expect(secondResult.reason).toBe('Second reason')
  })
})


