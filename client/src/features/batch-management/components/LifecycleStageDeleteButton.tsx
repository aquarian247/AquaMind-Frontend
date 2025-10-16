import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteLifecycleStage } from '../api'
import type { LifeCycleStage } from '@/api/generated'

interface LifecycleStageDeleteButtonProps {
  /** Lifecycle stage to delete */
  lifecycleStage: LifeCycleStage
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Optional CSS class for styling */
  className?: string
  /** Show as icon-only button (default: false) */
  iconOnly?: boolean
}

/**
 * Delete button for LifeCycleStage entities with audit trail.
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
 * <LifecycleStageDeleteButton
 *   lifecycleStage={stage}
 *   onSuccess={() => console.log('Deleted!')}
 * />
 * ```
 */
export function LifecycleStageDeleteButton({
  lifecycleStage,
  onSuccess,
  className,
  iconOnly = false,
}: LifecycleStageDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteLifecycleStage()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Lifecycle Stage Deletion',
      description: `You are about to delete lifecycle stage "${lifecycleStage.name}" (${lifecycleStage.species_name}). This action cannot be undone. Batches currently using this stage may be affected.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this lifecycle stage (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: lifecycleStage.id })
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete lifecycle stage error:', error)
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
          aria-label={`Delete lifecycle stage ${lifecycleStage.name}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Stage'}
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
