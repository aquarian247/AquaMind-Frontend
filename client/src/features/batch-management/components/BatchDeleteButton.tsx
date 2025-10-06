import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteBatch } from '../api'
import type { Batch } from '@/api/generated'

interface BatchDeleteButtonProps {
  /** Batch to delete */
  batch: Batch
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for Batch entities with audit trail.
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
 * <BatchDeleteButton
 *   batch={batch}
 *   onSuccess={() => navigate('/batches')}
 * />
 * ```
 */
export function BatchDeleteButton({
  batch,
  onSuccess,
  className,
  iconOnly = false,
}: BatchDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteBatch()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Batch Deletion',
      description: `You are about to delete batch "${batch.batch_number}" (${batch.species_name}). This action cannot be undone. All associated assignments, transfers, and growth data may be affected.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this batch (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: batch.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete batch error:', error)
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
          aria-label={`Delete batch ${batch.batch_number}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Batch'}
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
