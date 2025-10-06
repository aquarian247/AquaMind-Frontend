import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteBatchContainerAssignment } from '../api'
import type { BatchContainerAssignment } from '@/api/generated'

interface BatchContainerAssignmentDeleteButtonProps {
  /** Assignment to delete */
  assignment: BatchContainerAssignment
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for BatchContainerAssignment entities with audit trail.
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
 * <BatchContainerAssignmentDeleteButton
 *   assignment={assignment}
 *   onSuccess={() => console.log('Deleted!')}
 * />
 * ```
 */
export function BatchContainerAssignmentDeleteButton({
  assignment,
  onSuccess,
  className,
  iconOnly = false,
}: BatchContainerAssignmentDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteBatchContainerAssignment()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Assignment Deletion',
      description: `You are about to delete assignment for batch "${assignment.batch?.batch_number}" to container "${assignment.container?.name}". This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this assignment (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: assignment.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete assignment error:', error)
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
          aria-label={`Delete assignment for ${assignment.batch?.batch_number}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Assignment'}
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

