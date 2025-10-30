import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import {
  useAuditReasonPrompt,
  AuditReasonDialog,
} from '@/features/shared/audit'
import { useDeleteHealthParameter } from '../api'
import type { HealthParameter } from '@/api/generated'

interface HealthParameterDeleteButtonProps {
  healthParameter: HealthParameter
  onSuccess?: () => void
  className?: string
  iconOnly?: boolean
}

/**
 * Delete button for HealthParameter entities with audit trail.
 *
 * Features:
 * - Confirmation dialog with parameter name
 * - Permission gate (Veterinarian+ only)
 * - Audit reason prompt
 * - Automatic cache invalidation
 *
 * @example
 * ```tsx
 * <HealthParameterDeleteButton
 *   healthParameter={param}
 *   onSuccess={() => console.log('Deleted!')}
 * />
 * ```
 */
export function HealthParameterDeleteButton({
  healthParameter,
  onSuccess,
  className,
  iconOnly = false,
}: HealthParameterDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteHealthParameter()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Health Parameter Deletion',
      description: `You are about to delete the health parameter "${healthParameter.name}". This will also delete all associated score definitions. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'Enter reason for deleting this health parameter (min 10 characters)...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({ id: healthParameter.id })
        onSuccess?.()
      } catch (error) {
        console.error('Delete health parameter error:', error)
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
          aria-label={`Delete health parameter ${healthParameter.name}`}
        >
          <Trash2 className={iconOnly ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
          {!iconOnly && 'Delete Parameter'}
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


