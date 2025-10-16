import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteIndividualFishObservation } from '../api'
import type { IndividualFishObservation } from '@/api/generated'

interface IndividualFishObservationDeleteButtonProps {
  /** Individual fish observation to delete */
  observation: IndividualFishObservation
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for IndividualFishObservation entities with audit trail.
 *
 * Features:
 * - Permission gate (Manager+ only)
 * - Audit reason dialog (required, min 10 chars)
 * - Confirmation flow with detailed messaging
 * - Automatic query invalidation (including parent sampling event)
 * - Success/error toast notifications
 *
 * @example
 * ```tsx
 * <IndividualFishObservationDeleteButton
 *   observation={observation}
 *   onSuccess={() => refetch()}
 * />
 * ```
 */
export function IndividualFishObservationDeleteButton({
  observation,
  onSuccess,
  className,
  iconOnly = false,
}: IndividualFishObservationDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteIndividualFishObservation()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Fish Observation Deletion',
      description: `You are about to delete the observation for Fish #${observation.fish_identifier} (Weight: ${observation.weight_g}g, Length: ${observation.length_cm}cm). This action cannot be undone and will affect aggregate calculations.`,
      required: true,
      minLength: 10,
      placeholder:
        'Enter reason for deleting this fish observation (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: observation.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete fish observation error:', error)
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
          aria-label={`Delete observation for fish ${observation.fish_identifier}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Observation'}
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




