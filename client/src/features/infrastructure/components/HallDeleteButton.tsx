import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteHall } from '../api'
import type { Hall } from '@/api/generated'

interface HallDeleteButtonProps {
  /** Hall to delete */
  hall: Hall
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for Hall entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates hall queries on success
 * 
 * @example
 * ```tsx
 * <HallDeleteButton
 *   hall={myHall}
 *   onSuccess={() => navigate('/infrastructure/halls')}
 * />
 * ```
 */
export function HallDeleteButton({
  hall,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: HallDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteHall()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Hall',
      description: `This will permanently delete "${hall.name}" and all associated containers and data. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Hall decommissioned, restructuring facility...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: hall.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete hall error:', error)
      }
    }
  }

  return (
    <>
      <DeleteGate fallback={null}>
        <Button
          variant={variant}
          size={size}
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Hall'}
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
