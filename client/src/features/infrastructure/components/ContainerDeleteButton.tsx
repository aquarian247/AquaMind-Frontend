import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteContainer } from '../api'
import type { Container } from '@/api/generated'

interface ContainerDeleteButtonProps {
  /** Container to delete */
  container: Container
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for Container entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates container queries on success
 * 
 * @example
 * ```tsx
 * <ContainerDeleteButton
 *   container={myContainer}
 *   onSuccess={() => navigate('/infrastructure/containers')}
 * />
 * ```
 */
export function ContainerDeleteButton({
  container,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: ContainerDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteContainer()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Container',
      description: `This will permanently delete "${container.name}" and all associated batch assignments, sensors, and data. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Container damaged, decommissioned, replaced...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: container.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete container error:', error)
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
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Container'}
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
