import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteFeedPurchase } from '../api'
import type { FeedPurchase } from '@/api/generated'

interface FeedPurchaseDeleteButtonProps {
  /** Feed purchase to delete */
  feedPurchase: FeedPurchase
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for FeedPurchase entities with audit trail.
 *
 * Features:
 * - Permission gate (Manager+ only)
 * - Audit reason dialog (required, min 10 chars)
 * - Confirmation flow with detailed messaging
 * - Automatic query invalidation
 * - Success/error toast notifications
 *
 * @example
 * ```tsx
 * <FeedPurchaseDeleteButton
 *   feedPurchase={feedPurchase}
 *   onSuccess={() => refetch()}
 * />
 * ```
 */
export function FeedPurchaseDeleteButton({
  feedPurchase,
  onSuccess,
  className,
  iconOnly = false,
}: FeedPurchaseDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteFeedPurchase()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Feed Purchase Deletion',
      description: `You are about to delete the feed purchase "${feedPurchase.feed_name}" from ${feedPurchase.supplier} (${feedPurchase.quantity_kg} kg on ${feedPurchase.purchase_date}). This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder:
        'Enter reason for deleting this purchase record (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: feedPurchase.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete feed purchase error:', error)
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
          aria-label={`Delete feed purchase for ${feedPurchase.feed_name}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Purchase'}
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

