import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteMortalityEvent } from '../api'
import type { MortalityEvent } from '@/api/generated'

interface MortalityEventDeleteButtonProps {
  /** Mortality event to delete */
  mortalityEvent: MortalityEvent
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for MortalityEvent entities with audit trail.
 */
export function MortalityEventDeleteButton({
  mortalityEvent,
  onSuccess,
  className,
  iconOnly = false,
}: MortalityEventDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteMortalityEvent()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Mortality Event Deletion',
      description: `You are about to delete mortality event for batch "${mortalityEvent.batch_number}" on ${mortalityEvent.event_date}. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this mortality event (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: mortalityEvent.id })
        onSuccess?.()
      } catch (error) {
        console.error('Delete mortality event error:', error)
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
          aria-label="Delete mortality event"
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

