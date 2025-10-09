import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteFeedContainerStock } from '../api'
import type { FeedContainerStock } from '@/api/generated'

interface FeedContainerStockDeleteButtonProps {
  /** Feed container stock to delete */
  feedContainerStock: FeedContainerStock
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for FeedContainerStock entities with audit trail.
 *
 * Features:
 * - Permission gate (Manager+ only)
 * - Audit reason dialog (required, min 10 chars)
 * - Confirmation flow with detailed messaging
 * - FIFO consideration warning
 * - Automatic query invalidation
 * - Success/error toast notifications
 *
 * @example
 * ```tsx
 * <FeedContainerStockDeleteButton
 *   feedContainerStock={stock}
 *   onSuccess={() => refetch()}
 * />
 * ```
 */
export function FeedContainerStockDeleteButton({
  feedContainerStock,
  onSuccess,
  className,
  iconOnly = false,
}: FeedContainerStockDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteFeedContainerStock()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Stock Entry Deletion',
      description: `You are about to delete ${feedContainerStock.quantity_kg} kg of "${feedContainerStock.feed_type}" from ${feedContainerStock.feed_container_name} (entry date: ${feedContainerStock.entry_date.split('T')[0]}). This action cannot be undone and may affect FIFO calculations.`,
      required: true,
      minLength: 10,
      placeholder:
        'Enter reason for deleting this stock entry (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: feedContainerStock.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete feed container stock error:', error)
      }
    }
  }

  return (
    <>
      <DeleteGate fallback={null}>
        <Button
          variant="destructive"
          size={iconOnly ? 'icon' : 'default'}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={className}
          aria-label={`Delete stock entry for ${feedContainerStock.feed_type}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Stock'}
        </Button>
      </DeleteGate>

      <AuditReasonDialog
        open={dialogState.isOpen}
        options={dialogState.options}
        onConfirm={dialogState.onConfirm}
        onCancel={dialogState.onCancel}
      />
    </>
  )
}


