import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteFeedingEvent } from '../api'
import type { FeedingEvent } from '@/api/generated'

interface FeedingEventDeleteButtonProps {
  /** Feeding event to delete */
  feedingEvent: FeedingEvent
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for FeedingEvent entities with audit trail.
 *
 * Features:
 * - Permission gate (Manager+ only)
 * - Audit reason dialog (required, min 10 chars)
 * - Confirmation flow with detailed messaging
 * - Warning about summary recalculation
 * - Automatic query invalidation (includes summaries)
 * - Success/error toast notifications
 *
 * @example
 * ```tsx
 * <FeedingEventDeleteButton
 *   feedingEvent={event}
 *   onSuccess={() => refetch()}
 * />
 * ```
 */
export function FeedingEventDeleteButton({
  feedingEvent,
  onSuccess,
  className,
  iconOnly = false,
}: FeedingEventDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteFeedingEvent()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Feeding Event Deletion',
      description: `You are about to delete the feeding event for ${feedingEvent.batch_name} in ${feedingEvent.container_name} on ${feedingEvent.feeding_date} at ${feedingEvent.feeding_time} (${feedingEvent.amount_kg} kg of ${feedingEvent.feed_name}). This action cannot be undone and will affect feeding summaries and FCR calculations.`,
      required: true,
      minLength: 10,
      placeholder:
        'Enter reason for deleting this feeding event (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: feedingEvent.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete feeding event error:', error)
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
          aria-label={`Delete feeding event for ${feedingEvent.batch_name}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Event'}
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
