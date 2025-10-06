import { useState, useCallback } from 'react'
import type { AuditReasonPromptOptions, AuditReasonPromptResult } from './types'

/**
 * Hook for prompting user for audit trail change reasons.
 * Provides a promise-based interface for showing a dialog and capturing input.
 * 
 * @example Basic usage
 * ```tsx
 * function MyForm() {
 *   const { promptReason, PromptDialog } = useAuditReasonPrompt()
 *   
 *   const handleDelete = async () => {
 *     const { confirmed, reason } = await promptReason({
 *       title: 'Confirm Delete',
 *       description: 'Please provide a reason for deleting this record',
 *       required: true
 *     })
 *     
 *     if (confirmed) {
 *       await deleteRecord({ id: record.id, change_reason: reason })
 *     }
 *   }
 *   
 *   return (
 *     <>
 *       <Button onClick={handleDelete}>Delete</Button>
 *       <PromptDialog />
 *     </>
 *   )
 * }
 * ```
 */
export function useAuditReasonPrompt() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<AuditReasonPromptOptions>({})
  const [resolvePromise, setResolvePromise] = useState<
    ((result: AuditReasonPromptResult) => void) | null
  >(null)

  /**
   * Show audit reason prompt and return a promise that resolves when user confirms or cancels.
   */
  const promptReason = useCallback(
    (promptOptions: AuditReasonPromptOptions = {}): Promise<AuditReasonPromptResult> => {
      return new Promise((resolve) => {
        setOptions(promptOptions)
        setIsOpen(true)
        setResolvePromise(() => resolve)
      })
    },
    []
  )

  /**
   * Handle confirmation with reason.
   */
  const handleConfirm = useCallback(
    (reason: string) => {
      if (resolvePromise) {
        resolvePromise({ confirmed: true, reason })
      }
      setIsOpen(false)
      setResolvePromise(null)
    },
    [resolvePromise]
  )

  /**
   * Handle cancellation.
   */
  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise({ confirmed: false, reason: '' })
    }
    setIsOpen(false)
    setResolvePromise(null)
  }, [resolvePromise])

  return {
    /** Function to show the prompt and get user input */
    promptReason,
    /** Dialog state and handlers (for the component) */
    dialogState: {
      isOpen,
      options,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  }
}
