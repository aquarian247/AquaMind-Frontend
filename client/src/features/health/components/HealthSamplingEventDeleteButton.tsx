import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteHealthSamplingEvent } from '../api'
import type { HealthSamplingEvent } from '@/api/generated'

interface HealthSamplingEventDeleteButtonProps {
  /** Health sampling event to delete */
  samplingEvent: HealthSamplingEvent
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for HealthSamplingEvent entities with audit trail.
 *
 * Features:
 * - Permission gate (Manager+ only)
 * - Audit reason dialog (required, min 10 chars)
 * - Confirmation flow with detailed messaging
 * - Automatic query invalidation
 * - Success/error toast notifications
 * - Cascades to delete all individual fish observations
 *
 * @example
 * ```tsx
 * <HealthSamplingEventDeleteButton
 *   samplingEvent={samplingEvent}
 *   onSuccess={() => refetch()}
 * />
 * ```
 */
export function HealthSamplingEventDeleteButton({
  samplingEvent,
  onSuccess,
  className,
  iconOnly = false,
}: HealthSamplingEventDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteHealthSamplingEvent()

  const handleDelete = async () => {
    const samplingDate = samplingEvent.sampling_date
      ? new Date(samplingEvent.sampling_date).toLocaleDateString()
      : 'Unknown date'

    const fishCount = samplingEvent.calculated_sample_size || samplingEvent.number_of_fish_sampled
    
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Sampling Event Deletion',
      description: `You are about to delete the health sampling event from ${samplingDate} (${fishCount} fish sampled for ${samplingEvent.batch_number}). This will also delete all individual fish observations. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder:
        'Enter reason for deleting this sampling event (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: samplingEvent.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete sampling event error:', error)
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
          aria-label={`Delete sampling event from ${samplingEvent.sampling_date}`}
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




