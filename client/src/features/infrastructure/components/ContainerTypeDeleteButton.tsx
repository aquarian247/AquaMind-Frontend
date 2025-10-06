import React from 'react'
import { Button } from '@/components/ui/button'
import { DeleteGate } from '@/features/shared/permissions'
import { useAuditReasonPrompt, AuditReasonDialog } from '@/features/shared/audit'
import { useDeleteContainerType } from '../api'
import type { ContainerType } from '@/api/generated'

interface ContainerTypeDeleteButtonProps {
  /** Container type to delete */
  containerType: ContainerType
  /** Callback when deletion succeeds */
  onSuccess?: () => void
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Custom button size */
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

/**
 * Delete button for ContainerType entity with audit trail support.
 * 
 * - Prompts user for deletion reason (required, min 10 chars)
 * - Only visible to users with delete permission (Manager or higher)
 * - Invalidates container type queries on success
 * 
 * @example
 * ```tsx
 * <ContainerTypeDeleteButton
 *   containerType={myType}
 *   onSuccess={() => navigate('/infrastructure/container-types')}
 * />
 * ```
 */
export function ContainerTypeDeleteButton({
  containerType,
  onSuccess,
  variant = 'destructive',
  size = 'default',
}: ContainerTypeDeleteButtonProps) {
  const { promptReason, dialogState } = useAuditReasonPrompt()
  const deleteMutation = useDeleteContainerType()

  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete Container Type',
      description: `This will permanently delete "${containerType.name}" and all containers using this type. This action cannot be undone.`,
      required: true,
      minLength: 10,
      placeholder: 'e.g., Type no longer used, replacing with new standard...',
    })

    if (confirmed && reason) {
      try {
        await deleteMutation.mutateAsync({
          id: containerType.id,
          __auditReason: reason,
        } as any)
        
        onSuccess?.()
      } catch (error) {
        // Error handled by useCrudMutation toast
        console.error('Delete container type error:', error)
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
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Container Type'}
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
